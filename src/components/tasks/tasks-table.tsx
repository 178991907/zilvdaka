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
import { Task } from '@/lib/data';
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

interface TasksTableProps {
  tasks: Task[];
  setTasks: React.Dispatch<React.SetStateAction<Task[]>>;
  onEdit: (task: Task) => void;
  onDelete: (task: Task) => void;
}

// This component handles the translation of daysOfWeek on the client side to prevent hydration mismatch.
const TranslatedDays = ({ days }: { days: ('mon' | 'tue' | 'wed' | 'thu' | 'fri' | 'sat' | 'sun')[] | undefined }) => {
  if (!days || days.length === 0) return null;
  return (
    <>
      {days.map((day, index) => (
        <React.Fragment key={day}>
          <ClientOnlyT tKey={`tasks.weekdaysShort.${day}`} />
          {index < days.length - 1 && ', '}
        </React.Fragment>
      ))}
    </>
  );
};


export default function TasksTable({ tasks, setTasks, onEdit, onDelete }: TasksTableProps) {
  const { t } = useTranslation();

  const handleTaskCompletion = (taskId: string, completed: boolean) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId ? { ...task, completed } : task
      )
    );
  };

 const formatRecurrence = (task: Task) => {
    if (!task.recurrence) {
      if (task.time) {
        return <ClientOnlyT tKey="tasks.recurrence.display.onceAtTime" tOptions={{ time: task.time }} />;
      }
      return <ClientOnlyT tKey="tasks.recurrence.once" />;
    }

    const { interval, unit, daysOfWeek } = task.recurrence;
    const time = task.time ? ` at ${task.time}` : '';
    const intervalText = interval > 1 ? interval : '';

    const options: { [key: string]: any } = {
        count: interval,
        time: task.time
    };

    let tKey = `tasks.recurrence.display.every_${unit}`;
    if (interval > 1) {
        tKey = `tasks.recurrence.display.every_x_${unit}s`;
    }

    if (unit === 'week' && daysOfWeek && daysOfWeek.length > 0) {
        tKey += '_on';
        options.days = <TranslatedDays days={daysOfWeek} />;
    }

    return <ClientOnlyT tKey={tKey} tOptions={options} />;
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
            <TableHead><ClientOnlyT tKey='tasks.table.recurrence' /></TableHead>
            <TableHead><ClientOnlyT tKey='tasks.table.status' /></TableHead>
            <TableHead className="text-right w-[50px]"><ClientOnlyT tKey='tasks.table.actions' /></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {tasks.map(task => (
            <TableRow key={task.id}>
              <TableCell>
                 <Checkbox
                    checked={task.completed}
                    onCheckedChange={(checked) => handleTaskCompletion(task.id, !!checked)}
                  />
              </TableCell>
              <TableCell className="font-medium flex items-center gap-3">
                 <task.icon className="h-5 w-5 text-muted-foreground" />
                 {task.id.startsWith('task-') ? task.title : <ClientOnlyT tKey={`tasks.items.${task.id}.title`} />}
              </TableCell>
              <TableCell>
                <Badge variant="outline">{task.id.startsWith('task-') ? task.category : <ClientOnlyT tKey={`tasks.categories.${task.category.toLowerCase()}`} />}</Badge>
              </TableCell>
              <TableCell>
                <Badge variant={difficultyVariant[task.difficulty]}><ClientOnlyT tKey={`tasks.difficulties.${task.difficulty.toLowerCase()}`} /></Badge>
              </TableCell>
               <TableCell className="text-muted-foreground text-xs">
                {formatRecurrence(task)}
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
                    <DropdownMenuItem onClick={() => onEdit(task)}>
                        <Pencil className="mr-2 h-4 w-4"/>
                        <ClientOnlyT tKey='tasks.table.edit' />
                    </DropdownMenuItem>
                    <DropdownMenuItem className="text-destructive" onClick={() => onDelete(task)}>
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
