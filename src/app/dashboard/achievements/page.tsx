'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { achievements } from '@/lib/data';
import AchievementBadge from '@/components/achievements/achievement-badge';
import { useTranslation } from 'react-i18next';

export default function AchievementsPage() {
  const { t } = useTranslation();
  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
    
  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">{t('achievements.title')}</h1>
          <span className="ml-auto text-sm text-muted-foreground">{t('achievements.unlocked', { unlockedCount, totalCount })}</span>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {achievements.map(achievement => (
                <AchievementBadge key={achievement.id} achievement={achievement} />
            ))}
        </div>
      </main>
    </div>
  );
}
