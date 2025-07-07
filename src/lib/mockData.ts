import type { OnboardingBatch, NewHire, OnboardingStep } from '../types/index.js';

const generateMockSteps = (): OnboardingStep[] => [
  {
    id: 'docs',
    title: 'Documentation',
    description: 'Complete all required paperwork and documentation',
    status: 'completed',
    category: 'documents',
    hasFileUpload: true,
    dueDate: new Date(2025, 7, 8), // Aug 8, 2025
    responsiblePerson: {
      initials: 'MK',
      name: 'Maria Karlsson',
      role: 'HR Manager'
    },
    subtasks: [
      { 
        id: 'contract', 
        title: 'Sign employment contract', 
        completed: true, 
        completedAt: new Date(2025, 7, 1, 14, 30), // Aug 1, 2025 14:30
        priority: 'high',
        requiresFile: true,
        uploadedFile: {
          name: 'employment_contract_signed.pdf',
          type: 'pdf',
          uploadedAt: new Date(2025, 7, 1, 14, 30),
          size: '2.4 MB'
        }
      },
      { 
        id: 'tax', 
        title: 'Submit tax forms', 
        completed: true, 
        completedAt: new Date(2025, 7, 3, 10, 15), // Aug 3, 2025 10:15
        priority: 'medium',
        requiresFile: true,
        uploadedFile: {
          name: 'tax_forms_2025.pdf',
          type: 'pdf',
          uploadedAt: new Date(2025, 7, 3, 10, 15),
          size: '1.8 MB'
        }
      },
      { 
        id: 'emergency', 
        title: 'Emergency contact info', 
        completed: true, 
        completedAt: new Date(2025, 7, 5, 16, 45), // Aug 5, 2025 16:45
        priority: 'medium' 
      },
    ]
  },
  {
    id: 'security',
    title: 'Security Briefing',
    description: 'Complete security training and access setup',
    status: 'in_progress',
    category: 'security',
    hasFileUpload: false,
    dueDate: new Date(2025, 7, 10), // Aug 10, 2025
    responsiblePerson: {
      initials: 'PH',
      name: 'Peter Hansen',
      role: 'Admin'
    },
    subtasks: [
      { 
        id: 'badge', 
        title: 'Get security badge', 
        completed: true, 
        completedAt: new Date(2025, 7, 6, 9, 20), // Aug 6, 2025 09:20
        priority: 'high' 
      },
      { id: 'systems', title: 'System access setup', completed: false, priority: 'high' },
      { id: 'safety', title: 'Safety protocol training', completed: false, priority: 'medium' },
    ]
  },
  {
    id: 'training',
    title: 'Technical Training',
    description: 'Complete role-specific training modules',
    status: 'pending',
    category: 'training',
    hasFileUpload: true,
    dueDate: new Date(2025, 7, 15), // Aug 15, 2025
    responsiblePerson: {
      initials: 'AL',
      name: 'Anna Lindberg',
      role: 'Training Coordinator'
    },
    subtasks: [
      { id: 'basics', title: 'Basic operations training', completed: false, priority: 'high' },
      { 
        id: 'advanced', 
        title: 'Advanced procedures', 
        completed: false, 
        priority: 'medium',
        requiresFile: true 
      },
      { 
        id: 'certification', 
        title: 'Complete certification exam', 
        completed: false, 
        priority: 'high',
        requiresFile: true 
      },
    ]
  },
  {
    id: 'equipment',
    title: 'Equipment Setup',
    description: 'Receive and configure work equipment',
    status: 'pending',
    category: 'equipment',
    hasFileUpload: false,
    dueDate: new Date(2025, 7, 11), // Aug 11, 2025
    responsiblePerson: {
      initials: 'JS',
      name: 'Johan Svensson',
      role: 'IT Support'
    },
    subtasks: [
      { id: 'laptop', title: 'Laptop configuration', completed: false, priority: 'high' },
      { id: 'phone', title: 'Mobile phone setup', completed: false, priority: 'medium' },
      { id: 'tools', title: 'Specialized tools received', completed: false, priority: 'medium' },
    ]
  }
];

