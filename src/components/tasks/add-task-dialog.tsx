'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { useState, useEffect } from 'react';
import { Task } from '@/lib/data';

type AddTaskDialogProps = {
  onSave: (task: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'>) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
  task: Task | null;
};

const weekDays = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

export function AddTaskDialog({ onSave, isOpen, setIsOpen, task }: AddTaskDialogProps) {
  const { t } = useTranslation();
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');
  const [recurrence, setRecurrence] = useState({
    frequency: 'daily',
    daysOfWeek: [] as (typeof weekDays[number])[],
  });
  const [time, setTime] = useState('08:00');
  
  const isEditMode = task !== null;

  useEffect(() => {
    if (isOpen) {
      if (task) {
        setName(task.title);
        setCategory(task.category);
        setDifficulty(task.difficulty);
        setRecurrence(task.recurrence || { frequency: 'daily', daysOfWeek: [] });
        setTime(task.time || '08:00');
      } else {
        // Reset form for new task
        setName('');
        setCategory('');
        setDifficulty('');
        setRecurrence({ frequency: 'daily', daysOfWeek: [] });
        setTime('08:00');
      }
    }
  }, [isOpen, task]);

  const handleSave = () => {
    if (!name || !category || !difficulty) {
      // Basic validation
      return;
    }
    onSave({ title: name, category, difficulty, recurrence, time });
    setIsOpen(false);
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.title' : 'tasks.addTaskDialog.title'} /></DialogTitle>
          <DialogDescription>
            <ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.description' : 'tasks.addTaskDialog.description'} />
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.taskName' />
            </Label>
            <Input
              id="name"
              placeholder={t('tasks.addTaskDialog.taskNamePlaceholder')}
              className="col-span-3"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.category' />
            </Label>
            <Select onValueChange={setCategory} value={category}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.categoryPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Learning"><ClientOnlyT tKey='tasks.categories.learning' /></SelectItem>
                <SelectItem value="Creative"><ClientOnlyT tKey='tasks.categories.creative' /></SelectItem>
                <SelectItem value="Health"><ClientOnlyT tKey='tasks.categories.health' /></SelectItem>
                <SelectItem value="School"><ClientOnlyT tKey='tasks.categories.school' /></SelectItem>
                <SelectItem value="Activity"><ClientOnlyT tKey='tasks.categories.activity' /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.difficulty' />
            </Label>
            <Select onValueChange={(value) => setDifficulty(value as 'Easy' | 'Medium' | 'Hard')} value={difficulty}>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.difficultyPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="Easy"><ClientOnlyT tKey='tasks.difficulties.easy' /></SelectItem>
                <SelectItem value="Medium"><ClientOnlyT tKey='tasks.difficulties.medium' /></SelectItem>
                <SelectItem value="Hard"><ClientOnlyT tKey='tasks.difficulties.hard' /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="recurrence" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.recurrence' />
            </Label>
            <Select
              value={recurrence.frequency}
              onValueChange={(value) => setRecurrence(prev => ({ ...prev, frequency: value }))}
            >
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.selectRecurrence' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="daily"><ClientOnlyT tKey='tasks.recurrence.daily' /></SelectItem>
                <SelectItem value="weekly"><ClientOnlyT tKey='tasks.recurrence.weekly' /></SelectItem>
                <SelectItem value="monthly"><ClientOnlyT tKey='tasks.recurrence.monthly' /></SelectItem>
                <SelectItem value="yearly"><ClientOnlyT tKey='tasks.recurrence.yearly' /></SelectItem>
              </SelectContent>
            </Select>
          </div>

          {recurrence.frequency === 'weekly' && (
             <div className="grid grid-cols-4 items-start gap-4">
                <Label className="text-right pt-2">
                    <ClientOnlyT tKey='tasks.addTaskDialog.daysOfWeek' />
                </Label>
                <ToggleGroup
                    type="multiple"
                    variant="outline"
                    className="col-span-3 flex-wrap justify-start gap-1"
                    value={recurrence.daysOfWeek}
                    onValueChange={(days) => setRecurrence(prev => ({...prev, daysOfWeek: days as any}))}
                >
                    {weekDays.map(day => (
                        <ToggleGroupItem key={day} value={day} className="h-8 w-8 p-0">
                           <ClientOnlyT tKey={`tasks.weekdays.${day}`} />
                        </ToggleGroupItem>
                    ))}
                </ToggleGroup>
            </div>
          )}

          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="time" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.time' />
            </Label>
            <Input
              id="time"
              type="time"
              className="col-span-3"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleSave}>
            <ClientOnlyT tKey={isEditMode ? 'tasks.editTaskDialog.save' : 'tasks.addTaskDialog.createTask'} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
