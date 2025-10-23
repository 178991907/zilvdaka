'use client';

import { Achievement } from '@/lib/data';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Lock } from 'lucide-react';
import { Icon } from '@/components/icons';
import { ClientOnlyT } from '../layout/app-sidebar';

interface AchievementBadgeProps {
  achievement: Achievement;
}

export default function AchievementBadge({ achievement }: AchievementBadgeProps) {
  const isCustom = achievement.id.startsWith('custom-');

  return (
    <div className={cn(
        "relative flex flex-col items-center justify-start text-center aspect-square rounded-xl transition-all duration-300 transform hover:scale-105 p-4 group",
        achievement.unlocked 
          ? 'bg-accent/20 border-2 border-accent/50 shadow-lg shadow-accent/10' 
          : 'bg-muted/50'
      )}>
       
        {achievement.unlocked && (
            <div className="absolute inset-0 bg-grid-slate-100 [mask-image:linear-gradient(0deg,#fff,rgba(255,255,255,0.6))] dark:bg-grid-slate-700/25 dark:[mask-image:linear-gradient(0deg,rgba(255,255,255,0.1),rgba(255,255,255,0.5))]"></div>
        )}
        <div
          className={cn(
            'relative mx-auto flex h-24 w-24 items-center justify-center rounded-full z-10',
            achievement.unlocked ? 'bg-accent/20' : 'bg-secondary'
          )}
        >
          {achievement.unlocked && (
             <div className="absolute inset-0 animate-pulse rounded-full bg-accent opacity-30"></div>
          )}
          <Icon
            name={achievement.icon}
            className={cn(
              'h-12 w-12 z-10',
              achievement.unlocked ? 'text-accent-foreground' : 'text-muted-foreground'
            )}
          />
          {!achievement.unlocked && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/30 rounded-full">
              <Lock className="h-10 w-10 text-white/70" />
            </div>
          )}
        </div>
      <div className="flex flex-col flex-grow justify-center mt-2 z-10">
        <p className="font-bold text-base text-foreground">
            {isCustom ? achievement.title : <ClientOnlyT tKey={`achievements.items.${achievement.id}.title`} />}
        </p>
        <p className="text-xs text-muted-foreground mt-1 px-2">
            {isCustom ? achievement.description : <ClientOnlyT tKey={`achievements.items.${achievement.id}.description`} />}
        </p>
      </div>
      {achievement.unlocked && achievement.dateUnlocked && (
        <div className="w-full mt-2 z-10">
            <p className="text-xs text-muted-foreground w-full">
                <ClientOnlyT tKey='achievements.unlockedOn' />: {format(new Date(achievement.dateUnlocked), 'MMM d, yyyy')}
            </p>
        </div>
      )}
    </div>
  );
}
