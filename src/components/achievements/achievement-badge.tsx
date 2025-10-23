'use client';

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card';
import { Achievement } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';
import { Icon } from '@/components/icons';
import { useTranslation } from 'react-i18next';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const { t } = useTranslation();
  return (
    <Card
      className={cn(
        'flex flex-col items-center justify-center text-center transition-all duration-300 transform hover:scale-105 hover:shadow-xl',
        achievement.unlocked ? 'bg-card' : 'bg-muted/50'
      )}
    >
      <CardHeader className="p-4">
        <div
          className={cn(
            'relative mx-auto flex h-20 w-20 items-center justify-center rounded-full',
            achievement.unlocked ? 'bg-accent/20' : 'bg-secondary'
          )}
        >
          <div
            className={cn(
              'absolute inset-0 rounded-full',
              achievement.unlocked ? 'animate-ping opacity-25 bg-accent' : ''
            )}
          ></div>
          <Icon
            name={achievement.icon}
            className={cn(
              'h-10 w-10 z-10',
              achievement.unlocked ? 'text-accent' : 'text-muted-foreground'
            )}
          />
          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Lock className="h-8 w-8 text-white/70" />
            </div>
          )}
        </div>
      </CardHeader>
      <CardContent className="px-2 pb-2 flex-grow">
        <p className="font-bold text-sm text-foreground">{t(`achievements.items.${achievement.id}.title`)}</p>
        <p className="text-xs text-muted-foreground mt-1">{t(`achievements.items.${achievement.id}.description`)}</p>
      </CardContent>
      {achievement.unlocked && achievement.dateUnlocked && (
        <CardFooter className="p-2 pt-0 w-full">
            <p className="text-xs text-muted-foreground w-full">
                {t('achievements.unlockedOn')}: {format(achievement.dateUnlocked, t('achievements.dateFormat'))}
            </p>
        </CardFooter>
      )}
    </Card>
  );
}
