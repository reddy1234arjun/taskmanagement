'use client'

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface TaskFormProps {
  taskId?: string;
  initialData?: {
    title: string;
    description: string;
    status: 'pending' | 'in_progress' | 'completed';
    dueDate: string;
    remarks: string;
  };
}

export default function TaskForm({ taskId, initialData }: TaskFormProps) {
  const router = useRouter();
  const isEditing = !!taskId;
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    task_title: initialData?.title || '',
    task_description: initialData?.description || '',
    task_status: initialData?.status || 'pending',
    task_due_date: initialData?.dueDate ? new Date(initialData.dueDate).toISOString().split('T')[0] : '',
    task_remarks: initialData?.remarks || ''
  });
  
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    
    try {
      // Format the date for API
      const apiData = {
        ...formData,
        task_due_date: formData.task_due_date ? new Date(formData.task_due_date).toISOString() : null
      };
      
      if (isEditing) {
        await api.tasks.update(taskId!, apiData);
      } else {
        const result = await api.tasks.create(apiData);
        console.log("Task created:", result);
      }
      
      router.push('/dashboard/tasks');
    } catch (err) {
      setError('An error occurred while saving the task.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl mx-auto">
      {error && (
        <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md mb-4">
          {error}
        </div>
      )}
      
      <div className="space-y-2">
        <label htmlFor="task_title" className="block text-sm font-medium">
          Task Title <span className="text-destructive">*</span>
        </label>
        <input
          id="task_title"
          name="task_title"
          type="text"
          required
          value={formData.task_title}
          onChange={handleChange}
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
            "bg-background text-foreground"
          )}
          placeholder="Enter task title"
        />
      </div>
      
      <div className="space-y-2">
        <label htmlFor="task_description" className="block text-sm font-medium">
          Description <span className="text-destructive">*</span>
        </label>
        <textarea
          id="task_description"
          name="task_description"
          rows={4}
          required
          value={formData.task_description}
          onChange={handleChange}
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
            "bg-background text-foreground resize-none"
          )}
          placeholder="Describe the task in detail"
        />
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="task_status" className="block text-sm font-medium">
            Status <span className="text-destructive">*</span>
          </label>
          <select
            id="task_status"
            name="task_status"
            required
            value={formData.task_status}
            onChange={handleChange}
            className={cn(
              "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
              "bg-background text-foreground"
            )}
          >
            <option value="pending">Pending</option>
            <option value="in_progress">In Progress</option>
            <option value="completed">Completed</option>
          </select>
        </div>
        
        <div className="space-y-2">
          <label htmlFor="task_due_date" className="block text-sm font-medium">
            Due Date <span className="text-destructive">*</span>
          </label>
          <input
            id="task_due_date"
            name="task_due_date"
            type="date"
            required
            value={formData.task_due_date}
            onChange={handleChange}
            className={cn(
              "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
              "bg-background text-foreground"
            )}
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <label htmlFor="task_remarks" className="block text-sm font-medium">
          Remarks
        </label>
        <textarea
          id="task_remarks"
          name="task_remarks"
          rows={3}
          value={formData.task_remarks}
          onChange={handleChange}
          className={cn(
            "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
            "bg-background text-foreground resize-none"
          )}
          placeholder="Any additional information or notes"
        />
      </div>
      
      <div className="flex justify-end gap-4">
        <button
          type="button"
          onClick={() => router.back()}
          className={cn(
            "px-4 py-2 rounded-md border border-border",
            "hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-ring transition-colors"
          )}
        >
          Cancel
        </button>
        
        <button
          type="submit"
          disabled={loading}
          className={cn(
            "px-4 py-2 rounded-md bg-primary text-primary-foreground",
            "hover:bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
            loading && "opacity-70 cursor-not-allowed"
          )}
        >
          {loading ? 'Saving...' : isEditing ? 'Update Task' : 'Create Task'}
        </button>
      </div>
    </form>
  );
}
