'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import TasksTable from '@/components/tasks/tasks-table';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useState } from 'react';
import { Task, tasks as initialTasks } from '@/lib/data';
import { Atom, Bike, Book, Brush, Dumbbell, LucideIcon } from 'lucide-react';

const iconMap: { [key: string]: LucideIcon } = {
  Learning: Book,
  Creative: Brush,
  Health: Dumbbell,
  School: Atom,
  Activity: Bike,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);

  const handleAddTask = (newTaskData: { name: string; category: string; difficulty: 'Easy' | 'Medium' | 'Hard' }) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      title: newTaskData.name,
      category: newTaskData.category,
      icon: iconMap[newTaskData.category] || Book,
      difficulty: newTaskData.difficulty,
      completed: false,
      dueDate: new Date(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='tasks.title' /></h1>
          <div className="ml-auto">
            <AddTaskDialog onAddTask={handleAddTask} />
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <TasksTable tasks={tasks} setTasks={setTasks} />
      </main>
    </div>
  );
}
