import { useState } from 'react';
import { Save, Upload, Download, Bell, Users, Building } from 'lucide-react';

interface CompanySettings {
  companyName: string;
  logoUrl: string;
  primaryColor: string;
  defaultBatchSize: number;
  autoEmailReminders: boolean;
  reminderDaysBefore: number;
  requirePhotoUpload: boolean;
  allowBulkImport: boolean;
  defaultDepartment: string;
  workingDays: string[];
  timeZone: string;
}

interface NotificationSettings {
  onHireAdded: boolean;
  onStepCompleted: boolean;
  onBatchCreated: boolean;
  onDelayedProgress: boolean;
  emailDigest: 'none' | 'daily' | 'weekly';
}

export function Settings() {
  const [activeTab, setActiveTab] = useState<'company' | 'notifications' | 'users' | 'data'>('company');
  const [companySettings, setCompanySettings] = useState<CompanySettings>({
    companyName: 'Vestas Wind Systems',
    logoUrl: '/vestas-logo.png',
    primaryColor: '#0066CC',
    defaultBatchSize: 15,
    autoEmailReminders: true,
    reminderDaysBefore: 3,
    requirePhotoUpload: false,
    allowBulkImport: true,
    defaultDepartment: 'Service Technology',
    workingDays: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
    timeZone: 'Europe/Copenhagen'
  });

  const [notificationSettings, setNotificationSettings] = useState<NotificationSettings>({
    onHireAdded: true,
    onStepCompleted: true,
    onBatchCreated: true,
    onDelayedProgress: true,
    emailDigest: 'weekly'
  });

  const [isSaving, setIsSaving] = useState(false);

  const handleSaveSettings = async () => {
    setIsSaving(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsSaving(false);
    alert('Settings saved successfully!');
  };

  const exportData = (type: 'employees' | 'batches' | 'templates') => {
    alert(`Exporting ${type} data...`);
  };

  const importData = () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = '.csv,.json';
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        alert(`Importing ${file.name}...`);
      }
    };
    input.click();
  };

  const tabs = [
    { id: 'company', label: 'Company', icon: Building },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'users', label: 'Users & Roles', icon: Users },
    { id: 'data', label: 'Data Management', icon: Upload }
  ] as const;

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="text-gray-600 mt-1">Manage system settings and preferences</p>
      </div>

      {/* Tabs */}
      <div className="border-b border-gray-200 mb-6">
        <nav className="-mb-px flex space-x-8">
          {tabs.map((tab) => {
            const Icon = tab.icon;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-2 px-1 border-b-2 font-medium text-sm flex items-center gap-2 ${
                  activeTab === tab.id
                    ? 'border-primary-500 text-primary-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                }`}
              >
                <Icon size={18} />
                {tab.label}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Company Settings */}
      {activeTab === 'company' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Company Information</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Company Name</label>
                <input
                  type="text"
                  value={companySettings.companyName}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, companyName: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Logo URL</label>
                <input
                  type="url"
                  value={companySettings.logoUrl}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, logoUrl: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="https://example.com/logo.png"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Primary Color</label>
                <div className="flex gap-2">
                  <input
                    type="color"
                    value={companySettings.primaryColor}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="w-12 h-10 border border-gray-300 rounded cursor-pointer"
                  />
                  <input
                    type="text"
                    value={companySettings.primaryColor}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, primaryColor: e.target.value }))}
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Time Zone</label>
                <select
                  value={companySettings.timeZone}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, timeZone: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Europe/Copenhagen">Europe/Copenhagen</option>
                  <option value="Europe/London">Europe/London</option>
                  <option value="America/New_York">America/New_York</option>
                  <option value="America/Los_Angeles">America/Los_Angeles</option>
                  <option value="Asia/Tokyo">Asia/Tokyo</option>
                </select>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Onboarding Defaults</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Batch Size</label>
                <input
                  type="number"
                  value={companySettings.defaultBatchSize}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, defaultBatchSize: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  min="1"
                  max="50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Default Department</label>
                <select
                  value={companySettings.defaultDepartment}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, defaultDepartment: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                >
                  <option value="Service Technology">Service Technology</option>
                  <option value="Operations">Operations</option>
                  <option value="Manufacturing">Manufacturing</option>
                  <option value="Engineering">Engineering</option>
                  <option value="Sales">Sales</option>
                  <option value="Administration">Administration</option>
                </select>
              </div>
            </div>

            <div className="mt-6 space-y-4">
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={companySettings.requirePhotoUpload}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, requirePhotoUpload: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Require photo upload for new employees</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={companySettings.allowBulkImport}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, allowBulkImport: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Allow bulk import of employees</span>
              </label>
              <label className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={companySettings.autoEmailReminders}
                  onChange={(e) => setCompanySettings(prev => ({ ...prev, autoEmailReminders: e.target.checked }))}
                  className="rounded border-gray-300"
                />
                <span className="text-sm text-gray-700">Send automatic email reminders</span>
              </label>
              {companySettings.autoEmailReminders && (
                <div className="ml-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">Days before deadline</label>
                  <input
                    type="number"
                    value={companySettings.reminderDaysBefore}
                    onChange={(e) => setCompanySettings(prev => ({ ...prev, reminderDaysBefore: parseInt(e.target.value) }))}
                    className="w-20 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    min="1"
                    max="30"
                  />
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Notifications */}
      {activeTab === 'notifications' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Email Notifications</h3>
            <div className="space-y-4">
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">New employee added</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.onHireAdded}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, onHireAdded: e.target.checked }))}
                  className="rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Onboarding step completed</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.onStepCompleted}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, onStepCompleted: e.target.checked }))}
                  className="rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">New batch created</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.onBatchCreated}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, onBatchCreated: e.target.checked }))}
                  className="rounded border-gray-300"
                />
              </label>
              <label className="flex items-center justify-between">
                <span className="text-sm text-gray-700">Progress is delayed</span>
                <input
                  type="checkbox"
                  checked={notificationSettings.onDelayedProgress}
                  onChange={(e) => setNotificationSettings(prev => ({ ...prev, onDelayedProgress: e.target.checked }))}
                  className="rounded border-gray-300"
                />
              </label>
            </div>

            <div className="mt-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">Email Digest Frequency</label>
              <select
                value={notificationSettings.emailDigest}
                onChange={(e) => setNotificationSettings(prev => ({ ...prev, emailDigest: e.target.value as any }))}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 max-w-xs"
              >
                <option value="none">None</option>
                <option value="daily">Daily</option>
                <option value="weekly">Weekly</option>
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Users & Roles */}
      {activeTab === 'users' && (
        <div className="bg-white rounded-xl shadow-sm p-6">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-lg font-semibold text-gray-900">User Management</h3>
            <button className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors">
              <Users size={18} />
              Add User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50 border-b border-gray-200">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Last Login</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">AD</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">Admin User</div>
                        <div className="text-sm text-gray-500">admin@vestas.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-red-100 text-red-800">
                      Super Admin
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Today, 2:30 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">Edit</button>
                  </td>
                </tr>
                <tr>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                        <span className="text-sm font-medium text-primary-600">HR</span>
                      </div>
                      <div>
                        <div className="text-sm font-medium text-gray-900">HR Manager</div>
                        <div className="text-sm text-gray-500">hr@vestas.com</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-blue-100 text-blue-800">
                      HR
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">Yesterday, 4:15 PM</td>
                  <td className="px-6 py-4">
                    <span className="inline-flex px-2 py-1 text-xs font-semibold rounded-full bg-green-100 text-green-800">
                      Active
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <button className="text-primary-600 hover:text-primary-700 text-sm">Edit</button>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Data Management */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Export Data</h3>
            <p className="text-gray-600 mb-4">Download your data in various formats for backup or analysis.</p>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => exportData('employees')}
                className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={20} className="text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Employees</div>
                  <div className="text-sm text-gray-500">CSV format</div>
                </div>
              </button>
              <button
                onClick={() => exportData('batches')}
                className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={20} className="text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Batches</div>
                  <div className="text-sm text-gray-500">JSON format</div>
                </div>
              </button>
              <button
                onClick={() => exportData('templates')}
                className="flex items-center gap-2 p-4 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Download size={20} className="text-gray-600" />
                <div className="text-left">
                  <div className="font-medium">Templates</div>
                  <div className="text-sm text-gray-500">JSON format</div>
                </div>
              </button>
            </div>
          </div>

          <div className="bg-white rounded-xl shadow-sm p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Import Data</h3>
            <p className="text-gray-600 mb-4">Upload employee data from CSV files or restore from backup.</p>
            <button
              onClick={importData}
              className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
            >
              <Upload size={20} />
              Import File
            </button>
            <p className="text-sm text-gray-500 mt-2">Supported formats: CSV, JSON</p>
          </div>

          <div className="bg-red-50 border border-red-200 rounded-xl p-6">
            <h3 className="text-lg font-semibold text-red-900 mb-2">Danger Zone</h3>
            <p className="text-red-700 mb-4">These actions cannot be undone. Please be careful.</p>
            <button className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors">
              Reset All Data
            </button>
          </div>
        </div>
      )}

      {/* Save Button */}
      <div className="flex justify-end mt-8">
        <button
          onClick={handleSaveSettings}
          disabled={isSaving}
          className="flex items-center gap-2 px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          <Save size={20} />
          {isSaving ? 'Saving...' : 'Save Settings'}
        </button>
      </div>
    </div>
  );
}