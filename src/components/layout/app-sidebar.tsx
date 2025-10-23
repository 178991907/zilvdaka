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
} from 'lucide-react';
import { UserNav } from './user-nav';
import { useTranslation } from 'react-i18next';
import { useEffect, useState } from 'react';

// This wrapper prevents hydration errors by rendering the fallback language on the server
// and only rendering the selected language on the client after hydration.
export const ClientOnlyT = ({ tKey, tOptions }: { tKey: string; tOptions?: any }) => {
  const { t, i18n } = useTranslation();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // On the server, and on initial client render, render the fallback text.
  // After hydration (in the useEffect), we render the translated text.
  if (!isClient) {
    let fallbackText = tKey;
    try {
        const resources = i18n.getResourceBundle('en', 'translation');
        fallbackText = tKey.split('.').reduce((acc, part) => acc && (acc as any)[part], resources);
        if (tOptions && typeof fallbackText === 'string') {
           Object.keys(tOptions).forEach(key => {
                fallbackText = fallbackText.replace(new RegExp(`{{${key}}}`, 'g'), tOptions[key]);
           });
        }
    } catch(e) {
        // ignore if path not found
    }
    return fallbackText || tKey;
  }

  return t(tKey, tOptions);
};

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, labelKey: 'sidebar.dashboard' },
    { href: '/dashboard/tasks', icon: CheckSquare, labelKey: 'sidebar.tasks' },
    { href: '/dashboard/achievements', icon: Trophy, labelKey: 'sidebar.achievements' },
    { href: '/dashboard/reports', icon: BarChart, labelKey: 'sidebar.reports' },
    { href: '/dashboard/settings', icon: Settings, labelKey: 'sidebar.settings' },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Star className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl font-headline text-foreground">
            <ClientOnlyT tKey="appName" />
          </span>
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
