'use client';
import { PetInfo, Pets, PetIds } from '@/lib/pets';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';
import { useMemo, Suspense } from 'react';
import { Skeleton } from '../ui/skeleton';

interface PetPickerProps {
  selectedPet: string;
  onSelectPet: (id: string) => void;
  userLevel: number;
}

// Temporary PetInfo data for calculating unlock levels. Will be removed after refactor.
const PetInfos: Omit<PetInfo, 'component'>[] = [
  { id: 'pet1', name: 'Blobby', unlockLevel: 1 },
  { id: 'pet2', name: 'Spiky', unlockLevel: 2 },
  { id: 'pet3', name: 'Cacto', unlockLevel: 5 },
  { id: 'pet4', name: 'Boxy', unlockLevel: 10 },
  { id: 'pet5', name: 'Cloudy', unlockLevel: 15 },
];


export default function PetPicker({ selectedPet, onSelectPet, userLevel }: PetPickerProps) {
  
  const unlockedPetIds = useMemo(() => {
    return new Set(PetInfos.filter(p => userLevel >= p.unlockLevel).map(p => p.id));
  }, [userLevel]);

  return (
    <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-7 gap-4">
      {PetIds.map((petId) => {
        const PetComponent = Pets[petId];
        const petInfo = PetInfos.find(p => p.id === petId)!;
        const isUnlocked = unlockedPetIds.has(petId);
        
        return (
          <div
            key={petId}
            className={cn(
              'relative rounded-lg border-2 transition-all aspect-square w-full p-2 bg-card',
              selectedPet === petId ? 'border-primary' : 'border-transparent',
              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed'
            )}
            onClick={() => isUnlocked && onSelectPet(petId)}
            role="button"
            aria-label={`Select ${petInfo.name} pet`}
            aria-disabled={!isUnlocked}
          >
            <Suspense fallback={<Skeleton className="w-full h-full rounded-md" />}>
              <PetComponent />
            </Suspense>
            
            {!isUnlocked && (
                <div className="absolute inset-0 bg-black/50 rounded-lg flex flex-col items-center justify-center text-white">
                    <Lock className="h-6 w-6" />
                    <span className="text-xs font-bold mt-1">Lv. {petInfo.unlockLevel}</span>
                </div>
            )}
            
            {selectedPet === petId && (
              <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
                <CheckCircle className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        )
      })}
    </div>
  );
}