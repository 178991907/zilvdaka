'use client';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
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
import { PlusCircle } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { useState } from 'react';

type AddTaskDialogProps = {
  onAddTask: (task: { name: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard' }) => void;
};

export function AddTaskDialog({ onAddTask }: AddTaskDialogProps) {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState('');
  const [category, setCategory] = useState('');
  const [difficulty, setDifficulty] = useState<'Easy' | 'Medium' | 'Hard' | ''>('');

  const handleCreateTask = () => {
    if (!name || !category || !difficulty) {
      // Basic validation
      return;
    }
    onAddTask({ name, category, difficulty });
    setIsOpen(false);
    setName('');
    setCategory('');
    setDifficulty('');
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>
          <PlusCircle className="mr-2 h-4 w-4" />
          <ClientOnlyT tKey='tasks.addTask' />
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle><ClientOnlyT tKey='tasks.addTaskDialog.title' /></DialogTitle>
          <DialogDescription>
            <ClientOnlyT tKey='tasks.addTaskDialog.description' />
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
        </div>
        <DialogFooter>
          <Button type="submit" onClick={handleCreateTask}><ClientOnlyT tKey='tasks.addTaskDialog.createTask' /></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
