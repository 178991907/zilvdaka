// src/lib/data.ts
import * as localData from './data-local';
import * as kvData from './data-kv';
import * as dbData from './data-db';
import type { User, Task, Achievement, Recurrence, iconMap } from './data-types';

// This file acts as a router for data storage.
// It will use the STORAGE_PROVIDER environment variable to determine which data source to use.
// Default is 'local'.
const provider = process.env.NEXT_PUBLIC_STORAGE_PROVIDER || 'local';

let dataProvider;

switch (provider) {
  case 'kv':
    console.log('Using Cloudflare KV data provider.');
    dataProvider = kvData;
    break;
  case 'db':
    console.log('Using 3rd party DB data provider.');
    dataProvider = dbData;
    break;
  case 'local':
  default:
    console.log('Using local storage data provider.');
    dataProvider = localData;
    break;
}

export const { 
    getUser, 
    updateUser, 
    completeTaskAndUpdateXP,
    getAchievements,
    updateAchievements,
    getTasks,
    getTodaysTasks,
    updateTasks,
    iconMap,
    reportData
} = dataProvider;

// Re-export types
export type { User, Task, Achievement, Recurrence };
