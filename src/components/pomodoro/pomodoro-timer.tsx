'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { ClientOnlyT } from '../layout/app-sidebar';

const MODES = {
  work: { duration: 25 * 60, label: 'pomodoro.work' },
  shortBreak: { duration: 5 * 60, label: 'pomodoro.shortBreak' },
  longBreak: { duration: 15 * 60, label: 'pomodoro.longBreak' },
};

type Mode = keyof typeof MODES;

export default function PomodoroTimer() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeRemaining, setTimeRemaining] = useState(MODES[mode].duration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const playSound = useSound();

  const progress = (MODES[mode].duration - timeRemaining) / MODES[mode].duration;

  const nextMode = useCallback(() => {
    playSound('timer-end');
    if (mode === 'work') {
      const newPomodoroCount = pomodoros + 1;
      setPomodoros(newPomodoroCount);
      if (newPomodoroCount % 4 === 0) {
        setMode('longBreak');
      } else {
        setMode('shortBreak');
      }
    } else {
      setMode('work');
    }
  }, [mode, pomodoros, playSound]);

  useEffect(() => {
    setTimeRemaining(MODES[mode].duration);
    setIsActive(false); // Pause timer on mode change
  }, [mode]);
  
  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;
    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining(prev => prev - 1);
      }, 1000);
    } else if (isActive && timeRemaining <= 0) {
      nextMode();
    }

    return () => {
      if (interval) {
        clearInterval(interval);
      }
    };
  }, [isActive, timeRemaining, nextMode]);

  const handleToggle = () => {
    setIsActive(prev => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setTimeRemaining(MODES[mode].duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col items-center gap-4 text-center text-sidebar-foreground py-4 px-2">
      <div className="relative h-40 w-40">
        <AnimatePresence mode="wait">
           <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'backInOut' }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 100 100">
              {/* Background Circle */}
              <circle
                className="stroke-current text-sidebar-accent"
                strokeWidth="7"
                cx="50"
                cy="50"
                r="45"
                fill="transparent"
              />
              {/* Water filling effect */}
              <motion.path
                d="M 5,50 a 45,45 0 1,1 90,0"
                className="fill-current text-primary/30"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: progress }}
                transition={{ duration: 1, ease: 'easeInOut' }}
                strokeWidth="7"
                stroke="hsl(var(--primary))"
                strokeLinecap="round"
              />
            </svg>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.span
                    key={timeRemaining}
                    initial={{ opacity: 0, y: -10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 10 }}
                    transition={{ duration: 0.2 }}
                    className="text-4xl font-bold font-mono text-sidebar-primary-foreground"
                >
                    {formatTime(timeRemaining)}
                </motion.span>
            </AnimatePresence>
            <p className="text-xs font-semibold uppercase tracking-wider text-sidebar-primary-foreground/70 mt-1">
                <ClientOnlyT tKey={MODES[mode].label} />
            </p>
        </div>
      </div>

       <div className="flex w-full justify-center items-center gap-2 mt-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleReset}
          className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
        >
          <RotateCcw className="h-5 w-5" />
        </Button>
        <Button
          onClick={handleToggle}
          className="w-24 h-12 rounded-full bg-sidebar-primary text-sidebar-primary-foreground hover:bg-sidebar-primary/90 text-lg font-bold"
        >
          {isActive ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
        </Button>
         <Button
          variant="ghost"
          size="icon"
          disabled // Settings not implemented yet
          className="h-10 w-10 text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground disabled:opacity-30"
        >
          <Settings2 className="h-5 w-5" />
        </Button>
      </div>

       <div className="flex gap-2 mt-2">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
                backgroundColor: i < pomodoros % 4 ? 'hsl(var(--primary))' : 'hsl(var(--sidebar-accent))',
                scale: i === pomodoros % 4 && mode === 'work' && isActive ? 1.2 : 1,
            }}
            className="h-2 w-5 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
