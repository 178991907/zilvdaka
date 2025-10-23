'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  SidebarHeader,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarContent,
  SidebarFooter,
} from '@/components/ui/sidebar';
import {
  LayoutDashboard,
  CheckSquare,
  Trophy,
  BarChart,
  Settings,
  Star,
  LogOut,
  Gift,
} from 'lucide-react';
import { UserNav } from './user-nav';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';
import i18n from '@/i18n'; // Import the i18n instance
import { getUser, User } from '@/lib/data';
import Image from 'next/image';


// This wrapper prevents hydration errors by rendering the fallback language on the server
// and only rendering the selected language on the client after hydration.
export const ClientOnlyT = ({ tKey, tOptions }: { tKey: string; tOptions?: any }) => {
  const { t, i18n: i18nInstance } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  const getTranslation = (lng: string, key: string, options?: any) => {
    // Use the standard i18n.t() method which correctly handles nested keys and options.
    return i18n.t(key, { lng, ...options });
  };
  
  if (!isClient) {
    // On the server, always render the English text to ensure consistency with server-rendered HTML.
    const fallbackText = getTranslation('en', tKey, tOptions);
    return <span>{fallbackText}</span>;
  }

  if (i18nInstance.language === 'en-zh') {
    const zhText = getTranslation('zh', tKey, tOptions);
    const enText = getTranslation('en', tKey, tOptions);
    // Avoid showing the key if translation is missing for both
    if (zhText !== tKey && enText !== tKey) {
        return (
          <span className="flex flex-wrap items-center gap-x-2">
            <span>{zhText}</span>
            <span className="text-muted-foreground">({enText})</span>
          </span>
        );
    }
     // Fallback to whichever translation is available if one is missing
    return <span>{zhText !== tKey ? zhText : enText}</span>;
  }

  // For 'en' or 'zh', use the standard t function
  return t(tKey, tOptions);
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const handleUserUpdate = () => setUser(getUser());
    window.addEventListener('userProfileUpdated', handleUserUpdate);
    handleUserUpdate(); // Initial load
    return () => window.removeEventListener('userProfileUpdated', handleUserUpdate);
  }, []);


  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
    { href: '/dashboard/tasks', icon: CheckSquare, labelKey: 'sidebar.tasks' },
    { href: '/dashboard/achievements', icon: Trophy, labelKey: 'sidebar.achievements' },
    { href: '/dashboard/reports', icon: BarChart, labelKey: 'sidebar.reports' },
    { href: '/dashboard/rewards', icon: Gift, labelKey: 'sidebar.rewards' },
    { href: '/dashboard/settings', icon: Settings, labelKey: 'sidebar.settings' },
  ];

  return (
    <>
      <SidebarHeader>
         <div className="flex items-center p-2">
            <div className="w-full">
              {user?.appLogo ? (
                <div className="w-full h-auto aspect-[3/1] rounded-lg overflow-hidden">
                    <Image src={user.appLogo} alt="App Logo" width={600} height={200} className="object-cover w-full h-full" />
                </div>
              ) : (
                <div className="flex items-center justify-start gap-2">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary shrink-0">
                    <Star className="h-6 w-6 text-primary-foreground" />
                  </div>
                  <span className="font-bold text-xl font-headline text-foreground truncate">
                    <ClientOnlyT tKey="appName" />
                  </span>
                </div>
              )}
            </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {navItems.map((item) => (
            <SidebarMenuItem key={item.href}>
              <SidebarMenuButton
                asChild
                isActive={pathname === item.href}
                tooltip={t(item.labelKey)}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span><ClientOnlyT tKey={item.labelKey} /></span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter className="flex flex-col gap-4">
        <UserNav />
        <SidebarMenu>
            <SidebarMenuItem>
                <SidebarMenuButton asChild tooltip={t('sidebar.logout')}>
                    <Link href="/">
                        <LogOut />
                        <span><ClientOnlyT tKey="sidebar.logout" /></span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
