import { Users, Calendar, CheckCircle, Clock, TrendingUp, AlertCircle } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import { ActivityLog } from './ActivityLog';

export function AdminDashboard() {
  const { batches } = useOnboardingStore();
  
  // Calculate statistics
  const totalHires = batches.reduce((acc, batch) => acc + batch.hires.length, 0);
  const activeHires = batches.reduce((acc, batch) => 
    acc + batch.hires.filter(h => h.status === 'in_progress').length, 0
  );
  const completedHires = batches.reduce((acc, batch) => 
    acc + batch.hires.filter(h => h.status === 'completed').length, 0
  );
  const delayedHires = batches.reduce((acc, batch) => 
    acc + batch.hires.filter(h => h.status === 'delayed').length, 0
  );

  const stats = [
    {
      label: 'Total Employees',
      value: totalHires,
      icon: Users,
      color: 'bg-blue-500',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600'
    },
    {
      label: 'Active Onboarding',
      value: activeHires,
      icon: Clock,
      color: 'bg-primary-500',
      bgColor: 'bg-primary-50',
      textColor: 'text-primary-600'
    },
    {
      label: 'Completed',
      value: completedHires,
      icon: CheckCircle,
      color: 'bg-success-500',
      bgColor: 'bg-success-50',
      textColor: 'text-success-600'
    },
    {
      label: 'Delayed',
      value: delayedHires,
      icon: AlertCircle,
      color: 'bg-warning-500',
      bgColor: 'bg-warning-50',
      textColor: 'text-warning-600'
    }
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-gray-600 mt-1">Overview of onboarding activities</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`p-3 ${stat.bgColor} rounded-lg`}>
                  <Icon className={`w-6 h-6 ${stat.textColor}`} />
                </div>
                <TrendingUp className="w-5 h-5 text-gray-400" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">{stat.value}</h3>
              <p className="text-sm text-gray-600 mt-1">{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Two column layout for Recent Batches and Activity Log */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Batches */}
        <div className="bg-white rounded-xl shadow-sm">
          <div className="p-6 border-b border-gray-200">
            <h2 className="text-lg font-semibold text-gray-900">Recent Batches</h2>
          </div>
          <div className="divide-y divide-gray-200">
            {batches.slice(0, 5).map((batch) => {
              const activeCount = batch.hires.filter(h => h.status === 'in_progress').length;
              const completedCount = batch.hires.filter(h => h.status === 'completed').length;
              
              return (
                <div key={batch.id} className="p-6 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {batch.month} {batch.year}
                      </h3>
                      <p className="text-sm text-gray-600 mt-1">
                        {batch.hires.length} employees • {activeCount} active • {completedCount} completed
                      </p>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar className="w-5 h-5 text-gray-400" />
                      <span className="text-sm text-gray-600">
                        Created {new Date(batch.createdAt).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Activity Log */}
        <ActivityLog />
      </div>
    </div>
  );
}