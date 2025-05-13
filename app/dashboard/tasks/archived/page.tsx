'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  PlusCircle,
  Search,
  X,
  CalendarRange,
  RefreshCw
} from 'lucide-react';
import { cn } from '@/lib/utils';
import TaskCard from '@/components/tasks/TaskCard';
import { api } from '@/lib/api';

export default function ArchivedTasksPage() {
  const [tasks, setTasks] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        // In a real app, we would have a separate API endpoint for archived tasks
        // For now, we'll simulate archived tasks using localStorage
        const archivedTasksJson = typeof window !== 'undefined' ? localStorage.getItem('archivedTasks') : null;
        const archivedTasks = archivedTasksJson ? JSON.parse(archivedTasksJson) : [];
        setTasks(archivedTasks);
      } catch (error) {
        console.error('Error fetching archived tasks:', error);
        setError('Failed to load archived tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleRestore = async (id: string) => {
    try {
      // Get the archived task
      const taskToRestore = tasks.find(task => task.id === id);
      if (!taskToRestore) return;
      
      // Remove from archived tasks
      const updatedArchivedTasks = tasks.filter(task => task.id !== id);
      if (typeof window !== 'undefined') {
        localStorage.setItem('archivedTasks', JSON.stringify(updatedArchivedTasks));
      }
      
      // Add back to regular tasks
      const allTasksJson = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : [];
      allTasks.push(taskToRestore);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(allTasks));
      }
      
      // Update UI
      setTasks(updatedArchivedTasks);
    } catch (error) {
      console.error('Error restoring task:', error);
    }
  };
  
  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to permanently delete this archived task?')) {
      try {
        const updatedArchivedTasks = tasks.filter(task => task.id !== id);
        if (typeof window !== 'undefined') {
          localStorage.setItem('archivedTasks', JSON.stringify(updatedArchivedTasks));
        }
        setTasks(updatedArchivedTasks);
      } catch (error) {
        console.error('Error deleting archived task:', error);
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
        <h1 className="text-2xl font-bold">Archived Tasks</h1>
        <Link 
          href="/dashboard/tasks" 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
            "hover:bg-primary hover:bg-opacity-90 transition-colors"
          )}
        >
          <RefreshCw className="h-4 w-4" />
          Active Tasks
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
            placeholder="Search archived tasks..."
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
          <h3 className="text-lg font-medium mb-1">No archived tasks found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try a different search term" 
              : "Archive tasks you want to keep for reference but are no longer active"}
          </p>
          <Link 
            href="/dashboard/tasks" 
            className={cn(
              "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground",
              "hover:bg-primary hover:bg-opacity-90 transition-colors"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            View All Tasks
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredTasks.map(task => (
            <div key={task.id} className="bg-card border border-border rounded-lg shadow-sm overflow-hidden opacity-80">
              <div className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="px-2 py-1 text-xs font-medium rounded-full bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300">
                    Archived
                  </span>
                </div>
                
                <h3 className="font-medium text-lg mb-2 text-muted-foreground">{task.task_title}</h3>
                <p className="text-muted-foreground text-sm line-clamp-2 mb-4">{task.task_description}</p>
                
                <div className="mt-4 flex items-center justify-between">
                  <button
                    onClick={() => handleRestore(task.id)}
                    className="px-3 py-1 text-sm rounded-md border border-primary text-primary hover:bg-primary hover:bg-opacity-10"
                  >
                    Restore
                  </button>
                  
                  <button
                    onClick={() => handleDelete(task.id)}
                    className="px-3 py-1 text-sm rounded-md border border-destructive text-destructive hover:bg-destructive hover:bg-opacity-10"
                  >
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
