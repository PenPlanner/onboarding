import { create } from 'zustand';
import type { OnboardingBatch, NewHire, OnboardingStep, Subtask } from '../types/index.js';

interface OnboardingState {
  currentBatch: OnboardingBatch | null;
  batches: OnboardingBatch[];
  selectedHire: NewHire | null;
  
  // Actions
  setCurrentBatch: (batch: OnboardingBatch) => void;
  addBatch: (batch: OnboardingBatch) => void;
  updateHire: (hireId: string, updates: Partial<NewHire>) => void;
  updateStep: (hireId: string, stepId: string, updates: Partial<OnboardingStep>) => void;
  toggleSubtask: (hireId: string, stepId: string, subtaskId: string) => void;
  setSelectedHire: (hire: NewHire | null) => void;
  calculateOverallProgress: (hireId: string) => void;
}

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  currentBatch: null,
  batches: [],
  selectedHire: null,

  setCurrentBatch: (batch) => set({ currentBatch: batch }),
  
  addBatch: (batch) => set((state) => ({ 
    batches: [...state.batches, batch] 
  })),

  updateHire: (hireId, updates) => set((state) => ({
    currentBatch: state.currentBatch ? {
      ...state.currentBatch,
      hires: state.currentBatch.hires.map(hire => 
        hire.id === hireId ? { ...hire, ...updates } : hire
      )
    } : null
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