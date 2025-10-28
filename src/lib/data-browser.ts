
'use server';

import { db, dbInitializationError } from '@/lib/db';
import { users, tasks as tasksSchema, achievements as achievementsSchema } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { User, Task, Achievement, PomodoroSettings } from './data-types';
import { PetInfos } from './pets';

// --- Local Storage Fallback Data ---

const LOCAL_STORAGE_USER_KEY = 'userProfile-v2';
const LOCAL_STORAGE_TASKS_KEY = 'tasks-v2';
const LOCAL_STORAGE_ACHIEVEMENTS_KEY = 'achievements-v2';
const HARDCODED_USER_ID = 'user_2fP7sW5gR8zX9yB1eA6vC4jK0lM';

const defaultPomodoroSettings: PomodoroSettings = {
  modes: [
    { id: 'work', name: 'Work', duration: 25 },
    { id: 'shortBreak', name: 'Short Break', duration: 5 },
    { id: 'longBreak', name: 'Long Break', duration: 15 },
  ],
  longBreakInterval: 4,
};

const getDefaultUser = (): User => ({
  id: HARDCODED_USER_ID,
  name: 'Alex',
  avatar: 'avatar1',
  level: 1,
  xp: 75,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
  pomodoroSettings: defaultPomodoroSettings,
  appName: 'Discipline Baby',
  landingTitle: "Gamify Your Child's Habits",
  landingDescription: 'Turn daily routines and learning into a fun adventure. Motivate your kids with rewards, achievements, and a virtual pet that grows with them.',
  landingCta: 'Get Started for Free',
  dashboardLink: '设置页面',
});

const getDefaultTasks = (): Task[] => {
    const today = new Date();
    return [
        { id: `default-${Date.now()}-1`, userId: HARDCODED_USER_ID, title: 'Read for 20 minutes', category: 'Learning', icon: 'Learning', difficulty: 'Easy', completed: false, status: 'active', dueDate: today, recurrence: { interval: 1, unit: 'week', daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'] }, time: '20:00' },
        { id: `default-${Date.now()}-2`, userId: HARDCODED_USER_ID, title: 'Practice drawing', category: 'Creative', icon: 'Creative', difficulty: 'Medium', completed: false, status: 'active', dueDate: today, recurrence: { interval: 1, unit: 'week', daysOfWeek: ['tue', 'thu'] }, time: '16:30' },
    ];
};

const getDefaultAchievements = (): Achievement[] => [
    { id: `default-${Date.now()}-1`, userId: HARDCODED_USER_ID, title: 'First Mission', description: 'Complete your very first task.', icon: 'Star', unlocked: true, dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 5)) },
    { id: `default-${Date.now()}-2`, userId: HARDCODED_USER_ID, title: 'Task Master', description: 'Complete 10 tasks in total.', icon: 'Trophy', unlocked: true, dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 2)) },
    { id: `default-${Date.now()}-3`, userId: HARDCODED_USER_ID, title: 'Perfect Week', description: 'Complete all your tasks for 7 days in a row.', icon: 'ShieldCheck', unlocked: false },
];

const buildTimeCache = new Map<string, any>();

const readFromCache = (key: string): any => {
    if (typeof window !== 'undefined') {
        const item = localStorage.getItem(key);
        return item ? JSON.parse(item) : null;
    }
    return buildTimeCache.get(key);
};

const writeToCache = (key: string, data: any): void => {
    if (typeof window !== 'undefined') {
        localStorage.setItem(key, JSON.stringify(data));
        // Dispatch event for client-side updates
        if (key === LOCAL_STORAGE_USER_KEY) {
            window.dispatchEvent(new CustomEvent('userProfileUpdated'));
        } else {
            window.dispatchEvent(new CustomEvent(key.replace(/-v\d+$/, '') + 'Updated'));
        }
    }
    buildTimeCache.set(key, data);
};

// Initialize cache with defaults if empty
if (typeof window !== 'undefined') {
    if (!readFromCache(LOCAL_STORAGE_USER_KEY)) writeToCache(LOCAL_STORAGE_USER_KEY, getDefaultUser());
    if (!readFromCache(LOCAL_STORAGE_TASKS_KEY)) writeToCache(LOCAL_STORAGE_TASKS_KEY, getDefaultTasks());
    if (!readFromCache(LOCAL_STORAGE_ACHIEVEMENTS_KEY)) writeToCache(LOCAL_STORAGE_ACHIEVEMENTS_KEY, getDefaultAchievements());
}

// --- Universal Data Functions ---

