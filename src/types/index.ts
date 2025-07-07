export interface Subtask {
  id: string;
  title: string;
  completed: boolean;
  completedAt?: Date;
  dueDate?: Date;
  priority: 'low' | 'medium' | 'high';
  requiresFile?: boolean;
  uploadedFile?: {
    name: string;
    type: string;
    uploadedAt: Date;
    size: string;
  };
}

export interface ResponsiblePerson {
  initials: string;
  name: string;
  role: 'Admin' | 'Field Supervisor' | 'Training Coordinator' | 'Recruiter' | 'HR Manager' | 'IT Support';
}

export interface OnboardingStep {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  subtasks: Subtask[];
  category: 'documents' | 'security' | 'training' | 'equipment' | 'orientation';
  dueDate?: Date;
  assignedTo?: string;
  responsiblePerson: ResponsiblePerson;
  hasFileUpload: boolean;
  uploadedFiles?: string[];
}

export interface CourseRecord {
  courseName: string;
  completionDate: Date;
  certificate?: string;
  validUntil?: Date;
}

export interface NewHire {
  id: string;
  name: string;
  position: string;
  department: string;
  startDate: Date;
  email: string;
  phone?: string;
  photoUrl: string;
  windaId?: string;
  sapId?: string;
  employeeId?: string;
  previousCourses: CourseRecord[];
  steps: OnboardingStep[];
  overallProgress: number;
  status: 'not_started' | 'in_progress' | 'completed' | 'delayed';
}

export interface OnboardingBatch {
  id: string;
  title: string;
  month: string;
  year: number;
  hires: NewHire[];
  totalHires: number;
  completedHires: number;
  createdAt: string;
}

export type StepCategory = 'documents' | 'security' | 'training' | 'equipment' | 'orientation';

export interface StepTemplate {
  id: string;
  title: string;
  description: string;
  category: StepCategory;
  subtasks: Omit<Subtask, 'id' | 'completed'>[];
  hasFileUpload: boolean;
  estimatedDays: number;
}