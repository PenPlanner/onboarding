import { useState, useRef } from 'react';
import { Upload, Download, CheckCircle, AlertCircle, X } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import type { NewHire } from '../../types';

interface ImportError {
  row: number;
  field: string;
  message: string;
}

interface ParsedEmployee {
  name: string;
  email: string;
  phone?: string;
  position: string;
  department: string;
  startDate: string;
  windaId?: string;
  sapId?: string;
  employeeId?: string;
}

export function BulkImport({ onClose }: { onClose: () => void }) {
  const { batches, addHire } = useOnboardingStore();
  const [selectedBatch, setSelectedBatch] = useState<string>(batches[0]?.id || '');
  const [dragActive, setDragActive] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [parsedData, setParsedData] = useState<ParsedEmployee[]>([]);
  const [errors, setErrors] = useState<ImportError[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [importComplete, setImportComplete] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const downloadTemplate = () => {
    const template = [
      'Name,Email,Phone,Position,Department,Start Date,Winda ID,SAP ID,Employee ID',
      'John Doe,john.doe@vestas.com,+45 12 34 56 78,Service Technician,Service Technology,2025-08-12,WID123456,SAP123456,EMP123456',
      'Jane Smith,jane.smith@vestas.com,+45 87 65 43 21,Senior Service Tech,Service Technology,2025-08-12,WID123457,SAP123457,EMP123457'
    ].join('\n');

    const blob = new Blob([template], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'employee_import_template.csv';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    const files = e.dataTransfer.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files[0]) {
      handleFileSelect(files[0]);
    }
  };

  const handleFileSelect = (selectedFile: File) => {
    if (!selectedFile.name.endsWith('.csv')) {
      alert('Please select a CSV file');
      return;
    }
    setFile(selectedFile);
    parseCSV(selectedFile);
  };

  const parseCSV = (csvFile: File) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const text = e.target?.result as string;
      const lines = text.split('\n').filter(line => line.trim());
      const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
      
      const requiredFields = ['name', 'email', 'position', 'department'];
      const missingFields = requiredFields.filter(field => 
        !headers.some(header => header.includes(field))
      );

      if (missingFields.length > 0) {
        alert(`Missing required columns: ${missingFields.join(', ')}`);
        return;
      }

      const newErrors: ImportError[] = [];
      const newParsedData: ParsedEmployee[] = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim().replace(/"/g, ''));
        const employee: any = {};

        headers.forEach((header, index) => {
          const value = values[index] || '';
          
          if (header.includes('name')) employee.name = value;
          else if (header.includes('email')) employee.email = value;
          else if (header.includes('phone')) employee.phone = value;
          else if (header.includes('position')) employee.position = value;
          else if (header.includes('department')) employee.department = value;
          else if (header.includes('start') && header.includes('date')) employee.startDate = value;
          else if (header.includes('winda')) employee.windaId = value;
          else if (header.includes('sap')) employee.sapId = value;
          else if (header.includes('employee') && header.includes('id')) employee.employeeId = value;
        });

        // Validation
        if (!employee.name) {
          newErrors.push({ row: i + 1, field: 'name', message: 'Name is required' });
        }
        if (!employee.email) {
          newErrors.push({ row: i + 1, field: 'email', message: 'Email is required' });
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(employee.email)) {
          newErrors.push({ row: i + 1, field: 'email', message: 'Invalid email format' });
        }
        if (!employee.position) {
          newErrors.push({ row: i + 1, field: 'position', message: 'Position is required' });
        }
        if (!employee.department) {
          newErrors.push({ row: i + 1, field: 'department', message: 'Department is required' });
        }

        // Set defaults
        if (!employee.startDate) {
          employee.startDate = new Date().toISOString().split('T')[0];
        }
        if (!employee.department) {
          employee.department = 'Service Technology';
        }

        newParsedData.push(employee);
      }

      setErrors(newErrors);
      setParsedData(newParsedData);
    };

    reader.readAsText(csvFile);
  };

  const handleImport = async () => {
    if (errors.length > 0) {
      alert('Please fix all errors before importing');
      return;
    }

    if (!selectedBatch) {
      alert('Please select a batch');
      return;
    }

    setIsProcessing(true);

    try {
      for (const employee of parsedData) {
        const hire: NewHire = {
          id: `hire-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          name: employee.name,
          email: employee.email,
          phone: employee.phone,
          position: employee.position,
          department: employee.department,
          startDate: new Date(employee.startDate),
          photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(employee.name)}&background=random&size=128`,
          windaId: employee.windaId,
          sapId: employee.sapId,
          employeeId: employee.employeeId,
          previousCourses: [],
          steps: [], // Will be populated with default steps
          overallProgress: 0,
          status: 'not_started'
        };

        addHire(selectedBatch, hire);
        
        // Small delay to avoid overwhelming the UI
        await new Promise(resolve => setTimeout(resolve, 100));
      }

      setImportComplete(true);
    } catch (error) {
      console.error('Import failed:', error);
      alert('Import failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (importComplete) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-xl p-8 w-full max-w-md text-center">
          <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <CheckCircle size={32} className="text-green-600" />
          </div>
          <h2 className="text-xl font-bold text-gray-900 mb-2">Import Successful!</h2>
          <p className="text-gray-600 mb-6">
            Successfully imported {parsedData.length} employees to the selected batch.
          </p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-bold text-gray-900">Bulk Import Employees</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X size={20} className="text-gray-500" />
          </button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {/* Step 1: Download Template */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 1: Download Template</h3>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <p className="text-blue-800 mb-3">
                Download our CSV template to ensure your data is in the correct format.
              </p>
              <button
                onClick={downloadTemplate}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                <Download size={20} />
                Download Template
              </button>
            </div>
          </div>

          {/* Step 2: Select Batch */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 2: Select Target Batch</h3>
            <select
              value={selectedBatch}
              onChange={(e) => setSelectedBatch(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
            >
              <option value="">Select a batch</option>
              {batches.map(batch => (
                <option key={batch.id} value={batch.id}>
                  {batch.month} {batch.year} ({batch.hires.length} employees)
                </option>
              ))}
            </select>
          </div>

          {/* Step 3: Upload File */}
          <div className="mb-8">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 3: Upload CSV File</h3>
            <div
              className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                dragActive
                  ? 'border-primary-500 bg-primary-50'
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload size={48} className="mx-auto text-gray-400 mb-4" />
              <p className="text-lg font-medium text-gray-900 mb-2">
                {file ? file.name : 'Drop your CSV file here'}
              </p>
              <p className="text-gray-600 mb-4">
                or{' '}
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="text-primary-600 hover:text-primary-700 font-medium"
                >
                  browse to upload
                </button>
              </p>
              <p className="text-sm text-gray-500">CSV files only, max 10MB</p>
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileInput}
                className="hidden"
              />
            </div>
          </div>

          {/* Preview & Errors */}
          {parsedData.length > 0 && (
            <div className="mb-8">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Step 4: Review Data</h3>
              
              {/* Errors */}
              {errors.length > 0 && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4 mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <AlertCircle size={20} className="text-red-600" />
                    <span className="font-medium text-red-800">
                      {errors.length} error(s) found
                    </span>
                  </div>
                  <div className="space-y-1">
                    {errors.slice(0, 5).map((error, index) => (
                      <p key={index} className="text-sm text-red-700">
                        Row {error.row}, {error.field}: {error.message}
                      </p>
                    ))}
                    {errors.length > 5 && (
                      <p className="text-sm text-red-700">
                        ... and {errors.length - 5} more errors
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Preview */}
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-200">
                  <h4 className="font-medium text-gray-900">
                    Preview ({parsedData.length} employees)
                  </h4>
                </div>
                <div className="overflow-x-auto max-h-64">
                  <table className="w-full text-sm">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-4 py-2 text-left">Name</th>
                        <th className="px-4 py-2 text-left">Email</th>
                        <th className="px-4 py-2 text-left">Position</th>
                        <th className="px-4 py-2 text-left">Department</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200">
                      {parsedData.slice(0, 10).map((employee, index) => (
                        <tr key={index}>
                          <td className="px-4 py-2">{employee.name}</td>
                          <td className="px-4 py-2">{employee.email}</td>
                          <td className="px-4 py-2">{employee.position}</td>
                          <td className="px-4 py-2">{employee.department}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                  {parsedData.length > 10 && (
                    <div className="px-4 py-2 bg-gray-50 text-center text-sm text-gray-600">
                      ... and {parsedData.length - 10} more employees
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <button
            onClick={onClose}
            className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleImport}
            disabled={!file || !selectedBatch || errors.length > 0 || isProcessing}
            className="px-6 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isProcessing ? 'Importing...' : `Import ${parsedData.length} Employees`}
          </button>
        </div>
      </div>
    </div>
  );
}