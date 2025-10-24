'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { RotateCcw, Play, Pause, Settings2, Plus, Trash2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useSound } from '@/hooks/use-sound';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter, DialogClose } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { getUser, updateUser, User } from '@/lib/data';
import type { PomodoroSettings, PomodoroMode } from '@/lib/data-types';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const getInitialSettings = (user: User | null): PomodoroSettings => {
  const defaultSettings: PomodoroSettings = {
    modes: [
      { id: 'work', name: 'Work', duration: 25 },
      { id: 'shortBreak', name: 'Short Break', duration: 5 },
      { id: 'longBreak', name: 'Long Break', duration: 15 },
    ],
    longBreakInterval: 4,
  };

  if (user?.pomodoroSettings) {
    // Merge user settings with defaults to ensure all properties are present
    const mergedSettings = {
      ...defaultSettings,
      ...user.pomodoroSettings,
      modes: user.pomodoroSettings.modes?.length ? user.pomodoroSettings.modes : defaultSettings.modes,
    };
    // Ensure default modes exist
    if (!mergedSettings.modes.find(m => m.id === 'work')) mergedSettings.modes.unshift({ id: 'work', name: 'Work', duration: 25 });
    if (!mergedSettings.modes.find(m => m.id === 'shortBreak')) mergedSettings.modes.push({ id: 'shortBreak', name: 'Short Break', duration: 5 });
    if (!mergedSettings.modes.find(m => m.id === 'longBreak')) mergedSettings.modes.push({ id: 'longBreak', name: 'Long Break', duration: 15 });
    
    return mergedSettings;
  }
  return defaultSettings;
};


