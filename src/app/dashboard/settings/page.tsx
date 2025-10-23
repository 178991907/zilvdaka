'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import AvatarPicker from '@/components/settings/avatar-picker';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, Trash2 } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useTheme } from 'next-themes';

type Reward = {
  name: string;
  tasksRequired: number;
};

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  const [rewards, setRewards] = useState<Reward[]>([
    { name: '30 minutes of screen time', tasksRequired: 5 },
    { name: 'Ice cream trip', tasksRequired: 10 },
  ]);

  // This state ensures we have a reliable value for the Select component,
  // especially during initial client-side render.
  const [currentLanguage, setCurrentLanguage] = useState(i18n.language);

  useEffect(() => {
    const handleLanguageChanged = (lng: string) => {
      setCurrentLanguage(lng);
    };
    i18n.on('languageChanged', handleLanguageChanged);
    
    // Fallback for when the detector has run but component hasn't updated
    if (i18n.language !== currentLanguage) {
      setCurrentLanguage(i18n.language);
    }
    
    return () => {
      i18n.off('languageChanged', handleLanguageChanged);
    };
  }, [i18n, currentLanguage]);


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='settings.title' /></h1>
        </header>
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle><ClientOnlyT tKey='settings.profile.title' /></CardTitle>
            <CardDescription><ClientOnlyT tKey='settings.profile.description' /></CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name"><ClientOnlyT tKey='settings.profile.name' /></Label>
              <Input id="name" defaultValue="Alex" />
            </div>
             <div className="space-y-2">
              <Label><ClientOnlyT tKey='settings.profile.avatar' /></Label>
              <AvatarPicker />
            </div>
            <Button><ClientOnlyT tKey='settings.profile.save' /></Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle><ClientOnlyT tKey='settings.personalization.title' /></CardTitle>
                <CardDescription><ClientOnlyT tKey='settings.personalization.description' /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="dark-mode"><ClientOnlyT tKey='settings.personalization.darkMode' /></Label>
                        <p className="text-sm text-muted-foreground"><ClientOnlyT tKey='settings.personalization.darkModeDescription' /></p>
                    </div>
                    <Switch
                        id="dark-mode"
                        checked={theme === 'dark'}
                        onCheckedChange={(checked) => setTheme(checked ? 'dark' : 'light')}
                    />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="sound-effects"><ClientOnlyT tKey='settings.personalization.soundEffects' /></Label>
                        <p className="text-sm text-muted-foreground"><ClientOnlyT tKey='settings.personalization.soundEffectsDescription' /></p>
                    </div>
                    <Switch id="sound-effects" defaultChecked />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle><ClientOnlyT tKey='settings.language.title' /></CardTitle>
                <CardDescription><ClientOnlyT tKey='settings.language.description' /></CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <Label htmlFor="language-select"><ClientOnlyT tKey='settings.language.displayLanguage' /></Label>
                     <Select value={currentLanguage} onValueChange={changeLanguage}>
                        <SelectTrigger id="language-select" className="w-[280px]">
                            <SelectValue placeholder={t('settings.language.selectLanguage')} />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="en">English</SelectItem>
                            <SelectItem value="zh">中文 (Chinese)</SelectItem>
                            <SelectItem value="en-zh">中英对照 (Bilingual)</SelectItem>
                        </SelectContent>
                    </Select>
                </div>
            </CardContent>
        </Card>

         <Card>
            <CardHeader>
                <CardTitle><ClientOnlyT tKey='settings.parentalControls.title' /></CardTitle>
                <CardDescription><ClientOnlyT tKey='settings.parentalControls.description' /></CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-4">
                        <div>
                            <Label><ClientOnlyT tKey='settings.parentalControls.rewardSystem' /></Label>
                            <p className="text-sm text-muted-foreground"><ClientOnlyT tKey='settings.parentalControls.rewardSystemDescription' /></p>
                        </div>
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
                                        <ClientOnlyT tKey="settings.parentalControls.tasksToComplete" tOptions={{ count: reward.tasksRequired }} />
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
