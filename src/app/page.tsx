'use client';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import { useEffect, useState } from 'react';
import { getUser, getTasks, User, Task } from '@/lib/data';
import Image from 'next/image';
import PetViewer from '@/components/dashboard/pet-viewer';
import { Card, CardContent } from '@/components/ui/card';
import { ProgressSummaryContent } from '@/components/dashboard/progress-summary';
import { Target, Zap } from 'lucide-react';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Skeleton } from '@/components/ui/skeleton';

export default function LandingPage() {
  const [user, setUser] = useState<User | null>(null);
  const [tasks, setTasks] = useState<Task[]>([]);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const userConfig = getUser();
    setUser(userConfig);
    setTasks(getTasks());
    setIsClient(true);
  }, []);

  const completedTasks = tasks.filter(t => t.completed && new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;
  
  const petProgress = user ? (user.xp / user.xpToNextLevel) * 100 : 0;

  return (
    <div className="flex flex-col min-h-screen bg-background">
      <header className="sticky top-0 z-10 flex h-[120px] items-center justify-between bg-background/80 backdrop-blur-sm px-4 md:px-8">
        <div className="flex items-center gap-2 w-1/3">
        </div>
        <div className="flex justify-center w-1/3">
          <Image src="https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png" alt="Logo" width={360} height={114} priority className="h-[114px] w-auto" />
        </div>
        <nav className="flex justify-end w-1/3">
          <Button asChild>
            <Link href="/dashboard">
                {user?.dashboardLink || 'Go to Dashboard'}
            </Link>
          </Button>
        </nav>
      </header>

      <main className="flex-1 flex items-center justify-center p-4 md:p-8 gap-8">
        <div className="w-1/4">
            {isClient ? (
                <Card className="h-full">
                    <CardContent className="p-4 h-full">
                        <ProgressSummaryContent
                            icon={Target}
                            title={<ClientOnlyT tKey="dashboard.dailyGoal" />}
                            value={`${Math.round(dailyProgress)}%`}
                            description={<ClientOnlyT tKey="dashboard.dailyGoalDescription" tOptions={{ completedTasks, totalTasks }} />}
                        />
                    </CardContent>
                </Card>
            ) : (
                <Skeleton className="h-32 w-full" />
            )}
        </div>
        
        <div className="w-1/2 flex justify-center">
            {user && <PetViewer progress={petProgress} className="w-64 h-64" />}
        </div>
        
        <div className="w-1/4">
            {isClient && user ? (
                <Card className="h-full">
                    <CardContent className="p-4 h-full">
                        <ProgressSummaryContent
                            icon={Zap}
                            title={<ClientOnlyT tKey="dashboard.xpGained" />}
                            value={`${user.xp} XP`}
                            description={<ClientOnlyT tKey="dashboard.xpToNextLevel" tOptions={{ xp: user.xpToNextLevel - user.xp }} />}
                            progress={petProgress}
                        />
                    </CardContent>
                </Card>
             ) : (
                <Skeleton className="h-32 w-full" />
            )}
        </div>
      </main>

       <footer className="py-4 text-center text-xl text-muted-foreground">
            <a href="https://web.terry.dpdns.org/" target="_blank" rel="noopener noreferrer" className="hover:text-primary transition-colors">
              © 2025 英语全科启蒙. All Rights Reserved.『Terry开发与维护』
            </a>
       </footer>
    </div>
  );
}
