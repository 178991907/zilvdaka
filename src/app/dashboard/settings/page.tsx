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

export default function SettingsPage() {
  const { t, i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">{t('settings.title')}</h1>
        </header>
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>{t('settings.profile.title')}</CardTitle>
            <CardDescription>{t('settings.profile.description')}</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">{t('settings.profile.name')}</Label>
              <Input id="name" defaultValue="Alex" />
            </div>
             <div className="space-y-2">
              <Label>{t('settings.profile.avatar')}</Label>
              <AvatarPicker />
            </div>
            <Button>{t('settings.profile.save')}</Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.personalization.title')}</CardTitle>
                <CardDescription>{t('settings.personalization.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="dark-mode">{t('settings.personalization.darkMode')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.personalization.darkModeDescription')}</p>
                    </div>
                    <Switch id="dark-mode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="sound-effects">{t('settings.personalization.soundEffects')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.personalization.soundEffectsDescription')}</p>
                    </div>
                    <Switch id="sound-effects" defaultChecked />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>{t('settings.language.title')}</CardTitle>
                <CardDescription>{t('settings.language.description')}</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <Label htmlFor="language-select">{t('settings.language.displayLanguage')}</Label>
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
                <CardTitle>{t('settings.parentalControls.title')}</CardTitle>
                <CardDescription>{t('settings.parentalControls.description')}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="notifications">{t('settings.parentalControls.emailNotifications')}</Label>
                        <p className="text-sm text-muted-foreground">{t('settings.parentalControls.emailNotificationsDescription')}</p>
                    </div>
                    <Switch id="notifications" />
                </div>
                <Separator />
                 <div>
                    <Label htmlFor="rewards">{t('settings.parentalControls.rewardSystem')}</Label>
                    <p className="text-sm text-muted-foreground mb-4">{t('settings.parentalControls.rewardSystemDescription')}</p>
                    <div className="flex gap-2">
                        <Input id="rewards" placeholder={t('settings.parentalControls.rewardPlaceholder')} />
                        <Button>{t('settings.parentalControls.setReward')}</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
