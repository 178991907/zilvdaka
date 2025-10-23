'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star, Zap, Info } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { getUser, User } from '@/lib/data';
import { Pets } from '@/lib/pets';
import { motion, AnimatePresence } from 'framer-motion';
import { cn } from '@/lib/utils';

interface PetViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
}

type AnimationType = 'jump' | 'wiggle' | 'spin' | 'bounce' | 'wink';

const animations = {
  jump: { scale: [1, 1.1, 1], y: [0, -20, 0], transition: { duration: 0.4, ease: "easeInOut" } },
  wiggle: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  spin: { rotate: [0, 360], scale: [1, 0.8, 1], transition: { duration: 0.5, ease: "circOut" } },
  bounce: { y: [0, -15, 0, -8, 0], transition: { duration: 0.6, ease: "easeOut" } },
  wink: { scaleY: [1, 0.1, 1], transition: { duration: 0.3 } },
};


const PetViewer: React.FC<PetViewerProps> = ({ progress, className }) => {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [eyeBlinkDuration, setEyeBlinkDuration] = useState(4);
  const [bodyAnimation, setBodyAnimation] = useState<AnimationType | null>(null);
  const [eyeAnimation, setEyeAnimation] = useState<AnimationType | null>(null);

  const petContainerRef = useRef<HTMLDivElement>(null);
  
  const petScale = 0.6 + (progress / 100) * 0.3;

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(getUser());
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    handleProfileUpdate(); 

    // This will only run on the client, after initial hydration
    setEyeBlinkDuration(2 + Math.random() * 4);

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  if (!user) {
    return null; // Or a loading skeleton
  }

  const selectedPet = Pets.find(p => p.id === user.petStyle) || Pets[0];
  
  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    const target = event.target as SVGElement;
    const clickedPartId = target.id || target.parentElement?.id;

    switch(clickedPartId) {
        case 'eye-left':
        case 'eye-right':
        case 'eyes':
            setEyeAnimation('wink');
            if (bodyAnimation) setBodyAnimation(null);
            break;
        case 'body':
        default:
            const bodyAnims: AnimationType[] = ['jump', 'wiggle', 'spin', 'bounce'];
            const randomAnimation = bodyAnims[Math.floor(Math.random() * bodyAnims.length)];
            setBodyAnimation(randomAnimation);
            if (eyeAnimation) setEyeAnimation(null);
            break;
    }
  };
  
  return (
     <Card className={cn("flex flex-col", className)}>
        <CardHeader>
            <CardTitle><ClientOnlyT tKey='dashboard.petTitle'/></CardTitle>
        </CardHeader>
        <CardContent className="flex flex-col flex-grow items-center justify-start p-4 pt-0 w-full relative overflow-hidden cursor-pointer" onClick={handleClick}>
           <motion.div
            className="w-full flex-grow flex items-center justify-center rounded-lg bg-primary/10"
            style={{ scale: petScale, transition: 'transform 0.5s ease' }}
            animate={bodyAnimation ? animations[bodyAnimation] : {}}
            onAnimationComplete={() => setBodyAnimation(null)}
          >
            <div
              ref={petContainerRef}
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: selectedPet.getSvg(eyeBlinkDuration, eyeAnimation ? animations['wink'] : undefined) }}
            />
          </motion.div>
          <div className="w-full pt-4">
            <h2 className="text-lg font-bold text-center -mb-1">{user.petName}</h2>
            <div className="flex items-center gap-2 mb-2">
                <Star className="w-4 h-4 text-accent fill-accent" />
                <span className="font-bold text-sm text-foreground"><ClientOnlyT tKey='dashboard.petLevel' /> {user.level}</span>
            </div>
            <Progress value={progress} className="w-full h-2" />
          </div>
        </CardContent>
    </Card>
  );
};

export default PetViewer;
