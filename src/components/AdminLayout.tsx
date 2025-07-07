import React from 'react';
import { Users, Calendar, Settings, LogOut, BarChart, Home, X } from 'lucide-react';
import { useAuthStore } from '../stores/auth';

interface AdminLayoutProps {
  children: React.ReactNode;
  activePage: 'dashboard' | 'hires' | 'batches' | 'templates' | 'settings';
  onNavigate: (page: 'dashboard' | 'hires' | 'batches' | 'templates' | 'settings') => void;
}

export function AdminLayout({ children, activePage, onNavigate }: AdminLayoutProps) {
  const { user, logout } = useAuthStore();

  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: Home },
    { id: 'hires', label: 'Employees', icon: Users },
    { id: 'batches', label: 'Batches', icon: Calendar },
    { id: 'templates', label: 'Templates', icon: BarChart },
    { id: 'settings', label: 'Settings', icon: Settings },
  ] as const;

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <div className="w-64 bg-white shadow-lg">
        <div className="p-6">
          <div className="flex items-center justify-between mb-2">
            <h1 className="text-xl font-bold text-gray-900">Onboarding Admin</h1>
            <button
              onClick={() => {
                // Om det är ett popup-fönster, stäng det
                if (window.opener) {
                  window.close();
                } else {
                  // Annars gå tillbaka till employee view
                  window.location.href = window.location.href.replace('?admin=true', '');
                }
              }}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              title="Stäng admin-panel"
            >
              <X size={18} className="text-gray-500" />
            </button>
          </div>
          <p className="text-sm text-gray-600">{user?.name}</p>
        </div>

        <nav className="px-4 py-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.id}
                onClick={() => onNavigate(item.id)}
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-colors mb-1 ${
                  activePage === item.id
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-700 hover:bg-gray-50'
                }`}
              >
                <Icon size={20} />
                <span className="font-medium">{item.label}</span>
              </button>
            );
          })}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 p-4">
          <button
            onClick={logout}
            className="w-full flex items-center gap-3 px-4 py-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <LogOut size={20} />
            <span className="font-medium">Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-auto">
        {children}
      </div>
    </div>
  );
}