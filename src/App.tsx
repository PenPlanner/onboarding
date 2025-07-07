import React from 'react';
import { useOnboardingStore } from './stores/onboarding';
import { Dashboard } from './components/dashboard/Dashboard';
import { HireDetail } from './components/dashboard/HireDetail';

function App() {
  const { selectedHire } = useOnboardingStore();

  return (
    <div className="min-h-screen bg-gray-50">
      <main className="container mx-auto px-4 py-8">
        {selectedHire ? (
          <HireDetail />
        ) : (
          <Dashboard />
        )}
      </main>
    </div>
  );
}

export default App;