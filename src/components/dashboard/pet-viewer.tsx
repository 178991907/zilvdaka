'use client';

import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Star } from 'lucide-react';
import { useTranslation } from 'react-i18next';

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
  }, []); // Empty dependency array ensures this runs once on mount

  const eyeStyle: React.CSSProperties = {
    animationName: 'blink',
    animationDuration: `${eyeBlinkDuration}s`,
    animationIterationCount: 'infinite',
  };

  const eye2Style: React.CSSProperties = {
    ...eyeStyle,
    animationDelay: '0.1s',
  };

  return (
    <Card className="bg-primary/10 border-primary/20 flex flex-col items-center justify-center p-6 aspect-square w-full relative overflow-hidden">
      <div className="absolute top-4 left-4 right-4">
        <div className="flex items-center gap-2 mb-2">
            <Star className="w-5 h-5 text-accent fill-accent" />
            <span className="font-bold text-foreground">{t('dashboard.petLevel')}</span>
        </div>
        <Progress value={progress} className="w-full h-3" />
      </div>

      <div className="w-full h-full flex items-center justify-center">
        <svg
          viewBox="0 0 200 200"
          className="w-full h-full max-w-[300px] max-h-[300px]"
          style={{ transform: `scale(${petScale})`, transition: 'transform 0.5s ease' }}
        >
          <defs>
            <radialGradient id="bodyGradient" cx="0.5" cy="0.5" r="0.7">
              <stop offset="0%" stopColor="hsl(var(--primary))" />
              <stop offset="100%" stopColor="hsl(var(--primary) / 0.7)" />
            </radialGradient>
          </defs>
          
          {/* Shadow */}
          <ellipse cx="100" cy="180" rx="60" ry="10" fill="black" opacity="0.1" />

          {/* Body */}
          <g style={{ transformOrigin: 'bottom center', animationName: 'sway', animationDuration: '8s', animationTimingFunction: 'ease-in-out', animationIterationCount: 'infinite' }}>
            <path
              d="M 50,170 C 20,130 20,70 50,40 C 80,10 120,10 150,40 C 180,70 180,130 150,170 Z"
              fill="url(#bodyGradient)"
            />
          </g>
          
          {/* Eyes */}
          <g>
            <circle cx="80" cy="90" r="15" fill="white" />
            <circle cx="120" cy="90" r="15" fill="white" />
            <circle
              cx="83"
              cy="90"
              r="7"
              fill="black"
              style={eyeStyle}
            />
            <circle
              cx="117"
              cy="90"
              r="7"
              fill="black"
              style={eye2Style}
            />
          </g>
          
          {/* Mouth */}
          <path
            d="M 90,130 Q 100,145 110,130"
            stroke="white"
            strokeWidth="4"
            fill="none"
            strokeLinecap="round"
          />
        </svg>
      </div>

      <style jsx>{`
        @keyframes sway {
          0%, 100% { transform: rotate(0deg); }
          50% { transform: rotate(3deg); }
        }
        @keyframes blink {
          0%, 95%, 100% { transform: scaleY(1); }
          97.5% { transform: scaleY(0.1); }
        }
      `}</style>
    </Card>
  );
};

export default PetViewer;
