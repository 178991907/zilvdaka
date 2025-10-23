import type { LucideIcon } from 'lucide-react';
import { Book, Brush, Bed, Atom, Bike, Dumbbell, ShieldCheck, Star, Trophy, Zap } from 'lucide-react';

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
  icon: LucideIcon;
  unlocked: boolean;
  dateUnlocked?: Date;
};

export type User = {
  name: string;
  avatar: string;
  level: number;
  xp: number;
  xpToNextLevel: number;
};

export const user: User = {
  name: 'Alex',
  avatar: 'avatar1',
  level: 5,
  xp: 75,
  xpToNextLevel: 100,
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

export const achievements: Achievement[] = [
  {
    id: '1',
    title: 'First Mission',
    description: 'Complete your very first task.',
    icon: Star,
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 5)),
  },
  {
    id: '2',
    title: 'Task Master',
    description: 'Complete 10 tasks in total.',
    icon: Trophy,
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 2)),
  },
  {
    id: '3',
    title: 'Perfect Week',
    description: 'Complete all your tasks for 7 days in a row.',
    icon: ShieldCheck,
    unlocked: false,
  },
    {
    id: '4',
    title: 'Streak Starter',
    description: 'Maintain a 3-day completion streak.',
    icon: Zap,
    unlocked: true,
    dateUnlocked: new Date(new Date().setDate(new Date().getDate() - 3)),
  },
  {
    id: '5',
    title: 'Learning Hero',
    description: 'Complete 5 learning tasks.',
    icon: Book,
    unlocked: false,
  },
  {
    id: '6',
    title: 'Creative Genius',
    description: 'Complete 5 creative tasks.',
    icon: Brush,
    unlocked: false,
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
