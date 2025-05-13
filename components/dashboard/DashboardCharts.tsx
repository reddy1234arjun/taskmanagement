'use client'

import { useState } from 'react';

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function ChartCard({ title, children, className }: ChartCardProps) {
  return (
    <div className={`bg-card border border-border rounded-lg p-6 ${className}`}>
      <h3 className="text-lg font-medium mb-4">{title}</h3>
      {children}
    </div>
  );
}

// Placeholder for TaskStatusChart
export function TaskStatusChart() {
  // This is a placeholder for an actual chart component
  // In a real app, you'd use a library like recharts, victory, or nivo
  return (
    <ChartCard title="Task Status">
      <div className="space-y-4">
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Pending</span>
            <span className="font-medium">12 tasks (30%)</span>
          </div>
          <div className="h-2 bg-background rounded overflow-hidden">
            <div className="h-full bg-amber-500" style={{ width: '30%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>In Progress</span>
            <span className="font-medium">18 tasks (45%)</span>
          </div>
          <div className="h-2 bg-background rounded overflow-hidden">
            <div className="h-full bg-blue-500" style={{ width: '45%' }}></div>
          </div>
        </div>
        
        <div>
          <div className="flex justify-between text-sm mb-1">
            <span>Completed</span>
            <span className="font-medium">10 tasks (25%)</span>
          </div>
          <div className="h-2 bg-background rounded overflow-hidden">
            <div className="h-full bg-green-500" style={{ width: '25%' }}></div>
          </div>
        </div>
      </div>
    </ChartCard>
  );
}

// Placeholder for TaskCompletionChart
export function TaskCompletionChart() {
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep'];
  
  // Placeholder data
  const completedTasks = [12, 19, 15, 22, 28, 25, 30, 35, 32];
  const createdTasks = [15, 25, 18, 30, 36, 28, 40, 42, 35];
  
  // Simple calculation for max value to set chart height
  const maxValue = Math.max(...createdTasks) + 5;
  
  return (
    <ChartCard title="Task Completion Trend">
      <div className="h-64 flex items-end justify-between gap-1">
        {months.map((month, index) => {
          const completedHeight = (completedTasks[index] / maxValue) * 100;
          const createdHeight = (createdTasks[index] / maxValue) * 100;
          
          return (
            <div key={month} className="flex flex-col items-center flex-1">
              <div className="w-full flex items-end h-56 gap-1 justify-center">
                <div 
                  className="w-3 bg-blue-500 rounded-t"
                  style={{ height: `${createdHeight}%` }}
                  title={`Created: ${createdTasks[index]}`}
                ></div>
                <div 
                  className="w-3 bg-green-500 rounded-t"
                  style={{ height: `${completedHeight}%` }}
                  title={`Completed: ${completedTasks[index]}`}
                ></div>
              </div>
              <div className="text-xs mt-2 text-muted-foreground">{month}</div>
            </div>
          );
        })}
      </div>
      
      <div className="flex items-center justify-center gap-6 mt-4">
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-blue-500 rounded"></div>
          <span className="text-xs">Created Tasks</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-3 w-3 bg-green-500 rounded"></div>
          <span className="text-xs">Completed Tasks</span>
        </div>
      </div>
    </ChartCard>
  );
}
