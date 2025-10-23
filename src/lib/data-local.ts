'use client';
import type { User, Task, Achievement } from './data-types';
import { iconMap } from './data-types';
import { toast } from '@/hooks/use-toast';
import { Pets } from './pets';

const defaultUser: User = {
  name: 'Alex',
  avatar: 'avatar1',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
};

// This function now gets user data, prioritizing localStorage.
export const getUser = (): User => {
  if (typeof window === 'undefined') {
    return defaultUser;
  }
  try {
    const storedUser = localStorage.getItem('habit-heroes-user');
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      // We merge with default user to ensure all fields are present,
      // in case of data structure changes.
      return { ...defaultUser, ...parsedUser };
    }
  } catch (error) {
    console.error("Failed to parse user from localStorage", error);
    // If parsing fails, fall back to default
  }
  return defaultUser;
};

// Function to update the global user object and localStorage
export const updateUser = (newUserData: Partial<User>, eventDetail?: object) => {
   if (typeof window !== 'undefined') {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...newUserData };
    try {
      localStorage.setItem('habit-heroes-user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userProfileUpdated', { detail: eventDetail }));
    } catch (error) {
        console.error("Failed to save user to localStorage", error);
    }
  }
};

const XP_MAP = {
  'Easy': 5,
  'Medium': 10,
  'Hard': 15,
};

const getPetStyleForLevel = (level: number): string => {
  const sortedPets = [...Pets].sort((a, b) => b.unlockLevel - a.unlockLevel);
  const bestPet = sortedPets.find(p => level >= p.unlockLevel);
  return bestPet ? bestPet.id : 'pet1';
};


export const completeTaskAndUpdateXP = (task: Task, completed: boolean) => {
  const currentUser = getUser();
  const oldLevel = currentUser.level;
  const oldPetStyle = currentUser.petStyle;

  let newXp = currentUser.xp;
  const xpChange = XP_MAP[task.difficulty] || 0;

  if (completed) {
    newXp += xpChange;
  } else {
    // De-selecting a task removes XP
    newXp -= xpChange;
    if (newXp < 0) newXp = 0;
  }

  let newLevel = currentUser.level;
  let newXpToNextLevel = currentUser.xpToNextLevel;
  let hasLeveledUp = false;

  while (newXp >= newXpToNextLevel) {
    newLevel++;
    newXp -= newXpToNextLevel;
    newXpToNextLevel = Math.floor(newXpToNextLevel * 1.2); // Increase XP requirement for next level
    hasLeveledUp = true;
  }
  
  const newPetStyle = getPetStyleForLevel(newLevel);
  
  updateUser({
    xp: newXp,
    level: newLevel,
    xpToNextLevel: newXpToNextLevel,
    petStyle: newPetStyle,
  }, { leveledUp: hasLeveledUp });

  // Handle notifications
  if (hasLeveledUp) {
    const newPet = Pets.find(p => p.id === newPetStyle);
    const oldPet = Pets.find(p => p.id === oldPetStyle);

    if (newPetStyle !== oldPetStyle && newPet && oldPet) {
      toast({
        title: 'Your pet evolved!',
        description: `Wow! Your ${oldPet.name} evolved into a ${newPet.name}! You reached level ${newLevel}.`,
      });
    } else {
      toast({
        title: 'Level Up!',
        description: `Congratulations! You and your pet have reached level ${newLevel}.`,
      });
    }
  }


  // Also update the task's completion status
  const tasks = getTasks();
  const updatedTasks = tasks.map(t =>
    t.id === task.id ? { ...t, completed } : t
  );
  updateTasks(updatedTasks);
};


