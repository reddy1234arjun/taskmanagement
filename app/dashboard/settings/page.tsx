'use client'

import { useState, useEffect } from 'react';
import { 
  Save,
  Moon,
  Sun,
  Bell,
  Mail,
  User,
  Lock,
  Trash2
} from 'lucide-react';
import { cn } from '@/lib/utils';

export default function SettingsPage() {
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [isDarkMode, setIsDarkMode] = useState(false);
  
  const [settings, setSettings] = useState({
    name: '',
    email: '',
    notifications: {
      email: true,
      browser: true,
      mobile: false
    },
    theme: 'system',
    language: 'en'
  });
  
  useEffect(() => {
    // Get user from localStorage
    if (typeof window !== 'undefined') {
      const storedUser = localStorage.getItem('user');
      if (storedUser) {
        try {
          const userData = JSON.parse(storedUser);
          setUser(userData);
          setSettings(prev => ({
            ...prev,
            name: userData.name,
            email: userData.email
          }));
        } catch (e) {
          console.error('Failed to parse user from localStorage');
        }
      }
      
      // Get theme preference
      const storedTheme = localStorage.getItem('theme');
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      
      if (storedTheme === 'dark' || (!storedTheme && prefersDark)) {
        setIsDarkMode(true);
        setSettings(prev => ({ ...prev, theme: 'dark' }));
      } else if (storedTheme === 'light') {
        setSettings(prev => ({ ...prev, theme: 'light' }));
      }
      
      // Get stored settings if available
      const storedSettings = localStorage.getItem('userSettings');
      if (storedSettings) {
        try {
          const parsedSettings = JSON.parse(storedSettings);
          const userInfo = user || (storedUser ? JSON.parse(storedUser) : null);
          setSettings(prev => ({
            ...prev,
            ...parsedSettings,
            name: userInfo?.name || parsedSettings.name,
            email: userInfo?.email || parsedSettings.email
          }));
        } catch (e) {
          console.error('Failed to parse settings from localStorage');
        }
      }
    }
  }, []);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    
    if (type === 'checkbox') {
      const checkbox = e.target as HTMLInputElement;
      const notificationKey = name.split('.')[1];
      
      setSettings(prev => ({
        ...prev,
        notifications: {
          ...prev.notifications,
          [notificationKey]: checkbox.checked
        }
      }));
    } else {
      setSettings(prev => ({
        ...prev,
        [name]: value
      }));
    }
  };
  
  const handleThemeChange = (theme: string) => {
    setSettings(prev => ({ ...prev, theme }));
    
    if (typeof window !== 'undefined') {
      if (theme === 'dark') {
        document.documentElement.classList.add('dark');
        localStorage.setItem('theme', 'dark');
        setIsDarkMode(true);
      } else if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        localStorage.setItem('theme', 'light');
        setIsDarkMode(false);
      } else {
        // System preference
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        if (prefersDark) {
          document.documentElement.classList.add('dark');
          setIsDarkMode(true);
        } else {
          document.documentElement.classList.remove('dark');
          setIsDarkMode(false);
        }
        localStorage.removeItem('theme');
      }
    }
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');
    
    try {
      // Update user info
      if (typeof window !== 'undefined') {
        const userData = {
          name: settings.name,
          email: settings.email
        };
        
        localStorage.setItem('user', JSON.stringify(userData));
        localStorage.setItem('userSettings', JSON.stringify(settings));
      }
      
      setSuccess('Settings saved successfully');
      
      // Clear success message after 3 seconds
      setTimeout(() => {
        setSuccess('');
      }, 3000);
    } catch (err) {
      setError('Failed to save settings');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">Settings</h1>
      </div>
      
      {error && (
        <div className="bg-destructive bg-opacity-10 text-destructive px-4 py-3 rounded-md">
          {error}
        </div>
      )}
      
      {success && (
        <div className="bg-green-100 text-green-800 dark:bg-green-900 dark:bg-opacity-30 dark:text-green-300 px-4 py-3 rounded-md">
          {success}
        </div>
      )}
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-1">
          <div className="bg-card border border-border rounded-lg p-6 sticky top-20">
            <h2 className="text-lg font-medium mb-4">Settings</h2>
            <nav className="space-y-1">
              <a href="#profile" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md bg-accent text-accent-foreground">
                <User className="h-4 w-4" />
                <span>Profile</span>
              </a>
              <a href="#notifications" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">
                <Bell className="h-4 w-4" />
                <span>Notifications</span>
              </a>
              <a href="#appearance" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">
                <Moon className="h-4 w-4" />
                <span>Appearance</span>
              </a>
              <a href="#account" className="flex items-center gap-2 px-3 py-2 text-sm rounded-md hover:bg-accent hover:text-accent-foreground">
                <Lock className="h-4 w-4" />
                <span>Account</span>
              </a>
            </nav>
          </div>
        </div>
        
        <div className="md:col-span-2 space-y-6">
          <form onSubmit={handleSubmit}>
            {/* Profile Section */}
            <section id="profile" className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Profile Information</h2>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <label htmlFor="name" className="block text-sm font-medium">
                    Full Name
                  </label>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    value={settings.name}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                      "bg-background text-foreground"
                    )}
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium">
                    Email Address
                  </label>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    value={settings.email}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                      "bg-background text-foreground"
                    )}
                  />
                </div>
              </div>
            </section>
            
            {/* Notifications Section */}
            <section id="notifications" className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Notification Preferences</h2>
              
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Email Notifications</h3>
                    <p className="text-sm text-muted-foreground">Receive notifications via email</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.email"
                      checked={settings.notifications.email}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Browser Notifications</h3>
                    <p className="text-sm text-muted-foreground">Show desktop notifications</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.browser"
                      checked={settings.notifications.browser}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
                
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-medium">Mobile Notifications</h3>
                    <p className="text-sm text-muted-foreground">Push notifications to mobile device</p>
                  </div>
                  <label className="relative inline-flex items-center cursor-pointer">
                    <input 
                      type="checkbox" 
                      name="notifications.mobile"
                      checked={settings.notifications.mobile}
                      onChange={handleChange}
                      className="sr-only peer" 
                    />
                    <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-ring rounded-full peer dark:bg-gray-700 peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all dark:border-gray-600 peer-checked:bg-primary"></div>
                  </label>
                </div>
              </div>
            </section>
            
            {/* Appearance Section */}
            <section id="appearance" className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Appearance</h2>
              
              <div className="space-y-4">
                <div>
                  <h3 className="text-sm font-medium mb-3">Theme</h3>
                  <div className="grid grid-cols-3 gap-3">
                    <button
                      type="button"
                      onClick={() => handleThemeChange('light')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-md border",
                        settings.theme === 'light' 
                          ? "border-primary bg-primary bg-opacity-5" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      <Sun className="h-6 w-6" />
                      <span className="text-sm">Light</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleThemeChange('dark')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-md border",
                        settings.theme === 'dark' 
                          ? "border-primary bg-primary bg-opacity-5" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      <Moon className="h-6 w-6" />
                      <span className="text-sm">Dark</span>
                    </button>
                    
                    <button
                      type="button"
                      onClick={() => handleThemeChange('system')}
                      className={cn(
                        "flex flex-col items-center gap-2 p-3 rounded-md border",
                        settings.theme === 'system' 
                          ? "border-primary bg-primary bg-opacity-5" 
                          : "border-border hover:border-primary"
                      )}
                    >
                      <div className="h-6 w-6 flex items-center justify-center">
                        <div className="h-5 w-5 rounded-full bg-primary bg-opacity-20 flex items-center justify-center">
                          <span className="text-xs">S</span>
                        </div>
                      </div>
                      <span className="text-sm">System</span>
                    </button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="language" className="block text-sm font-medium">
                    Language
                  </label>
                  <select
                    id="language"
                    name="language"
                    value={settings.language}
                    onChange={handleChange}
                    className={cn(
                      "w-full px-3 py-2 border border-input rounded-md focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                      "bg-background text-foreground"
                    )}
                  >
                    <option value="en">English</option>
                    <option value="es">Spanish</option>
                    <option value="fr">French</option>
                    <option value="de">German</option>
                    <option value="ja">Japanese</option>
                  </select>
                </div>
              </div>
            </section>
            
            {/* Account Section */}
            <section id="account" className="bg-card border border-border rounded-lg p-6 mb-6">
              <h2 className="text-lg font-medium mb-4">Account</h2>
              
              <div className="space-y-4">
                <div className="p-4 border border-destructive border-opacity-20 rounded-md bg-destructive bg-opacity-5">
                  <h3 className="text-sm font-medium text-destructive mb-2">Danger Zone</h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    Once you delete your account, there is no going back. Please be certain.
                  </p>
                  <button
                    type="button"
                    className="flex items-center gap-2 px-3 py-2 rounded-md border border-destructive text-destructive hover:bg-destructive hover:bg-opacity-10"
                  >
                    <Trash2 className="h-4 w-4" />
                    <span>Delete Account</span>
                  </button>
                </div>
              </div>
            </section>
            
            <div className="flex justify-end">
              <button
                type="submit"
                disabled={loading}
                className={cn(
                  "flex items-center gap-2 px-4 py-2 rounded-md bg-primary text-primary-foreground",
                  "hover:bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-ring transition-colors",
                  loading && "opacity-70 cursor-not-allowed"
                )}
              >
                <Save className="h-4 w-4" />
                {loading ? 'Saving...' : 'Save Settings'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
