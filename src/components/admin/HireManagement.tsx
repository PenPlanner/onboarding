import { useState } from 'react';
import { Plus, Search, Edit2, Trash2, Mail, Phone, Building, Download, Upload } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import type { NewHire } from '../../types';
import { HireFormModal } from './HireFormModal';
import { BulkImport } from './BulkImport';

export function HireManagement() {
  const { batches, updateHire, deleteHire, addHire } = useOnboardingStore();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedBatch, setSelectedBatch] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);
  const [editingHire, setEditingHire] = useState<NewHire | null>(null);
  const [showBulkImport, setShowBulkImport] = useState(false);

  // Get all hires with batch info
  const allHires = batches.flatMap(batch => 
    batch.hires.map(hire => ({ ...hire, batchId: batch.id, batchName: `${batch.month} ${batch.year}` } as NewHire & { batchId: string; batchName: string }))
  );

  // Filter hires
  const filteredHires = allHires.filter(hire => {
    const matchesSearch = searchTerm === '' || 
      hire.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hire.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      hire.position.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesBatch = selectedBatch === 'all' || hire.batchId === selectedBatch;
    
    return matchesSearch && matchesBatch;
  });

  const exportEmployees = () => {
    const csvData = filteredHires.map(hire => ({
      Name: hire.name,
      Email: hire.email,
      Phone: hire.phone || '',
      Position: hire.position,
      Department: hire.department,
      'Start Date': new Date(hire.startDate).toLocaleDateString(),
      Status: hire.status,
      'Progress %': hire.overallProgress,
      Batch: hire.batchName,
      'Winda ID': hire.windaId || '',
      'SAP ID': hire.sapId || '',
      'Employee ID': hire.employeeId || ''
    }));

    const headers = Object.keys(csvData[0] || {});
    const csvContent = [
      headers.join(','),
      ...csvData.map(row => headers.map(header => `"${(row as any)[header]}"`).join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `employees_${new Date().toISOString().split('T')[0]}.csv`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Employee Management</h1>
          <p className="text-gray-600 mt-1">Manage all onboarding employees</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => exportEmployees()}
            className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
          >
            <Download size={20} />
            Export CSV
          </button>
          <button
            onClick={() => setShowBulkImport(true)}
            className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
          >
            <Upload size={20} />
            Bulk Import
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            <Plus size={20} />
            Add Employee
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white rounded-xl shadow-sm p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search employees..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              />
            </div>
          </div>
          <select
            value={selectedBatch}
            onChange={(e) => setSelectedBatch(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
          >
            <option value="all">All Batches</option>
            {batches.map(batch => (
              <option key={batch.id} value={batch.id}>
                {batch.month} {batch.year}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Employees Table */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        <table className="w-full">
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Employee
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Position
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Department
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Batch
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {filteredHires.map((hire) => (
              <tr key={hire.id} className="hover:bg-gray-50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center">
                    <img
                      src={hire.photoUrl}
                      alt={hire.name}
                      className="w-10 h-10 rounded-full mr-3"
                    />
                    <div>
                      <div className="text-sm font-medium text-gray-900">{hire.name}</div>
                      <div className="text-sm text-gray-500 flex items-center gap-3 mt-1">
                        <span className="flex items-center gap-1">
                          <Mail size={14} />
                          {hire.email}
                        </span>
                        <span className="flex items-center gap-1">
                          <Phone size={14} />
                          {hire.phone}
                        </span>
                      </div>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{hire.position}</div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900 flex items-center gap-1">
                    <Building size={14} />
                    {hire.department}
                  </div>
                </td>
                <td className="px-6 py-4">
                  <div className="text-sm text-gray-900">{hire.batchName}</div>
                </td>
                <td className="px-6 py-4">
                  <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                    hire.status === 'completed'
                      ? 'bg-success-100 text-success-800'
                      : hire.status === 'in_progress'
                      ? 'bg-primary-100 text-primary-800'
                      : 'bg-warning-100 text-warning-800'
                  }`}>
                    {hire.status.replace('_', ' ')}
                  </span>
                </td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setEditingHire(hire)}
                      className="p-1 text-gray-600 hover:text-primary-600 transition-colors"
                    >
                      <Edit2 size={16} />
                    </button>
                    <button
                      onClick={() => {
                        if (confirm('Are you sure you want to delete this employee?')) {
                          deleteHire((hire as any).batchId, hire.id);
                        }
                      }}
                      className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                    >
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add/Edit Modal */}
      {(showAddModal || editingHire) && (
        <HireFormModal
          hire={editingHire}
          batches={batches}
          onClose={() => {
            setShowAddModal(false);
            setEditingHire(null);
          }}
          onSave={(hire, batchId) => {
            if (editingHire) {
              updateHire((editingHire as any).batchId, hire);
            } else {
              addHire(batchId, hire);
            }
            setShowAddModal(false);
            setEditingHire(null);
          }}
        />
      )}

      {/* Bulk Import Modal */}
      {showBulkImport && (
        <BulkImport onClose={() => setShowBulkImport(false)} />
      )}
    </div>
  );
}

