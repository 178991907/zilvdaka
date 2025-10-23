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

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

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
                    <Switch id="dark-mode" />
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
                     <Select defaultValue={i18n.language} onValueChange={changeLanguage}>
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
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="notifications"><ClientOnlyT tKey='settings.parentalControls.emailNotifications' /></Label>
                        <p className="text-sm text-muted-foreground"><ClientOnlyT tKey='settings.parentalControls.emailNotificationsDescription' /></p>
                    </div>
                    <Switch id="notifications" />
                </div>
                <Separator />
                 <div>
                    <Label htmlFor="rewards"><ClientOnlyT tKey='settings.parentalControls.rewardSystem' /></Label>
                    <p className="text-sm text-muted-foreground mb-4"><ClientOnlyT tKey='settings.parentalControls.rewardSystemDescription' /></p>
                    <div className="flex gap-2">
                        <Input id="rewards" placeholder={t('settings.parentalControls.rewardPlaceholder')} />
                        <Button><ClientOnlyT tKey='settings.parentalControls.setReward' /></Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
