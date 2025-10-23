'use client';
import { Pets, PetInfo } from '@/lib/pets';
import { cn } from '@/lib/utils';
import { CheckCircle, Lock } from 'lucide-react';
import { useMemo } from 'react';

interface PetPickerProps {
  selectedPet: string;
  onSelectPet: (id: string) => void;
  userLevel: number;
}

const getUnlockedPets = (level: number): PetInfo[] => {
    const unlocked = new Set<string>();
    if (level >= 1) unlocked.add('pet1');
    if (level >= 2) unlocked.add('pet2');
    if (level >= 5) unlocked.add('pet3');
    if (level >= 10) unlocked.add('pet4');
    if (level >= 15) unlocked.add('pet5');
    return Pets.filter(p => unlocked.has(p.id));
};


export default function PetPicker({ selectedPet, onSelectPet, userLevel }: PetPickerProps) {
  
  const unlockedPets = useMemo(() => getUnlockedPets(userLevel), [userLevel]);
  const unlockedPetIds = new Set(unlockedPets.map(p => p.id));

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {Pets.map((pet) => {
        const isUnlocked = unlockedPetIds.has(pet.id);
        return (
          <div
            key={pet.id}
            className={cn(
              'relative rounded-lg border-2 transition-all aspect-square w-full p-2 bg-card',
              selectedPet === pet.id ? 'border-primary' : 'border-transparent',
              isUnlocked ? 'cursor-pointer' : 'cursor-not-allowed opacity-50'
            )}
            onClick={() => isUnlocked && onSelectPet(pet.id)}
            role="button"
            aria-label={`Select ${pet.name} pet`}
            aria-disabled={!isUnlocked}
          >
            <div dangerouslySetInnerHTML={{ __html: pet.getSvg(0) }} className="w-full h-full" />
            
            {!isUnlocked && (
                <div className="absolute inset-0 bg-black/40 rounded-lg flex items-center justify-center">
                    <Lock className="h-8 w-8 text-white" />
                </div>
            )}
            
            {selectedPet === pet.id && (
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
