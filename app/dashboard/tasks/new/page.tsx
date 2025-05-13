import { ChevronLeft } from 'lucide-react';
import Link from 'next/link';
import TaskForm from '@/components/tasks/TaskForm';

export default function NewTaskPage() {
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
        <h1 className="text-2xl font-bold mb-6">Create New Task</h1>
        <TaskForm />
      </div>
    </div>
  );
}
