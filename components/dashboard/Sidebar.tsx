'use client'

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  CheckSquare, 
  Clock, 
  Archive, 
  Users, 
  Settings, 
  PlusCircle,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface SidebarLink {
  href: string;
  label: string;
  icon: React.ReactNode;
  active?: boolean;
}

interface SidebarGroupProps {
  title: string;
  children: React.ReactNode;
  defaultOpen?: boolean;
}

function SidebarGroup({ title, children, defaultOpen = true }: SidebarGroupProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="mb-2">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center justify-between w-full px-3 py-2 text-sm font-medium text-sidebar-foreground"
      >
        <span>{title}</span>
        {isOpen ? (
          <ChevronDown className="h-4 w-4 text-sidebar-foreground opacity-70" />
        ) : (
          <ChevronRight className="h-4 w-4 text-sidebar-foreground opacity-70" />
        )}
      </button>
      {isOpen && <div className="mt-1 space-y-1">{children}</div>}
    </div>
  );
}

function SidebarLink({ href, label, icon, active }: SidebarLink) {
  return (
    <Link
      href={href}
      className={cn(
        "flex items-center gap-3 px-3 py-2 text-sm rounded-md hover:bg-sidebar-accent hover:text-sidebar-accent-foreground transition-colors",
        active ? "bg-sidebar-accent text-sidebar-accent-foreground" : "text-sidebar-foreground"
      )}
    >
      {icon}
      <span>{label}</span>
    </Link>
  );
}

export default function Sidebar() {
  const pathname = usePathname();
  
  return (
    <aside className="fixed inset-y-0 left-0 z-20 flex h-full w-64 flex-col border-r border-sidebar-border bg-sidebar-background">
      <div className="flex h-14 items-center border-b border-sidebar-border px-4">
        <Link href="/dashboard" className="flex items-center gap-2">
          <CheckSquare className="h-5 w-5 text-sidebar-primary" />
          <span className="font-semibold text-lg">Task Management</span>
        </Link>
      </div>
      
      <div className="flex-1 overflow-auto py-2 px-2">
        <div className="mb-4 px-3">
          <Link
            href="/dashboard/tasks/new"
            className="flex w-full items-center gap-2 rounded-md bg-sidebar-primary px-3 py-2 text-sm text-sidebar-primary-foreground hover:bg-sidebar-primary hover:bg-opacity-90 transition-colors"
          >
            <PlusCircle className="h-4 w-4" />
            <span>New Task</span>
          </Link>
        </div>
      
        <nav className="space-y-1">
          <SidebarLink
            href="/dashboard"
            label="Dashboard"
            icon={<LayoutDashboard className="h-4 w-4" />}
            active={pathname === '/dashboard'}
          />
          
          <SidebarGroup title="Tasks">
            <SidebarLink
              href="/dashboard/tasks"
              label="All Tasks"
              icon={<CheckSquare className="h-4 w-4" />}
              active={pathname === '/dashboard/tasks'}
            />
            <SidebarLink
              href="/dashboard/tasks/pending"
              label="Pending"
              icon={<AlertCircle className="h-4 w-4" />}
              active={pathname === '/dashboard/tasks/pending'}
            />
            <SidebarLink
              href="/dashboard/tasks/in-progress"
              label="In Progress"
              icon={<Clock className="h-4 w-4" />}
              active={pathname === '/dashboard/tasks/in-progress'}
            />
            <SidebarLink
              href="/dashboard/tasks/completed"
              label="Completed"
              icon={<CheckCircle className="h-4 w-4" />}
              active={pathname === '/dashboard/tasks/completed'}
            />
            <SidebarLink
              href="/dashboard/tasks/archived"
              label="Archived"
              icon={<Archive className="h-4 w-4" />}
              active={pathname === '/dashboard/tasks/archived'}
            />
          </SidebarGroup>
          
          <SidebarLink
            href="/dashboard/team"
            label="Team Members"
            icon={<Users className="h-4 w-4" />}
            active={pathname === '/dashboard/team'}
          />
          
          <SidebarLink
            href="/dashboard/settings"
            label="Settings"
            icon={<Settings className="h-4 w-4" />}
            active={pathname === '/dashboard/settings'}
          />
        </nav>
      </div>
    </aside>
  );
}
