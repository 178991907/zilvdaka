'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';

const MODES = {
  work: { duration: 25 * 60, label: 'pomodoro.work' },
  shortBreak: { duration: 5 * 60, label: 'pomodoro.shortBreak' },
  longBreak: { duration: 15 * 60, label: 'pomodoro.longBreak' },
};

type Mode = keyof typeof MODES;

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>('work');
  const [timeRemaining, setTimeRemaining] = useState(MODES[mode].duration);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const playSound = useSound();

  const progress = (MODES[mode].duration - timeRemaining) / MODES[mode].duration * 100;

  const nextMode = useCallback(() => {
    playSound('timer-end');
    if (mode === 'work') {
      const newPomodoroCount = pomodoros + 1;
      setPomodoros(newPomodoroCount);
      setMode(newPomodoroCount % 4 === 0 ? 'longBreak' : 'shortBreak');
    } else {
      setMode('work');
    }
  }, [mode, pomodoros, playSound]);

  useEffect(() => {
    setTimeRemaining(MODES[mode].duration);
    setIsActive(false);
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

  const handleModeChange = (newMode: string) => {
    setMode(newMode as Mode);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetPomodoros = () => {
    setPomodoros(0);
  };

  return (
    <div className="flex flex-col items-center gap-8 text-center bg-card p-8 rounded-xl shadow-lg">
      <Tabs defaultValue="work" value={mode} onValueChange={handleModeChange} className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="work"><ClientOnlyT tKey={MODES.work.label} /></TabsTrigger>
          <TabsTrigger value="shortBreak"><ClientOnlyT tKey={MODES.shortBreak.label} /></TabsTrigger>
          <TabsTrigger value="longBreak"><ClientOnlyT tKey={MODES.longBreak.label} /></TabsTrigger>
        </TabsList>
      </Tabs>
      
      <div className="relative h-64 w-64">
        <AnimatePresence mode="wait">
           <motion.div
            key={mode}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.5, ease: 'backInOut' }}
            className="absolute inset-0"
          >
            <svg className="w-full h-full" viewBox="0 0 120 120">
              <circle
                className="stroke-current text-muted"
                strokeWidth="10"
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
              />
              <motion.circle
                className="stroke-current text-primary"
                strokeWidth="10"
                cx="60"
                cy="60"
                r="50"
                fill="transparent"
                strokeDasharray="314.15"
                strokeDashoffset={314.15 * (1 - progress / 100)}
                strokeLinecap="round"
                transform="rotate(-90 60 60)"
                initial={{ strokeDashoffset: 314.15 }}
                animate={{ strokeDashoffset: 314.15 * (1 - progress / 100) }}
                transition={{ duration: 1, ease: 'easeInOut' }}
              />
            </svg>
          </motion.div>
        </AnimatePresence>
        <div className="absolute inset-0 flex flex-col items-center justify-center">
            <AnimatePresence mode="wait">
                <motion.span
                    key={timeRemaining}
                    initial={{ opacity: 0, y: -15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 15, position: 'absolute' }}
                    transition={{ duration: 0.3 }}
                    className="text-6xl font-bold font-mono text-foreground"
                >
                    {formatTime(timeRemaining)}
                </motion.span>
            </AnimatePresence>
        </div>
      </div>

       <div className="flex w-full justify-center items-center gap-4 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={handleReset}
          className="h-14 w-14 rounded-full"
        >
          <RotateCcw className="h-6 w-6" />
        </Button>
        <Button
          onClick={handleToggle}
          className="w-32 h-16 rounded-full text-2xl font-bold"
          size="lg"
        >
          {isActive ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
        </Button>
         <div className="h-14 w-14" />
      </div>

       <div className="flex gap-4 mt-4 cursor-pointer" onClick={resetPomodoros} title="Reset Pomodoro Count">
        {Array.from({ length: 4 }).map((_, i) => (
          <motion.div
            key={i}
            animate={{ 
                backgroundColor: i < pomodoros % 4 ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                scale: i === pomodoros % 4 && mode === 'work' && isActive ? 1.25 : 1,
            }}
            transition={{ type: 'spring', stiffness: 500, damping: 30 }}
            className="h-3 w-8 rounded-full"
          />
        ))}
      </div>
    </div>
  );
}
