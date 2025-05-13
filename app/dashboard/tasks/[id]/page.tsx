'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import { 
  ChevronLeft,
  Clock,
  Calendar,
  Edit2,
  User,
  MessageCircle
} from 'lucide-react';
import { formatDistanceToNow, format } from 'date-fns';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_status: 'pending' | 'in_progress' | 'completed';
  task_due_date: string;
  task_remarks: string;
  created_by: string;
  created_on: string;
  last_updated_by: string;
  last_updated_on: string;
}

export default function TaskDetailsPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskData = await api.tasks.getById(id as string);
        setTask(taskData);
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [id]);
  
  const getStatusColor = (status: string) => {
    const colors = {
      pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:bg-opacity-30 dark:text-yellow-300",
      in_progress: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300",
      completed: "bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300"
    };
    
    return colors[status as keyof typeof colors] || colors.pending;
  };
  
  const formatStatus = (status: string) => {
    return status.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
  };
  
  if (loading) {
    return (
      <div className="flex justify-center py-12">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full"></div>
      </div>
    );
  }
  
  if (error || !task) {
    return (
      <div className="bg-destructive bg-opacity-10 text-destructive px-6 py-4 rounded-lg">
        <h2 className="text-lg font-medium mb-2">Error</h2>
        <p>{error || 'Task not found'}</p>
        <Link 
          href="/dashboard/tasks" 
          className="mt-4 inline-block text-primary hover:underline"
        >
          Return to Tasks
        </Link>
      </div>
    );
  }
  
  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/tasks"
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Tasks
        </Link>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <span 
              className={cn(
                "px-3 py-1 text-sm font-medium rounded-full",
                getStatusColor(task.task_status)
              )}
            >
              {formatStatus(task.task_status)}
            </span>
          </div>
          
          <Link
            href={`/dashboard/tasks/${task.id}/edit`}
            className="flex items-center gap-2 px-3 py-1.5 rounded-md border border-border hover:bg-accent hover:text-accent-foreground"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </Link>
        </div>
        
        <h1 className="text-2xl font-bold mb-2">{task.task_title}</h1>
        
        <div className="flex flex-wrap gap-6 mb-6">
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-4 w-4" />
            <span>Due: {format(new Date(task.task_due_date), 'MMM d, yyyy')}</span>
            <span className="text-xs">
              ({formatDistanceToNow(new Date(task.task_due_date), { addSuffix: true })})
            </span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <User className="h-4 w-4" />
            <span>Created by: {task.created_by}</span>
          </div>
          
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Calendar className="h-4 w-4" />
            <span>Created: {format(new Date(task.created_on), 'MMM d, yyyy')}</span>
          </div>
        </div>
        
        <div className="mb-8">
          <h2 className="text-lg font-medium mb-2">Description</h2>
          <div className="bg-background p-4 rounded-md border border-border whitespace-pre-line">
            {task.task_description}
          </div>
        </div>
        
        {task.task_remarks && (
          <div className="mb-8">
            <h2 className="text-lg font-medium mb-2">Remarks</h2>
            <div className="flex gap-3 bg-background p-4 rounded-md border border-border">
              <MessageCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
              <div>{task.task_remarks}</div>
            </div>
          </div>
        )}
        
        <div className="border-t border-border pt-4 text-sm text-muted-foreground">
          <p>Last updated by {task.last_updated_by} on {format(new Date(task.last_updated_on), 'MMM d, yyyy')}</p>
        </div>
      </div>
    </div>
  );
}
