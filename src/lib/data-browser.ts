

'use server';

import { db, dbInitializationError } from '@/lib/db';
import { users, tasks as tasksSchema, achievements as achievementsSchema } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { User, Task, Achievement, PomodoroSettings } from './data-types';
import { PetInfos } from './pets';

// --- Local Storage Definitions ---

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

// --- Local Storage Helper Functions ---
// These are only used in a browser context.
const readFromLocalStorage = (key: string): any => {
    if (typeof window === 'undefined') return null;
    const item = localStorage.getItem(key);
    try {
        return item ? JSON.parse(item) : null;
    } catch (e) {
        console.error(`Failed to parse localStorage item: ${key}`, e);
        return null;
    }
};

const writeToLocalStorage = (key: string, data: any): void => {
    if (typeof window === 'undefined') return;
    localStorage.setItem(key, JSON.stringify(data));
    const eventName = key.replace(/-v\d+$/, '') + 'Updated';
    window.dispatchEvent(new CustomEvent(eventName));
};


// --- Universal Data Functions ---

// --- User Data ---
const mapDbUserToAppUser = (user: any): User => {
  if (!user) return getDefaultUser();
  const parsedPomodoroSettings = typeof user.pomodoroSettings === 'string' 
      ? JSON.parse(user.pomodoroSettings) 
      : (user.pomodoroSettings || defaultPomodoroSettings);

  return { ...user, pomodoroSettings: parsedPomodoroSettings };
};

export async function getUser(): Promise<User> {
  if (dbInitializationError) {
    return getClientUser(); 
  }
  try {
    let user = await db.query.users.findFirst({
      where: eq(users.id, HARDCODED_USER_ID),
    });

    if (!user) {
      console.log('No user found in DB, creating and seeding default user.');
      const defaultUser = getDefaultUser();
      const dbUser = {
        ...defaultUser,
        pomodoroSettings: defaultUser.pomodoroSettings ? JSON.stringify(defaultUser.pomodoroSettings) : null,
      };
      await db.insert(users).values(dbUser as any);
      user = await db.query.users.findFirst({ where: eq(users.id, HARDCODED_USER_ID) });
    }
    
    return mapDbUserToAppUser(user);
  } catch (error) {
    console.error("Failed to fetch/create user from DB. Falling back to client user.", error);
    return getClientUser();
  }
}

export async function updateUser(newUserData: Partial<Omit<User, 'id'>>) {
  if (dbInitializationError) {
     return updateClientUser(newUserData);
  }
  try {
    const dataToUpdate: { [key: string]: any } = { ...newUserData };
    if (newUserData.pomodoroSettings) {
      dataToUpdate.pomodoroSettings = JSON.stringify(newUserData.pomodoroSettings);
    }
    await db.update(users).set(dataToUpdate).where(eq(users.id, HARDCODED_USER_ID));
  } catch (error) {
    console.error("Failed to update user in DB", error);
    throw error;
  }
}

// --- Task Data ---
const XP_MAP = { 'Easy': 5, 'Medium': 10, 'Hard': 15 };
const getPetStyleForLevel = (level: number): string => {
  const sortedPets = [...PetInfos].sort((a, b) => b.unlockLevel - a.unlockLevel);
  const bestPet = sortedPets.find(p => level >= p.unlockLevel);
  return bestPet ? bestPet.id : 'pet1';
};

const mapDbTaskToAppTask = (dbTask: any): Task => ({
    ...dbTask,
    id: dbTask.id.toString(), // Ensure id is a string for consistency
    recurrence: dbTask.recurrence && typeof dbTask.recurrence === 'string' ? JSON.parse(dbTask.recurrence) : dbTask.recurrence,
    dueDate: dbTask.dueDate ? new Date(dbTask.dueDate) : new Date(),
});


export async function getTasks(): Promise<Task[]> {
  if (dbInitializationError) {
    return getClientTasks();
  }
  try {
    let userTasks = await db.query.tasks.findMany({ where: eq(tasksSchema.userId, HARDCODED_USER_ID) });
     if (userTasks.length === 0) {
        console.log("No tasks found, seeding default tasks to DB.");
        const defaultTasks = getDefaultTasks().map(t => ({
            ...t,
            userId: HARDCODED_USER_ID,
            recurrence: t.recurrence ? JSON.stringify(t.recurrence) : null,
        }));
        // @ts-ignore - Drizzle handles id for insertion
        await db.insert(tasksSchema).values(defaultTasks.map(({id, ...rest}) => rest));
        userTasks = await db.query.tasks.findMany({ where: eq(tasksSchema.userId, HARDCODED_USER_ID) });
    }
    return userTasks.map(mapDbTaskToAppTask);
  } catch (error) {
    console.error("Failed to fetch tasks from DB.", error);
    return getClientTasks();
  }
};

