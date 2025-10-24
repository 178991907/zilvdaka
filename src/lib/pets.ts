import { lazy, LazyExoticComponent, FC } from 'react';

export type PetInfo = {
  id: string;
  name: string;
  unlockLevel: number;
  component: LazyExoticComponent<FC<{}>>;
};

export const Pets: Record<string, LazyExoticComponent<FC<{}>>> = {
  pet1: lazy(() => import('@/components/icons/pet1')),
  pet2: lazy(() => import('@/components/icons/pet2')),
  pet3: lazy(() => import('@/components/icons/pet3')),
  pet4: lazy(() => import('@/components/icons/pet4')),
  pet5: lazy(() => import('@/components/icons/pet5')),
};

export const PetIds = Object.keys(Pets);