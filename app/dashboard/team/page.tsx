'use client'

import { useState, useEffect } from 'react';
import { 
  User, 
  Mail, 
  Calendar, 
  Clock, 
  CheckCircle,
  PlusCircle,
  X
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { api } from '@/lib/api';

interface TeamMember {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar: string;
  joinedDate: string;
  tasksCompleted: number;
  tasksInProgress: number;
}

export default function TeamPage() {
  const [teamMembers, setTeamMembers] = useState<TeamMember[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState({
    name: '',
    email: '',
    role: 'Member'
  });
  
  useEffect(() => {
    const fetchTeamMembers = async () => {
      try {
        setLoading(true);
        
        // In a real app, we would fetch team members from an API
        // For now, we'll use localStorage to simulate team members
        if (typeof window !== 'undefined') {
          const storedMembers = localStorage.getItem('teamMembers');
          
          if (storedMembers) {
            setTeamMembers(JSON.parse(storedMembers));
          } else {
            // Add the current user as a team member
            const currentUser = localStorage.getItem('user');
            if (currentUser) {
              const user = JSON.parse(currentUser);
              const initialTeam = [{
                id: '1',
                name: user.name,
                email: user.email,
                role: 'Admin',
                avatar: user.name.charAt(0).toUpperCase(),
                joinedDate: new Date().toISOString(),
                tasksCompleted: 0,
                tasksInProgress: 0
              }];
              
              setTeamMembers(initialTeam);
              localStorage.setItem('teamMembers', JSON.stringify(initialTeam));
            }
          }
        }
      } catch (err) {
        console.error('Error fetching team members:', err);
        setError('Failed to load team members');
      } finally {
        setLoading(false);
      }
    };
    
    fetchTeamMembers();
  }, []);
  
  const handleAddMember = () => {
    if (!newMember.name || !newMember.email) {
      setError('Name and email are required');
      return;
    }
    
    const newTeamMember: TeamMember = {
      id: Date.now().toString(),
      name: newMember.name,
      email: newMember.email,
      role: newMember.role,
      avatar: newMember.name.charAt(0).toUpperCase(),
      joinedDate: new Date().toISOString(),
      tasksCompleted: 0,
      tasksInProgress: 0
    };
    
    const updatedTeam = [...teamMembers, newTeamMember];
    setTeamMembers(updatedTeam);
    
    if (typeof window !== 'undefined') {
      localStorage.setItem('teamMembers', JSON.stringify(updatedTeam));
    }
    
    setNewMember({
      name: '',
      email: '',
      role: 'Member'
    });
    
    setShowAddMember(false);
  };
  
  const handleRemoveMember = (id: string) => {
    if (id === '1') {
      setError("You can't remove yourself from the team");
      return;
    }
    
    if (confirm('Are you sure you want to remove this team member?')) {
      const updatedTeam = teamMembers.filter(member => member.id !== id);
      setTeamMembers(updatedTeam);
      
      if (typeof window !== 'undefined') {
        localStorage.setItem('teamMembers', JSON.stringify(updatedTeam));
      }
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Team Members</h1>
        <button
          onClick={() => setShowAddMember(!showAddMember)}
          className={cn(
            "flex items-center gap-2 px-4 py-2 rounded-md",
            showAddMember 
              ? "bg-muted text-muted-foreground border border-border"
              : "bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90",
            "transition-colors"
          )}
        >
          {showAddMember ? (
            <>
              <X className="h-4 w-4" />
              Cancel
            </>
          ) : (
            <>
              <PlusCircle className="h-4 w-4" />
              Add Member
            </>
          )}
        </button>
      </div>
      
      {error && (
        <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {showAddMember && (
        <div className="bg-card border border-border rounded-lg p-6 mb-6">
          <h2 className="text-lg font-medium mb-4">Add New Team Member</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div className="space-y-2">
              <label htmlFor="name" className="block text-sm font-medium">
                Full Name <span className="text-destructive">*</span>
              </label>
              <input
                id="name"
                type="text"
                value={newMember.name}
                onChange={(e) => setNewMember({...newMember, name: e.target.value})}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                  "bg-background text-foreground"
                )}
                placeholder="John Doe"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="email" className="block text-sm font-medium">
                Email Address <span className="text-destructive">*</span>
              </label>
              <input
                id="email"
                type="email"
                value={newMember.email}
                onChange={(e) => setNewMember({...newMember, email: e.target.value})}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                  "bg-background text-foreground"
                )}
                placeholder="john@example.com"
              />
            </div>
            
            <div className="space-y-2">
              <label htmlFor="role" className="block text-sm font-medium">
                Role
              </label>
              <select
                id="role"
                value={newMember.role}
                onChange={(e) => setNewMember({...newMember, role: e.target.value})}
                className={cn(
                  "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                  "bg-background text-foreground"
                )}
              >
                <option value="Member">Member</option>
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Viewer">Viewer</option>
              </select>
            </div>
          </div>
          
          <div className="flex justify-end">
            <button
              onClick={handleAddMember}
              className="px-4 py-2 rounded-md bg-primary text-primary-foreground hover:bg-primary hover:bg-opacity-90 transition-colors"
            >
              Add Team Member
            </button>
          </div>
        </div>
      )}
      
      {loading ? (
        <div className="flex justify-center py-8">
          <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full"></div>
        </div>
      ) : teamMembers.length === 0 ? (
        <div className="text-center py-8">
          <User className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
          <h3 className="text-lg font-medium mb-1">No team members found</h3>
          <p className="text-muted-foreground">
            Add team members to collaborate on tasks
          </p>
          <button
            onClick={() => setShowAddMember(true)}
            className={cn(
              "inline-flex items-center gap-2 mt-4 px-4 py-2 rounded-md bg-primary text-primary-foreground",
              "hover:bg-primary hover:bg-opacity-90 transition-colors"
            )}
          >
            <PlusCircle className="h-4 w-4" />
            Add First Team Member
          </button>
        </div>
      ) : (
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-muted">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Member
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Joined
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Tasks
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-muted-foreground uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border">
                {teamMembers.map((member) => (
                  <tr key={member.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="h-10 w-10 rounded-full bg-primary bg-opacity-10 flex items-center justify-center text-primary font-medium">
                          {member.avatar}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium">{member.name}</div>
                          <div className="text-sm text-muted-foreground">{member.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={cn(
                        "px-2 py-1 text-xs font-medium rounded-full",
                        member.role === 'Admin' ? "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:bg-opacity-30 dark:text-blue-300" :
                        member.role === 'Manager' ? "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:bg-opacity-30 dark:text-purple-300" :
                        "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:bg-opacity-30 dark:text-gray-300"
                      )}>
                        {member.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-muted-foreground">
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-1" />
                        {formatDate(member.joinedDate)}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center gap-4">
                        <div className="flex items-center text-sm">
                          <CheckCircle className="h-4 w-4 text-green-500 mr-1" />
                          <span>{member.tasksCompleted}</span>
                        </div>
                        <div className="flex items-center text-sm">
                          <Clock className="h-4 w-4 text-blue-500 mr-1" />
                          <span>{member.tasksInProgress}</span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      {member.id !== '1' && (
                        <button
                          onClick={() => handleRemoveMember(member.id)}
                          className="text-destructive hover:text-destructive hover:underline"
                        >
                          Remove
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
