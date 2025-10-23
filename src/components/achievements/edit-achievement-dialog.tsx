'use client';
import { ReactNode, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
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
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '../layout/app-sidebar';
import { Achievement } from '@/lib/data';
import { Icon, iconNames } from '../icons';
import { Switch } from '../ui/switch';
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover';
import { CalendarIcon, Trash2 } from 'lucide-react';
import { Calendar } from '../ui/calendar';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '../ui/alert-dialog';
import { Textarea } from '../ui/textarea';

interface EditAchievementDialogProps {
  achievement?: Achievement;
  trigger: ReactNode;
  onSave: (achievement: Achievement) => void;
  onDelete?: (id: string) => void;
}

export function EditAchievementDialog({ achievement, trigger, onSave, onDelete }: EditAchievementDialogProps) {
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);

  const isEditing = !!achievement;

  const [title, setTitle] = useState(achievement?.title || '');
  const [description, setDescription] = useState(achievement?.description || '');
  const [icon, setIcon] = useState<string>(achievement?.icon || 'Star');
  const [unlocked, setUnlocked] = useState(achievement?.unlocked || false);
  const [dateUnlocked, setDateUnlocked] = useState<Date | undefined>(
    achievement?.dateUnlocked ? new Date(achievement.dateUnlocked) : undefined
  );
  
  const handleSave = () => {
    const newAchievementData: Achievement = {
      id: achievement?.id || `custom-${Date.now()}`,
      title,
      description,
      icon,
      unlocked,
      dateUnlocked: unlocked ? (dateUnlocked || new Date()) : undefined,
    };
    onSave(newAchievementData);
    setOpen(false);
  };
  
  const handleDelete = () => {
    if (onDelete && achievement) {
        onDelete(achievement.id);
        setOpen(false);
    }
  };
  
  useEffect(() => {
    if (open) {
      setTitle(achievement?.title || '');
      setDescription(achievement?.description || '');
      setIcon(achievement?.icon || 'Star');
      setUnlocked(achievement?.unlocked || false);
      setDateUnlocked(achievement?.dateUnlocked ? new Date(achievement.dateUnlocked) : undefined);
    }
  }, [open, achievement]);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px]">
        <DialogHeader>
          <DialogTitle>
            {isEditing 
                ? <ClientOnlyT tKey='achievements.edit.title' /> 
                : <ClientOnlyT tKey='achievements.add.title' />}
          </DialogTitle>
          <DialogDescription>
             {isEditing 
                ? <ClientOnlyT tKey='achievements.edit.description' /> 
                : <ClientOnlyT tKey='achievements.add.description' />}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="title" className="text-right">
              <ClientOnlyT tKey='achievements.edit.name' />
            </Label>
            <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-start gap-4">
            <Label htmlFor="description" className="text-right pt-2">
              <ClientOnlyT tKey='achievements.edit.descriptionLabel' />
            </Label>
            <Textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)} className="col-span-3" />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="icon" className="text-right">
              <ClientOnlyT tKey='achievements.edit.icon' />
            </Label>
            <Select value={icon} onValueChange={setIcon}>
              <SelectTrigger className="col-span-3">
                <div className="flex items-center gap-2">
                    <Icon name={icon} className="h-4 w-4" />
                    <SelectValue placeholder={<ClientOnlyT tKey='achievements.edit.selectIcon' />} />
                </div>
              </SelectTrigger>
              <SelectContent className="max-h-64">
                {iconNames.map(iconName => (
                  <SelectItem key={iconName} value={iconName}>
                    <div className="flex items-center gap-2">
                        <Icon name={iconName} className="h-4 w-4" />
                        <span>{iconName}</span>
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
           <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="unlocked" className="text-right">
              <ClientOnlyT tKey='achievements.edit.unlocked' />
            </Label>
             <Switch id="unlocked" checked={unlocked} onCheckedChange={setUnlocked} className='justify-self-start' />
          </div>
          {unlocked && (
            <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="date-unlocked" className="text-right">
                    <ClientOnlyT tKey='achievements.edit.date' />
                </Label>
                <Popover>
                    <PopoverTrigger asChild>
                    <Button
                        variant={'outline'}
                        className={cn(
                        'col-span-3 justify-start text-left font-normal',
                        !dateUnlocked && 'text-muted-foreground'
                        )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {dateUnlocked ? format(dateUnlocked, 'PPP') : <span><ClientOnlyT tKey='achievements.edit.pickDate' /></span>}
                    </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                    <Calendar
                        mode="single"
                        selected={dateUnlocked}
                        onSelect={setDateUnlocked}
                        initialFocus
                    />
                    </PopoverContent>
                </Popover>
            </div>
          )}
        </div>
        <DialogFooter className="sm:justify-between">
            {isEditing && onDelete ? (
                 <AlertDialog>
                    <AlertDialogTrigger asChild>
                        <Button variant="destructive" type="button">
                            <Trash2 className="mr-2 h-4 w-4" />
                            <ClientOnlyT tKey="achievements.edit.delete" />
                        </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                        <AlertDialogTitle><ClientOnlyT tKey="achievements.delete.confirmTitle" /></AlertDialogTitle>
                        <AlertDialogDescription>
                            <ClientOnlyT tKey="achievements.delete.confirmDescription" />
                        </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                        <AlertDialogCancel><ClientOnlyT tKey="achievements.delete.cancel" /></AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete}>
                            <ClientOnlyT tKey="achievements.delete.confirm" />
                        </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>

            ) : <div></div>}
            <div className='flex gap-2'>
                <DialogClose asChild>
                    <Button variant="outline"><ClientOnlyT tKey="achievements.edit.cancel" /></Button>
                </DialogClose>
                <Button type="submit" onClick={handleSave}><ClientOnlyT tKey="achievements.edit.save" /></Button>
            </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
