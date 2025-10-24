'use client';
import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Settings2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Tabs, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

type Mode = 'work' | 'shortBreak' | 'longBreak';

const getInitialDurations = () => {
  if (typeof window === 'undefined') {
    return {
      work: 25 * 60,
      shortBreak: 5 * 60,
      longBreak: 15 * 60,
    };
  }
  const savedDurations = localStorage.getItem('pomodoro-durations');
  if (savedDurations) {
    const parsed = JSON.parse(savedDurations);
    return {
      work: parsed.work * 60,
      shortBreak: parsed.shortBreak * 60,
      longBreak: parsed.longBreak * 60,
    };
  }
  return {
    work: 25 * 60,
    shortBreak: 5 * 60,
    longBreak: 15 * 60,
  };
};

export default function PomodoroPage() {
  const [mode, setMode] = useState<Mode>('work');
  const [durations, setDurations] = useState(getInitialDurations());
  const [timeRemaining, setTimeRemaining] = useState(durations.work);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const playSound = useSound();

  const MODES: Record<Mode, { label: string }> = {
    work: { label: 'pomodoro.work' },
    shortBreak: { label: 'pomodoro.shortBreak' },
    longBreak: { label: 'pomodoro.longBreak' },
  };

  const progress = (durations[mode] - timeRemaining) / durations[mode] * 100;

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
    setTimeRemaining(durations[mode]);
    setIsActive(false);
  }, [mode, durations]);
  
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
    setTimeRemaining(durations[mode]);
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
  
  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const form = e.target as HTMLFormElement;
    const newDurations = {
      work: parseInt(form.work.value) || 25,
      shortBreak: parseInt(form.shortBreak.value) || 5,
      longBreak: parseInt(form.longBreak.value) || 15,
    };
    
    setDurations({
      work: newDurations.work * 60,
      shortBreak: newDurations.shortBreak * 60,
      longBreak: newDurations.longBreak * 60,
    });

    localStorage.setItem('pomodoro-durations', JSON.stringify(newDurations));
    setIsSettingsOpen(false);
  };


  return (
    <>
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
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsSettingsOpen(true)}
            className="h-14 w-14 rounded-full"
          >
            <Settings2 className="h-6 w-6" />
          </Button>
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
      
      <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
        <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle><ClientOnlyT tKey="pomodoro.settings.title" /></DialogTitle>
              <DialogDescription><ClientOnlyT tKey="pomodoro.settings.description" /></DialogDescription>
            </DialogHeader>
            <form onSubmit={handleSaveSettings}>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="work" className="text-right">
                    <ClientOnlyT tKey="pomodoro.work" />
                  </Label>
                  <Input id="work" name="work" type="number" defaultValue={durations.work / 60} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="shortBreak" className="text-right">
                    <ClientOnlyT tKey="pomodoro.shortBreak" />
                  </Label>
                  <Input id="shortBreak" name="shortBreak" type="number" defaultValue={durations.shortBreak / 60} className="col-span-3" />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="longBreak" className="text-right">
                    <ClientOnlyT tKey="pomodoro.longBreak" />
                  </Label>
                  <Input id="longBreak" name="longBreak" type="number" defaultValue={durations.longBreak / 60} className="col-span-3" />
                </div>
              </div>
              <DialogFooter>
                <DialogClose asChild>
                  <Button type="button" variant="secondary"><ClientOnlyT tKey="achievements.edit.cancel" /></Button>
                </DialogClose>
                <Button type="submit"><ClientOnlyT tKey="achievements.edit.save" /></Button>
              </DialogFooter>
            </form>
        </DialogContent>
      </Dialog>
    </>
  );
}
