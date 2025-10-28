'use server';

import { db } from '@/lib/db';
import { users, tasks as tasksSchema, achievements as achievementsSchema } from '@/lib/db/schema';
import { eq, and } from 'drizzle-orm';
import type { User, Task, Achievement, PomodoroSettings } from './data-types';
import { iconMap } from './data-types';
import { toast } from '@/hooks/use-toast';
import { PetInfos } from './pets';
import i18n from '@/i18n';

// For this prototype, we'll hardcode a single user ID.
// In a real application, this would come from an authentication system.
const HARDCODED_USER_ID = 'user_2fP7sW5gR8zX9yB1eA6vC4jK0lM';

const defaultPomodoroSettings: PomodoroSettings = {
  modes: [
    { id: 'work', name: 'Work', duration: 25 },
    { id: 'shortBreak', name: 'Short Break', duration: 5 },
    { id: 'longBreak', name: 'Long Break', duration: 15 },
  ],
  longBreakInterval: 4,
};


// This function now gets user data from the database.
export const getUser = async (): Promise<User> => {
  try {
    let user = await db.query.users.findFirst({
      where: eq(users.id, HARDCODED_USER_ID),
    });

    if (!user) {
        console.log('No user found, creating default user.');
        const defaultUser: Omit<User, 'id'> = {
            name: 'Alex',
            avatar: 'avatar1',
            level: 1,
            xp: 75,
            xpToNextLevel: 100,
            petStyle: 'pet1',
            petName: '泡泡',
            appLogo: '',
            pomodoroSettings: defaultPomodoroSettings,
            // Configurable content
            appName: 'Discipline Baby',
            landingTitle: 'Gamify Your Child\'s Habits',
            landingDescription: 'Turn daily routines and learning into a fun adventure. Motivate your kids with rewards, achievements, and a virtual pet that grows with them.',
            landingCta: 'Get Started for Free',
            dashboardLink: '设置页面',
        };
      await db.insert(users).values({ id: HARDCODED_USER_ID, ...defaultUser, pomodoroSettings: JSON.stringify(defaultUser.pomodoroSettings) });
      user = await db.query.users.findFirst({
        where: eq(users.id, HARDCODED_USER_ID),
      });
      if (!user) throw new Error("Failed to create and retrieve user.");
    }
    
    // Parse pomodoroSettings from JSON string
    const parsedPomodoroSettings = user.pomodoroSettings ? JSON.parse(user.pomodoroSettings as string) : defaultPomodoroSettings;

    return {
        ...user,
        pomodoroSettings: parsedPomodoroSettings
    } as User;

  } catch (error) {
    console.error("Failed to fetch or create user from DB", error);
    // In case of a database error, return a default user object to prevent app crash
    return {
        id: HARDCODED_USER_ID,
        name: 'Alex (DB Error)',
        avatar: 'avatar1',
        level: 1,
        xp: 0,
        xpToNextLevel: 100,
        petStyle: 'pet1',
        petName: 'Error',
        appLogo: '',
        pomodoroSettings: defaultPomodoroSettings,
        appName: 'Discipline Baby',
        landingTitle: 'Error Loading Data',
        landingDescription: 'Could not connect to the database.',
        landingCta: 'Try Again Later',
        dashboardLink: 'Settings',
    } as User;
  }
};

// Function to update the user object in the database
export const updateUser = async (newUserData: Partial<User>) => {
    try {
        const dataToUpdate: { [key: string]: any } = { ...newUserData };

        if (newUserData.pomodoroSettings) {
            dataToUpdate.pomodoroSettings = JSON.stringify(newUserData.pomodoroSettings);
        }

        await db.update(users)
            .set(dataToUpdate)
            .where(eq(users.id, HARDCODED_USER_ID));
            
        // Note: We can't dispatch browser events from server actions.
        // Revalidation (e.g., revalidatePath from 'next/cache') is the modern way to update UI.
    } catch (error) {
        console.error("Failed to save user to DB", error);
    }
};

const XP_MAP = {
  'Easy': 5,
  'Medium': 10,
  'Hard': 15,
};

const getPetStyleForLevel = (level: number): string => {
  const sortedPets = [...PetInfos].sort((a, b) => b.unlockLevel - a.unlockLevel);
  const bestPet = sortedPets.find(p => level >= p.unlockLevel);
  return bestPet ? bestPet.id : 'pet1';
};

export const completeTaskAndUpdateXP = async (task: Task, completed: boolean) => {
  const currentUser = await getUser();
  
  const allTasks = await getTasks();
  const originalTask = allTasks.find(t => t.id === task.id);
  if (!originalTask) return;

  const xpChange = XP_MAP[originalTask.difficulty] || 0;

  if (completed !== originalTask.completed) {
      let newXp = currentUser.xp + (completed ? xpChange : -xpChange);
      if (newXp < 0) newXp = 0;

      let newLevel = currentUser.level;
      let newXpToNextLevel = currentUser.xpToNextLevel;

      while (newXp >= newXpToNextLevel) {
          newLevel++;
          newXp -= newXpToNextLevel;
          newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2);
      }
      
      const newPetStyle = getPetStyleForLevel(newLevel);
      
      await updateUser({
          xp: newXp,
          level: newLevel,
          xpToNextLevel: newXpToNextLevel,
          petStyle: newPetStyle,
      });
  }

  await db.update(tasksSchema)
    .set({ completed })
    .where(eq(tasksSchema.id, task.id));
};

