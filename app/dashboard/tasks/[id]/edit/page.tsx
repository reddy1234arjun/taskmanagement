'use client'

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';
import TaskForm from '@/components/tasks/TaskForm';
import { api } from '@/lib/api';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  dueDate: string;
  remarks: string;
}

export default function EditTaskPage() {
  const { id } = useParams<{ id: string }>();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  useEffect(() => {
    const fetchTaskDetails = async () => {
      try {
        const taskData = await api.tasks.getById(id as string);
        
        // Transform API data to match our form structure
        setTask({
          id: taskData.id,
          title: taskData.task_title,
          description: taskData.task_description,
          status: taskData.task_status,
          dueDate: taskData.task_due_date,
          remarks: taskData.task_remarks || ''
        });
      } catch (err) {
        console.error('Error fetching task details:', err);
        setError('Failed to load task details');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTaskDetails();
  }, [id]);
  
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
          href={`/dashboard/tasks/${id}`}
          className="flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back to Task Details
        </Link>
      </div>
      
      <div className="bg-card border border-border rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-6">Edit Task</h1>
        <TaskForm 
          taskId={id as string}
          initialData={task}
        />
      </div>
    </div>
  );
}