export async function getUser(): Promise<User> {
  if (!db) {
    console.warn("DB not available, falling back to local storage for getUser.");
    return readFromCache(LOCAL_STORAGE_USER_KEY) || getDefaultUser();
  }
  try {
    let user = await db.query.users.findFirst({
      where: eq(users.id, HARDCODED_USER_ID),
    });

    if (!user) {
      console.log('No user found in DB, creating default user.');
      const defaultUser = getDefaultUser();
      const dbUser = {
        ...defaultUser,
        pomodoroSettings: defaultUser.pomodoroSettings ? JSON.stringify(defaultUser.pomodoroSettings) : null,
      };
      await db.insert(users).values(dbUser as any);
      user = await db.query.users.findFirst({ where: eq(users.id, HARDCODED_USER_ID) });
      if (!user) throw new Error("Failed to create and retrieve user.");
    }
    
    const parsedPomodoroSettings = typeof user.pomodoroSettings === 'string' 
      ? JSON.parse(user.pomodoroSettings) 
      : user.pomodoroSettings;

    return { ...user, pomodoroSettings: parsedPomodoroSettings };
  } catch (error) {
    console.error("Failed to fetch/create user from DB, falling back to localStorage.", error);
    return readFromCache(LOCAL_STORAGE_USER_KEY) || getDefaultUser();
  }
}

export async function updateUser(newUserData: Partial<Omit<User, 'id'>>) {
  if (!db) {
    const currentUser = readFromCache(LOCAL_STORAGE_USER_KEY) || getDefaultUser();
    const updatedUser = { ...currentUser, ...newUserData };
    writeToCache(LOCAL_STORAGE_USER_KEY, updatedUser);
    return;
  }
  try {
    const dataToUpdate: { [key: string]: any } = { ...newUserData };
    if (newUserData.pomodoroSettings) {
      dataToUpdate.pomodoroSettings = JSON.stringify(newUserData.pomodoroSettings);
    }
    await db.update(users).set(dataToUpdate).where(eq(users.id, HARDCODED_USER_ID));
  } catch (error) {
    console.error("Failed to update user in DB", error);
  }
}

const XP_MAP = { 'Easy': 5, 'Medium': 10, 'Hard': 15 };
const getPetStyleForLevel = (level: number): string => {
  const sortedPets = [...PetInfos].sort((a, b) => b.unlockLevel - a.unlockLevel);
  const bestPet = sortedPets.find(p => level >= p.unlockLevel);
  return bestPet ? bestPet.id : 'pet1';
};

export async function completeTaskAndUpdateXP(task: Task, completed: boolean) {
    const currentUser = await getUser();
    const allTasks = await getTasks();
    const originalTask = allTasks.find(t => t.id === task.id);
    if (!originalTask || completed === originalTask.completed) return;

    const xpChange = XP_MAP[originalTask.difficulty] || 0;
    let newXp = currentUser.xp + (completed ? xpChange : -xpChange);
    if (newXp < 0) newXp = 0;

    let newLevel = currentUser.level;
    let newXpToNextLevel = currentUser.xpToNextLevel;
    while (newXp >= newXpToNextLevel) {
        newLevel++;
        newXp -= newXpToNextLevel;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
    }
    
    await updateUser({
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        petStyle: getPetStyleForLevel(newLevel),
    });

    const updatedTasks = allTasks.map(t => t.id === task.id ? { ...t, completed } : t);
    await updateTasks(updatedTasks);
}

export async function getAchievements(): Promise<Achievement[]> {
    if (!db) {
        return (readFromCache(LOCAL_STORAGE_ACHIEVEMENTS_KEY) || getDefaultAchievements()).map((a: any) => ({
            ...a,
            id: a.id.toString(),
            dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : undefined
        }));
    }
    try {
        let userAchievements = await db.query.achievements.findMany({ where: eq(achievementsSchema.userId, HARDCODED_USER_ID) });
        if (userAchievements.length === 0) {
            const defaultAchievements = getDefaultAchievements().map(a => ({...a, userId: HARDCODED_USER_ID, id: undefined}));
            await db.insert(achievementsSchema).values(defaultAchievements as any);
            userAchievements = await db.query.achievements.findMany({ where: eq(achievementsSchema.userId, HARDCODED_USER_ID) });
        }
        return userAchievements.map(a => ({...a, id: a.id.toString()}));
    } catch (error) {
        console.error("Failed to fetch achievements from DB, falling back to localStorage.", error);
        return (readFromCache(LOCAL_STORAGE_ACHIEVEMENTS_KEY) || getDefaultAchievements()).map((a: any) => ({
            ...a,
            id: a.id.toString(),
            dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : undefined
        }));
    }
}

export async function updateAchievements(newAchievements: Achievement[]) {
    if (!db) {
        writeToCache(LOCAL_STORAGE_ACHIEVEMENTS_KEY, newAchievements);
        return;
    }
    try {
      for (const achievement of newAchievements) {
        const { id, ...data } = achievement;
        const record = {
            ...data,
            userId: HARDCODED_USER_ID,
            dateUnlocked: data.dateUnlocked ? new Date(data.dateUnlocked) : null
        };

        if (id && !id.toString().startsWith('custom-')) {
            await db.update(achievementsSchema).set(record).where(eq(achievementsSchema.id, Number(id)));
        } else {
            await db.insert(achievementsSchema).values(record as any);
        }
      }
    } catch (error) {
        console.error("Failed to save achievements to DB", error);
    }
}

