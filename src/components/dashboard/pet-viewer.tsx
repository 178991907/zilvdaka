'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { user } from '@/lib/data';
import { Pets } from '@/lib/pets';

interface PetViewerProps {
  progress: number;
}

const PetViewer: React.FC<PetViewerProps> = ({ progress }) => {
  const { t } = useTranslation();
  const [eyeBlinkDuration, setEyeBlinkDuration] = useState(4);
  const petScale = 0.8 + (progress / 100) * 0.4; // Scale from 0.8 to 1.2

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setEyeBlinkDuration(2 + Math.random() * 4);
  }, []);

  const selectedPet = Pets.find(p => p.id === user.petStyle) || Pets[0];

  return (
    <Card className="bg-primary/10 border-primary/20 flex flex-col items-center justify-center p-6 aspect-square w-full relative overflow-hidden">
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-bold text-foreground"><ClientOnlyT tKey='dashboard.petLevel' /></span>
        </div>
        <Progress value={progress} className="w-full h-3" />
      </div>

      <div
        className="w-full h-full flex items-center justify-center"
        style={{ transform: `scale(${petScale})`, transition: 'transform 0.5s ease' }}
        dangerouslySetInnerHTML={{ __html: selectedPet.getSvg(eyeBlinkDuration) }}
      />
    </Card>
  );
};

export default PetViewer;
