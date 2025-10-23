import React from 'react';
import { SidebarProvider, Sidebar, SidebarInset } from '@/components/ui/sidebar';
import AppSidebar from '@/components/layout/app-sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <SidebarProvider>
      <Sidebar>
        <AppSidebar />
      </Sidebar>
      <SidebarInset>
        <div className="min-h-screen flex flex-col">
          <div className="flex-1 flex flex-col">
            {children}
          </div>
          <footer className="py-4 text-center text-xs text-muted-foreground">
            <p>© 2025 英语全科启蒙. All Rights Reserved.『Terry开发与维护』</p>
          </footer>
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}
