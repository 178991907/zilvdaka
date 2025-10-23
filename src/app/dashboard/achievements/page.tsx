'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { achievements as initialAchievements, updateAchievements, Achievement } from '@/lib/data';
import AchievementBadge from '@/components/achievements/achievement-badge';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useEffect, useState } from 'react';
import { EditAchievementDialog } from '@/components/achievements/edit-achievement-dialog';
import { PlusCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function AchievementsPage() {
  const { t } = useTranslation();
  const [achievements, setAchievements] = useState<Achievement[]>(initialAchievements);

  useEffect(() => {
    const handleAchievementsUpdate = () => {
      const updatedAchievements = JSON.parse(localStorage.getItem('habit-heroes-achievements') || 'null') || initialAchievements;
      setAchievements(updatedAchievements);
    };

    // Initial load
    handleAchievementsUpdate();

    window.addEventListener('achievementsUpdated', handleAchievementsUpdate);
    return () => {
      window.removeEventListener('achievementsUpdated', handleAchievementsUpdate);
    };
  }, []);

  const unlockedCount = achievements.filter(a => a.unlocked).length;
  const totalCount = achievements.length;
    
  const handleSave = (updatedAchievement: Achievement) => {
    const newAchievements = achievements.map(a => a.id === updatedAchievement.id ? updatedAchievement : a);
    updateAchievements(newAchievements);
  };
  
  const handleAdd = (newAchievement: Achievement) => {
    const newAchievements = [...achievements, newAchievement];
    updateAchievements(newAchievements);
  };

  const handleDelete = (achievementId: string) => {
    const newAchievements = achievements.filter(a => a.id !== achievementId);
    updateAchievements(newAchievements);
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='achievements.title' /></h1>
          <div className="ml-auto flex items-center gap-4">
            <span className="text-sm font-semibold text-muted-foreground">
                <ClientOnlyT tKey='achievements.unlocked' tOptions={{ unlockedCount, totalCount }} />
            </span>
            <EditAchievementDialog
                trigger={
                    <Button>
                        <PlusCircle className="mr-2 h-4 w-4" />
                        <ClientOnlyT tKey="achievements.add" />
                    </Button>
                }
                onSave={handleAdd}
            />
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {achievements.map(achievement => (
                <AchievementBadge 
                    key={achievement.id} 
                    achievement={achievement} 
                    onSave={handleSave}
                    onDelete={handleDelete}
                />
            ))}
        </div>
      </main>
    </div>
  );
}
