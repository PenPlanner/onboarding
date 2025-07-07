import { useState } from 'react';
import { Plus, Edit2, Trash2, Save, X, GripVertical, ChevronDown, ChevronUp } from 'lucide-react';
import type { OnboardingStep, Subtask, StepCategory } from '../../types';

const defaultStepTemplates: OnboardingStep[] = [
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Complete all required paperwork and documentation',
    status: 'pending',
    category: 'documents',
    hasFileUpload: true,
    responsiblePerson: { initials: 'HR', name: 'HR Department', role: 'HR Manager' },
    subtasks: [
      { id: '1', title: 'Sign employment contract', completed: false, priority: 'high', requiresFile: true },
      { id: '2', title: 'Submit tax forms', completed: false, priority: 'medium', requiresFile: true },
      { id: '3', title: 'Emergency contact info', completed: false, priority: 'medium' },
      { id: '4', title: 'Bank account details', completed: false, priority: 'high' }
    ]
  },
  {
    id: 'security',
    title: 'Security & Access',
    description: 'Set up security clearances and access credentials',
    status: 'pending',
    category: 'security',
    hasFileUpload: false,
    responsiblePerson: { initials: 'IT', name: 'IT Support', role: 'IT Support' },
    subtasks: [
      { id: '1', title: 'Create Winda ID', completed: false, priority: 'high' },
      { id: '2', title: 'Issue access badge', completed: false, priority: 'high' },
      { id: '3', title: 'Create SAP account', completed: false, priority: 'medium' },
      { id: '4', title: 'VPN setup', completed: false, priority: 'low' }
    ]
  },
  {
    id: 'training',
    title: 'Training & Certification',
    description: 'Complete required training courses and certifications',
    status: 'pending',
    category: 'training',
    hasFileUpload: true,
    responsiblePerson: { initials: 'TC', name: 'Training Coordinator', role: 'Training Coordinator' },
    subtasks: [
      { id: '1', title: 'GWO Basic Safety Training', completed: false, priority: 'high', requiresFile: true },
      { id: '2', title: 'Working at Heights', completed: false, priority: 'high', requiresFile: true },
      { id: '3', title: 'First Aid certification', completed: false, priority: 'high', requiresFile: true },
      { id: '4', title: 'Company orientation', completed: false, priority: 'medium' }
    ]
  },
  {
    id: 'equipment',
    title: 'Equipment & Tools',
    description: 'Receive and set up work equipment',
    status: 'pending',
    category: 'equipment',
    hasFileUpload: false,
    responsiblePerson: { initials: 'FS', name: 'Field Supervisor', role: 'Field Supervisor' },
    subtasks: [
      { id: '1', title: 'Safety equipment issued', completed: false, priority: 'high' },
      { id: '2', title: 'Laptop/tablet setup', completed: false, priority: 'medium' },
      { id: '3', title: 'Tools inventory check', completed: false, priority: 'medium' },
      { id: '4', title: 'Vehicle assignment', completed: false, priority: 'low' }
    ]
  }
];

