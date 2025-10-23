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
import { useState, useEffect, useRef } from 'react';
import { useTheme } from 'next-themes';
import PetPicker from '@/components/settings/pet-picker';
import { useToast } from '@/hooks/use-toast';
import { getUser, updateUser, User } from '@/lib/data';
import { Upload } from 'lucide-react';
import Image from 'next/image';

export default function SettingsPage() {
  const { t, i18n } = useTranslation();
  const { theme, setTheme } = useTheme();
  
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [name, setName] = useState('');
  const [petName, setPetName] = useState('');
  const [selectedAvatar, setSelectedAvatar] = useState('');
  const [selectedPet, setSelectedPet] = useState('');
  const [appLogo, setAppLogo] = useState('');
  
  const [isSoundEnabled, setIsSoundEnabled] = useState(true);
  const { toast } = useToast();
  const logoFileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const handleUserUpdate = () => {
      const user = getUser();
      setCurrentUser(user);
      setName(user.name);
      setPetName(user.petName);
      setSelectedAvatar(user.avatar);
      setSelectedPet(user.petStyle);
      setAppLogo(user.appLogo || '');
    };

    handleUserUpdate(); // Initial load

    const storedSoundSetting = localStorage.getItem('sound-effects-enabled');
    if (storedSoundSetting !== null) {
      setIsSoundEnabled(storedSoundSetting === 'true');
    }

    window.addEventListener('userProfileUpdated', handleUserUpdate);

    return () => {
      window.removeEventListener('userProfileUpdated', handleUserUpdate);
    };
  }, []);


  const changeLanguage = (lng: string) => {
    i18n.changeLanguage(lng);
  };
  
  const handleSoundToggle = (checked: boolean) => {
    setIsSoundEnabled(checked);
    localStorage.setItem('sound-effects-enabled', String(checked));
  };

  const handleLogoFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        setAppLogo(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSaveChanges = () => {
    // Save the changes to localStorage
    updateUser({
      name: name,
      petName: petName,
      avatar: selectedAvatar,
      petStyle: selectedPet,
      appLogo: appLogo,
    });

    toast({
      title: t('settings.profile.saveSuccessTitle'),
      description: t('settings.profile.saveSuccessDescription'),
    });
  };

  if (!currentUser) {
    return null; // or a loading skeleton
  }


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
              <Label htmlFor="appLogo"><ClientOnlyT tKey='settings.profile.appLogo' /></Label>
              <div className="flex items-center gap-4">
                <div className="w-32 h-32 rounded-md border border-dashed flex items-center justify-center bg-muted/50 overflow-hidden">
                    {appLogo ? (
                        <Image src={appLogo} alt="App Logo Preview" width={120} height={120} className="object-contain" />
                    ) : (
                        <span className="text-xs text-muted-foreground"><ClientOnlyT tKey='settings.profile.logoPreview' /></span>
                    )}
                </div>
                <div className="flex-1 space-y-2">
                    <Input id="appLogo" placeholder={t('settings.profile.logoUrlPlaceholder')} value={appLogo} onChange={(e) => setAppLogo(e.target.value)} />
                     <Button variant="outline" onClick={() => logoFileInputRef.current?.click()}>
                        <Upload className="mr-2 h-4 w-4" />
                        <ClientOnlyT tKey='settings.profile.upload' />
                     </Button>
                    <input
                        type="file"
                        ref={logoFileInputRef}
                        className="hidden"
                        onChange={handleLogoFileChange}
                        accept="image/*"
                    />
                </div>
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="name"><ClientOnlyT tKey='settings.profile.name' /></Label>
              <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label><ClientOnlyT tKey='settings.profile.avatar' /></Label>
              <AvatarPicker selectedAvatar={selectedAvatar} onSelectAvatar={setSelectedAvatar} />
            </div>
            <div className="space-y-2">
                <Label htmlFor="petName"><ClientOnlyT tKey='settings.profile.petName' /></Label>
                <Input id="petName" value={petName} onChange={(e) => setPetName(e.target.value)} />
            </div>
             <div className="space-y-2">
              <Label><ClientOnlyT tKey='settings.profile.choosePet' /></Label>
               <PetPicker 
                  selectedPet={selectedPet} 
                  onSelectPet={setSelectedPet}
                  userLevel={currentUser.level}
                />
            </div>
            <Button onClick={handleSaveChanges}><ClientOnlyT tKey='settings.profile.save' /></Button>
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
                    <Switch 
                      id="sound-effects" 
                      checked={isSoundEnabled}
                      onCheckedChange={handleSoundToggle}
                    />
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
                     <Select value={i18n.language} onValueChange={changeLanguage}>
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

      </main>
    </div>
  );
}
