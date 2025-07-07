import React from 'react';
import { Calendar, Clock, CheckCircle, AlertCircle } from 'lucide-react';
import type { NewHire } from '../../types/index.js';
import { cn } from '../../lib/utils';

interface HireCardProps {
  hire: NewHire;
  onClick?: () => void;
}

export const HireCard: React.FC<HireCardProps> = ({ hire, onClick }) => {
  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const completedSteps = hire.steps.filter(step => step.status === 'completed').length;
  const totalSteps = hire.steps.length;

  const nextStep = hire.steps.find(step => step.status === 'in_progress') || 
                   hire.steps.find(step => step.status === 'pending');

  const today = new Date();
  const startDate = new Date(2025, 7, 12); // August 12, 2025
  const daysUntilStart = Math.ceil((startDate.getTime() - today.getTime()) / (1000 * 3600 * 24));

  return (
    <div 
      className={cn(
        'bg-white rounded-xl p-5 border border-gray-200/50 cursor-pointer hover:shadow-lg transition-all duration-200 hover:border-gray-300 group'
      )}
      onClick={onClick}
    >
      <div className="flex items-center space-x-4">
        {/* Initials Only */}
        <div className="relative">
          <div className={cn(
            'w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-sm shadow-sm',
            hire.status === 'completed' ? 'bg-green-500' :
            hire.status === 'in_progress' ? 'bg-blue-500' :
            hire.status === 'delayed' ? 'bg-red-500' : 'bg-gray-400'
          )}>
            {getInitials(hire.name)}
          </div>
          {/* Status indicator */}
          <div className="absolute -bottom-1 -right-1">
            {hire.status === 'completed' && (
              <CheckCircle className="w-4 h-4 text-green-500 bg-white rounded-full" />
            )}
            {hire.status === 'in_progress' && (
              <Clock className="w-4 h-4 text-blue-500 bg-white rounded-full p-0.5" />
            )}
            {hire.status === 'delayed' && (
              <AlertCircle className="w-4 h-4 text-red-500 bg-white rounded-full" />
            )}
          </div>
        </div>
        
        {/* Main Info */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center justify-between mb-2">
            <div>
              <h3 className="font-semibold text-gray-900 truncate group-hover:text-blue-600 transition-colors">
                {hire.name}
              </h3>
              <p className="text-sm text-gray-600">{hire.position}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-bold text-gray-900">{hire.overallProgress}%</div>
              <div className="text-xs text-gray-500">complete</div>
            </div>
          </div>
          
          {/* Progress Bar with gradient and glow */}
          <div className="w-full bg-gray-200 rounded-full h-3 mb-3 overflow-hidden relative">
            <div 
              className={cn(
                'h-3 rounded-full transition-all duration-500 ease-out relative',
                hire.status === 'completed' ? 'bg-gradient-to-r from-green-400 via-green-500 to-green-600 shadow-md' :
                hire.status === 'in_progress' ? 'bg-gradient-to-r from-blue-400 via-blue-500 to-blue-600 shadow-md' :
                hire.status === 'delayed' ? 'bg-gradient-to-r from-red-400 via-red-500 to-red-600 shadow-md' : 'bg-gradient-to-r from-gray-400 to-gray-500'
              )}
              style={{ width: `${hire.overallProgress}%` }}
            >
              {/* Progress glow effect */}
              {hire.overallProgress > 0 && (
                <div className={cn(
                  'absolute inset-0 rounded-full opacity-30',
                  hire.status === 'completed' ? 'bg-gradient-to-r from-green-300 to-green-400' :
                  hire.status === 'in_progress' ? 'bg-gradient-to-r from-blue-300 to-blue-400' :
                  hire.status === 'delayed' ? 'bg-gradient-to-r from-red-300 to-red-400' : 'bg-gray-300'
                )} />
              )}
              
              {/* Shine effect */}
              {hire.overallProgress > 10 && (
                <div className="absolute top-0 left-0 w-full h-1 bg-white opacity-40 rounded-full" />
              )}
            </div>
            
            {/* 100% celebration effect */}
            {hire.overallProgress === 100 && (
              <div className="absolute inset-0 bg-gradient-to-r from-green-400 to-green-500 rounded-full animate-pulse opacity-50" />
            )}
          </div>
          
          {/* Bottom row with details */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4 text-xs text-gray-500">
              <span className="flex items-center space-x-1">
                <CheckCircle className="w-3 h-3" />
                <span>{completedSteps}/{totalSteps} steps</span>
              </span>
              <span className="flex items-center space-x-1">
                <Calendar className="w-3 h-3" />
                <span>Start {daysUntilStart > 0 ? `in ${daysUntilStart}d` : 'today'}</span>
              </span>
            </div>
            {nextStep && (
              <div className="text-xs text-gray-600 max-w-40">
                <div className="truncate">Next: {nextStep.title}</div>
                <div className="text-xs text-gray-500">
                  Assigned: {nextStep.responsiblePerson.initials} ({nextStep.responsiblePerson.role})
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step details with responsible persons */}
      <div className="mt-4 pt-3 border-t border-gray-100">
        {/* Mini step indicators */}
        <div className="flex items-center space-x-1 mb-3">
          {hire.steps.map((step) => (
            <div
              key={step.id}
              className={cn(
                'flex-1 h-1.5 rounded-full transition-all duration-300',
                step.status === 'completed' ? 'bg-green-500' :
                step.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-200'
              )}
              title={`${step.title} - ${step.responsiblePerson.initials} (${step.responsiblePerson.role})`}
            />
          ))}
        </div>
        
        {/* Responsible persons with status */}
        <div className="grid grid-cols-2 gap-2">
          {hire.steps.map((step) => (
            <div key={step.id} className="flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <div className={cn(
                  'w-6 h-6 rounded-full flex items-center justify-center text-xs font-semibold text-white',
                  step.status === 'completed' ? 'bg-green-500' :
                  step.status === 'in_progress' ? 'bg-blue-500' : 'bg-gray-400'
                )}>
                  {step.responsiblePerson.initials}
                </div>
                <span className="text-gray-600 truncate max-w-20" title={step.responsiblePerson.role}>
                  {step.responsiblePerson.role}
                </span>
              </div>
              <span className={cn(
                'text-xs font-medium px-1.5 py-0.5 rounded',
                step.status === 'completed' ? 'text-green-700 bg-green-100' :
                step.status === 'in_progress' ? 'text-blue-700 bg-blue-100' : 'text-gray-600 bg-gray-100'
              )}>
                {step.status === 'completed' ? 'Completed' :
                 step.status === 'in_progress' ? 'In Progress' : 'Pending'}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};