'use client';
import * as React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Task, completeTaskAndUpdateXP } from '@/lib/data';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useSound } from '@/hooks/use-sound';

interface DailyTaskTableProps {
  tasks: Task[];
}

export default function DailyTaskTable({ tasks }: DailyTaskTableProps) {
  const playSound = useSound();

  const handleTaskCompletion = (task: Task, completed: boolean) => {
    if (completed) {
      playSound('success');
    }
    completeTaskAndUpdateXP(task, completed);
  };

  return (
    <div className="rounded-lg border bg-card text-card-foreground shadow-sm">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[80px] text-center"><ClientOnlyT tKey="tasks.dailyTable.order" /></TableHead>
            <TableHead><ClientOnlyT tKey="tasks.dailyTable.dailyTask" /></TableHead>
            <TableHead className="w-[120px] text-center"><ClientOnlyT tKey="tasks.dailyTable.execution" /></TableHead>
            <TableHead className="w-[120px] text-center"><ClientOnlyT tKey="tasks.dailyTable.status" /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.length > 0 ? (
            tasks.map((task, index) => (
              <TableRow key={task.id}>
                <TableCell className="text-center font-medium">{index + 1}</TableCell>
                <TableCell>
                  <div className="flex items-center gap-3">
                    {task.icon && <task.icon className="h-5 w-5 text-primary" />}
                    <span className="font-medium">
                      {task.id.startsWith('custom-') ? task.title : <ClientOnlyT tKey={`tasks.items.${task.id}.title`} />}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="text-center">
                  <Button variant="outline" size="sm">
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
            ))
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
