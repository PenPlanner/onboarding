import { useState, useEffect } from 'react';
import { X, AlertCircle } from 'lucide-react';
import type { NewHire, OnboardingBatch } from '../../types';

interface HireFormModalProps {
  hire: NewHire | null;
  batches: OnboardingBatch[];
  onClose: () => void;
  onSave: (hire: NewHire, batchId: string) => void;
}

interface FormData {
  name: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  startDate: string;
  batchId: string;
  photoUrl: string;
  windaId: string;
  sapId: string;
  employeeId: string;
}

interface FormErrors {
  [key: string]: string;
}

export function HireFormModal({ hire, batches, onClose, onSave }: HireFormModalProps) {
  const [formData, setFormData] = useState<FormData>({
    name: '',
    email: '',
    phone: '',
    position: '',
    department: 'Service Technology',
    startDate: new Date().toISOString().split('T')[0],
    batchId: batches[0]?.id || '',
    photoUrl: '',
    windaId: '',
    sapId: '',
    employeeId: ''
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (hire) {
      setFormData({
        name: hire.name,
        email: hire.email,
        phone: hire.phone || '',
        position: hire.position,
        department: hire.department,
        startDate: new Date(hire.startDate).toISOString().split('T')[0],
        batchId: '', // Will be set by parent component
        photoUrl: hire.photoUrl,
        windaId: hire.windaId || '',
        sapId: hire.sapId || '',
        employeeId: hire.employeeId || ''
      });
    } else {
      // Generate IDs for new hire
      const timestamp = Date.now();
      setFormData(prev => ({
        ...prev,
        windaId: `WID${timestamp.toString().slice(-6)}`,
        sapId: `SAP${timestamp.toString().slice(-6)}`,
        employeeId: `EMP${timestamp.toString().slice(-6)}`,
        photoUrl: ''
      }));
    }
  }, [hire]);

  const validateForm = (): boolean => {
    const newErrors: FormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }

    if (!formData.position.trim()) {
      newErrors.position = 'Position is required';
    }

    if (!formData.batchId) {
      newErrors.batchId = 'Please select a batch';
    }

    if (formData.phone && !/^[\+]?[\d\s\-\(\)]+$/.test(formData.phone)) {
      newErrors.phone = 'Please enter a valid phone number';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);

    try {
      // Generate photo URL if not provided
      const photoUrl = formData.photoUrl || 
        `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=128`;

      const hireData: NewHire = {
        id: hire?.id || `hire-${Date.now()}`,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        position: formData.position,
        department: formData.department,
        startDate: new Date(formData.startDate),
        photoUrl,
        windaId: formData.windaId,
        sapId: formData.sapId,
        employeeId: formData.employeeId,
        previousCourses: hire?.previousCourses || [],
        steps: hire?.steps || generateMockSteps(),
        overallProgress: hire?.overallProgress || 0,
        status: hire?.status || 'not_started'
      };

      onSave(hireData, formData.batchId);
    } catch (error) {
      console.error('Error saving hire:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof FormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const generatePhotoFromName = () => {
    if (formData.name) {
      const url = `https://ui-avatars.com/api/?name=${encodeURIComponent(formData.name)}&background=random&size=128`;
      setFormData(prev => ({ ...prev, photoUrl: url }));
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">
            {hire ? 'Edit Employee' : 'Add New Employee'}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          <div className="space-y-6">
            {/* Photo section */}
            <div className="flex items-center gap-4">
              <div className="flex-shrink-0">
                {formData.photoUrl ? (
                  <img
                    src={formData.photoUrl}
                    alt="Profile"
                    className="w-16 h-16 rounded-full object-cover"
                  />
                ) : (
                  <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center">
                    <span className="text-gray-500 text-sm">No photo</span>
                  </div>
                )}
              </div>
              <div className="flex-1">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Photo URL (optional)
                </label>
                <div className="flex gap-2">
                  <input
                    type="url"
                    value={formData.photoUrl}
                    onChange={(e) => handleInputChange('photoUrl', e.target.value)}
                    placeholder="https://example.com/photo.jpg"
                    className="flex-1 px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  />
                  <button
                    type="button"
                    onClick={generatePhotoFromName}
                    className="px-3 py-2 text-sm bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Generate
                  </button>
                </div>
              </div>
            </div>

            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => handleInputChange('name', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.name ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="John Doe"
                />
                {errors.name && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {errors.name}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email Address *
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.email ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="john.doe@vestas.com"
                />
                {errors.email && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {errors.email}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={formData.phone}
                  onChange={(e) => handleInputChange('phone', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.phone ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="+45 12 34 56 78"
                />
                {errors.phone && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {errors.phone}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position *
                </label>
                <input
                  type="text"
                  value={formData.position}
                  onChange={(e) => handleInputChange('position', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                    errors.position ? 'border-red-500' : 'border-gray-300'
                  }`}
                  placeholder="Service Technician"
                />
                {errors.position && (
                  <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                    <AlertCircle size={14} />
                    {errors.position}
                  </div>
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => handleInputChange('department', e.target.value)}
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

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Start Date
                </label>
                <input
                  type="date"
                  value={formData.startDate}
                  onChange={(e) => handleInputChange('startDate', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
              </div>
            </div>

            {/* Batch Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Onboarding Batch *
              </label>
              <select
                value={formData.batchId}
                onChange={(e) => handleInputChange('batchId', e.target.value)}
                className={`w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500 ${
                  errors.batchId ? 'border-red-500' : 'border-gray-300'
                }`}
              >
                <option value="">Select a batch</option>
                {batches.map(batch => (
                  <option key={batch.id} value={batch.id}>
                    {batch.month} {batch.year} ({batch.hires.length} employees)
                  </option>
                ))}
              </select>
              {errors.batchId && (
                <div className="flex items-center gap-1 mt-1 text-red-600 text-sm">
                  <AlertCircle size={14} />
                  {errors.batchId}
                </div>
              )}
            </div>

            {/* System IDs */}
            <div className="border-t border-gray-200 pt-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">System IDs</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Winda ID
                  </label>
                  <input
                    type="text"
                    value={formData.windaId}
                    onChange={(e) => handleInputChange('windaId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="WID123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    SAP ID
                  </label>
                  <input
                    type="text"
                    value={formData.sapId}
                    onChange={(e) => handleInputChange('sapId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="SAP123456"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Employee ID
                  </label>
                  <input
                    type="text"
                    value={formData.employeeId}
                    onChange={(e) => handleInputChange('employeeId', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                    placeholder="EMP123456"
                  />
                </div>
              </div>
            </div>
          </div>
        </form>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={isLoading}
            className="px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Saving...' : (hire ? 'Update Employee' : 'Add Employee')}
          </button>
        </div>
      </div>
    </div>
  );
}

// Need to create a simplified generateMockSteps function since we can't import the full one
function generateMockSteps() {
  return [
    {
      id: 'docs',
      title: 'Documentation',
      description: 'Complete all required paperwork',
      status: 'pending' as const,
      category: 'documents' as const,
      hasFileUpload: true,
      responsiblePerson: { initials: 'HR', name: 'HR Department', role: 'HR Manager' as const },
      subtasks: [
        { id: '1', title: 'Sign employment contract', completed: false, priority: 'high' as const },
        { id: '2', title: 'Submit tax forms', completed: false, priority: 'medium' as const }
      ]
    },
    {
      id: 'security',
      title: 'Security & Access',
      description: 'Set up security clearances',
      status: 'pending' as const,
      category: 'security' as const,
      hasFileUpload: false,
      responsiblePerson: { initials: 'IT', name: 'IT Support', role: 'IT Support' as const },
      subtasks: [
        { id: '1', title: 'Create Winda ID', completed: false, priority: 'high' as const },
        { id: '2', title: 'Issue access badge', completed: false, priority: 'high' as const }
      ]
    }
  ];
}