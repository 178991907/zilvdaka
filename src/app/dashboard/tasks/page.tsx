'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import TasksTable from '@/components/tasks/tasks-table';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useState, useEffect } from 'react';
import { Task, getTasks, updateTasks, iconMap } from '@/lib/data';
import { PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import Image from 'next/image';


export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    const loadedTasks = getTasks();
    setTasks(loadedTasks);
    setIsClient(true);

    const handleTasksUpdate = () => {
      setTasks(getTasks());
    };
    window.addEventListener('tasksUpdated', handleTasksUpdate);
    return () => {
      window.removeEventListener('tasksUpdated', handleTasksUpdate);
    };
  }, []);


  const handleOpenDialog = (task: Task | null = null) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'>, taskId?: string) => {
    let updatedTasks;
    if (taskId) {
      // Update existing task
       updatedTasks = tasks.map(t => 
        t.id === taskId 
        ? { ...t, ...taskData, icon: iconMap[taskData.category] || iconMap.Learning } 
        : t
      );
    } else {
      // Add new task
      const newTask: Task = {
        id: `custom-${Date.now()}`,
        ...taskData,
        icon: iconMap[taskData.category] || iconMap.Learning,
        completed: false,
        dueDate: new Date(),
      };
      updatedTasks = [newTask, ...tasks];
    }
    updateTasks(updatedTasks);
  };

  const handleDeleteRequest = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      const updatedTasks = tasks.filter(task => task.id !== deletingTask.id);
      updateTasks(updatedTasks);
      setDeletingTask(null);
    }
  };
  
  const handleToggleStatus = (taskId: string) => {
    const updatedTasks = tasks.map(task =>
      task.id === taskId
        ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
        : task
    );
    updateTasks(updatedTasks);
  };

  const handleSetTasks = (newTasks: Task[]) => {
    updateTasks(newTasks);
  }

  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center justify-between gap-1 bg-background px-4">
          <div className="flex items-center gap-1 w-1/3">
            <SidebarTrigger className="md:hidden" />
            <h1 className="text-xl font-semibold truncate"><ClientOnlyT tKey='tasks.title' /></h1>
          </div>
          <div className="flex justify-center w-1/3">
             <Image src="https://pic1.imgdb.cn/item/6817c79a58cb8da5c8dc723f.png" alt="Logo" width={120} height={40} priority className="h-10 w-auto" />
          </div>
          <div className="flex items-center justify-end gap-4 w-1/3">
             <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <ClientOnlyT tKey='tasks.addTask' />
            </Button>
            {isClient && (
              <AddTaskDialog 
                isOpen={isDialogOpen}
                setIsOpen={setIsDialogOpen}
                onSave={handleSaveTask}
                task={editingTask}
              />
            )}
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <TasksTable 
            tasks={tasks} 
            setTasks={handleSetTasks} 
            onEdit={handleOpenDialog}
            onDelete={handleDeleteRequest}
            onToggleStatus={handleToggleStatus}
        />
      </main>

      <AlertDialog open={!!deletingTask} onOpenChange={(open) => !open && setDeletingTask(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle><ClientOnlyT tKey="tasks.delete.title" /></AlertDialogTitle>
            <AlertDialogDescription>
              <ClientOnlyT tKey="tasks.delete.description" />
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel><ClientOnlyT tKey="tasks.delete.cancel" /></AlertDialogCancel>
            <AlertDialogAction onClick={handleDeleteConfirm} className="bg-destructive text-destructive-foreground hover:bg-destructive/90">
              <ClientOnlyT tKey="tasks.delete.confirm" />
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
