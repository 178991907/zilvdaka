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

export function AddTaskDialog() {
  const { t } = useTranslation();
  return (
    <Dialog>
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
            <Input id="name" placeholder={t('tasks.addTaskDialog.taskNamePlaceholder')} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="category" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.category' />
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.categoryPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="learning"><ClientOnlyT tKey='tasks.categories.learning' /></SelectItem>
                <SelectItem value="creative"><ClientOnlyT tKey='tasks.categories.creative' /></SelectItem>
                <SelectItem value="health"><ClientOnlyT tKey='tasks.categories.health' /></SelectItem>
                <SelectItem value="school"><ClientOnlyT tKey='tasks.categories.school' /></SelectItem>
                <SelectItem value="activity"><ClientOnlyT tKey='tasks.categories.activity' /></SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="difficulty" className="text-right">
              <ClientOnlyT tKey='tasks.addTaskDialog.difficulty' />
            </Label>
            <Select>
              <SelectTrigger className="col-span-3">
                <SelectValue placeholder={<ClientOnlyT tKey='tasks.addTaskDialog.difficultyPlaceholder' />} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="easy"><ClientOnlyT tKey='tasks.difficulties.easy' /></SelectItem>
                <SelectItem value="medium"><ClientOnlyT tKey='tasks.difficulties.medium' /></SelectItem>
                <SelectItem value="hard"><ClientOnlyT tKey='tasks.difficulties.hard' /></SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button type="submit"><ClientOnlyT tKey='tasks.addTaskDialog.createTask' /></Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
