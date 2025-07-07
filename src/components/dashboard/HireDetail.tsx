import React from 'react';
import { ArrowLeft, Mail, Phone, Calendar, User, Building, FileText, Clock } from 'lucide-react';
import { useOnboardingStore } from '../../stores/onboarding';
import { ProgressStepper } from '../stepper/ProgressStepper';
import { Button } from '../ui/Button';
import { Badge } from '../ui/Badge';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/Card';
import { cn } from '../../lib/utils';

export const HireDetail: React.FC = () => {
  const { selectedHire, setSelectedHire, toggleSubtask } = useOnboardingStore();

  if (!selectedHire) {
    return null;
  }

  const handleBackClick = () => {
    setSelectedHire(null);
  };

  const handleSubtaskToggle = (stepId: string, subtaskId: string) => {
    toggleSubtask(selectedHire.id, stepId, subtaskId);
  };

  const getStatusColor = (status: typeof selectedHire.status) => {
    switch (status) {
      case 'completed':
        return 'success';
      case 'in_progress':
        return 'info';
      case 'delayed':
        return 'error';
      default:
        return 'neutral';
    }
  };

  const getStatusText = (status: typeof selectedHire.status) => {
    switch (status) {
      case 'completed':
        return 'Completed';
      case 'in_progress':
        return 'In Progress';
      case 'delayed':
        return 'Delayed';
      default:
        return 'Not Started';
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Button
            variant="outline"
            size="sm"
            onClick={handleBackClick}
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Dashboard
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">
              {selectedHire.name}
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              {selectedHire.position} • {selectedHire.department}
            </p>
          </div>
        </div>
        <Badge variant={getStatusColor(selectedHire.status)}>
          {getStatusText(selectedHire.status)}
        </Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Progress Stepper */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Onboarding Progress</CardTitle>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className="bg-gradient-to-r from-success-400 to-success-500 h-2 rounded-full transition-all duration-300"
                  style={{ width: `${selectedHire.overallProgress}%` }}
                />
              </div>
              <p className="text-sm text-gray-600">
                {selectedHire.overallProgress}% complete
              </p>
            </CardHeader>
            <CardContent>
              <ProgressStepper
                steps={selectedHire.steps}
                onSubtaskToggle={handleSubtaskToggle}
              />
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Hire Information */}
        <div className="space-y-6">
          {/* Personal Information */}
          <Card>
            <CardHeader>
              <CardTitle>Personal Information</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="mb-6">
                <h3 className="font-semibold text-gray-900 text-lg">{selectedHire.name}</h3>
                <p className="text-sm text-gray-600">{selectedHire.position}</p>
              </div>
              
              <div className="space-y-4">
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 text-sm">
                    <Mail className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedHire.email}</span>
                  </div>
                  {selectedHire.phone && (
                    <div className="flex items-center space-x-3 text-sm">
                      <Phone className="w-4 h-4 text-gray-400" />
                      <span className="text-gray-600">{selectedHire.phone}</span>
                    </div>
                  )}
                  <div className="flex items-center space-x-3 text-sm">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">
                      Start Date: {selectedHire.startDate.toLocaleDateString()}
                    </span>
                  </div>
                  <div className="flex items-center space-x-3 text-sm">
                    <Building className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-600">{selectedHire.department}</span>
                  </div>
                </div>
                
                {/* System IDs */}
                <div className="pt-4 border-t border-gray-100">
                  <h4 className="font-medium text-gray-900 mb-3">System Information</h4>
                  <div className="grid grid-cols-1 gap-3">
                    {selectedHire.windaId && (
                      <div className="flex items-center space-x-3 text-sm">
                        <FileText className="w-4 h-4 text-blue-400" />
                        <span className="text-gray-500">WINDA ID:</span>
                        <span className="text-gray-700 font-mono">{selectedHire.windaId}</span>
                      </div>
                    )}
                    {selectedHire.sapId && (
                      <div className="flex items-center space-x-3 text-sm">
                        <FileText className="w-4 h-4 text-green-400" />
                        <span className="text-gray-500">SAP ID:</span>
                        <span className="text-gray-700 font-mono">{selectedHire.sapId}</span>
                      </div>
                    )}
                    {selectedHire.employeeId && (
                      <div className="flex items-center space-x-3 text-sm">
                        <User className="w-4 h-4 text-purple-400" />
                        <span className="text-gray-500">Employee ID:</span>
                        <span className="text-gray-700 font-mono">{selectedHire.employeeId}</span>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>


          {/* Progress Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Progress Summary</span>
                <div className="flex items-center space-x-2">
                  {selectedHire.overallProgress === 100 ? (
                    <div className="flex items-center space-x-2 text-green-600">
                      <div className="w-10 h-10 bg-green-500 rounded-full flex items-center justify-center shadow-lg">
                        <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-sm font-semibold">Complete</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-blue-600">
                      <Clock className="w-4 h-4" />
                      <span className="text-sm font-semibold">In Progress</span>
                    </div>
                  )}
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {selectedHire.steps.map((step) => {
                  const completedSubtasks = step.subtasks.filter(s => s.completed).length;
                  const totalSubtasks = step.subtasks.length;
                  const stepProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
                  
                  return (
                    <div key={step.id} className="space-y-2">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-gray-700">{step.title}</span>
                          {stepProgress === 100 && (
                            <div className="w-4 h-4 bg-green-500 rounded-full flex items-center justify-center">
                              <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <span className="text-sm text-gray-500">{Math.round(stepProgress)}%</span>
                      </div>
                      <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
                        <div 
                          className={cn(
                            'h-2 rounded-full transition-all duration-300 relative',
                            stepProgress === 100 
                              ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-sm' 
                              : 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-sm'
                          )}
                          style={{ width: `${stepProgress}%` }}
                        >
                          {/* Glow effect */}
                          {stepProgress > 0 && (
                            <div className={cn(
                              'absolute inset-0 rounded-full opacity-30',
                              stepProgress === 100 ? 'bg-green-300' : 'bg-blue-300'
                            )} />
                          )}
                          
                          {/* Celebration effect for 100% */}
                          {stepProgress === 100 && (
                            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse opacity-50" />
                          )}
                        </div>
                      </div>
                      <div className="text-xs text-gray-500">
                        {completedSubtasks} of {totalSubtasks} tasks completed
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <Card>
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <Button variant="primary" className="w-full">
                  Send Reminder
                </Button>
                <Button variant="outline" className="w-full">
                  Schedule Meeting
                </Button>
                <Button variant="outline" className="w-full">
                  Add Note
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};