import { useState } from 'react';
import { AdminLayout } from '../AdminLayout';
import { AdminDashboard } from './AdminDashboard';
import { HireManagement } from './HireManagement';
import { BatchManagement } from './BatchManagement';
import { TemplateEditor } from './TemplateEditor';
import { Settings } from './Settings';

type AdminPage = 'dashboard' | 'hires' | 'batches' | 'templates' | 'settings';

export function AdminPanel() {
  const [activePage, setActivePage] = useState<AdminPage>('dashboard');

  const renderPage = () => {
    switch (activePage) {
      case 'dashboard':
        return <AdminDashboard />;
      case 'hires':
        return <HireManagement />;
      case 'batches':
        return <BatchManagement />;
      case 'templates':
        return <TemplateEditor />;
      case 'settings':
        return <Settings />;
      default:
        return <AdminDashboard />;
    }
  };

  return (
    <AdminLayout activePage={activePage} onNavigate={setActivePage}>
      {renderPage()}
    </AdminLayout>
  );
}

// Placeholder components