const generateMockHire = (id: string, name: string, position: string, customStatus?: NewHire['status']): NewHire => {
  const steps = generateMockSteps();
  
  // Calculate realistic progress based on status
  let progress = 0;
  let status: NewHire['status'] = customStatus || 'not_started';
  
  // Assign specific progress values to avoid duplicates
  const progressMap: Record<string, number> = {
    '1': 92,  // Lars - almost complete
    '2': 67,  // Emma - good progress
    '3': 45,  // Mikkel - halfway
    '4': 78,  // Sofia - strong progress  
    '5': 89,  // Jonas - nearly done
    '6': 34,  // Astrid - early stage
    '7': 56,  // Oliver - mid progress
    '8': 23,  // Ida - just started
    '9': 12,  // Magnus - very early
    '10': 8,  // Freja - just beginning
    '11': 5,  // Christian - barely started
    '12': 0   // Nanna - not started
  };

  progress = progressMap[id] || 0;

  if (progress >= 80) {
    // Nearly complete - all but last step done
    steps[0].status = 'completed';
    steps[1].status = 'completed';
    steps[2].status = 'completed';
    steps[3].status = 'in_progress';
    
    // Complete first 3 steps
    for (let i = 0; i < 3; i++) {
      steps[i].subtasks.forEach(subtask => {
        subtask.completed = true;
        subtask.completedAt = new Date(2025, 7, Math.floor(Math.random() * 3) + 1);
      });
    }
    
    // Partially complete last step
    const lastStepCompletion = Math.floor((progress - 75) / 25 * steps[3].subtasks.length);
    for (let i = 0; i < lastStepCompletion; i++) {
      steps[3].subtasks[i].completed = true;
      steps[3].subtasks[i].completedAt = new Date(2025, 7, 6 + i);
    }
  } else if (progress >= 50) {
    // Good progress - first 2 steps done, working on 3rd
    steps[0].status = 'completed';
    steps[1].status = 'completed';
    steps[2].status = 'in_progress';
    
    // Complete first 2 steps
    for (let i = 0; i < 2; i++) {
      steps[i].subtasks.forEach(subtask => {
        subtask.completed = true;
        subtask.completedAt = new Date(2025, 7, Math.floor(Math.random() * 3) + 1);
      });
    }
    
    // Partially complete 3rd step
    const thirdStepCompletion = Math.floor((progress - 50) / 25 * steps[2].subtasks.length);
    for (let i = 0; i < thirdStepCompletion; i++) {
      steps[2].subtasks[i].completed = true;
      steps[2].subtasks[i].completedAt = new Date(2025, 7, 5 + i);
    }
  } else if (progress >= 25) {
    // Early progress - first step done, working on 2nd
    steps[0].status = 'completed';
    steps[1].status = 'in_progress';
    
    // Complete first step
    steps[0].subtasks.forEach(subtask => {
      subtask.completed = true;
      subtask.completedAt = new Date(2025, 7, Math.floor(Math.random() * 3) + 1);
    });
    
    // Partially complete 2nd step
    const secondStepCompletion = Math.floor((progress - 25) / 25 * steps[1].subtasks.length);
    for (let i = 0; i < secondStepCompletion; i++) {
      steps[1].subtasks[i].completed = true;
      steps[1].subtasks[i].completedAt = new Date(2025, 7, 4 + i);
    }
  } else if (progress > 0) {
    // Just started - working on first step
    steps[0].status = 'in_progress';
    
    // Partially complete first step
    const firstStepCompletion = Math.floor(progress / 25 * steps[0].subtasks.length);
    for (let i = 0; i < firstStepCompletion; i++) {
      steps[0].subtasks[i].completed = true;
      steps[0].subtasks[i].completedAt = new Date(2025, 7, 2 + i);
    }
  }

  // Generate realistic WINDA and SAP IDs
  const windaId = `WINDA${Math.floor(Math.random() * 900000) + 100000}`;
  const sapId = `SAP${Math.floor(Math.random() * 90000) + 10000}`;
  const employeeId = `EMP${id.padStart(4, '0')}`;

  // Generate previous courses based on experience level
  const generatePreviousCourses = () => {
    const courses = [
      { name: 'Basic Safety Training', date: new Date(2023, 3, 15) },
      { name: 'Wind Turbine Fundamentals', date: new Date(2023, 5, 22) },
      { name: 'Electrical Safety Certification', date: new Date(2023, 8, 10) },
      { name: 'Working at Height Certificate', date: new Date(2024, 1, 5) },
      { name: 'First Aid Certification', date: new Date(2024, 2, 18) },
      { name: 'GWO Basic Safety Training', date: new Date(2024, 4, 12) },
      { name: 'Hydraulic Systems Training', date: new Date(2024, 6, 8) },
      { name: 'Advanced Troubleshooting', date: new Date(2024, 9, 25) }
    ];

    // Senior techs have more courses
    const numCourses = position.includes('Senior') ? 
      Math.floor(Math.random() * 3) + 4 : // 4-6 courses for senior
      Math.floor(Math.random() * 2) + 2;  // 2-3 courses for regular

    return courses.slice(0, numCourses).map(course => ({
      courseName: course.name,
      completionDate: course.date,
      certificate: `${course.name.replace(/\s+/g, '_')}_${id}.pdf`,
      validUntil: course.name.includes('Certification') ? 
        new Date(course.date.getFullYear() + 3, course.date.getMonth(), course.date.getDate()) : 
        undefined
    }));
  };

  return {
    id,
    name,
    position,
    department: 'Service Technology',
    startDate: new Date(2025, 7, 12), // August 12, 2025
    email: `${name.toLowerCase().replace(' ', '.')}@vestas.com`,
    phone: '+45 12 34 56 78',
    photoUrl: `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&background=random&size=128`,
    windaId,
    sapId,
    employeeId,
    previousCourses: generatePreviousCourses(),
    steps,
    overallProgress: progress,
    status
  };
};

