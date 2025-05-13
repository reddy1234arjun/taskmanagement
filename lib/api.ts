'use client'

import { useState, useEffect } from 'react';

// Base URL for API
const API_BASE_URL = 'http://localhost:8000';

// Types
export interface Task {
  id: string;
  task_title: string;
  task_description: string;
  task_status: 'pending' | 'in_progress' | 'completed';
  task_due_date: string;
  task_remarks?: string;
  created_by: string;
  last_updated_by: string;
  created_on: string;
  last_updated_on: string;
}

export interface User {
  id: number;
  name: string;
  email: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

// Helper function to get token
const getToken = (): string | null => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('taskmaster_token');
  }
  return null;
};

// Mock API client for development
export const api = {
  // Auth endpoints
  auth: {
    login: async (credentials: LoginCredentials) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Mock successful login
      return {
        access_token: 'mock_jwt_token_' + Date.now(),
        user: {
          id: 1,
          name: credentials.email.split('@')[0],
          email: credentials.email
        }
      };
    },
    
    register: async (data: RegisterData) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock successful registration
      return {
        id: 1,
        name: data.name,
        email: data.email
      };
    },
  },
  
  // Task endpoints
  tasks: {
    getAll: async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get tasks from localStorage or return empty array
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      return storedTasks ? JSON.parse(storedTasks) : [];
    },
    
    getById: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get tasks from localStorage
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Find task by ID
      const task = tasks.find((t: any) => t.id === id);
      
      if (!task) {
        throw new Error('Task not found');
      }
      
      return task;
    },
    
    create: async (taskData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get user from localStorage
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = storedUser ? JSON.parse(storedUser) : { name: 'Anonymous' };
      
      // Create new task
      const newTask = {
        id: Date.now().toString(),
        ...taskData,
        created_by: user.name,
        last_updated_by: user.name,
        created_on: new Date().toISOString(),
        last_updated_on: new Date().toISOString()
      };
      
      // Get existing tasks from localStorage
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Add new task to array
      tasks.push(newTask);
      
      // Save updated tasks to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      
      return newTask;
    },
    
    update: async (id: string, taskData: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get user from localStorage
      const storedUser = typeof window !== 'undefined' ? localStorage.getItem('user') : null;
      const user = storedUser ? JSON.parse(storedUser) : { name: 'Anonymous' };
      
      // Get tasks from localStorage
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Find task index
      const taskIndex = tasks.findIndex((t: any) => t.id === id);
      
      if (taskIndex === -1) {
        throw new Error('Task not found');
      }
      
      // Update task
      const updatedTask = {
        ...tasks[taskIndex],
        ...taskData,
        last_updated_by: user.name,
        last_updated_on: new Date().toISOString()
      };
      
      tasks[taskIndex] = updatedTask;
      
      // Save updated tasks to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(tasks));
      }
      
      return updatedTask;
    },
    
    delete: async (id: string) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Get tasks from localStorage
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Filter out the task to delete
      const updatedTasks = tasks.filter((t: any) => t.id !== id);
      
      // Save updated tasks to localStorage
      if (typeof window !== 'undefined') {
        localStorage.setItem('tasks', JSON.stringify(updatedTasks));
      }
      
      return true;
    },
    
    search: async (params: any) => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 800));
      
      // Get tasks from localStorage
      const storedTasks = typeof window !== 'undefined' ? localStorage.getItem('tasks') : null;
      const tasks = storedTasks ? JSON.parse(storedTasks) : [];
      
      // Filter tasks based on search parameters
      return tasks.filter((task: any) => {
        let matches = true;
        
        // Filter by query (title or description)
        if (params.query) {
          const query = params.query.toLowerCase();
          const titleMatch = task.task_title.toLowerCase().includes(query);
          const descMatch = task.task_description.toLowerCase().includes(query);
          matches = matches && (titleMatch || descMatch);
        }
        
        // Filter by status
        if (params.status && params.status !== 'all') {
          matches = matches && task.task_status === params.status;
        }
        
        // Filter by due date range
        if (params.dueDateFrom) {
          const fromDate = new Date(params.dueDateFrom);
          const taskDate = new Date(task.task_due_date);
          matches = matches && taskDate >= fromDate;
        }
        
        if (params.dueDateTo) {
          const toDate = new Date(params.dueDateTo);
          const taskDate = new Date(task.task_due_date);
          matches = matches && taskDate <= toDate;
        }
        
        return matches;
      });
    },
  },
};

// Custom hook for authentication
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const checkAuth = async () => {
      try {
        if (typeof window === 'undefined') {
          setLoading(false);
          return;
        }
        
        const token = localStorage.getItem('taskmaster_token');
        const storedUser = localStorage.getItem('user');
        
        if (!token) {
          setUser(null);
          setLoading(false);
          return;
        }
        
        if (storedUser) {
          setUser(JSON.parse(storedUser));
        }
      } catch (err) {
        console.error('Auth error:', err);
        setError('Authentication failed');
        if (typeof window !== 'undefined') {
          localStorage.removeItem('taskmaster_token');
          localStorage.removeItem('user');
        }
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    
    checkAuth();
  }, []);
  
  const login = async (credentials: LoginCredentials) => {
    try {
      setLoading(true);
      const response = await api.auth.login(credentials);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('taskmaster_token', response.access_token);
        
        // Store user data
        const userData = { 
          id: 1,
          name: response.user.name || credentials.email.split('@')[0], 
          email: credentials.email 
        };
        localStorage.setItem('user', JSON.stringify(userData));
        
        setUser(userData);
      }
      
      setError(null);
      return true;
    } catch (err) {
      console.error('Login error:', err);
      setError('Login failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const register = async (data: RegisterData) => {
    try {
      setLoading(true);
      await api.auth.register(data);
      
      // After registration, log the user in
      return await login({ email: data.email, password: data.password });
    } catch (err) {
      console.error('Registration error:', err);
      setError('Registration failed');
      return false;
    } finally {
      setLoading(false);
    }
  };
  
  const logout = () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('taskmaster_token');
      localStorage.removeItem('user');
    }
    setUser(null);
  };
  
  return { user, loading, error, login, register, logout };
}
