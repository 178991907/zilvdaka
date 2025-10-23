// src/lib/data-kv.ts
// This is a placeholder for Cloudflare KV storage implementation.
// The actual implementation would require server-side logic (e.g., Next.js API routes or Cloudflare Workers)
// to interact with the KV namespace. The `KV` variable would be bound in the Cloudflare environment.

import type { User, Task, Achievement } from './data-types';
import { iconMap } from './data-types';

// --- PLACEHOLDER IMPLEMENTATION ---

const defaultUser: User = {
  name: 'Alex (KV)',
  avatar: 'avatar1',
  level: 1,
  xp: 0,
  xpToNextLevel: 100,
  petStyle: 'pet1',
  petName: '泡泡',
  appLogo: '',
};

const initialTasks: Task[] = [
  { id: '1', title: 'Read KV Task', category: 'Learning', icon: iconMap.Learning, difficulty: 'Easy', completed: false, status: 'active', dueDate: new Date() }
];

const defaultAchievements: Achievement[] = [
    { id: '1', title: 'KV Achivement', description: 'Loaded from KV', icon: 'Star', unlocked: true, dateUnlocked: new Date() }
];

console.warn("Cloudflare KV provider is not fully implemented. Using placeholder data.");

export const getUser = (): User => {
  // In a real scenario, you'd fetch this from a server-side endpoint
  // that reads from Cloudflare KV.
  return defaultUser;
};

export const updateUser = (newUserData: Partial<User>) => {
  // In a real scenario, this would send an update to a server-side endpoint.
  console.log("KV.updateUser called (placeholder)", newUserData);
};

export const getTasks = (): Task[] => {
  return initialTasks;
};

export const updateTasks = (newTasks: Task[]) => {
  console.log("KV.updateTasks called (placeholder)", newTasks);
};

export const getAchievements = (): Achievement[] => {
    return defaultAchievements;
};

export const updateAchievements = (newAchievements: Achievement[]) => {
    console.log("KV.updateAchievements called (placeholder)", newAchievements);
};

export const completeTaskAndUpdateXP = (task: Task, completed: boolean) => {
    console.log("KV.completeTaskAndUpdateXP called (placeholder)", task, completed);
};

export { iconMap };

export const reportData = [
    { date: 'Mon', completed: 1 },
    { date: 'Tue', completed: 1 },
    { date: 'Wed', completed: 1 },
    { date: 'Thu', completed: 1 },
    { date: 'Fri', completed: 1 },
    { date 'Sat', completed: 1 },
    { date: 'Sun', completed: 1 },
];
