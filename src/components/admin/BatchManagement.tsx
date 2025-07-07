import { useState } from 'react';
import { Plus, Calendar, Users, Trash2, ChevronDown, ChevronUp } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import type { OnboardingBatch } from '../../types';

export function BatchManagement() {
  const { batches, addBatch, deleteBatch } = useOnboardingStore();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [expandedBatch, setExpandedBatch] = useState<string | null>(null);

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Batch Management</h1>
          <p className="text-gray-600 mt-1">Manage onboarding batches and schedules</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Create Batch
        </button>
      </div>

      {/* Batches List */}
      <div className="space-y-4">
        {batches.map((batch) => (
          <div key={batch.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="p-3 bg-primary-50 rounded-lg">
                    <Calendar className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">
                      {batch.month} {batch.year}
                    </h3>
                    <p className="text-sm text-gray-600 mt-1">
                      <span className="flex items-center gap-1">
                        <Users size={16} />
                        {batch.hires.length} employees
                      </span>
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setExpandedBatch(expandedBatch === batch.id ? null : batch.id)}
                    className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                  >
                    {expandedBatch === batch.id ? <ChevronUp size={20} /> : <ChevronDown size={20} />}
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Are you sure you want to delete this batch?')) {
                        deleteBatch(batch.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <Trash2 size={20} />
                  </button>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedBatch === batch.id && (
                <div className="mt-6 pt-6 border-t border-gray-200">
                  <h4 className="font-medium text-gray-900 mb-4">Employees in this batch:</h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {batch.hires.map((hire) => (
                      <div key={hire.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <img
                          src={hire.photoUrl}
                          alt={hire.name}
                          className="w-10 h-10 rounded-full"
                        />
                        <div>
                          <div className="font-medium text-gray-900">{hire.name}</div>
                          <div className="text-sm text-gray-600">{hire.position}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Create Batch Modal */}
      {showCreateModal && (
        <CreateBatchModal
          onClose={() => setShowCreateModal(false)}
          onCreate={(month: string, year: number) => {
            const newBatch: OnboardingBatch = {
              id: `batch-${Date.now()}`,
              title: `Onboarding ${month} ${year}`,
              month,
              year,
              hires: [],
              totalHires: 0,
              completedHires: 0,
              createdAt: new Date().toISOString()
            };
            addBatch(newBatch);
            setShowCreateModal(false);
          }}
        />
      )}
    </div>
  );
}

function CreateBatchModal({ onClose, onCreate }: { onClose: () => void; onCreate: (month: string, year: number) => void }) {
  const [selectedMonth, setSelectedMonth] = useState('January');
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());

  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Create New Batch</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Month</label>
            <select
              value={selectedMonth}
              onChange={(e) => setSelectedMonth(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {months.map(month => (
                <option key={month} value={month}>{month}</option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Year</label>
            <select
              value={selectedYear}
              onChange={(e) => setSelectedYear(parseInt(e.target.value))}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              {[2024, 2025, 2026].map(year => (
                <option key={year} value={year}>{year}</option>
              ))}
            </select>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={() => onCreate(selectedMonth, selectedYear)}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Create Batch
          </button>
        </div>
      </div>
    </div>
  );
}