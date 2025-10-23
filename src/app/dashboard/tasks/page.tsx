'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import TasksTable from '@/components/tasks/tasks-table';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { useTranslation } from 'react-i18next';
import { ClientOnlyT } from '@/components/layout/app-sidebar';

export default function TasksPage() {
  const { t } = useTranslation();
  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='tasks.title' /></h1>
          <div className="ml-auto">
            <AddTaskDialog />
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <TasksTable />
      </main>
    </div>
  );
}