const mapDbTaskToAppTask = (dbTask: any): Task => ({
    ...dbTask,
    id: dbTask.id.toString(),
    icon: dbTask.category,
    dueDate: dbTask.dueDate ? new Date(dbTask.dueDate) : new Date(),
    recurrence: dbTask.recurrence && typeof dbTask.recurrence === 'string' ? JSON.parse(dbTask.recurrence) : dbTask.recurrence,
});

export async function getTasks(): Promise<Task[]> {
  if (!db) {
      return (readFromCache(LOCAL_STORAGE_TASKS_KEY) || getDefaultTasks()).map(mapDbTaskToAppTask);
  }
  try {
    let userTasks = await db.query.tasks.findMany({ where: eq(tasksSchema.userId, HARDCODED_USER_ID) });
    if (userTasks.length === 0) {
      const defaultTasks = getDefaultTasks().map(t => ({ ...t, recurrence: JSON.stringify(t.recurrence) }));
      const insertableTasks = defaultTasks.map(({ id, ...rest }) => rest);
      await db.insert(tasksSchema).values(insertableTasks as any);
      userTasks = await db.query.tasks.findMany({ where: eq(tasksSchema.userId, HARDCODED_USER_ID) });
    }
    return userTasks.map(mapDbTaskToAppTask);
  } catch (error) {
    console.error("Failed to fetch tasks from DB, falling back to localStorage.", error);
    return (readFromCache(LOCAL_STORAGE_TASKS_KEY) || getDefaultTasks()).map(mapDbTaskToAppTask);
  }
};

export async function updateTasks(newTasks: Task[]) {
    if (!db) {
        writeToCache(LOCAL_STORAGE_TASKS_KEY, newTasks);
        return;
    }
     try {
        for (const task of newTasks) {
           const { ...taskForDb } = task;
           const dataForDb = {
                ...taskForDb,
                recurrence: task.recurrence ? JSON.stringify(task.recurrence) : null,
            };
            // @ts-ignore
            if (task.id && !task.id.startsWith('default-') && !task.id.startsWith('local-')) {
                await db.update(tasksSchema).set(dataForDb).where(eq(tasksSchema.id, Number(task.id)));
            } else {
                const { id, ...newRecord } = dataForDb;
                await db.insert(tasksSchema).values(newRecord as any);
            }
        }
    } catch (error) {
        console.error("Failed to save tasks to DB", error);
    }
}

export async function saveTask(taskData: Omit<Task, 'id' | 'userId'>, taskId?: string) {
    if (!db) {
        const tasks = readFromCache(LOCAL_STORAGE_TASKS_KEY) || [];
        if (taskId) {
            const index = tasks.findIndex((t: Task) => t.id === taskId);
            if (index > -1) tasks[index] = { ...tasks[index], ...taskData };
        } else {
            tasks.unshift({ ...taskData, id: `local-${Date.now()}`, completed: false, icon: taskData.category, userId: HARDCODED_USER_ID });
        }
        writeToCache(LOCAL_STORAGE_TASKS_KEY, tasks);
        return;
    }

    const dataForDb = {
        ...taskData,
        userId: HARDCODED_USER_ID,
        recurrence: taskData.recurrence ? JSON.stringify(taskData.recurrence) : null,
        dueDate: taskData.dueDate || new Date(),
    };
    
    if (taskId && !taskId.startsWith('local-') && !taskId.startsWith('default-')) {
        await db.update(tasksSchema).set(dataForDb).where(eq(tasksSchema.id, parseInt(taskId, 10)));
    } else {
        await db.insert(tasksSchema).values(dataForDb as any);
    }
}

export async function deleteTask(taskId: string) {
    if (!db) {
        let tasks = readFromCache(LOCAL_STORAGE_TASKS_KEY) || [];
        tasks = tasks.filter((t: Task) => t.id !== taskId);
        writeToCache(LOCAL_STORAGE_TASKS_KEY, tasks);
        return;
    }
    if (taskId && !taskId.startsWith('local-') && !taskId.startsWith('default-')) {
      await db.delete(tasksSchema).where(eq(tasksSchema.id, parseInt(taskId, 10)));
    }
}

const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export async function getTodaysTasks(): Promise<Task[]> {
    const allTasks = await getTasks();
    const today = new Date();
    const todayString = today.toDateString();
    const todayDay = dayMapping[today.getDay()];

    return allTasks.filter(task => {
        if (task.status !== 'active') return false;

        if (task.recurrence) {
            const { unit, interval, daysOfWeek } = task.recurrence;
            if (unit === 'week') {
                if (daysOfWeek && daysOfWeek.length > 0) {
                    // Check if today is one of the recurring days
                    return daysOfWeek.includes(todayDay);
                }
                // If no days are specified, it might be a weekly task from its start date
            }
        }
        
        // Fallback to checking the simple due date for non-recurring or improperly defined recurring tasks
        return new Date(task.dueDate).toDateString() === todayString;
    });
}
