'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

type Reward = {
  name: string;
  tasksRequired?: number;
  daysRequired?: number;
};

export default function RewardsPage() {
  const { t } = useTranslation();
  const [rewards, setRewards] = useState<Reward[]>([
    { name: '30 minutes of screen time', tasksRequired: 5 },
    { name: 'Ice cream trip', tasksRequired: 10 },
  ]);

  const getRewardDescription = (reward: Reward) => {
    const tasks = reward.tasksRequired;
    const days = reward.daysRequired;

    if (tasks && tasks > 0 && days && days > 0) {
      return t('settings.parentalControls.tasksAndDaysToComplete', { tasksCount: tasks, daysCount: days });
    } else if (tasks && tasks > 0) {
      return t('settings.parentalControls.tasksToComplete', { count: tasks });
    } else if (days && days > 0) {
        return t('settings.parentalControls.daysToComplete', { count: days });
    }
    return t('settings.parentalControls.noRequirement');
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='rewards.title' /></h1>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <Card>
            <CardContent className="space-y-4 pt-6">
                <div className="space-y-1">
                    <CardTitle><ClientOnlyT tKey='settings.parentalControls.rewardSystem' /></CardTitle>
                    <CardDescription className="mb-4"><ClientOnlyT tKey='settings.parentalControls.rewardSystemDescription' /></CardDescription>
                </div>
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <Dialog>
                            <DialogTrigger asChild>
                                <Button>
                                    <PlusCircle className="mr-2 h-4 w-4" />
                                    <ClientOnlyT tKey='settings.parentalControls.addReward' />
                                </Button>
                            </DialogTrigger>
                            <DialogContent className="sm:max-w-[425px]">
                                <DialogHeader>
                                <DialogTitle><ClientOnlyT tKey='settings.parentalControls.addRewardDialog.title' /></DialogTitle>
                                <DialogDescription>
                                    <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.description' />
                                </DialogDescription>
                                </DialogHeader>
                                <div className="grid gap-4 py-4">
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="reward-name" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.rewardName' />
                                        </Label>
                                        <Input id="reward-name" placeholder={t('settings.parentalControls.addRewardDialog.rewardNamePlaceholder')} className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="tasks-required" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.tasksRequired' />
                                        </Label>
                                        <Input id="tasks-required" type="number" placeholder="5" className="col-span-3" />
                                    </div>
                                    <div className="grid grid-cols-4 items-center gap-4">
                                        <Label htmlFor="days-required" className="text-right">
                                            <ClientOnlyT tKey='settings.parentalControls.addRewardDialog.daysRequired' />
                                        </Label>
                                        <Input id="days-required" type="number" placeholder="3" className="col-span-3" />
                                    </div>
                                </div>
                                <DialogFooter>
                                <Button type="submit"><ClientOnlyT tKey='settings.parentalControls.addRewardDialog.createButton' /></Button>
                                </DialogFooter>
                            </DialogContent>
                        </Dialog>
                    </div>
                     <div className="space-y-2 rounded-md border p-2">
                        {rewards.length > 0 ? rewards.map((reward, index) => (
                           <div key={index} className="flex items-center justify-between p-2 rounded-md hover:bg-muted/50">
                                <div>
                                    <p className="font-medium">{reward.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {getRewardDescription(reward)}
                                    </p>
                                </div>
                                <Button variant="ghost" size="icon" className="text-destructive">
                                    <Trash2 className="h-4 w-4" />
                                </Button>
                           </div>
                        )) : (
                            <p className="text-center text-muted-foreground p-4"><ClientOnlyT tKey="settings.parentalControls.noRewards" /></p>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
