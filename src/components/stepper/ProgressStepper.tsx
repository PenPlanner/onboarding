import React, { useState } from 'react';
import { Check, Clock, Circle, FileText, Upload, ChevronDown, ChevronRight } from 'lucide-react';
import type { OnboardingStep } from '../../types/index.js';
import { Badge } from '../ui/Badge';
import { cn } from '../../lib/utils';

interface ProgressStepperProps {
  steps: OnboardingStep[];
  onStepClick?: (step: OnboardingStep) => void;
  onSubtaskToggle?: (stepId: string, subtaskId: string) => void;
}

export const ProgressStepper: React.FC<ProgressStepperProps> = ({
  steps,
  onStepClick,
  onSubtaskToggle
}) => {
  const completedStepCount = steps.filter(step => step.status === 'completed').length;
  const totalSteps = steps.length;
  
  // State to track which steps are expanded (default: completed steps are collapsed, others are expanded)
  const [expandedSteps, setExpandedSteps] = useState<Record<string, boolean>>(() => {
    const initial: Record<string, boolean> = {};
    steps.forEach(step => {
      initial[step.id] = step.status !== 'completed'; // Completed steps start collapsed
    });
    return initial;
  });

  const toggleStepExpansion = (stepId: string) => {
    setExpandedSteps(prev => ({
      ...prev,
      [stepId]: !prev[stepId]
    }));
  };

  return (
    <div className="bg-white rounded-2xl p-8 border border-gray-200/50">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold text-gray-900">Onboarding Progress</h3>
          <span className="text-sm text-gray-500">
            {completedStepCount} of {totalSteps} completed
          </span>
        </div>
        
        {/* Main Progress Line */}
        <div className="relative h-4 bg-gray-200 rounded-full overflow-hidden shadow-inner">
          <div 
            className="absolute top-0 left-0 h-4 bg-gradient-to-r from-green-400 via-green-500 to-green-600 rounded-full transition-all duration-700 ease-out shadow-lg relative"
            style={{ width: `${(completedStepCount / totalSteps) * 100}%` }}
          >
            {/* Progress glow effect */}
            {completedStepCount > 0 && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-300 to-green-400 rounded-full opacity-40" />
            )}
            
            {/* Multiple shine effects */}
            {completedStepCount > 0 && (
              <>
                <div className="absolute top-0 left-0 w-full h-1.5 bg-white opacity-50 rounded-full" />
                <div className="absolute top-1 left-0 w-3/4 h-0.5 bg-white opacity-30 rounded-full" />
              </>
            )}
            
            {/* Animated progress indicator */}
            {completedStepCount < totalSteps && completedStepCount > 0 && (
              <div className="absolute top-0 right-0 w-1 h-4 bg-white opacity-60 animate-pulse" />
            )}
          </div>
          
          {/* 100% completion celebration */}
          {completedStepCount === totalSteps && (
            <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse opacity-30" />
          )}
          
          {/* Step markers on the line */}
          {steps.map((step, index) => {
            // Position markers with padding from edges to prevent cutoff
            const position = 10 + (index / (totalSteps - 1)) * 80; // 10% to 90% range
            return (
              <div
                key={step.id}
                className="absolute top-1/2 transform -translate-y-1/2 -translate-x-1/2 z-10"
                style={{ left: `${position}%` }}
              >
                <div className={cn(
                  'w-8 h-8 rounded-full border-2 bg-white flex items-center justify-center transition-all duration-300 shadow-lg',
                  step.status === 'completed' 
                    ? 'border-green-500 bg-green-500 shadow-green-200' 
                    : step.status === 'in_progress'
                    ? 'border-blue-500 bg-blue-500 shadow-blue-200'
                    : 'border-gray-300 shadow-gray-200'
                )}>
                  {step.status === 'completed' && (
                    <Check className="w-4 h-4 text-white font-bold" strokeWidth={3} />
                  )}
                  {step.status === 'in_progress' && (
                    <div className="w-3 h-3 bg-white rounded-full animate-pulse" />
                  )}
                  {step.status === 'pending' && (
                    <div className="w-2 h-2 bg-gray-400 rounded-full" />
                  )}
                </div>
                
                {/* Step label below marker */}
                <div className="absolute top-10 left-1/2 transform -translate-x-1/2 text-xs text-gray-600 font-medium whitespace-nowrap">
                  {step.title.split(' ')[0]}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Step Categories */}
      <div className="space-y-6">
        {steps.map((step, index) => {
          const completedSubtasks = step.subtasks.filter(s => s.completed).length;
          const totalSubtasks = step.subtasks.length;
          const stepProgress = totalSubtasks > 0 ? (completedSubtasks / totalSubtasks) * 100 : 0;
          
          return (
            <div key={step.id} className="relative">
              {/* Step Header - Clickable */}
              <div 
                className="flex items-center space-x-4 mb-4 cursor-pointer hover:bg-gray-50 rounded-lg p-2 -m-2 transition-colors"
                onClick={() => toggleStepExpansion(step.id)}
              >
                <div className={cn(
                  'w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all duration-300',
                  step.status === 'completed' 
                    ? 'border-green-500 bg-green-500' 
                    : step.status === 'in_progress'
                    ? 'border-blue-500 bg-blue-500'
                    : 'border-gray-300 bg-white'
                )}>
                  {step.status === 'completed' && (
                    <Check className="w-5 h-5 text-white" />
                  )}
                  {step.status === 'in_progress' && (
                    <Clock className="w-5 h-5 text-white" />
                  )}
                  {step.status === 'pending' && (
                    <span className="text-sm font-medium text-gray-500">{index + 1}</span>
                  )}
                </div>
                
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <h4 
                        className={cn(
                          'text-base font-medium transition-colors',
                          step.status === 'completed' ? 'text-green-700' :
                          step.status === 'in_progress' ? 'text-blue-700' : 'text-gray-700'
                        )}
                      >
                        {step.title}
                      </h4>
                      <button
                        className="text-gray-400 hover:text-gray-600 transition-colors"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleStepExpansion(step.id);
                        }}
                      >
                        {expandedSteps[step.id] ? (
                          <ChevronDown className="w-4 h-4" />
                        ) : (
                          <ChevronRight className="w-4 h-4" />
                        )}
                      </button>
                    </div>
                    <div className="flex items-center space-x-2">
                      <div className="flex items-center space-x-2">
                        <div className={cn(
                          'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white',
                          step.status === 'completed' ? 'bg-green-500' :
                          step.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                        )}>
                          {step.responsiblePerson.initials}
                        </div>
                        <span className="text-xs text-gray-600">{step.responsiblePerson.role}</span>
                      </div>
                      <Badge 
                        variant={step.status === 'completed' ? 'success' : 
                                step.status === 'in_progress' ? 'info' : 'neutral'}
                      >
                        {step.status === 'completed' ? 'Complete' :
                         step.status === 'in_progress' ? 'In Progress' : 'Pending'}
                      </Badge>
                      {step.dueDate && (
                        <Badge variant="warning">
                          Due {step.dueDate.toLocaleDateString()}
                        </Badge>
                      )}
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-600 mt-1">{step.description}</p>
                  
                  {/* Step Progress Bar */}
                  <div className="mt-2">
                    <div className="flex items-center justify-between text-xs text-gray-500 mb-1">
                      <span>{completedSubtasks} of {totalSubtasks} tasks</span>
                      <span>{Math.round(stepProgress)}%</span>
                    </div>
                    <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className={cn(
                          'h-2 rounded-full transition-all duration-300 relative',
                          step.status === 'completed' ? 'bg-gradient-to-r from-green-400 to-green-500 shadow-sm' : 'bg-gradient-to-r from-blue-400 to-blue-500 shadow-sm'
                        )}
                        style={{ width: `${stepProgress}%` }}
                      >
                        {/* Mini glow effect */}
                        {stepProgress > 0 && (
                          <div className={cn(
                            'absolute inset-0 rounded-full opacity-30',
                            step.status === 'completed' ? 'bg-green-300' : 'bg-blue-300'
                          )} />
                        )}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              {/* Subtasks - Collapsible */}
              {expandedSteps[step.id] && (
                <div className="ml-14 space-y-3 animate-in slide-in-from-top duration-200">
                  {step.subtasks.map((subtask) => (
                  <div 
                    key={subtask.id} 
                    className="p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors border border-gray-200"
                  >
                    <div className="flex items-start space-x-3">
                      <input
                        type="checkbox"
                        checked={subtask.completed}
                        onChange={() => onSubtaskToggle?.(step.id, subtask.id)}
                        className="h-4 w-4 text-green-600 rounded border-gray-300 focus:ring-green-500 mt-0.5"
                      />
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center justify-between mb-2">
                          <span className={cn(
                            'text-sm font-medium',
                            subtask.completed ? 'line-through text-gray-500' : 'text-gray-700'
                          )}>
                            {subtask.title}
                          </span>
                          <div className="flex items-center space-x-2">
                            {subtask.requiresFile && (
                              <FileText className="w-4 h-4 text-blue-500" />
                            )}
                            {subtask.priority === 'high' && (
                              <Badge variant="error" className="text-xs">High Priority</Badge>
                            )}
                          </div>
                        </div>
                        
                        {/* Completion date */}
                        {subtask.completedAt && (
                          <div className="flex items-center space-x-1 text-xs text-green-600 mb-2">
                            <Check className="w-3 h-3" />
                            <span>Completed {subtask.completedAt.toLocaleDateString()} at {subtask.completedAt.toLocaleTimeString()}</span>
                          </div>
                        )}
                        
                        {/* File upload section */}
                        {subtask.requiresFile && (
                          <div className="mt-2 p-2 bg-white rounded border border-gray-200">
                            {subtask.uploadedFile ? (
                              <div className="flex items-center space-x-2">
                                <div className="w-6 h-6 bg-green-100 rounded flex items-center justify-center">
                                  <Check className="w-4 h-4 text-green-600" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <p className="text-xs font-medium text-gray-900 truncate">
                                    {subtask.uploadedFile.name}
                                  </p>
                                  <p className="text-xs text-gray-500">
                                    {subtask.uploadedFile.size} • Uploaded {subtask.uploadedFile.uploadedAt.toLocaleDateString()}
                                  </p>
                                </div>
                                <div className="w-6 h-6 bg-blue-100 rounded flex items-center justify-center">
                                  {subtask.uploadedFile.type === 'pdf' && (
                                    <FileText className="w-4 h-4 text-blue-600" />
                                  )}
                                </div>
                              </div>
                            ) : (
                              <div className="flex items-center space-x-2 text-gray-500">
                                <Upload className="w-4 h-4" />
                                <span className="text-xs">File upload required</span>
                              </div>
                            )}
                          </div>
                        )}
                        
                        {/* Due date */}
                        {subtask.dueDate && (
                          <div className="text-xs text-gray-500 mt-2">
                            Due: {subtask.dueDate.toLocaleDateString()}
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};