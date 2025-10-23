'use client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import PetViewer from '@/components/dashboard/pet-viewer';
import ProgressSummary from '@/components/dashboard/progress-summary';
import TaskList from '@/components/dashboard/task-list';
import { tasks, user } from '@/lib/data';
import { Flame, Target, Zap } from 'lucide-react';
import React from 'react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';

export default function DashboardPage() {
  const { t } = useTranslation();
  const completedTasks = tasks.filter(t => t.completed).length;
  const totalTasks = tasks.filter(t => new Date(t.dueDate).toDateString() === new Date().toDateString()).length;
  const dailyProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='dashboard.title' /></h1>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <Card className="lg:col-span-2">
            <CardHeader>
              <CardTitle><ClientOnlyT tKey='dashboard.petTitle'/></CardTitle>
            </CardHeader>
            <CardContent>
              <PetViewer progress={user.xp} />
            </CardContent>
          </Card>
          <div className="space-y-6">
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
              progress={(user.xp / user.xpToNextLevel) * 100}
            />
          </div>
        </div>
        <div className="mt-6">
          <TaskList />
        </div>
      </main>
    </div>
  );
}