const defaultAchievements: Achievement[] = [
  {
    id: '1',
    title: 'First Mission',
    description: 'Complete your very first task.',
    icon: 'Star',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: '2',
    title: 'Task Master',
    description: 'Complete 10 tasks in total.',
    icon: 'Trophy',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '3',
    title: 'Perfect Week',
    description: 'Complete all your tasks for 7 days in a row.',
    icon: 'ShieldCheck',
    unlocked: false,
  },
    {
    id: '4',
    title: 'Streak Starter',
    description: 'Maintain a 3-day completion streak.',
    icon: 'Zap',
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '5',
    title: 'Learning Hero',
    description: 'Complete 5 learning tasks.',
    icon: 'Book',
    unlocked: false,
  },
  {
    id: '6',
    title: 'Creative Genius',
    description: 'Complete 5 creative tasks.',
    icon: 'Brush',
    unlocked: false,
  },
  {
    id: 'ant_bronze',
    title: 'Little Ant - Bronze',
    description: '1-day streak.',
    icon: 'Bug',
    unlocked: true,
    dateUnlocked: new Date(),
  },
  {
    id: 'ant_silver',
    title: 'Little Ant - Silver',
    description: '3-day streak.',
    icon: 'Bug',
    unlocked: true,
    dateUnlocked: new Date(),
  },
  {
    id: 'ant_gold',
    title: 'Little Ant - Gold',
    description: '7-day streak.',
    icon: 'Bug',
unlocked: false,
  },
  {
    id: 'knight_bronze',
    title: 'Brave Knight - Bronze',
    description: '7-day streak.',
    icon: 'Swords',
    unlocked: false,
  },
  {
    id: 'knight_silver',
    title: 'Brave Knight - Silver',
    description: '14-day streak.',
    icon: 'Swords',
    unlocked: false,
  },
  {
    id: 'knight_gold',
    title: 'Brave Knight - Gold',
    description: '21-day streak.',
    icon: 'Swords',
unlocked: false,
  },
  {
    id: 'explorer_bronze',
    title: 'Magic Explorer - Bronze',
    description: '30-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'explorer_silver',
    title: 'Magic Explorer - Silver',
    description: '60-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'explorer_gold',
    title: 'Magic Explorer - Gold',
    description: '90-day streak.',
    icon: 'Mountain',
    unlocked: false,
  },
  {
    id: 'guardian_bronze',
    title: 'Seasons Guardian - Bronze',
    description: '90-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'guardian_silver',
    title: 'Seasons Guardian - Silver',
    description: '180-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'guardian_gold',
    title: 'Seasons Guardian - Gold',
    description: '365-day streak.',
    icon: 'Flower',
    unlocked: false,
  },
  {
    id: 'master_bronze',
    title: 'Super Master - Bronze',
    description: '1-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
  {
    id: 'master_silver',
    title: 'Super Master - Silver',
    description: '2-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
  {
    id: 'master_gold',
    title: 'Super Master - Gold',
    description: '3-year streak.',
    icon: 'Gem',
    unlocked: false,
  },
];

export const getAchievements = (): Achievement[] => {
    if (typeof window === 'undefined') {
        return defaultAchievements;
    }
    try {
        const storedAchievements = localStorage.getItem('habit-heroes-achievements');
        if (storedAchievements) {
            // Parse and ensure date objects are correctly formatted
            const parsed = JSON.parse(storedAchievements);
            return parsed.map((ach: Achievement) => ({
                ...ach,
                dateUnlocked: ach.dateUnlocked ? new Date(ach.dateUnlocked) : undefined
            }));
        }
    } catch (error) {
        console.error("Failed to parse achievements from localStorage", error);
    }
    // Set default achievements if none are in localStorage
    localStorage.setItem('habit-heroes-achievements', JSON.stringify(defaultAchievements));
    return defaultAchievements;
};


export const updateAchievements = (newAchievements: Achievement[]) => {
    if (typeof window !== 'undefined') {
        // Sort custom achievements to the top
        const sortedAchievements = [...newAchievements].sort((a, b) => {
            const aIsCustom = a.id.startsWith('custom-');
            const bIsCustom = b.id.startsWith('custom-');
            if (aIsCustom && !bIsCustom) return -1;
            if (!aIsCustom && bIsCustom) return 1;
            // then sort by unlock status
            if (a.unlocked && !b.unlocked) return -1;
            if (!a.unlocked && b.unlocked) return 1;
            return 0;
        });

        try {
            localStorage.setItem('habit-heroes-achievements', JSON.stringify(sortedAchievements));
            window.dispatchEvent(new CustomEvent('achievementsUpdated'));
        } catch (error) {
            console.error("Failed to save achievements to localStorage", error);
        }
    }
};

const initialTasks: Task[] = [
  {
    id: 'read',
    title: 'Read for 20 minutes',
    category: 'Learning',
    icon: iconMap.Learning,
    difficulty: 'Easy',
    completed: true,
    status: 'active',
    dueDate: new Date(),
    recurrence: { interval: 1, unit: 'week', daysOfWeek: ['mon', 'tue', 'wed', 'thu', 'fri'] },
    time: '20:00',
  },
  {
    id: 'drawing',
    title: 'Practice drawing',
    category: 'Creative',
    icon: iconMap.Creative,
    difficulty: 'Medium',
    completed: false,
    status: 'active',
    dueDate: new Date(),
    recurrence: { interval: 1, unit: 'week', daysOfWeek: ['tue', 'thu'] },
    time: '16:30',
  },
  {
    id: 'bedtime',
    title: 'Go to bed on time',
    category: 'Health',
    icon: iconMap.Health,
    difficulty: 'Easy',
    completed: false,
    status: 'active',
    dueDate: new Date(),
    time: '21:00',
  },
  {
    id: 'homework',
    title: 'Finish science homework',
    category: 'School',
    icon: iconMap.School,
    difficulty: 'Hard',
    completed: true,
    status: 'active',
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: 'bike',
    title: 'Bike ride in the park',
    category: 'Activity',
    icon: iconMap.Activity,
    difficulty: 'Medium',
    completed: false,
    status: 'paused',
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
   {
    id: 'workout',
    title: 'Morning workout',
    category: 'Health',
    icon: iconMap.Health,
    difficulty: 'Medium',
    completed: true,
    status: 'active',
    dueDate: new Date(),
    time: '07:00',
  },
];

export const getTasks = (): Task[] => {
    if (typeof window === 'undefined') {
        return initialTasks;
    }
    try {
        const storedTasks = localStorage.getItem('habit-heroes-tasks');
        if (storedTasks) {
            const parsedTasks = JSON.parse(storedTasks);
            
            // This is a recovery mechanism for old, malformed data structure.
            // It checks if the ID of the first task is a number, which indicates the old structure.
            if (parsedTasks.length > 0 && typeof parsedTasks[0].id === 'number') {
                localStorage.removeItem('habit-heroes-tasks'); // Remove the bad data
                // Fall through to re-initialize with correct data
            } else {
                 return parsedTasks.map((task: any) => ({
                    ...task,
                    icon: iconMap[task.category] || iconMap.Learning, // Re-assign icon function
                    dueDate: new Date(task.dueDate)
                }));
            }
        }
    } catch (error) {
        console.error("Failed to parse tasks from localStorage", error);
        localStorage.removeItem('habit-heroes-tasks'); // Clear bad data on error
    }

    // This part runs if localStorage is empty, or if it was just cleared.
    // It initializes localStorage with the correct data structure.
    const tasksToSave = initialTasks.map(({icon, ...rest}) => rest);
    localStorage.setItem('habit-heroes-tasks', JSON.stringify(tasksToSave));
    return initialTasks;
};

export const updateTasks = (newTasks: Task[]) => {
    if (typeof window !== 'undefined') {
        try {
            const tasksToSave = newTasks.map(({ icon, ...rest }) => rest);
            localStorage.setItem('habit-heroes-tasks', JSON.stringify(tasksToSave));
            window.dispatchEvent(new CustomEvent('tasksUpdated'));
        } catch (error) {
            console.error("Failed to save tasks to localStorage", error);
        }
    }
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
