'use client';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Target, Zap } from 'lucide-react';
import { useEffect, useState } from 'react';
import { getTasks, getUser, User, Task } from '@/lib/data';
import { Skeleton } from '@/components/ui/skeleton';
import PetViewer from '@/components/dashboard/pet-viewer';
import { ProgressSummaryContent } from '@/components/dashboard/progress-summary';
import DigitalClock from '@/components/dashboard/digital-clock';
import TaskList from '@/components/dashboard/task-list';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { ClientOnlyT } from '@/components/layout/app-sidebar';

export default function DashboardPage() {
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

  const completedTasks = tasks.filter(t => t.completed && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4 shrink-0">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='dashboard.title' /></h1>
          <div className="ml-auto flex items-center">
            {isClient && <DigitalClock />}
          </div>
        </header>

        <main className="flex-grow p-4 md:p-8">
            <div className="max-w-4xl w-full mx-auto grid lg:grid-cols-2 gap-6 items-start">
                <div>
                {isClient && user ? (
                    <PetViewer progress={petProgress} className="min-h-[300px]" />
                ) : (
                    <Skeleton className="h-full min-h-[300px] w-full" />
                )}
                </div>
                <div className="space-y-6">
                {isClient && user ? (
                    <>
                    <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <ProgressSummaryContent
                            icon={Target}
                            titleTKey="dashboard.dailyGoal"
                            value={`${Math.round(dailyProgress)}%`}
                            descriptionTKey="dashboard.dailyGoalDescription"
                            descriptionTPOptions={{ completedTasks, totalTasks }}
                        />
                    </div>
                        <div className="p-6 rounded-lg border bg-card text-card-foreground shadow-sm">
                        <ProgressSummaryContent
                            icon={Zap}
                            titleTKey="dashboard.xpGained"
                            value={`${user.xp} XP`}
                            descriptionTKey="dashboard.xpToNextLevel"
                            descriptionTPOptions={{ xp: user.xpToNextLevel - user.xp }}
                            progress={petProgress}
                        />
                        </div>
                    </>
                ) : (
                    <>
                    <Skeleton className="h-32 w-full" />
                    <Skeleton className="h-32 w-full" />
                    </>
                )}
                </div>
            </div>
            <div className="max-w-4xl mx-auto mt-8">
                <TaskList />
            </div>
        </main>
    </div>
  );
}
