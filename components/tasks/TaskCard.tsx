'use client'

import { useState } from 'react';
import Link from 'next/link';
import { 
  Clock,
  CheckCircle, 
  AlertCircle, 
  MoreVertical,
  Trash2,
  Edit,
  Archive
} from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { cn } from '@/lib/utils';

interface TaskCardProps {
  task: {
    id: string;
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    dueDate: string;
    createdBy: string;
  };
  onDelete?: (id: string) => void;
  onArchive?: (id: string) => void;
  onStatusChange?: (id: string, status: string) => void;
}

export default function TaskCard({ task, onDelete, onArchive, onStatusChange }: TaskCardProps) {
  const [menuOpen, setMenuOpen] = useState(false);
  
  const statusColors = {
    pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300",
    in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300",
    completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300"
  };
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'completed';
  
  const handleStatusChange = (newStatus: 'pending' | 'in_progress' | 'completed') => {
    if (onStatusChange) {
      onStatusChange(task.id, newStatus);
    }
    setMenuOpen(false);
  };
  
  const handleArchive = () => {
    if (onArchive) {
      // Get existing archived tasks
      const archivedTasksJson = typeof window !== 'undefined' ? localStorage.getItem('archivedTasks') : null;
      const archivedTasks = archivedTasksJson ? JSON.parse(archivedTasksJson) : [];
      
      // Get all tasks to find the one to archive
      const allTasksJson = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const allTasks = allTasksJson ? JSON.parse(allTasksJson) : [];
      const taskToArchive = allTasks.find((t: any) => t.id === task.id);
      
      if (taskToArchive) {
        // Add to archived tasks
        archivedTasks.push(taskToArchive);
        if (typeof window !== 'undefined') {
          localStorage.setItem('archivedTasks', JSON.stringify(archivedTasks));
        }
        
        // Call the onArchive callback (which should remove it from the active tasks)
        onArchive(task.id);
      }
      
      setMenuOpen(false);
    }
  };
  
  return (
    <div className="bg-card border border-border rounded-lg shadow-sm overflow-hidden">
      <div className="p-4">
        <div className="flex items-center justify-between mb-2">
          <span 
            className={cn(
              "px-2 py-1 text-xs font-medium rounded-full",
              statusColors[task.status]
            )}
          >
            {formatStatus(task.status)}
          </span>
          <div className="relative">
            <button 
              onClick={() => setMenuOpen(!menuOpen)}
              className="p-1 rounded-full hover:bg-accent"
            >
              <MoreVertical className="h-4 w-4 text-muted-foreground" />
            </button>
            
            {menuOpen && (
              <div className="absolute right-0 mt-1 w-48 bg-card border border-border rounded-md shadow-lg z-10">
                <div className="py-1">
                  <Link 
                    href={`/dashboard/tasks/${task.id}/edit`}
                    className="flex items-center gap-2 px-4 py-2 text-sm hover:bg-accent"
                    onClick={() => setMenuOpen(false)}
                  >
                    <Edit className="h-4 w-4" />
                    <span>Edit Task</span>
                  </Link>
                  
                  <div className="border-t border-border my-1"></div>
                  
                  <button 
                    onClick={() => handleStatusChange('pending')}
                    disabled={task.status === 'pending'}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent",
                      task.status === 'pending' && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <AlertCircle className="h-4 w-4" />
                    <span>Mark as Pending</span>
                  </button>
                  
                  <button 
                    onClick={() => handleStatusChange('in_progress')}
                    disabled={task.status === 'in_progress'}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent",
                      task.status === 'in_progress' && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <Clock className="h-4 w-4" />
                    <span>Mark as In Progress</span>
                  </button>
                  
                  <button 
                    onClick={() => handleStatusChange('completed')}
                    disabled={task.status === 'completed'}
                    className={cn(
                      "w-full flex items-center gap-2 px-4 py-2 text-sm text-left hover:bg-accent",
                      task.status === 'completed' && "opacity-50 cursor-not-allowed"
                    )}
                  >
                    <CheckCircle className="h-4 w-4" />
                    <span>Mark as Completed</span>
                  </button>
                  
                  <div className="border-t border-border my-1"></div>
                  
                  <button 
                    onClick={handleArchive}
                    className="w-full flex items-center gap-2 px-4 py-2 text-sm text-amber-600 dark:text-amber-400 hover:bg-accent"
                  >
                    <Archive className="h-4 w-4" />
                    <span>Archive</span>
                  </button>
                  
                  {onDelete && (
                    <button 
                      onClick={() => {
                        onDelete(task.id);
                        setMenuOpen(false);
                      }}
                      className="w-full flex items-center gap-2 px-4 py-2 text-sm text-destructive hover:bg-accent"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span>Delete</span>
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
        
        <Link href={`/dashboard/tasks/${task.id}`}>
          <h3 className="font-medium text-lg mb-2 hover:text-primary transition-colors">
            {task.title}
          </h3>
        </Link>
        
        <p className="text-muted-foreground text-sm line-clamp-2 mb-4">
          {task.description}
        </p>
        
        <div className="mt-4 flex items-center justify-between text-sm">
          <div className="flex items-center gap-1 text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span className={isOverdue ? 'text-destructive' : ''}>
              {isOverdue ? 'Overdue: ' : 'Due: '}
              {formatDistanceToNow(new Date(task.dueDate), { addSuffix: true })}
            </span>
          </div>
          
          <div className="flex items-center">
            <div className="h-6 w-6 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary text-xs">
              {task.createdBy.charAt(0)}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
