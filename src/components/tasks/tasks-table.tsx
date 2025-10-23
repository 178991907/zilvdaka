'use client';

import * as React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { tasks, Task } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { MoreHorizontal, Pencil, Trash2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Checkbox } from '../ui/checkbox';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';

const difficultyVariant = {
    Easy: 'default',
    Medium: 'secondary',
    Hard: 'destructive',
} as const;

export default function TasksTable() {
  const { t } = useTranslation();
  const [allTasks, setAllTasks] = React.useState<Task[]>(tasks);

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    setAllTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };
  
  return (
    <div className="rounded-lg border">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[50px]"></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.task' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.category' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.difficulty' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.status' /></TableHead>
            <TableHead className="text-right w-[50px]"><ClientOnlyT tKey='tasks.table.actions' /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {allTasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>
                 <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                  />
              </TableCell>
              <TableCell className="font-medium flex items-center gap-3">
                 <task.icon className="h-5 w-5 text-muted-foreground" />
                 <ClientOnlyT tKey={`tasks.items.${task.id}.title`} />
              </TableCell>
              <TableCell>
                <Badge variant="outline"><ClientOnlyT tKey={`tasks.categories.${task.category.toLowerCase()}`} /></Badge>
              </TableCell>
              <TableCell>
                <Badge variant={difficultyVariant[task.difficulty]}><ClientOnlyT tKey={`tasks.difficulties.${task.difficulty.toLowerCase()}`} /></Badge>
              </TableCell>
              <TableCell>
                <Badge variant={task.completed ? 'default' : 'secondary'} className={task.completed ? 'bg-green-500/20 text-green-700' : ''}>
                    {task.completed ? <ClientOnlyT tKey='tasks.status.completed' /> : <ClientOnlyT tKey='tasks.status.pending' />}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" className="h-8 w-8 p-0">
                      <span className="sr-only"><ClientOnlyT tKey='tasks.table.openMenu' /></span>
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem>
                        <Pencil className="mr-2 h-4 w-4"/>
                        <ClientOnlyT tKey='tasks.table.edit' />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive">
                        <Trash2 className="mr-2 h-4 w-4"/>
                        <ClientOnlyT tKey='tasks.table.delete' />
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
