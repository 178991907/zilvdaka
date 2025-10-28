
'use client';
import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableCaption } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Task, completeTaskAndUpdateXP } from '@/lib/data-browser';
import { iconMap } from '@/lib/data-types';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useSound } from '@/hooks/use-sound';
import DigitalClock from '../dashboard/digital-clock';
import { usePomodoroModal } from '@/components/pomodoro/pomodoro-modal';
import { useRouter } from 'next/navigation';

export default function DailyTaskTable({ initialTasks }: { initialTasks: Task[]}) {
  const [tasks, setTasks] = React.useState<Task[]>(initialTasks);
  const playSound = useSound();
  const { openPomodoro } = usePomodoroModal();
  const router = useRouter();


  const handleTaskCompletion = async (task: Task, completed: boolean) => {
    if (completed) {
      playSound('success');
    }
    await completeTaskAndUpdateXP(task, completed);
    // Optimistically update UI
    setTasks(prevTasks => prevTasks.map(t => t.id === task.id ? { ...t, completed } : t));
    router.refresh();
  };
  
  const handleStartTask = (task: Task) => {
    openPomodoro();
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
           <TableRow>
            <TableCell colSpan={4} className="p-0">
              <div className="p-4">
                <DigitalClock />
              </div>
            </TableCell>
          </TableRow>
          <TableRow>
            <TableHead className="w-[80px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.order" /></TableHead>
            <TableHead className="text-lg"><ClientOnlyT tKey="tasks.dailyTable.dailyTask" /></TableHead>
            <TableHead className="w-[120px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.execution" /></TableHead>
            <TableHead className="w-[120px] text-center text-lg"><ClientOnlyT tKey="tasks.dailyTable.status" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => {
              const Icon = iconMap[task.icon];
              return (
              <TableRow key={task.id}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {Icon && <Icon className="h-5 w-5 text-primary" />}
                    <span className="font-medium">
                      {task.title}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm" onClick={() => handleStartTask(task)}>
                    <ClientOnlyT tKey="tasks.dailyTable.start" />
                  </Button>
                </TableCell>
                <TableCell className="text-center">
                  <Switch
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task, checked)}
                  />
                </TableCell>
              </TableRow>
              )
            })
          ) : (
            <TableRow>
              <TableCell colSpan={4} className="h-24 text-center">
                <ClientOnlyT tKey="dashboard.noAdventures" />
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </div>
  );
}