export async function completeTaskAndUpdateXP(task: Task, completed: boolean) {
    if (dbInitializationError) {
       return completeClientTaskAndUpdateXP(task, completed);
    }
    
    const currentUser = await getUser();
    const originalTask = await db.query.tasks.findFirst({ where: eq(tasksSchema.id, parseInt(task.id)) });
    
    if (!originalTask || completed === originalTask.completed) return;

    const xpChange = XP_MAP[originalTask.difficulty as keyof typeof XP_MAP] || 0;
    let newXp = currentUser.xp + (completed ? xpChange : -xpChange);
    if (newXp < 0) newXp = 0;

    let newLevel = currentUser.level;
    let newXpToNextLevel = currentUser.xpToNextLevel;
    while (newXp >= newXpToNextLevel) {
        newLevel++;
        newXp -= newXpToNextLevel;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
    }
    
    try {
        await updateUser({
            xp: newXp,
            level: newLevel,
            xpToNextLevel: newXpToNextLevel,
            petStyle: getPetStyleForLevel(newLevel),
        });

        await db.update(tasksSchema).set({ completed }).where(eq(tasksSchema.id, parseInt(task.id)));
    } catch(e) {
        console.error("Failed to complete task and update XP in DB", e);
        throw e;
    }
}

export async function saveTask(taskData: Omit<Task, 'id' | 'userId'>, taskId?: string) {
    if (dbInitializationError) {
        return saveClientTask(taskData, taskId);
    }
    
    const dataForDb = {
        ...taskData,
        userId: HARDCODED_USER_ID,
        recurrence: taskData.recurrence ? JSON.stringify(taskData.recurrence) : null,
        dueDate: taskData.dueDate || new Date(),
    };

    try {
        if (taskId && !isNaN(parseInt(taskId))) {
            await db.update(tasksSchema).set(dataForDb).where(eq(tasksSchema.id, parseInt(taskId, 10)));
        } else {
             // @ts-ignore
            await db.insert(tasksSchema).values(dataForDb);
        }
    } catch (error) {
        console.error("Failed to save task to DB", error);
        throw error;
    }
}


export async function deleteTask(taskId: string) {
    if (dbInitializationError) {
        return deleteClientTask(taskId);
    }
    if (taskId && !isNaN(parseInt(taskId))) {
        try {
            await db.delete(tasksSchema).where(eq(tasksSchema.id, parseInt(taskId)));
        } catch (error) {
            console.error("Failed to delete task from DB", error);
            throw error;
        }
    }
}

export async function updateTasks(newTasks: Task[]) {
  if (dbInitializationError) {
    writeToLocalStorage(LOCAL_STORAGE_TASKS_KEY, newTasks);
    return;
  }
  // This is a complex operation for a database, involving potential updates,
  // creations, and deletions. For now, we'll just re-fetch to ensure consistency.
  // A more robust implementation would diff the arrays.
  console.warn("updateTasks with database is not fully implemented for batch updates. Re-fetching is recommended.");
}


// --- Achievement Data ---
const mapDbAchievementToAppAchievement = (a: any): Achievement => ({
    ...a,
    id: a.id.toString(), // Ensure id is a string for consistency
    dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : undefined
});

export async function getAchievements(): Promise<Achievement[]> {
    if (dbInitializationError) {
        return getClientAchievements();
    }
    try {
        let userAchievements = await db.query.achievements.findMany({ where: eq(achievementsSchema.userId, HARDCODED_USER_ID) });
        if (userAchievements.length === 0) {
            console.log("No achievements found, seeding default achievements to DB.");
            const defaultAchievements = getDefaultAchievements().map(a => ({
                ...a,
                userId: HARDCODED_USER_ID,
                dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : null,
            }));
             // @ts-ignore
            await db.insert(achievementsSchema).values(defaultAchievements.map(({id, ...rest}) => rest));
            userAchievements = await db.query.achievements.findMany({ where: eq(achievementsSchema.userId, HARDCODED_USER_ID) });
        }
        return userAchievements.map(mapDbAchievementToAppAchievement);
    } catch (error) {
        console.error("Failed to fetch achievements from DB.", error);
        return getClientAchievements();
    }
}


export async function updateAchievements(newAchievements: Achievement[]) {
    if (dbInitializationError) {
        return updateClientAchievements(newAchievements);
    }
    try {
        // This is a simplified approach: clear and re-insert for the user.
        // For production, a more sophisticated diffing logic would be better.
        await db.delete(achievementsSchema).where(eq(achievementsSchema.userId, HARDCODED_USER_ID));
        
        if (newAchievements.length > 0) {
            const achievementsToInsert = newAchievements.map(ach => {
                const { id, ...rest } = ach; // Drizzle needs id excluded for auto-increment
                return {
                    ...rest,
                    userId: HARDCODED_USER_ID,
                    dateUnlocked: ach.dateUnlocked ? new Date(ach.dateUnlocked) : null,
                };
            });
            await db.insert(achievementsSchema).values(achievementsToInsert as any);
        }
    } catch (error) {
        console.error("Failed to save achievements to DB", error);
        throw error;
    }
}


