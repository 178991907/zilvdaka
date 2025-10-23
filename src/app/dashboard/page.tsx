'use client';
import Link from 'next/link';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Zap, Info } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTasks, getUser, User, Task } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import PetViewer from '@/components/dashboard/pet-viewer';
import { ProgressSummaryContent } from '@/components/dashboard/progress-summary';
import DigitalClock from '@/components/dashboard/digital-clock';
import TaskList from '@/components/dashboard/task-list';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Pets } from '@/lib/pets';
import { Button } from '@/components/ui/button';
import { useTranslation } from 'react-i18next';
import { Progress } from '@/components/ui/progress';

export default function DashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);
  const { t } = useTranslation();

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

  const completedTasks = tasks.filter(t => t.completed && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;
  const currentPet = user ? Pets.find(p => p.id === user.petStyle) : null;

  const petIntroTitle = t('dashboard.petIntroTitle');
  const petIntroItems = t('pets.description.items', { returnObjects: true }) as string[];


  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shrink-0">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">{t('dashboard.title')}</h1>
          <div className="ml-auto flex items-center">
            {isClient ? <DigitalClock /> : <Skeleton className="h-16 w-48" />}
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8">
            <div className="max-w-6xl w-full mx-auto space-y-6">
                <div className="grid lg:grid-cols-3 gap-6">
                    <div className="lg:col-span-2 grid md:grid-cols-2 gap-6">
                        <Card className="transform scale-[1.30] origin-top-left md:ml-20 mt-10">
                            <CardHeader>
                                <CardTitle>{t('dashboard.myPet')}</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {isClient && user ? (
                                    <>
                                        <PetViewer progress={petProgress} className="h-48" />
                                        <div className="text-center mt-4">
                                            <p className="text-lg font-bold">{user.petName}</p>
                                            <p className="text-sm text-muted-foreground">
                                            {t('user.level', { level: user.level })}
                                            </p>
                                        </div>
                                        <Progress value={petProgress} className="mt-4 h-2" />
                                    </>
                                ) : (
                                    <>
                                        <Skeleton className="h-48 w-full" />
                                        <Skeleton className="h-6 w-24 mx-auto mt-4" />
                                        <Skeleton className="h-4 w-16 mx-auto mt-2" />
                                        <Skeleton className="h-2 w-full mt-4" />
                                    </>
                                )}
                            </CardContent>
                        </Card>
                         <div className="space-y-6 flex flex-col">
                            <Card className="flex-1">
                                <CardHeader>
                                    <ProgressSummaryContent
                                        icon={Target}
                                        title={t("dashboard.dailyGoal")}
                                        value={`${Math.round(dailyProgress)}%`}
                                        description={t("dashboard.dailyGoalDescription", { completedTasks, totalTasks })}
                                    />
                                </CardHeader>
                            </Card>
                            <Card className="flex-1">
                                 <CardHeader>
                                    <ProgressSummaryContent
                                        icon={Zap}
                                        title={t("dashboard.xpGained")}
                                        value={`${user ? user.xp : 0} XP`}
                                        description={t("dashboard.xpToNextLevel", { xp: user ? user.xpToNextLevel - user.xp : '...' })}
                                        progress={petProgress}
                                    />
                                 </CardHeader>
                            </Card>
                        </div>
                    </div>
                     <Card>
                        <CardHeader className="flex flex-row items-start gap-4">
                          <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                          <div className="flex-1">
                           <CardTitle>{petIntroTitle}</CardTitle>
                            {isClient && Array.isArray(petIntroItems) ? (
                              <div className="mt-2 text-sm text-muted-foreground">
                                {petIntroItems[0] && <p className="mb-3">{petIntroItems[0]}</p>}
                                {petIntroItems.length > 1 && (
                                  <ul className="space-y-2 list-none p-0">
                                    {petIntroItems.slice(1).map((item, index) => (
                                      <li key={index} className="flex items-start">
                                        <span>{item}</span>
                                      </li>
                                    ))}
                                  </ul>
                                )}
                              </div>
                            ) : (
                                <div className="mt-2 space-y-2">
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-3/4" />
                                </div>
                            )}
                          </div>
                        </CardHeader>
                    </Card>
                </div>
                <TaskList />
            </div>
        </main>
    </div>
  );
}
