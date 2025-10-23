'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Progress } from '@/components/ui/progress';
import DashboardGridLayout from '@/components/dashboard/dashboard-grid-layout';

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

  const petIntroDescription = t('dashboard.petIntroDescription');
  const petIntroItems = t('dashboard.petIntroItems', { returnObjects: true }) as string[];


  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shrink-0">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='dashboard.title' /></h1>
          <div className="ml-auto flex items-center">
            {isClient ? <DigitalClock /> : <Skeleton className="h-16 w-48" />}
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8">
            <DashboardGridLayout>
                <div key="pet" className="overflow-hidden rounded-lg">
                    <Card className="flex flex-col h-full">
                        <CardHeader>
                            <CardTitle><ClientOnlyT tKey='dashboard.myPet' /></CardTitle>
                        </CardHeader>
                        <CardContent className="flex-grow flex flex-col p-4">
                            {isClient && user ? (
                                <>
                                    <div className="flex-grow flex items-start justify-center">
                                        <PetViewer progress={petProgress} className="scale-[0.8]" />
                                    </div>
                                    <div className="mt-4">
                                        <div className="text-center">
                                            <p className="text-lg font-bold">{user.petName}</p>
                                            <p className="text-sm text-muted-foreground">
                                                <ClientOnlyT tKey='user.level' tOptions={{ level: user.level }} />
                                            </p>
                                        </div>
                                        <Progress value={petProgress} className="mt-4 h-2" />
                                    </div>
                                </>
                            ) : (
                                <div className="flex-grow flex flex-col">
                                    <Skeleton className="flex-grow w-full" />
                                    <div className="mt-4">
                                        <Skeleton className="h-6 w-24 mx-auto" />
                                        <Skeleton className="h-4 w-16 mx-auto mt-2" />
                                        <Skeleton className="h-2 w-full mt-4" />
                                    </div>
                                </div>
                            )}
                        </CardContent>
                    </Card>
                </div>
                <div key="dailyGoal" className="overflow-hidden rounded-lg">
                    <Card className="h-full">
                        <CardContent className="p-4">
                            <ProgressSummaryContent
                                icon={Target}
                                title={<ClientOnlyT tKey="dashboard.dailyGoal" />}
                                value={`${Math.round(dailyProgress)}%`}
                                description={<ClientOnlyT tKey="dashboard.dailyGoalDescription" tOptions={{ completedTasks, totalTasks }} />}
                            />
                        </CardContent>
                    </Card>
                </div>
                <div key="xpGained" className="overflow-hidden rounded-lg">
                     <Card className="h-full">
                        <CardContent className="p-4">
                            <ProgressSummaryContent
                                icon={Zap}
                                title={<ClientOnlyT tKey="dashboard.xpGained" />}
                                value={`${user ? user.xp : 0} XP`}
                                description={<ClientOnlyT tKey="dashboard.xpToNextLevel" tOptions={{ xp: user ? user.xpToNextLevel - user.xp : '...' }} />}
                                progress={petProgress}
                            />
                        </CardContent>
                     </Card>
                </div>
                <div key="petIntro" className="overflow-hidden rounded-lg">
                   <Card className="h-full">
                        <CardHeader className="flex flex-row items-start gap-4">
                        <Info className="h-6 w-6 text-primary mt-1 flex-shrink-0" />
                        <div className="flex-1">
                        <CardTitle><ClientOnlyT tKey="dashboard.petIntroTitle" /></CardTitle>
                        {isClient && Array.isArray(petIntroItems) ? (
                            <div className="mt-2 text-sm text-muted-foreground">
                            {petIntroDescription && <p className="mb-3">{petIntroDescription}</p>}
                            {petIntroItems.length > 0 && (
                                <ul className="space-y-2 list-disc pl-5">
                                {petIntroItems.map((item, index) => (
                                    <li key={index}>{item}</li>
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
               <div key="tasks" className="overflow-hidden rounded-lg border bg-card text-card-foreground shadow-sm react-grid-drag-handle">
                  <CardHeader>
                    <CardTitle><ClientOnlyT tKey='dashboard.todaysAdventures' /></CardTitle>
                  </CardHeader>
                  <CardContent className="pt-0 px-6 pb-2">
                    <TaskList />
                  </CardContent>
                </div>
            </DashboardGridLayout>
        </main>
    </div>
  );
}