export default function PomodoroPage() {
  const [user, setUser] = useState<User | null>(null);
  const [settings, setSettings] = useState<PomodoroSettings>(getInitialSettings(null));
  
  const [modeIndex, setModeIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(0);
  const [isActive, setIsActive] = useState(false);
  const [pomodoros, setPomodoros] = useState(0);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  
  const playSound = useSound();
  const { t } = useTranslation();
  
  const currentMode = useMemo(() => settings.modes[modeIndex], [settings.modes, modeIndex]);
  const duration = useMemo(() => (currentMode?.duration || 0) * 60, [currentMode]);

  const updateUserAndSettings = useCallback(() => {
    const currentUser = getUser();
    setUser(currentUser);
    const newSettings = getInitialSettings(currentUser);
    setSettings(newSettings);
  }, []);

  useEffect(() => {
    updateUserAndSettings();

    window.addEventListener('userProfileUpdated', updateUserAndSettings);
    return () => {
      window.removeEventListener('userProfileUpdated', updateUserAndSettings);
    };
  }, [updateUserAndSettings]);
  
  useEffect(() => {
    const newDuration = (settings.modes[modeIndex]?.duration || 0) * 60;
    setTimeRemaining(newDuration);
    setIsActive(false);
  }, [modeIndex, settings]);

  const progress = duration > 0 ? (duration - timeRemaining) / duration * 100 : 0;

 const nextMode = useCallback(() => {
    playSound('timer-end');
    let nextModeIndex = 0;
    
    if (currentMode?.id === 'work') {
      const newPomodoroCount = pomodoros + 1;
      setPomodoros(newPomodoroCount);
      
      const isLongBreakTime = newPomodoroCount % settings.longBreakInterval === 0;
      const longBreakModeIndex = settings.modes.findIndex(m => m.id === 'longBreak');
      const shortBreakModeIndex = settings.modes.findIndex(m => m.id === 'shortBreak');

      if (isLongBreakTime && longBreakModeIndex !== -1) {
        nextModeIndex = longBreakModeIndex;
      } else if (shortBreakModeIndex !== -1) {
        nextModeIndex = shortBreakModeIndex;
      }
    } else {
      const workModeIndex = settings.modes.findIndex(m => m.id === 'work');
      if (workModeIndex !== -1) {
        nextModeIndex = workModeIndex;
      }
    }
    setModeIndex(nextModeIndex >= 0 && nextModeIndex < settings.modes.length ? nextModeIndex : 0);
  }, [currentMode?.id, pomodoros, playSound, settings]);

  
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
    setTimeRemaining(duration);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const resetPomodoros = () => {
    setPomodoros(0);
  };
  
  const handleSaveSettings = (newSettings: PomodoroSettings) => {
    if (newSettings.modes.length === 0) {
      newSettings.modes.push({ id: `custom-${Date.now()}`, name: 'Work', duration: 25 });
    }
    if (newSettings.longBreakInterval < 1) {
      newSettings.longBreakInterval = 1;
    }
    
    updateUser({ pomodoroSettings: newSettings });
    
    const currentModeId = currentMode?.id;
    let newCurrentModeIndex = currentModeId ? newSettings.modes.findIndex(m => m.id === currentModeId) : -1;
    if (newCurrentModeIndex === -1) {
        newCurrentModeIndex = 0;
    }
    setModeIndex(newCurrentModeIndex);

    setIsSettingsOpen(false);
  };

  const switchModeById = (id: string) => {
    const newIndex = settings.modes.findIndex(m => m.id === id);
    if (newIndex !== -1) {
      setModeIndex(newIndex);
    }
  };

  const defaultModeIds = ['work', 'shortBreak', 'longBreak'];
  const defaultModes = defaultModeIds.map(id => settings.modes.find(m => m.id === id)).filter(Boolean) as PomodoroMode[];


  return (
    <>
      <div className="flex flex-col items-center gap-6 text-center bg-card p-8 rounded-xl shadow-lg">
         <div className="flex items-center gap-2 rounded-full bg-primary/10 p-1">
            {defaultModes.map(mode => (
              <Button
                key={mode.id}
                variant={currentMode?.id === mode.id ? 'default' : 'ghost'}
                className={cn(
                  "rounded-full w-24 px-4 py-1.5 text-sm font-semibold transition-colors",
                   currentMode?.id === mode.id
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:text-primary'
                )}
                onClick={() => switchModeById(mode.id)}
              >
                 <ClientOnlyT tKey={`pomodoro.settings.defaultMode${mode.name.replace(' ','')}`} />
              </Button>
            ))}
        </div>
        
        <div className="relative h-64 w-64">
          <AnimatePresence mode="wait">
            <motion.div
              key={modeIndex}
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
          {Array.from({ length: settings.longBreakInterval }).map((_, i) => (
            <motion.div
              key={i}
              animate={{ 
                  backgroundColor: i < pomodoros % settings.longBreakInterval ? 'hsl(var(--primary))' : 'hsl(var(--muted))',
                  scale: i === pomodoros % settings.longBreakInterval && currentMode?.id === 'work' && isActive ? 1.25 : 1,
              }}
              transition={{ type: 'spring', stiffness: 500, damping: 30 }}
              className="h-3 w-8 rounded-full"
            />
          ))}
        </div>
      </div>
      
      {isSettingsOpen && 
        <SettingsDialog
          isOpen={isSettingsOpen}
          setIsOpen={setIsSettingsOpen}
          settings={settings}
          onSave={handleSaveSettings}
        />
      }
    </>
  );
}


interface SettingsDialogProps {
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  settings: PomodoroSettings;
  onSave: (settings: PomodoroSettings) => void;
}

function SettingsDialog({ isOpen, setIsOpen, settings, onSave }: SettingsDialogProps) {
  const [currentSettings, setCurrentSettings] = useState(settings);
  const { t } = useTranslation();

  useEffect(() => {
    setCurrentSettings(settings);
  }, [settings, isOpen]);

  const handleModeChange = (index: number, field: keyof PomodoroMode, value: any) => {
    const newModes = [...currentSettings.modes];
    newModes[index] = { ...newModes[index], [field]: value };
    setCurrentSettings({ ...currentSettings, modes: newModes });
  };

  const handleAddMode = () => {
    const newMode: PomodoroMode = {
      id: `custom-${Date.now()}`,
      name: 'New Mode',
      duration: 10,
    };
    setCurrentSettings({ ...currentSettings, modes: [...currentSettings.modes, newMode] });
  };

  const handleRemoveMode = (index: number) => {
    const newModes = currentSettings.modes.filter((_, i) => i !== index);
    setCurrentSettings({ ...currentSettings, modes: newModes });
  };

  const handleSave = () => {
    onSave(currentSettings);
  };
  
  const getModeName = (mode: PomodoroMode) => {
    const defaultKeys: {[key: string]: string} = {
        'work': 'pomodoro.settings.defaultModeWork',
        'shortBreak': 'pomodoro.settings.defaultModeShortBreak',
        'longBreak': 'pomodoro.settings.defaultModeLongBreak'
    }
    if (defaultKeys[mode.id]) {
        return <ClientOnlyT tKey={defaultKeys[mode.id]} />;
    }
    return mode.name;
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle><ClientOnlyT tKey="pomodoro.settings.title" /></DialogTitle>
            <DialogDescription><ClientOnlyT tKey="pomodoro.settings.description" /></DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label><ClientOnlyT tKey="pomodoro.settings.modes" /></Label>
              <div className="space-y-2 rounded-md border p-2">
                {currentSettings.modes.map((mode, index) => (
                  <div key={mode.id} className="flex items-center gap-2">
                    <Input
                      placeholder={t('pomodoro.settings.modeNamePlaceholder')}
                      value={mode.id.startsWith('custom-') ? mode.name : t(`pomodoro.settings.defaultMode${mode.name.replace(' ','')}`)}
                      onChange={(e) => handleModeChange(index, 'name', e.target.value)}
                      className="h-9"
                      disabled={['work', 'shortBreak', 'longBreak'].includes(mode.id)}
                    />
                    <Input
                      type="number"
                      placeholder={t('pomodoro.settings.minutesPlaceholder')}
                      value={mode.duration}
                      onChange={(e) => handleModeChange(index, 'duration', parseInt(e.target.value) || 0)}
                      className="w-24 h-9"
                    />
                    <Button variant="ghost" size="icon" className="h-9 w-9 text-destructive" onClick={() => handleRemoveMode(index)} disabled={['work', 'shortBreak', 'longBreak'].includes(mode.id)}>
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
              <Button variant="outline" size="sm" onClick={handleAddMode}>
                <Plus className="mr-2 h-4 w-4" />
                <ClientOnlyT tKey="pomodoro.settings.addMode" />
              </Button>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="longBreakInterval"><ClientOnlyT tKey="pomodoro.settings.longBreakInterval" /></Label>
              <Input
                id="longBreakInterval"
                type="number"
                value={currentSettings.longBreakInterval}
                onChange={(e) => setCurrentSettings({ ...currentSettings, longBreakInterval: parseInt(e.target.value) || 1 })}
              />
            </div>
          </div>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="secondary"><ClientOnlyT tKey="achievements.edit.cancel" /></Button>
            </DialogClose>
            <Button type="button" onClick={handleSave}><ClientOnlyT tKey="achievements.edit.save" /></Button>
          </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
