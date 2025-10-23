import type { LucideIcon } from 'lucide-react';
import { Book, Brush, Bed, Atom, Bike, Dumbbell, ShieldCheck, Star, Trophy, Zap, Bug, Swords, Mountain, Flower, Gem } from 'lucide-react';

export type Task = {
  id: string;
  title: string;
  category: string;
  icon: LucideIcon;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  completed: boolean;
  dueDate: Date;
};

export type Achievement = {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlocked: boolean;
  dateUnlocked?: Date | string;
};

export type User = {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
  petStyle: string;
};

const defaultUser: User = {
  name: 'Alex',
  avatar: 'avatar1',
  level: 5,
  xp: 75,
  xpToNextLevel: 100,
  petStyle: 'pet1',
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

// We still export the single instance for components that don't need real-time updates after initial load.
// Note: for reactive updates, components should call getUser() themselves within useEffect.
export let user = getUser();

// Function to update the global user object and localStorage
export const updateUser = (newUserData: Partial<User>) => {
   if (typeof window !== 'undefined') {
    const currentUser = getUser();
    const updatedUser = { ...currentUser, ...newUserData };
    user = updatedUser;
    try {
      localStorage.setItem('habit-heroes-user', JSON.stringify(updatedUser));
      window.dispatchEvent(new CustomEvent('userProfileUpdated'));
    } catch (error) {
      console.error("Failed to save user to localStorage", error);
    }
  }
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
            return JSON.parse(storedAchievements);
        }
    } catch (error) {
        console.error("Failed to parse achievements from localStorage", error);
    }
    // Set default achievements if none are in localStorage
    localStorage.setItem('habit-heroes-achievements', JSON.stringify(defaultAchievements));
    return defaultAchievements;
};

export let achievements = getAchievements();

export const updateAchievements = (newAchievements: Achievement[]) => {
    if (typeof window !== 'undefined') {
        // Sort custom achievements to the top
        const sortedAchievements = [...newAchievements].sort((a, b) => {
            const aIsCustom = a.id.startsWith('custom-');
            const bIsCustom = b.id.startsWith('custom-');
            if (aIsCustom && !bIsCustom) return -1;
            if (!aIsCustom && bIsCustom) return 1;
            return 0;
        });

        achievements = sortedAchievements;
        try {
            localStorage.setItem('habit-heroes-achievements', JSON.stringify(sortedAchievements));
            window.dispatchEvent(new CustomEvent('achievementsUpdated'));
        } catch (error) {
            console.error("Failed to save achievements to localStorage", error);
        }
    }
};


export const tasks: Task[] = [
  {
    id: '1',
    title: 'Read for 20 minutes',
    category: 'Learning',
    icon: Book,
    difficulty: 'Easy',
    completed: true,
    dueDate: new Date(),
  },
  {
    id: '2',
    title: 'Practice drawing',
    category: 'Creative',
    icon: Brush,
    difficulty: 'Medium',
    completed: false,
    dueDate: new Date(),
  },
  {
    id: '3',
    title: 'Go to bed on time',
    category: 'Health',
    icon: Bed,
    difficulty: 'Easy',
    completed: false,
    dueDate: new Date(),
  },
  {
    id: '4',
    title: 'Finish science homework',
    category: 'School',
    icon: Atom,
    difficulty: 'Hard',
    completed: true,
    dueDate: new Date(new Date().setDate(new Date().getDate() - 1)),
  },
  {
    id: '5',
    title: 'Bike ride in the park',
    category: 'Activity',
    icon: Bike,
    difficulty: 'Medium',
    completed: false,
    dueDate: new Date(new Date().setDate(new Date().getDate() + 1)),
  },
   {
    id: '6',
    title: 'Morning workout',
    category: 'Health',
    icon: Dumbbell,
    difficulty: 'Medium',
    completed: true,
    dueDate: new Date(),
  },
];

export const reportData = [
    { date: 'Mon', completed: 3 },
    { date: 'Tue', completed: 4 },
    { date: 'Wed', completed: 2 },
    { date: 'Thu', completed: 5 },
    { date: 'Fri', completed: 4 },
    { date: 'Sat', completed: 6 },
    { date: 'Sun', completed: 5 },
];