export const getAchievements = async (): Promise<Achievement[]> => {
    try {
        let userAchievements = await db.query.achievements.findMany({
            where: eq(achievementsSchema.userId, HARDCODED_USER_ID),
        });

        if (userAchievements.length === 0) {
            console.log('No achievements found for user, creating defaults.');
            // In a real app, you might have a global achievements definition table
            // and a user_achievements link table. For simplicity, we create them per user.
            const defaultAchievements: Omit<Achievement, 'id'>[] = [
                 { title: 'First Mission', description: 'Complete your very first task.', icon: 'Star', unlocked: true, dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 5)) },
                 { title: 'Task Master', description: 'Complete 10 tasks in total.', icon: 'Trophy', unlocked: true, dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 2)) },
                 { title: 'Perfect Week', description: 'Complete all your tasks for 7 days in a row.', icon: 'ShieldCheck', unlocked: false },
            ].map(a => ({...a, userId: HARDCODED_USER_ID}));
            
            await db.insert(achievementsSchema).values(defaultAchievements);
            userAchievements = await db.query.achievements.findMany({
                where: eq(achievementsSchema.userId, HARDCODED_USER_ID),
            });
        }
        return userAchievements.map(a => ({...a, id: a.id.toString()}));
    } catch (error) {
        console.error("Failed to fetch achievements from DB", error);
        return [];
    }
};

export const updateAchievements = async (newAchievements: Achievement[]) => {
    try {
        // This is complex with a DB. We'd typically update one by one.
        // For simplicity, we'll focus on a single update/insert operation.
        // A full implementation would need `db.transaction`.
    } catch (error) {
        console.error("Failed to save achievements to DB", error);
    }
};

// ... and so on for other data types ...

export const getTasks = async (): Promise<Task[]> => {
  try {
    const userTasks = await db.query.tasks.findMany({
      where: eq(tasksSchema.userId, HARDCODED_USER_ID),
    });

    if (userTasks.length === 0) {
      console.log("No tasks found for user, creating default tasks.");
      const today = new Date();
      const defaultTasksToInsert = [
        { title: 'Read for 20 minutes', category: 'Learning', difficulty: 'Easy', completed: false, status: 'active', dueDate: today, recurrence: { interval: 1, unit: 'week', daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'] }, time: '20:00' },
        { title: 'Practice drawing', category: 'Creative', difficulty: 'Medium', completed: false, status: 'active', dueDate: today, recurrence: { interval: 1, unit: 'week', daysOfWeek: ['tue', 'thu'] }, time: '16:30' },
      ].map(t => ({
        ...t,
        userId: HARDCODED_USER_ID,
        recurrence: JSON.stringify(t.recurrence) // stringify for DB
      }));
      await db.insert(tasksSchema).values(defaultTasksToInsert);
      const newTasks = await db.query.tasks.findMany({ where: eq(tasksSchema.userId, HARDCODED_USER_ID) });
      return newTasks.map(mapDbTaskToAppTask);
    }

    return userTasks.map(mapDbTaskToAppTask);
  } catch (error) {
    console.error("Failed to fetch tasks from DB", error);
    return [];
  }
};

const mapDbTaskToAppTask = (dbTask: any): Task => {
    return {
        ...dbTask,
        id: dbTask.id.toString(),
        icon: iconMap[dbTask.category] || iconMap.Learning,
        dueDate: new Date(dbTask.dueDate),
        recurrence: dbTask.recurrence ? JSON.parse(dbTask.recurrence) : undefined,
    };
};

export const updateTasks = async (newTasks: Task[]) => {
    // This is complex. Usually you update one task at a time.
    // For example, a function to update a single task:
};

export const saveTask = async (taskData: Omit<Task, 'id' | 'icon'>, taskId?: string) => {
    const dataForDb = {
        ...taskData,
        userId: HARDCODED_USER_ID,
        recurrence: taskData.recurrence ? JSON.stringify(taskData.recurrence) : null,
    };

    if (taskId) {
        await db.update(tasksSchema).set(dataForDb).where(eq(tasksSchema.id, parseInt(taskId)));
    } else {
        await db.insert(tasksSchema).values(dataForDb);
    }
}

export const deleteTask = async (taskId: string) => {
    await db.delete(tasksSchema).where(eq(tasksSchema.id, parseInt(taskId)));
}


const dayMapping = ['sun', 'mon', 'tue', 'wed', 'thu', 'fri', 'sat'] as const;

export const getTodaysTasks = async (): Promise<Task[]> => {
    const allTasks = await getTasks();
    const today = new Date();
    const todayString = today.toDateString();
    const todayDay = dayMapping[today.getDay()];

    return allTasks.filter(task => {
        if (task.status !== 'active') {
            return false;
        }

        const taskDueDate = new Date(task.dueDate);

        if (task.recurrence) {
            const { unit, interval, daysOfWeek } = task.recurrence;
            if (unit === 'week') {
                if (daysOfWeek && daysOfWeek.length > 0) {
                    return daysOfWeek.includes(todayDay);
                }
            }
        }
        
        return taskDueDate.toDateString() === todayString;
    });
};


export const reportData = [
    { date: 'Mon', completed: 3 },
    { date: 'Tue', completed: 4 },
    { date: 'Wed', completed: 2 },
    { date: 'Thu', completed: 5 },
    { date: 'Fri', completed: 4 },
    { date: 'Sat', completed: 6 },
    { date: 'Sun', completed: 5 },
];
