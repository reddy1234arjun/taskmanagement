'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle,
  Search,
  Filter,
  SlidersHorizontal,
  X,
  CalendarRange
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskCard from '@/components/tasks/TaskCard';
import { api } from '@/lib/api';

export default function PendingTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await api.tasks.getAll();
        // Filter only pending tasks
        const pendingTasks = tasksData.filter((task: any) => task.task_status === 'pending');
        setTasks(pendingTasks);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load pending tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.tasks.update(id, { task_status: newStatus });
      // Remove task from list if status is changed from pending
      if (newStatus !== 'pending') {
        setTasks(prev => prev.filter(task => task.id !== id));
      } else {
        setTasks(prev =>
          prev.map(task =>
            task.id === id ? { ...task, task_status: newStatus } : task
          )
        );
      }
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this task?')) {
      try {
        await api.tasks.delete(id);
        setTasks(prev => prev.filter(task => task.id !== id));
      } catch (error) {
        console.error('Error deleting task:', error);
      }
    }
  };
  
  // Apply client-side filtering for search
  const filteredTasks = tasks.filter(task => {
    if (!searchQuery) return true;
    
    return (
      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.task_description.toLowerCase().includes(searchQuery.toLowerCase())
    );
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Pending Tasks</h1>
        <Link 
          href="/dashboard/tasks/new" 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
            "hover:bg-primary hover:bg-opacity-90 transition-colors"
          )}
        >
          <PlusCircle className="h-4 w-4" />
          New Task
        </Link>
      </div>
      
      {error && (
        <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      <div className="flex flex-col md:flex-row items-start md:items-center gap-4">
        <div className="relative w-full md:max-w-md">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search pending tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-md border border-border",
              "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
      </div>
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <CalendarRange className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No pending tasks found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try a different search term" 
              : "All caught up! Create a new task to get started"}
          </p>
          <Link 
            href="/dashboard/tasks/new" 
            className={cn(
              "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground",
              "hover:bg-primary hover:bg-opacity-90 transition-colors"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            New Task
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <TaskCard 
              key={task.id} 
              task={{
                id: task.id,
                title: task.task_title,
                description: task.task_description,
                status: task.task_status,
                dueDate: task.task_due_date,
                createdBy: task.created_by
              }}
              onDelete={handleDelete}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
