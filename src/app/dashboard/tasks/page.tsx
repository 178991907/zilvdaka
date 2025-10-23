'use client';
import { SidebarTrigger } from '@/components/ui/sidebar';
import TasksTable from '@/components/tasks/tasks-table';
import { AddTaskDialog } from '@/components/tasks/add-task-dialog';
import { ClientOnlyT } from '@/components/layout/app-sidebar';
import { useState } from 'react';
import { Task, tasks as initialTasks } from '@/lib/data';
import { Atom, Bike, Book, Brush, Dumbbell, LucideIcon, PlusCircle } from 'lucide-react';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';

const iconMap: { [key: string]: LucideIcon } = {
  Learning: Book,
  Creative: Brush,
  Health: Dumbbell,
  School: Atom,
  Activity: Bike,
};

export default function TasksPage() {
  const [tasks, setTasks] = useState<Task[]>(initialTasks);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [deletingTask, setDeletingTask] = useState<Task | null>(null);

  const handleAddTask = (newTaskData: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'>) => {
    const newTask: Task = {
      id: `task-${Date.now()}`,
      ...newTaskData,
      icon: iconMap[newTaskData.category] || Book,
      completed: false,
      dueDate: new Date(),
    };
    setTasks(prevTasks => [newTask, ...prevTasks]);
  };

  const handleUpdateTask = (updatedTask: Task) => {
    setTasks(prevTasks =>
      prevTasks.map(task => (task.id === updatedTask.id ? updatedTask : task))
    );
  };

  const handleDeleteRequest = (task: Task) => {
    setDeletingTask(task);
  };

  const handleDeleteConfirm = () => {
    if (deletingTask) {
      setTasks(prevTasks => prevTasks.filter(task => task.id !== deletingTask.id));
      setDeletingTask(null);
    }
  };

  const handleOpenDialog = (task: Task | null = null) => {
    setEditingTask(task);
    setIsDialogOpen(true);
  };
  
  const handleSaveTask = (taskData: Omit<Task, 'id' | 'icon' | 'completed' | 'dueDate'>, taskId?: string) => {
    if (taskId) {
      // Update existing task
       const taskToUpdate = tasks.find(t => t.id === taskId);
       if (taskToUpdate) {
            const updatedTask = {
                ...taskToUpdate,
                ...taskData,
                icon: iconMap[taskData.category] || Book,
            };
            handleUpdateTask(updatedTask);
       }
    } else {
      // Add new task
      handleAddTask(taskData);
    }
  };
  
  const handleToggleStatus = (taskId: string) => {
    setTasks(prevTasks =>
      prevTasks.map(task =>
        task.id === taskId
          ? { ...task, status: task.status === 'active' ? 'paused' : 'active' }
          : task
      )
    );
  };


  return (
    <div className="flex flex-col">
       <header className="sticky top-0 z-10 flex h-[57px] items-center gap-1 border-b bg-background px-4">
          <SidebarTrigger className="md:hidden" />
          <h1 className="text-xl font-semibold"><ClientOnlyT tKey='tasks.title' /></h1>
          <div className="ml-auto">
             <Button onClick={() => handleOpenDialog()}>
                <PlusCircle className="mr-2 h-4 w-4" />
                <ClientOnlyT tKey='tasks.addTask' />
            </Button>
            <AddTaskDialog 
              isOpen={isDialogOpen}
              setIsOpen={setIsDialogOpen}
              onSave={handleSaveTask}
              task={editingTask}
            />
          </div>
        </header>
      <main className="flex-1 p-4 md:p-8">
        <TasksTable 
            tasks={tasks} 
            setTasks={setTasks} 
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
