import { lazy, LazyExoticComponent, FC } from 'react';

export type PetInfo = {
  id: string;
  name: string;
  unlockLevel: number;
  component: LazyExoticComponent<FC<{}>>;
};

export const PetInfos: PetInfo[] = [
  { id: 'pet1', name: 'Blobby', unlockLevel: 1, component: lazy(() => import('@/components/icons/pet1')) },
  { id: 'pet2', name: 'Spiky', unlockLevel: 2, component: lazy(() => import('@/components/icons/pet2')) },
  { id: 'pet3', name: 'Cacto', unlockLevel: 5, component: lazy(() => import('@/components/icons/pet3')) },
  { id: 'pet4', name: 'Boxy', unlockLevel: 10, component: lazy(() => import('@/components/icons/pet4')) },
  { id: 'pet5', name: 'Cloudy', unlockLevel: 15, component: lazy(() => import('@/components/icons/pet5')) },
];

export const Pets: Record<string, LazyExoticComponent<FC<{}>>> = PetInfos.reduce((acc, pet) => {
  acc[pet.id] = pet.component;
  return acc;
}, {} as Record<string, LazyExoticComponent<FC<{}>>>);


export const PetIds = PetInfos.map(p => p.id);
