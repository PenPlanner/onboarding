import { useState } from 'react';
import { Clock, User, FileText, UserPlus, Calendar, Edit2, Trash2, CheckCircle, AlertCircle } from 'lucide-react';

interface ActivityLogEntry {
  id: string;
  timestamp: Date;
  user: string;
  action: 'hire_added' | 'hire_updated' | 'hire_deleted' | 'batch_created' | 'batch_deleted' | 'step_completed' | 'template_updated' | 'login' | 'logout';
  target?: string;
  details?: string;
  severity: 'info' | 'warning' | 'success' | 'error';
}

const mockActivityLog: ActivityLogEntry[] = [
  {
    id: '1',
    timestamp: new Date(Date.now() - 10 * 60 * 1000), // 10 minutes ago
    user: 'admin@vestas.com',
    action: 'hire_added',
    target: 'John Doe',
    details: 'Added new employee to August 2025 batch',
    severity: 'success'
  },
  {
    id: '2',
    timestamp: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
    user: 'hr@vestas.com',
    action: 'step_completed',
    target: 'Lars Nielsen',
    details: 'Completed Documentation step',
    severity: 'info'
  },
  {
    id: '3',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
    user: 'admin@vestas.com',
    action: 'batch_created',
    target: 'September 2025',
    details: 'Created new onboarding batch',
    severity: 'success'
  },
  {
    id: '4',
    timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000), // 4 hours ago
    user: 'hr@vestas.com',
    action: 'hire_updated',
    target: 'Emma Sørensen',
    details: 'Updated employee information',
    severity: 'info'
  },
  {
    id: '5',
    timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000), // 6 hours ago
    user: 'admin@vestas.com',
    action: 'template_updated',
    target: 'Security & Access',
    details: 'Updated onboarding template',
    severity: 'info'
  },
  {
    id: '6',
    timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000), // 8 hours ago
    user: 'hr@vestas.com',
    action: 'hire_deleted',
    target: 'Test User',
    details: 'Removed test employee from system',
    severity: 'warning'
  },
  {
    id: '7',
    timestamp: new Date(Date.now() - 24 * 60 * 60 * 1000), // 1 day ago
    user: 'admin@vestas.com',
    action: 'login',
    details: 'Signed in to admin panel',
    severity: 'info'
  }
];

export function ActivityLog() {
  const [activities] = useState<ActivityLogEntry[]>(mockActivityLog);
  const [filter, setFilter] = useState<'all' | 'today' | 'week'>('all');
  const [actionFilter, setActionFilter] = useState<string>('all');

  const getActionIcon = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'hire_added':
        return <UserPlus size={16} className="text-green-600" />;
      case 'hire_updated':
        return <Edit2 size={16} className="text-blue-600" />;
      case 'hire_deleted':
        return <Trash2 size={16} className="text-red-600" />;
      case 'batch_created':
        return <Calendar size={16} className="text-green-600" />;
      case 'batch_deleted':
        return <Trash2 size={16} className="text-red-600" />;
      case 'step_completed':
        return <CheckCircle size={16} className="text-green-600" />;
      case 'template_updated':
        return <FileText size={16} className="text-blue-600" />;
      case 'login':
      case 'logout':
        return <User size={16} className="text-gray-600" />;
      default:
        return <AlertCircle size={16} className="text-gray-600" />;
    }
  };

  const getActionText = (action: ActivityLogEntry['action']) => {
    switch (action) {
      case 'hire_added':
        return 'Added Employee';
      case 'hire_updated':
        return 'Updated Employee';
      case 'hire_deleted':
        return 'Deleted Employee';
      case 'batch_created':
        return 'Created Batch';
      case 'batch_deleted':
        return 'Deleted Batch';
      case 'step_completed':
        return 'Completed Step';
      case 'template_updated':
        return 'Updated Template';
      case 'login':
        return 'Signed In';
      case 'logout':
        return 'Signed Out';
      default:
        return 'Unknown Action';
    }
  };

  const getSeverityColor = (severity: ActivityLogEntry['severity']) => {
    switch (severity) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const formatTimestamp = (timestamp: Date) => {
    const now = new Date();
    const diff = now.getTime() - timestamp.getTime();
    const diffMinutes = Math.floor(diff / (1000 * 60));
    const diffHours = Math.floor(diff / (1000 * 60 * 60));
    const diffDays = Math.floor(diff / (1000 * 60 * 60 * 24));

    if (diffMinutes < 60) {
      return `${diffMinutes} minutes ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hours ago`;
    } else if (diffDays < 7) {
      return `${diffDays} days ago`;
    } else {
      return timestamp.toLocaleDateString();
    }
  };

  const filteredActivities = activities.filter(activity => {
    // Time filter
    const now = new Date();
    const activityDate = activity.timestamp;
    
    if (filter === 'today') {
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      if (activityDate < today) return false;
    } else if (filter === 'week') {
      const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      if (activityDate < weekAgo) return false;
    }

    // Action filter
    if (actionFilter !== 'all' && activity.action !== actionFilter) {
      return false;
    }

    return true;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold text-gray-900">Activity Log</h2>
          <div className="flex items-center gap-2">
            <Clock size={20} className="text-gray-400" />
          </div>
        </div>

        {/* Filters */}
        <div className="flex items-center gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Time Period</label>
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value as 'all' | 'today' | 'week')}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last Week</option>
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Action Type</label>
            <select
              value={actionFilter}
              onChange={(e) => setActionFilter(e.target.value)}
              className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="all">All Actions</option>
              <option value="hire_added">Employee Added</option>
              <option value="hire_updated">Employee Updated</option>
              <option value="hire_deleted">Employee Deleted</option>
              <option value="batch_created">Batch Created</option>
              <option value="step_completed">Step Completed</option>
              <option value="template_updated">Template Updated</option>
              <option value="login">Sign In</option>
            </select>
          </div>
        </div>
      </div>

      {/* Activity List */}
      <div className="divide-y divide-gray-200 max-h-96 overflow-y-auto">
        {filteredActivities.length === 0 ? (
          <div className="p-6 text-center text-gray-500">
            No activities found for the selected filters.
          </div>
        ) : (
          filteredActivities.map((activity) => (
            <div
              key={activity.id}
              className={`p-4 border-l-4 ${getSeverityColor(activity.severity)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 mt-1">
                    {getActionIcon(activity.action)}
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-gray-900">
                        {getActionText(activity.action)}
                      </span>
                      {activity.target && (
                        <span className="text-sm text-gray-600">
                          • {activity.target}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-gray-600 mb-1">
                      {activity.details}
                    </p>
                    <div className="flex items-center gap-3 text-xs text-gray-500">
                      <span className="flex items-center gap-1">
                        <User size={12} />
                        {activity.user}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock size={12} />
                        {formatTimestamp(activity.timestamp)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}