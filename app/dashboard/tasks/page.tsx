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

interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_status: 'pending' | 'in_progress' | 'completed';
  task_due_date: string;
  created_by: string;
}

interface FilterOptions {
  status: string;
  dateRange: string;
}

export default function TasksListPage() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [error, setError] = useState('');
  
  const [filters, setFilters] = useState<FilterOptions>({
    status: 'all',
    dateRange: 'all',
  });
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        setLoading(true);
        const tasksData = await api.tasks.getAll();
        setTasks(tasksData);
      } catch (error) {
        console.error('Error fetching tasks:', error);
        setError('Failed to load tasks. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTasks();
  }, []);
  
  const handleFilterChange = (
    e: React.ChangeEvent<HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFilters(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleStatusChange = async (id: string, newStatus: string) => {
    try {
      await api.tasks.update(id, { task_status: newStatus });
      setTasks(prev =>
        prev.map(task =>
          task.id === id ? { ...task, task_status: newStatus as any } : task
        )
      );
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
  
  const handleArchive = async (id: string) => {
    try {
      // Remove from active tasks
      setTasks(prev => prev.filter(task => task.id !== id));
    } catch (error) {
      console.error('Error archiving task:', error);
    }
  };
  
  const handleSearch = async () => {
    try {
      setLoading(true);
      
      const searchParams: any = {};
      
      if (searchQuery) {
        searchParams.query = searchQuery;
      }
      
      if (filters.status !== 'all') {
        searchParams.status = filters.status;
      }
      
      if (filters.dateRange !== 'all') {
        const today = new Date();
        
        if (filters.dateRange === 'today') {
          searchParams.dueDateFrom = today.toISOString().split('T')[0];
          searchParams.dueDateTo = today.toISOString().split('T')[0];
        } else if (filters.dateRange === 'tomorrow') {
          const tomorrow = new Date(today);
          tomorrow.setDate(tomorrow.getDate() + 1);
          searchParams.dueDateFrom = tomorrow.toISOString().split('T')[0];
          searchParams.dueDateTo = tomorrow.toISOString().split('T')[0];
        } else if (filters.dateRange === 'week') {
          const nextWeek = new Date(today);
          nextWeek.setDate(nextWeek.getDate() + 7);
          searchParams.dueDateFrom = today.toISOString().split('T')[0];
          searchParams.dueDateTo = nextWeek.toISOString().split('T')[0];
        }
      }
      
      const results = await api.tasks.search(searchParams);
      setTasks(results);
    } catch (error) {
      console.error('Error searching tasks:', error);
      setError('Failed to search tasks. Please try again.');
    } finally {
      setLoading(false);
    }
  };
  
  // Apply client-side filtering for better UX
  const filteredTasks = tasks.filter(task => {
    // Apply text search
    const matchesSearch = 
      searchQuery === '' || 
      task.task_title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      task.task_description.toLowerCase().includes(searchQuery.toLowerCase());
    
    // Apply status filter
    const matchesStatus = 
      filters.status === 'all' || 
      task.task_status === filters.status;
    
    // Apply date filter
    const taskDate = new Date(task.task_due_date);
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);
    const nextWeek = new Date(today);
    nextWeek.setDate(nextWeek.getDate() + 7);
    
    let matchesDate = true;
    if (filters.dateRange === 'today') {
      matchesDate = 
        taskDate.getDate() === today.getDate() &&
        taskDate.getMonth() === today.getMonth() &&
        taskDate.getFullYear() === today.getFullYear();
    } else if (filters.dateRange === 'tomorrow') {
      matchesDate = 
        taskDate.getDate() === tomorrow.getDate() &&
        taskDate.getMonth() === tomorrow.getMonth() &&
        taskDate.getFullYear() === tomorrow.getFullYear();
    } else if (filters.dateRange === 'week') {
      matchesDate = taskDate <= nextWeek && taskDate >= today;
    }
    
    return matchesSearch && matchesStatus && matchesDate;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Tasks</h1>
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
            placeholder="Search tasks..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            className={cn(
              "w-full pl-9 pr-4 py-2 rounded-md border border-border",
              "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
            )}
          />
          {searchQuery && (
            <button
              onClick={() => {
                setSearchQuery('');
                handleSearch();
              }}
              className="absolute right-3 top-1/2 transform -translate-y-1/2"
            >
              <X className="h-4 w-4 text-muted-foreground hover:text-foreground" />
            </button>
          )}
        </div>
        
        <button
          onClick={() => setIsFilterOpen(!isFilterOpen)}
          className={cn(
            "flex items-center gap-2 px-3 py-2 rounded-md border border-border",
            "hover:bg-accent hover:text-accent-foreground transition-colors",
            isFilterOpen && "bg-accent text-accent-foreground"
          )}
        >
          <Filter className="h-4 w-4" />
          <span>Filter</span>
          <SlidersHorizontal className="h-4 w-4" />
        </button>
      </div>
      
      {isFilterOpen && (
        <div className="bg-card border border-border rounded-md p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="status" className="block text-sm font-medium mb-1">
                Status
              </label>
              <select
                id="status"
                name="status"
                value={filters.status}
                onChange={handleFilterChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-border",
                  "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              >
                <option value="all">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="in_progress">In Progress</option>
                <option value="completed">Completed</option>
              </select>
            </div>
            
            <div>
              <label htmlFor="dateRange" className="block text-sm font-medium mb-1">
                Due Date
              </label>
              <select
                id="dateRange"
                name="dateRange"
                value={filters.dateRange}
                onChange={handleFilterChange}
                className={cn(
                  "w-full px-3 py-2 rounded-md border border-border",
                  "bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-ring"
                )}
              >
                <option value="all">All Dates</option>
                <option value="today">Due Today</option>
                <option value="tomorrow">Due Tomorrow</option>
                <option value="week">Due This Week</option>
              </select>
            </div>
          </div>
          
          <div className="mt-4 flex justify-end">
            <button
              onClick={handleSearch}
              className={cn(
                "px-4 py-2 rounded-md bg-primary text-primary-foreground",
                "hover:bg-primary hover:bg-opacity-90 transition-colors"
              )}
            >
              Apply Filters
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <div className="text-center py-8">
          <CalendarRange className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No tasks found</h3>
          <p className="text-muted-foreground">
            {searchQuery 
              ? "Try a different search term or filter" 
              : "Create a new task to get started"}
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
              onArchive={handleArchive}
              onStatusChange={handleStatusChange}
            />
          ))}
        </div>
      )}
    </div>
  );
}
