'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Users,
  CalendarDays,
  ArrowRight
} from 'lucide-react';
import { cn } from '@/lib/utils';
import StatsCard from '@/components/dashboard/StatsCard';
import { TaskStatusChart, TaskCompletionChart } from '@/components/dashboard/DashboardCharts';
import TaskCard from '@/components/tasks/TaskCard';
import { api } from '@/lib/api';
import { format } from 'date-fns';

interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_status: 'pending' | 'in_progress' | 'completed';
  task_due_date: string;
  created_by: string;
}

interface TaskStats {
  total: number;
  inProgress: number;
  completed: number;
  overdue: number;
}

export default function DashboardPage() {
  const [loading, setLoading] = useState(true);
  const [recentTasks, setRecentTasks] = useState<Task[]>([]);
  const [stats, setStats] = useState<TaskStats>({
    total: 0,
    inProgress: 0,
    completed: 0,
    overdue: 0
  });
  const [upcomingDeadlines, setUpcomingDeadlines] = useState<{task: string, date: string}[]>([]);
  const [error, setError] = useState('');
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  
  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          setUser(JSON.parse(storedUser));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
        }
      }
    }
    
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch all tasks
        const tasksData = await api.tasks.getAll();
        
        // Calculate stats
        const now = new Date();
        const overdueTasks = tasksData.filter(
          task => new Date(task.task_due_date) < now && task.task_status !== 'completed'
        );
        
        setStats({
          total: tasksData.length,
          inProgress: tasksData.filter(task => task.task_status === 'in_progress').length,
          completed: tasksData.filter(task => task.task_status === 'completed').length,
          overdue: overdueTasks.length
        });
        
        // Get recent tasks (latest 3)
        const sortedTasks = [...tasksData].sort(
          (a, b) => {
            const dateA = a.created_on ? new Date(a.created_on).getTime() : 0;
            const dateB = b.created_on ? new Date(b.created_on).getTime() : 0;
            return dateB - dateA;
          }
        );
        setRecentTasks(sortedTasks.slice(0, 3));
        
        // Get upcoming deadlines
        const upcomingTasks = tasksData
          .filter(task => new Date(task.task_due_date) >= now && task.task_status !== 'completed')
          .sort((a, b) => new Date(a.task_due_date).getTime() - new Date(b.task_due_date).getTime())
          .slice(0, 4);
          
        setUpcomingDeadlines(
          upcomingTasks.map(task => ({
            task: task.task_title,
            date: format(new Date(task.task_due_date), 'MMM d, yyyy')
          }))
        );
        
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
        setError('Failed to load dashboard data. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.tasks.update(id, { task_status: newStatus });
      setRecentTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, task_status: newStatus as any } : task
        )
      );
    } catch (error) {
      console.error('Error updating task status:', error);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          {user && <p className="text-muted-foreground">Welcome back, {user.name}</p>}
        </div>
        <Link 
          href="/dashboard/tasks/new" 
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
            "hover:bg-primary hover:bg-opacity-90 transition-colors"
          )}
        >
          New Task
        </Link>
      </div>
      
      {error && (
        <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {/* Stats Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Tasks"
          value={stats.total.toString()}
          icon={CheckCircle}
          trend={{ value: 12, positive: true }}
        />
        
        <StatsCard
          title="In Progress"
          value={stats.inProgress.toString()}
          icon={Clock}
          trend={{ value: 8, positive: true }}
        />
        
        <StatsCard
          title="Completed"
          value={stats.completed.toString()}
          icon={CheckCircle}
          trend={{ value: 15, positive: true }}
        />
        
        <StatsCard
          title="Overdue"
          value={stats.overdue.toString()}
          icon={AlertCircle}
          trend={{ value: 5, positive: false }}
        />
      </div>
      
      {/* Charts Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <TaskStatusChart />
        <TaskCompletionChart />
      </div>
      
      {/* Recent Tasks Section */}
      <div className="bg-card border border-border rounded-lg p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-medium">Recent Tasks</h2>
          <Link 
            href="/dashboard/tasks"
            className="text-sm text-primary hover:underline flex items-center gap-1"
          >
            View All <ArrowRight className="h-3.5 w-3.5" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center py-8">
            <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
          </div>
        ) : recentTasks.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-muted-foreground">No tasks found. Create your first task to get started.</p>
            <Link 
              href="/dashboard/tasks/new" 
              className={cn(
                "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground",
                "hover:bg-primary hover:bg-opacity-90 transition-colors"
              )}
            >
              <ArrowRight className="h-4 w-4" />
              Create Task
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {recentTasks.map(task => (
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
                onStatusChange={handleStatusChange}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Activity & Team Section */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Team Members */}
        <div className="bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Team Members</h2>
            <Users className="h-5 w-5 text-muted-foreground" />
          </div>
          
          <div className="space-y-4">
            {user ? (
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary">
                  {user.name.charAt(0)}
                </div>
                <div>
                  <p className="text-sm font-medium">{user.name}</p>
                  <p className="text-xs text-muted-foreground">You (Admin)</p>
                </div>
              </div>
            ) : (
              <p className="text-muted-foreground text-center py-4">No team members yet</p>
            )}
          </div>
        </div>
        
        {/* Calendar */}
        <div className="col-span-2 bg-card border border-border rounded-lg p-6">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-medium">Upcoming Deadlines</h2>
            <CalendarDays className="h-5 w-5 text-muted-foreground" />
          </div>
          
          {upcomingDeadlines.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-muted-foreground">No upcoming deadlines.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingDeadlines.map((item, index) => (
                <div 
                  key={index} 
                  className="flex items-center justify-between p-3 border border-border rounded-md"
                >
                  <span>{item.task}</span>
                  <span className="text-sm text-muted-foreground">{item.date}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
