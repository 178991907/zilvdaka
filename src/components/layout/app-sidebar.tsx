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

export default function AppSidebar() {
  const pathname = usePathname();
  const { t } = useTranslation();

  const navItems = [
    { href: '/dashboard', icon: LayoutDashboard, label: t('sidebar.dashboard') },
    { href: '/dashboard/tasks', icon: CheckSquare, label: t('sidebar.tasks') },
    { href: '/dashboard/achievements', icon: Trophy, label: t('sidebar.achievements') },
    { href: '/dashboard/reports', icon: BarChart, label: t('sidebar.reports') },
    { href: '/dashboard/settings', icon: Settings, label: t('sidebar.settings') },
  ];

  return (
    <>
      <SidebarHeader>
        <div className="flex items-center gap-2 p-2">
           <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary">
            <Star className="h-6 w-6 text-primary-foreground" />
          </div>
          <span className="font-bold text-xl font-headline text-foreground">
            {t('appName')}
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
                tooltip={item.label}
              >
                <Link href={item.href}>
                  <item.icon />
                  <span>{item.label}</span>
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
                        <span>{t('sidebar.logout')}</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </>
  );
}