// --- Fallback Client-side Data Functions ---

export async function getClientUser(): Promise<User> {
    const user = readFromLocalStorage(LOCAL_STORAGE_USER_KEY) || getDefaultUser();
    return Promise.resolve(user);
}

export async function updateClientUser(newUserData: Partial<Omit<User, 'id'>>) {
    const currentUser = await getClientUser();
    const updatedUser = { ...currentUser, ...newUserData };
    writeToLocalStorage(LOCAL_STORAGE_USER_KEY, updatedUser);
    return Promise.resolve();
}

export async function getClientTasks(): Promise<Task[]> {
    const tasks = (readFromLocalStorage(LOCAL_STORAGE_TASKS_KEY) || getDefaultTasks());
    return Promise.resolve(tasks.map((t: any) => ({...t, dueDate: new Date(t.dueDate)})));
}

export async function saveClientTask(taskData: Omit<Task, 'id' | 'userId'>, taskId?: string) {
    let tasks = await getClientTasks();
    if (taskId) {
        tasks = tasks.map(t => t.id === taskId ? { ...t, ...taskData, id: taskId, userId: HARDCODED_USER_ID } : t);
    } else {
        tasks.unshift({ ...taskData, id: `local-${Date.now()}`, userId: HARDCODED_USER_ID });
    }
    writeToLocalStorage(LOCAL_STORAGE_TASKS_KEY, tasks);
}

export async function deleteClientTask(taskId: string) {
    let tasks = await getClientTasks();
    tasks = tasks.filter(t => t.id !== taskId);
    writeToLocalStorage(LOCAL_STORAGE_TASKS_KEY, tasks);
}

export async function completeClientTaskAndUpdateXP(task: Task, completed: boolean) {
    let currentUser = await getClientUser();
    let allTasks = await getClientTasks();
    const originalTask = allTasks.find((t: Task) => t.id === task.id);
    if (!originalTask || completed === originalTask.completed) return;

    const xpChange = XP_MAP[originalTask.difficulty as keyof typeof XP_MAP] || 0;
    let newXp = currentUser.xp + (completed ? xpChange : -xpChange);
    if (newXp < 0) newXp = 0;

    let newLevel = currentUser.level;
    let newXpToNextLevel = currentUser.xpToNextLevel;
    while (newXp >= newXpToNextLevel) {
        newLevel++;
        newXp -= newXpToNextLevel;
        newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
    }
    
    await updateClientUser({
        xp: newXp,
        level: newLevel,
        xpToNextLevel: newXpToNextLevel,
        petStyle: getPetStyleForLevel(newLevel),
    });

    const updatedTasks = allTasks.map((t: Task) => t.id === task.id ? { ...t, completed } : t);
    writeToLocalStorage(LOCAL_STORAGE_TASKS_KEY, updatedTasks);
}

export async function getClientAchievements(): Promise<Achievement[]> {
    const achievements = readFromLocalStorage(LOCAL_STORAGE_ACHIEVEMENTS_KEY) || getDefaultAchievements();
    return Promise.resolve(achievements.map((a: any) => ({ ...a, dateUnlocked: a.dateUnlocked ? new Date(a.dateUnlocked) : undefined })));
}

export async function updateClientAchievements(newAchievements: Achievement[]) {
    writeToLocalStorage(LOCAL_STORAGE_ACHIEVEMENTS_KEY, newAchievements);
    return Promise.resolve();
}

// This function needs to be available on the server to determine which tasks to show on the landing page.
export async function getTodaysTasks(): Promise<Task[] | undefined> {
    try {
        const allTasks = await getTasks(); 
        if (!allTasks) return [];

        const today = new Date();
        const todayString = today.toDateString();
        const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
        const todayDay = dayMapping[today.getDay()];

        return allTasks.filter(task => {
            if (task.status !== 'active') return false;

            if (task.recurrence) {
                const { unit, daysOfWeek } = task.recurrence;
                if (unit === 'week' && daysOfWeek && daysOfWeek.length > 0) {
                    return daysOfWeek.includes(todayDay);
                }
            }
            
            return new Date(task.dueDate).toDateString() === todayString;
        });
    } catch(e) {
        console.error("Error in getTodaysTasks", e);
        return [];
    }
}

export async function getClientTodaysTasks(): Promise<Task[]> {
    const allTasks = await getClientTasks();
    if (!allTasks) return [];

    const today = new Date();
    const todayString = today.toDateString();
    const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;
    const todayDay = dayMapping[today.getDay()];

    return allTasks.filter(task => {
        if (task.status !== 'active') return false;

        if (task.recurrence) {
            const { unit, daysOfWeek } = task.recurrence;
            if (unit === 'week' && daysOfWeek && daysOfWeek.length > 0) {
                return daysOfWeek.includes(todayDay);
            }
        }
        
        return new Date(task.dueDate).toDateString() === todayString;
    });
}
