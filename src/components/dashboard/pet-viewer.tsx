'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { user } from '@/lib/data';
import { Pets } from '@/lib/pets';
import { motion, AnimatePresence } from 'framer-motion';

interface PetViewerProps {
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


const PetViewer: React.FC<PetViewerProps> = ({ progress }) => {
  const { t } = useTranslation();
  const [eyeBlinkDuration, setEyeBlinkDuration] = useState(4);
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const [bodyAnimation, setBodyAnimation] = useState<AnimationType | null>(null);
  const [eyeAnimation, setEyeAnimation] = useState<AnimationType | null>(null);

  const audioRef = useRef<HTMLAudioElement>(null);
  const petContainerRef = useRef<HTMLDivElement>(null);
  
  const petScale = 0.7 + (progress / 100) * 0.3; // Adjusted pet scale

  useEffect(() => {
    // This will only run on the client, after initial hydration
    setEyeBlinkDuration(2 + Math.random() * 4);
    // Check local storage for sound settings, assuming it's stored there from settings page
    const soundSetting = localStorage.getItem('sound-effects-enabled');
    if (soundSetting) {
      setIsSoundEnabled(soundSetting === 'true');
    }
  }, []);

  const selectedPet = Pets.find(p => p.id === user.petStyle) || Pets[0];
  
  const playSound = () => {
    if (isSoundEnabled && audioRef.current) {
        audioRef.current.currentTime = 0;
        audioRef.current.play().catch(e => console.error("Audio play failed:", e));
    }
  }

  const handleClick = (event: React.MouseEvent<HTMLDivElement>) => {
    playSound();
    
    const target = event.target as SVGElement;
    const clickedPartId = target.id || target.parentElement?.id;

    switch(clickedPartId) {
        case 'eye-left':
        case 'eye-right':
        case 'eyes':
            setEyeAnimation('wink');
            // Reset body animation if you want eyes to animate independently
            if (bodyAnimation) setBodyAnimation(null);
            break;
        case 'body':
        default:
             // Trigger a random body animation
            const bodyAnims: AnimationType[] = ['jump', 'wiggle', 'spin', 'bounce'];
            const randomAnimation = bodyAnims[Math.floor(Math.random() * bodyAnims.length)];
            setBodyAnimation(randomAnimation);
            // Reset eye animation
            if (eyeAnimation) setEyeAnimation(null);
            break;
    }
  };
  
  return (
    <Card 
        className="bg-primary/10 border-primary/20 flex flex-col items-center justify-center p-6 aspect-square w-full relative overflow-hidden cursor-pointer"
        onClick={handleClick}
    >
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-bold text-foreground"><ClientOnlyT tKey='dashboard.petLevel' /></span>
        </div>
        <Progress value={progress} className="w-full h-3" />
      </div>

       <motion.div
        className="w-full h-full flex items-center justify-center"
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
      
      <audio ref={audioRef} src="/sounds/pop.mp3" preload="auto"></audio>
    </Card>
  );
};

export default PetViewer;
