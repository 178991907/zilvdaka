'use client';
import { Pets } from '@/lib/pets';
import { cn } from '@/lib/utils';
import { CheckCircle } from 'lucide-react';

interface PetPickerProps {
  selectedPet: string;
  onSelectPet: (id: string) => void;
}

export default function PetPicker({ selectedPet, onSelectPet }: PetPickerProps) {

  return (
    <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-4">
      {Pets.map((pet) => (
        <div
          key={pet.id}
          className={cn(
            'relative cursor-pointer rounded-lg border-2 transition-all aspect-square w-full p-2 bg-card',
            selectedPet === pet.id ? 'border-primary' : 'border-transparent'
          )}
          onClick={() => onSelectPet(pet.id)}
          role="button"
          aria-label={`Select ${pet.name} pet`}
        >
          <div dangerouslySetInnerHTML={{ __html: pet.getSvg(0) }} className="w-full h-full" />
          {selectedPet === pet.id && (
            <div className="absolute -top-2 -right-2 flex h-6 w-6 items-center justify-center rounded-full bg-primary">
              <CheckCircle className="h-4 w-4 text-primary-foreground" />
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