export const mockBatch: OnboardingBatch = {
  id: 'august-2025',
  title: 'Onboarding Vestas Servicetekniker',
  month: 'August',
  year: 2025,
  totalHires: 12,
  completedHires: 0, // No one is 100% complete now
  createdAt: new Date(2025, 6, 15).toISOString(), // July 15, 2025
  hires: [
    generateMockHire('1', 'Lars Nielsen', 'Service Technician', 'in_progress'),      // 92%
    generateMockHire('2', 'Emma Sørensen', 'Senior Service Tech', 'in_progress'),    // 67%
    generateMockHire('3', 'Mikkel Hansen', 'Service Technician', 'in_progress'),     // 45%
    generateMockHire('4', 'Sofia Andersen', 'Service Technician', 'in_progress'),    // 78%
    generateMockHire('5', 'Jonas Petersen', 'Lead Service Tech', 'in_progress'),     // 89%
    generateMockHire('6', 'Astrid Larsen', 'Service Technician', 'in_progress'),     // 34%
    generateMockHire('7', 'Oliver Kristensen', 'Service Technician', 'in_progress'), // 56%
    generateMockHire('8', 'Ida Thomsen', 'Senior Service Tech', 'in_progress'),      // 23%
    generateMockHire('9', 'Magnus Johansen', 'Service Technician', 'in_progress'),   // 12%
    generateMockHire('10', 'Freja Møller', 'Service Technician', 'in_progress'),     // 8%
    generateMockHire('11', 'Christian Berg', 'Service Technician', 'in_progress'),   // 5%
    generateMockHire('12', 'Nanna Holm', 'Senior Service Tech', 'not_started'),      // 0%
  ]
};