export function TemplateEditor() {
  const [templates, setTemplates] = useState<OnboardingStep[]>(defaultStepTemplates);
  const [editingStep, setEditingStep] = useState<string | null>(null);
  const [expandedSteps, setExpandedSteps] = useState<string[]>([]);
  const [showAddStep, setShowAddStep] = useState(false);

  const toggleExpanded = (stepId: string) => {
    setExpandedSteps(prev => 
      prev.includes(stepId) 
        ? prev.filter(id => id !== stepId)
        : [...prev, stepId]
    );
  };

  const updateStep = (stepId: string, updates: Partial<OnboardingStep>) => {
    setTemplates(prev => 
      prev.map(step => step.id === stepId ? { ...step, ...updates } : step)
    );
  };

  const deleteStep = (stepId: string) => {
    if (confirm('Are you sure you want to delete this step template?')) {
      setTemplates(prev => prev.filter(step => step.id !== stepId));
    }
  };

  const addSubtask = (stepId: string) => {
    const newSubtask: Subtask = {
      id: `subtask-${Date.now()}`,
      title: 'New subtask',
      completed: false,
      priority: 'medium'
    };
    
    setTemplates(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, subtasks: [...step.subtasks, newSubtask] }
          : step
      )
    );
  };

  const updateSubtask = (stepId: string, subtaskId: string, updates: Partial<Subtask>) => {
    setTemplates(prev => 
      prev.map(step => 
        step.id === stepId 
          ? {
              ...step,
              subtasks: step.subtasks.map(subtask => 
                subtask.id === subtaskId ? { ...subtask, ...updates } : subtask
              )
            }
          : step
      )
    );
  };

  const deleteSubtask = (stepId: string, subtaskId: string) => {
    setTemplates(prev => 
      prev.map(step => 
        step.id === stepId 
          ? { ...step, subtasks: step.subtasks.filter(st => st.id !== subtaskId) }
          : step
      )
    );
  };

  const categoryColors: Record<StepCategory, string> = {
    documents: 'text-blue-600 bg-blue-50',
    security: 'text-purple-600 bg-purple-50',
    training: 'text-green-600 bg-green-50',
    equipment: 'text-orange-600 bg-orange-50',
    orientation: 'text-pink-600 bg-pink-50'
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-gray-900">Template Editor</h1>
        <p className="text-gray-600 mt-1">Customize onboarding steps and subtasks for new hires</p>
      </div>

      {/* Action buttons */}
      <div className="mb-6 flex items-center justify-between">
        <button
          onClick={() => setShowAddStep(true)}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors"
        >
          <Plus size={20} />
          Add Step
        </button>
        <button
          className="flex items-center gap-2 px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors"
        >
          <Save size={20} />
          Save Templates
        </button>
      </div>

      {/* Steps list */}
      <div className="space-y-4">
        {templates.map((step) => (
          <div key={step.id} className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4 flex-1">
                  <GripVertical className="text-gray-400 mt-1 cursor-move" size={20} />
                  <div className="flex-1">
                    {editingStep === step.id ? (
                      <div className="space-y-4">
                        <input
                          type="text"
                          value={step.title}
                          onChange={(e) => updateStep(step.id, { title: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <textarea
                          value={step.description}
                          onChange={(e) => updateStep(step.id, { description: e.target.value })}
                          className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          rows={2}
                        />
                        <div className="flex gap-4">
                          <select
                            value={step.category}
                            onChange={(e) => updateStep(step.id, { category: e.target.value as StepCategory })}
                            className="px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                          >
                            <option value="documents">Documents</option>
                            <option value="security">Security</option>
                            <option value="training">Training</option>
                            <option value="equipment">Equipment</option>
                            <option value="orientation">Orientation</option>
                          </select>
                          <label className="flex items-center gap-2">
                            <input
                              type="checkbox"
                              checked={step.hasFileUpload}
                              onChange={(e) => updateStep(step.id, { hasFileUpload: e.target.checked })}
                              className="rounded border-gray-300"
                            />
                            <span className="text-sm">Requires file upload</span>
                          </label>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-gray-900">{step.title}</h3>
                          <span className={`px-2 py-1 text-xs font-medium rounded-full ${categoryColors[step.category]}`}>
                            {step.category}
                          </span>
                          {step.hasFileUpload && (
                            <span className="px-2 py-1 text-xs font-medium text-gray-600 bg-gray-100 rounded-full">
                              File upload required
                            </span>
                          )}
                        </div>
                        <p className="text-gray-600">{step.description}</p>
                        <div className="mt-2 text-sm text-gray-500">
                          Responsible: {step.responsiblePerson.name} ({step.responsiblePerson.role})
                        </div>
                      </>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {editingStep === step.id ? (
                    <>
                      <button
                        onClick={() => setEditingStep(null)}
                        className="p-2 text-green-600 hover:bg-green-50 rounded-lg transition-colors"
                      >
                        <Save size={18} />
                      </button>
                      <button
                        onClick={() => setEditingStep(null)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <X size={18} />
                      </button>
                    </>
                  ) : (
                    <>
                      <button
                        onClick={() => toggleExpanded(step.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        {expandedSteps.includes(step.id) ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
                      </button>
                      <button
                        onClick={() => setEditingStep(step.id)}
                        className="p-2 text-gray-600 hover:bg-gray-100 rounded-lg transition-colors"
                      >
                        <Edit2 size={18} />
                      </button>
                      <button
                        onClick={() => deleteStep(step.id)}
                        className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </>
                  )}
                </div>
              </div>

              {/* Subtasks */}
              {expandedSteps.includes(step.id) && (
                <div className="mt-6 pl-9">
                  <div className="flex items-center justify-between mb-3">
                    <h4 className="text-sm font-medium text-gray-700">Subtasks ({step.subtasks.length})</h4>
                    <button
                      onClick={() => addSubtask(step.id)}
                      className="text-sm text-primary-600 hover:text-primary-700 flex items-center gap-1"
                    >
                      <Plus size={16} />
                      Add subtask
                    </button>
                  </div>
                  <div className="space-y-2">
                    {step.subtasks.map((subtask) => (
                      <div key={subtask.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                        <input
                          type="text"
                          value={subtask.title}
                          onChange={(e) => updateSubtask(step.id, subtask.id, { title: e.target.value })}
                          className="flex-1 px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        />
                        <select
                          value={subtask.priority}
                          onChange={(e) => updateSubtask(step.id, subtask.id, { priority: e.target.value as 'low' | 'medium' | 'high' })}
                          className="px-3 py-1 bg-white border border-gray-300 rounded text-sm focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                        >
                          <option value="low">Low</option>
                          <option value="medium">Medium</option>
                          <option value="high">High</option>
                        </select>
                        <label className="flex items-center gap-2">
                          <input
                            type="checkbox"
                            checked={subtask.requiresFile || false}
                            onChange={(e) => updateSubtask(step.id, subtask.id, { requiresFile: e.target.checked })}
                            className="rounded border-gray-300"
                          />
                          <span className="text-sm">File</span>
                        </label>
                        <button
                          onClick={() => deleteSubtask(step.id, subtask.id)}
                          className="p-1 text-gray-600 hover:text-red-600 transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Add Step Modal */}
      {showAddStep && (
        <AddStepModal
          onClose={() => setShowAddStep(false)}
          onAdd={(newStep) => {
            setTemplates(prev => [...prev, { ...newStep, id: `step-${Date.now()}` }]);
            setShowAddStep(false);
          }}
        />
      )}
    </div>
  );
}

function AddStepModal({ onClose, onAdd }: { onClose: () => void; onAdd: (step: Omit<OnboardingStep, 'id'>) => void }) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<StepCategory>('documents');
  const [hasFileUpload, setHasFileUpload] = useState(false);
  const [responsibleRole, setResponsibleRole] = useState('HR Manager');

  const handleSubmit = () => {
    if (!title || !description) return;

    onAdd({
      title,
      description,
      status: 'pending',
      category,
      hasFileUpload,
      responsiblePerson: {
        initials: responsibleRole.split(' ').map(w => w[0]).join(''),
        name: responsibleRole,
        role: responsibleRole as any
      },
      subtasks: []
    });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl p-6 w-full max-w-md">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Add New Step</h2>
        
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              placeholder="e.g., Background Check"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              rows={3}
              placeholder="Describe the step..."
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value as StepCategory)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="documents">Documents</option>
                <option value="security">Security</option>
                <option value="training">Training</option>
                <option value="equipment">Equipment</option>
                <option value="orientation">Orientation</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Responsible</label>
              <select
                value={responsibleRole}
                onChange={(e) => setResponsibleRole(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
              >
                <option value="HR Manager">HR Manager</option>
                <option value="IT Support">IT Support</option>
                <option value="Training Coordinator">Training Coordinator</option>
                <option value="Field Supervisor">Field Supervisor</option>
                <option value="Admin">Admin</option>
              </select>
            </div>
          </div>

          <label className="flex items-center gap-2">
            <input
              type="checkbox"
              checked={hasFileUpload}
              onChange={(e) => setHasFileUpload(e.target.checked)}
              className="rounded border-gray-300"
            />
            <span className="text-sm text-gray-700">Requires file upload</span>
          </label>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            disabled={!title || !description}
            className="flex-1 px-4 py-2 bg-primary-600 text-white rounded-lg hover:bg-primary-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Step
          </button>
        </div>
      </div>
    </div>
  );
}