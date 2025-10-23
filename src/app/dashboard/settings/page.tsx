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
  const { i18n } = useTranslation();

  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold">Settings</h1>
        </header>
      <main className="flex-1 p-4 md:p-8 space-y-8">
        <Card>
          <CardHeader>
            <CardTitle>Profile</CardTitle>
            <CardDescription>Manage your personal information.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input id="name" defaultValue="Alex" />
            </div>
             <div className="space-y-2">
              <Label>Avatar</Label>
              <AvatarPicker />
            </div>
            <Button>Save Changes</Button>
          </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Personalization</CardTitle>
                <CardDescription>Customize the look and feel of your app.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                 <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="dark-mode">Dark Mode</Label>
                        <p className="text-sm text-muted-foreground">Toggle between light and dark themes.</p>
                    </div>
                    <Switch id="dark-mode" />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="sound-effects">Sound Effects</Label>
                        <p className="text-sm text-muted-foreground">Enable or disable sounds for completing tasks.</p>
                    </div>
                    <Switch id="sound-effects" defaultChecked />
                </div>
            </CardContent>
        </Card>

        <Card>
            <CardHeader>
                <CardTitle>Language</CardTitle>
                <CardDescription>Choose your preferred language for the app.</CardDescription>
            </CardHeader>
            <CardContent>
                 <div className="space-y-2">
                    <Label htmlFor="language-select">Display Language</Label>
                     <Select defaultValue={i18n.language} onValueChange={changeLanguage}>
                        <SelectTrigger id="language-select" className="w-[280px]">
                            <SelectValue placeholder="Select language" />
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
                <CardTitle>Parental Controls</CardTitle>
                <CardDescription>Manage rewards and notifications.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                    <div>
                        <Label htmlFor="notifications">Email Notifications</Label>
                        <p className="text-sm text-muted-foreground">Receive weekly progress reports via email.</p>
                    </div>
                    <Switch id="notifications" />
                </div>
                <Separator />
                 <div>
                    <Label htmlFor="rewards">Reward System</Label>
                    <p className="text-sm text-muted-foreground mb-4">Set a custom reward for achieving goals.</p>
                    <div className="flex gap-2">
                        <Input id="rewards" placeholder="e.g., An hour of video games" />
                        <Button>Set Reward</Button>
                    </div>
                </div>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
