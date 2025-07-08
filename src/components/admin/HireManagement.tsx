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
        <div className="overflow-x-auto">
          <table className="w-full min-w-[1200px]">
            <thead className="bg-gray-50 border-b border-gray-200">
              <tr>
                <th className="px-8 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Employee
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Position
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Department
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Batch
                </th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-8 py-4 text-right text-sm font-semibold text-gray-700 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-100">
              {filteredHires.map((hire) => (
                <tr key={hire.id} className="hover:bg-blue-50/30 transition-colors">
                  <td className="px-8 py-6">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-semibold text-sm">
                            {hire.name.split(' ').map(n => n[0]).join('')}
                          </span>
                        </div>
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="text-base font-semibold text-gray-900 mb-1">
                          {hire.name}
                        </div>
                        <div className="flex flex-col space-y-1">
                          <div className="flex items-center text-sm text-gray-600">
                            <Mail size={14} className="mr-2 text-gray-400" />
                            <span className="truncate">{hire.email}</span>
                          </div>
                          <div className="flex items-center text-sm text-gray-600">
                            <Phone size={14} className="mr-2 text-gray-400" />
                            <span>{hire.phone}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-medium text-gray-900">
                      {hire.position}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="flex items-center text-sm font-medium text-gray-900">
                      <Building size={16} className="mr-2 text-gray-400" />
                      {hire.department}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <div className="text-sm font-medium text-gray-900">
                      {hire.batchName}
                    </div>
                  </td>
                  <td className="px-6 py-6">
                    <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
                      hire.status === 'completed'
                        ? 'bg-green-100 text-green-800 border border-green-200'
                        : hire.status === 'in_progress'
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-yellow-100 text-yellow-800 border border-yellow-200'
                    }`}>
                      {hire.status === 'in_progress' ? 'In Progress' : 
                       hire.status === 'completed' ? 'Completed' : 'Delayed'}
                    </span>
                  </td>
                  <td className="px-8 py-6">
                    <div className="flex items-center justify-end space-x-3">
                      <button
                        onClick={() => setEditingHire(hire)}
                        className="inline-flex items-center px-3 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-lg text-gray-700 bg-white hover:bg-gray-50 hover:border-blue-300 transition-colors"
                      >
                        <Edit2 size={16} className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => {
                          if (confirm('Are you sure you want to delete this employee?')) {
                            deleteHire((hire as any).batchId, hire.id);
                          }
                        }}
                        className="inline-flex items-center px-3 py-2 border border-red-300 shadow-sm text-sm font-medium rounded-lg text-red-700 bg-white hover:bg-red-50 hover:border-red-400 transition-colors"
                      >
                        <Trash2 size={16} className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        
        {filteredHires.length === 0 && (
          <div className="text-center py-16">
            <div className="text-gray-400 mb-4">
              <Search size={48} className="mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No employees found</h3>
            <p className="text-gray-500">Try adjusting your search criteria or add a new employee.</p>
          </div>
        )}
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

