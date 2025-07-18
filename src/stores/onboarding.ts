import { create } from 'zustand';
import type { OnboardingBatch, NewHire, OnboardingStep } from '../types/index.js';
import { mockBatch } from '../lib/mockData';

interface OnboardingState {
  currentBatch: OnboardingBatch | null;
  batches: OnboardingBatch[];
  selectedHire: NewHire | null;
  
  // Actions
  setCurrentBatch: (batch: OnboardingBatch) => void;
  addBatch: (batch: OnboardingBatch) => void;
  deleteBatch: (batchId: string) => void;
  addHire: (batchId: string, hire: NewHire) => void;
  updateHire: (batchId: string, hire: NewHire) => void;
  deleteHire: (batchId: string, hireId: string) => void;
  updateStep: (hireId: string, stepId: string, updates: Partial<OnboardingStep>) => void;
  toggleSubtask: (hireId: string, stepId: string, subtaskId: string) => void;
  setSelectedHire: (hire: NewHire | null) => void;
  calculateOverallProgress: (hireId: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentBatch: mockBatch,
  batches: [mockBatch],
  selectedHire: null,

  setCurrentBatch: (batch) => set({ currentBatch: batch }),
  
  addBatch: (batch) => set((state) => ({ 
    batches: [...state.batches, batch] 
  })),

  deleteBatch: (batchId) => set((state) => ({
    batches: state.batches.filter(batch => batch.id !== batchId),
    currentBatch: state.currentBatch?.id === batchId ? null : state.currentBatch
  })),

  addHire: (batchId, hire) => set((state) => ({
    batches: state.batches.map(batch => 
      batch.id === batchId ? {
        ...batch,
        hires: [...batch.hires, hire],
        totalHires: batch.totalHires + 1
      } : batch
    ),
    currentBatch: state.currentBatch?.id === batchId ? {
      ...state.currentBatch,
      hires: [...state.currentBatch.hires, hire],
      totalHires: state.currentBatch.totalHires + 1
    } : state.currentBatch
  })),

  updateHire: (batchId, hire) => set((state) => ({
    batches: state.batches.map(batch => 
      batch.id === batchId ? {
        ...batch,
        hires: batch.hires.map(h => h.id === hire.id ? hire : h)
      } : batch
    ),
    currentBatch: state.currentBatch?.id === batchId ? {
      ...state.currentBatch,
      hires: state.currentBatch.hires.map(h => h.id === hire.id ? hire : h)
    } : state.currentBatch
  })),

  deleteHire: (batchId, hireId) => set((state) => ({
    batches: state.batches.map(batch => 
      batch.id === batchId ? {
        ...batch,
        hires: batch.hires.filter(h => h.id !== hireId)
      } : batch
    ),
    currentBatch: state.currentBatch?.id === batchId ? {
      ...state.currentBatch,
      hires: state.currentBatch.hires.filter(h => h.id !== hireId)
    } : state.currentBatch
  })),

  updateStep: (hireId, stepId, updates) => set((state) => ({
    currentBatch: state.currentBatch ? {
      ...state.currentBatch,
      hires: state.currentBatch.hires.map(hire => 
        hire.id === hireId ? {
          ...hire,
          steps: hire.steps.map(step => 
            step.id === stepId ? { ...step, ...updates } : step
          )
        } : hire
      )
    } : null
  })),

  toggleSubtask: (hireId, stepId, subtaskId) => set((state) => {
    const newState = {
      currentBatch: state.currentBatch ? {
        ...state.currentBatch,
        hires: state.currentBatch.hires.map(hire => 
          hire.id === hireId ? {
            ...hire,
            steps: hire.steps.map(step => 
              step.id === stepId ? {
                ...step,
                subtasks: step.subtasks.map(subtask => 
                  subtask.id === subtaskId ? { 
                    ...subtask, 
                    completed: !subtask.completed,
                    completedAt: !subtask.completed ? new Date() : undefined
                  } : subtask
                )
              } : step
            )
          } : hire
        )
      } : null,
      selectedHire: state.selectedHire && state.selectedHire.id === hireId ? {
        ...state.selectedHire,
        steps: state.selectedHire.steps.map(step => 
          step.id === stepId ? {
            ...step,
            subtasks: step.subtasks.map(subtask => 
              subtask.id === subtaskId ? { 
                ...subtask, 
                completed: !subtask.completed,
                completedAt: !subtask.completed ? new Date() : undefined
              } : subtask
            )
          } : step
        )
      } : state.selectedHire
    };
    
    // Update step status based on subtask completion
    const updatedBatch = newState.currentBatch;
    if (updatedBatch) {
      const hire = updatedBatch.hires.find(h => h.id === hireId);
      if (hire) {
        const step = hire.steps.find(s => s.id === stepId);
        if (step) {
          const completedSubtasks = step.subtasks.filter(s => s.completed).length;
          const totalSubtasks = step.subtasks.length;
          
          if (completedSubtasks === totalSubtasks) {
            step.status = 'completed';
          } else if (completedSubtasks > 0) {
            step.status = 'in_progress';
          } else {
            step.status = 'pending';
          }
          
          // Also update selectedHire if it's the same hire
          if (newState.selectedHire && newState.selectedHire.id === hireId) {
            const selectedStep = newState.selectedHire.steps.find(s => s.id === stepId);
            if (selectedStep) {
              selectedStep.status = step.status;
            }
          }
        }
      }
    }
    
    // Recalculate progress after toggling
    setTimeout(() => get().calculateOverallProgress(hireId), 0);
    
    return newState;
  }),

  setSelectedHire: (hire) => set({ selectedHire: hire }),

  calculateOverallProgress: (hireId) => set((state) => {
    if (!state.currentBatch) return state;
    
    const hire = state.currentBatch.hires.find(h => h.id === hireId);
    if (!hire) return state;

    const totalSubtasks = hire.steps.reduce((acc, step) => acc + step.subtasks.length, 0);
    const completedSubtasks = hire.steps.reduce((acc, step) => 
      acc + step.subtasks.filter(subtask => subtask.completed).length, 0
    );
    
    const progress = totalSubtasks > 0 ? Math.round((completedSubtasks / totalSubtasks) * 100) : 0;
    
    return {
      currentBatch: {
        ...state.currentBatch,
        hires: state.currentBatch.hires.map(h => 
          h.id === hireId ? { ...h, overallProgress: progress } : h
        )
      },
      selectedHire: state.selectedHire && state.selectedHire.id === hireId ? {
        ...state.selectedHire,
        overallProgress: progress
      } : state.selectedHire
    };
  })
}));