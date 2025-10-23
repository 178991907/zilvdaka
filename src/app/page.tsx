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

export default function LandingPage() {
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
    <div className="flex flex-col min-h-screen bg-background">
      <header className="container mx-auto px-4 sm:px-6 lg:px-8 py-4 flex flex-col items-center gap-4">
        <Image
          src="https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png"
          alt="App Logo"
          width={360}
          height={120}
          priority
        />
        <div className="max-w-4xl w-full mx-auto grid lg:grid-cols-2 gap-6 items-center">
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
                  <div className="p-6">
                    <ProgressSummaryContent
                        icon={Target}
                        titleTKey="dashboard.dailyGoal"
                        value={`${Math.round(dailyProgress)}%`}
                        descriptionTKey="dashboard.dailyGoalDescription"
                        descriptionTPOptions={{ completedTasks, totalTasks }}
                      />
                  </div>
                    <div className="p-6">
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
      </header>

      <main className="flex-grow">
        <section className="py-12 md:py-20">
          <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <h2 className="text-4xl md:text-6xl font-bold font-headline tracking-tight text-foreground">
              宝贝成长计划
            </h2>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-muted-foreground">
              A gamified habit tracking system designed for kids. Raise a virtual pet by completing real-life tasks and building great habits.
            </p>
            <div className="mt-8 flex justify-center gap-4">
              <Button size="lg" asChild>
                <Link href="/dashboard">Start Your Adventure</Link>
              </Button>
            </div>
          </div>
        </section>
      </main>

      <footer className="py-6 bg-card">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center text-muted-foreground">
          <a href="https://web.terry.dpdns.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
            © 2025 英语全科启蒙. All Rights Reserved.『Terry开发与维护』
          </a>
        </div>
      </footer>
    </div>
  );
}
