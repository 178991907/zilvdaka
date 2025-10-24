'use client';

import React, { useState, useEffect, Suspense } from 'react';
import { getUser, User } from '@/lib/data';
import { Pets } from '@/lib/pets';
import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { useSound } from '@/hooks/use-sound';
import { Skeleton } from '@/components/ui/skeleton';

interface PetViewerProps extends React.HTMLAttributes<HTMLDivElement> {
  progress: number;
}

type AnimationType = 'jump' | 'wiggle' | 'spin' | 'bounce';

const animations = {
  jump: { scale: [1, 1.1, 1], y: [0, -20, 0], transition: { duration: 0.4, ease: "easeInOut" } },
  wiggle: { rotate: [0, -10, 10, -10, 0], transition: { duration: 0.5, ease: "easeInOut" } },
  spin: { rotate: [0, 360], scale: [1, 0.8, 1], transition: { duration: 0.5, ease: "circOut" } },
  bounce: { y: [0, -15, 0, -8, 0], transition: { duration: 0.6, ease: "easeOut" } },
};

const PetViewer: React.FC<PetViewerProps> = ({ progress, className }) => {
  const [user, setUser] = useState<User | null>(null);
  const [bodyAnimation, setBodyAnimation] = useState<AnimationType | null>(null);
  const playSound = useSound();

  const petScale = (0.6 + (progress / 100) * 0.3) * 1.5;

  useEffect(() => {
    const handleProfileUpdate = () => {
      setUser(getUser());
    };
    
    window.addEventListener('userProfileUpdated', handleProfileUpdate);
    handleProfileUpdate(); 

    return () => {
      window.removeEventListener('userProfileUpdated', handleProfileUpdate);
    };
  }, []);

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    playSound('click');
    const bodyAnims: AnimationType[] = ['jump', 'wiggle', 'spin', 'bounce'];
    const randomAnimation = bodyAnims[Math.floor(Math.random() * bodyAnims.length)];
    setBodyAnimation(randomAnimation);
  };
  
  if (!user) {
    return <Skeleton className={cn("w-full h-full", className)} />;
  }

  const PetComponent = Pets[user.petStyle] || Pets['pet1'];
  
  return (
     <div className={cn("flex flex-col", className)}>
        <div className="flex flex-col flex-grow items-center justify-center w-full relative overflow-hidden">
           <div
            className="w-full h-full flex items-center justify-center rounded-lg cursor-pointer"
            onClick={handleClick}
          >
            <motion.div
              style={{ scale: petScale, transition: 'transform 0.5s ease' }}
              animate={bodyAnimation ? animations[bodyAnimation] : {}}
              onAnimationComplete={() => setBodyAnimation(null)}
              className="w-full h-full"
            >
              <Suspense fallback={<Skeleton className="w-full h-full rounded-full" />}>
                <PetComponent />
              </Suspense>
            </motion.div>
          </div>
        </div>
    </div>
  );
};

export default PetViewer;