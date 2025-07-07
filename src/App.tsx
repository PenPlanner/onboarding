import { useState, useEffect } from 'react';
import { useOnboardingStore } from './stores/onboarding';
import { useAuthStore } from './stores/auth';
import { Dashboard } from './components/dashboard/Dashboard';
import { HireDetail } from './components/dashboard/HireDetail';
import { Login } from './components/Login';
import { AdminPanel } from './components/admin/AdminPanel';
import { VersionDisplay } from './components/VersionDisplay';
import { Shield } from 'lucide-react';

function App() {
  const { selectedHire } = useOnboardingStore();
  const { isAuthenticated } = useAuthStore();
  const [isAdminMode, setIsAdminMode] = useState(false);

  // Check authentication and URL parameters on mount
  useEffect(() => {
    useAuthStore.getState().checkAuth();
    
    // Kontrollera om admin-parameter finns i URL:en
    const urlParams = new URLSearchParams(window.location.search);
    const isAdmin = urlParams.get('admin') === 'true';
    setIsAdminMode(isAdmin);
    
    // Sätt fönstrets titel baserat på läge
    if (isAdmin) {
      document.title = 'Vestas Onboarding - Admin Panel';
    } else {
      document.title = 'Vestas Onboarding';
    }
  }, []);

  // If in admin mode but not authenticated, show login
  if (isAdminMode && !isAuthenticated) {
    return (
      <>
        <Login onSuccess={() => {}} />
        <VersionDisplay />
      </>
    );
  }

  // Admin view
  if (isAdminMode && isAuthenticated) {
    return (
      <>
        <AdminPanel />
        <VersionDisplay />
      </>
    );
  }

  // Employee view
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with view toggle */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-semibold text-gray-900">Vestas Onboarding</h1>
            <button
              onClick={() => {
                // Öppna admin-panelen i nytt fönster
                const adminWindow = window.open(
                  window.location.href + '?admin=true',
                  'admin-panel',
                  'width=1400,height=900,scrollbars=yes,resizable=yes'
                );
                if (adminWindow) {
                  adminWindow.focus();
                }
              }}
              className="flex items-center gap-2 px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Shield size={18} />
              Admin Panel
            </button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {selectedHire ? (
          <HireDetail />
        ) : (
          <Dashboard />
        )}
      </main>
      
      <VersionDisplay />
    </div>
  );
}

export default App;