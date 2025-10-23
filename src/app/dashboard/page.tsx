'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import PetViewer from '@/components/dashboard/pet-viewer';
import ProgressSummary from '@/components/dashboard/progress-summary';
import TaskList from '@/components/dashboard/task-list';
import { getTasks, getUser, User, Task } from '@/lib/data';
import { Flame, Target, Zap, Info } from 'lucide-react';
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function DashboardPage() {
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadData = () => {
      setUser(getUser());
      setTasks(getTasks());
      setIsClient(true);
    };

    loadData();

    const handleUserUpdate = () => setUser(getUser());
    const handleTasksUpdate = () => setTasks(getTasks());

    window.addEventListener('userProfileUpdated', handleUserUpdate);
    window.addEventListener('tasksUpdated', handleTasksUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
      window.removeEventListener('tasksUpdated', handleTasksUpdate);
    };
  }, []);

  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='dashboard.title' /></h1>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-3">
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle><ClientOnlyT tKey='dashboard.petTitle'/></CardTitle>
              </CardHeader>
              <CardContent>
                {isClient && user ? (
                  <PetViewer progress={petProgress} />
                ) : (
                  <div className="aspect-square w-full flex items-center justify-center">
                    <Skeleton className="w-3/4 h-3/4 rounded-full" />
                  </div>
                )}
              </CardContent>
            </Card>

            <div className="space-y-6">
              {isClient && user ? (
                <>
                  <ProgressSummary
                    icon={Target}
                    titleTKey="dashboard.dailyGoal"
                    value={`${Math.round(dailyProgress)}%`}
                    descriptionTKey="dashboard.dailyGoalDescription"
                    descriptionTPOptions={{ completedTasks, totalTasks }}
                  />
                  <ProgressSummary
                    icon={Flame}
                    titleTKey="dashboard.weeklyStreak"
                    value=""
                    valueTKey="dashboard.weeklyStreakValue"
                    valueTPOptions={{ count: 4 }}
                    descriptionTKey="dashboard.weeklyStreakDescription"
                  />
                  <ProgressSummary
                    icon={Zap}
                    titleTKey="dashboard.xpGained"
                    value={`${user.xp} XP`}
                    descriptionTKey="dashboard.xpToNextLevel"
                    descriptionTPOptions={{ xp: user.xpToNextLevel - user.xp }}
                    progress={petProgress}
                  />
                </>
              ) : (
                <>
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                  <Skeleton className="h-32 w-full" />
                </>
              )}
            </div>
          </div>

          <div className="lg:col-span-1">
             {isClient && user ? (
                <Card>
                  <CardHeader className="pb-4">
                      <CardTitle className="text-base font-medium flex items-center gap-2">
                        <Info className="h-5 w-5 text-primary" />
                        <ClientOnlyT tKey="petGuide.title" />
                      </CardTitle>
                  </CardHeader>
                  <CardContent className="text-sm text-muted-foreground space-y-2">
                     <p><strong className="text-foreground"><ClientOnlyT tKey="petGuide.xpTitle" />:</strong> <ClientOnlyT tKey='petGuide.xp' /></p>
                     <p><strong className="text-foreground"><ClientOnlyT tKey="petGuide.levelTitle" />:</strong> <ClientOnlyT tKey='petGuide.level' tOptions={{ level: user.level }}/></p>
                     <p><strong className="text-foreground"><ClientOnlyT tKey="petGuide.skillsTitle" />:</strong> <ClientOnlyT tKey='petGuide.skills' /></p>
                  </CardContent>
                </Card>
              ) : (
                 <Skeleton className="h-40 w-full" />
              )}
          </div>
        </div>
        <div className="mt-6">
          <TaskList />
        </div>
      </main>
    </div>
  );
}