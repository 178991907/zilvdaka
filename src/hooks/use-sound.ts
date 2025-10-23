// /src/hooks/use-sound.ts
'use client';

import { useCallback, useEffect, useState } from 'react';

type SoundType = 'click' | 'success' | 'level-up';

const soundFiles: Record<SoundType, string> = {
  click: '/sounds/click.mp3',
  success: '/sounds/success.mp3',
  'level-up': '/sounds/level-up.mp3',
};

// Preload audio files
if (typeof window !== 'undefined') {
  Object.values(soundFiles).forEach(file => {
    const audio = new Audio(file);
    audio.load();
  });
}

export const useSound = () => {
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);

  useEffect(() => {
    const checkSoundSetting = () => {
      const storedSetting = localStorage.getItem('sound-effects-enabled');
      setIsSoundEnabled(storedSetting === null ? true : storedSetting === 'true');
    };

    checkSoundSetting();

    // Listen for changes from other tabs/windows
    window.addEventListener('storage', checkSoundSetting);
    
    // Custom event to listen for changes from the settings page in the same tab
    window.addEventListener('soundSettingChanged', checkSoundSetting);

    return () => {
      window.removeEventListener('storage', checkSoundSetting);
      window.removeEventListener('soundSettingChanged', checkSoundSetting);
    };
  }, []);

  const playSound = useCallback((sound: SoundType) => {
    if (isSoundEnabled && typeof window !== 'undefined') {
      try {
        const audio = new Audio(soundFiles[sound]);
        audio.volume = 0.5; // Adjust volume to a pleasant level
        audio.play().catch(error => {
          // Autoplay was prevented.
          console.error("Sound playback failed:", error);
        });
      } catch (error) {
        console.error("Could not play sound", error);
      }
    }
  }, [isSoundEnabled]);

  return { playSound, isSoundEnabled };
};
