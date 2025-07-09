import { Module, Curriculum } from '../types';

// Shared mock modules data - just 2 modules
export let mockModules = [
  { id: '1', name: 'Software Engineering', credits: 7, curriculumId: '1' },
  { id: '2', name: 'Business Strategy', credits: 5, curriculumId: '2' },
];

// Mock curricula data - just 2 curriculums
export const mockCurricula: Curriculum[] = [
  { id: '1', name: 'Bachelor of Computer Science', year: 2024, modules: [] },
  { id: '2', name: 'Master of Business Administration', year: 2024, modules: [] },
];

// Enhanced mock data with chapters, competencies, and appendices
export const mockModuleDetails: Record<string, Module> = {
  '1': {
    id: '1',
    name: 'Software Engineering',
    code: 'SE-101',
    credits: 7,
    creditType: 'EC',
    period: 1,
    year: 1,
    curriculumId: '1',
    description: 'Software Engineering (7 EC) is the systematic application of engineering approaches to the development of software. This module covers fundamental concepts, methodologies, and best practices in software development.',
    chapters: [
      {
        id: '1',
        number: 1,
        title: 'Introduction',
        content: 'This chapter introduces the fundamental concepts of software engineering, including software development life cycles, project management, and team collaboration.'
      },
      {
        id: '2',
        number: 2,
        title: 'Review',
        content: 'This chapter reviews key programming concepts and design patterns essential for effective software engineering practices.'
      },
      {
        id: '3',
        number: 3,
        title: 'Program',
        content: 'This chapter covers the practical implementation of software projects, including version control, testing strategies, and deployment processes.'
      }
    ],
    competencies: [
      {
        id: '1',
        text: 'Benchmark functionality, user experience, accessibility, and other design aspects for a client',
        level: 2,
        category: 'Analysis',
        domain: 'User Interaction'
      },
      {
        id: '2',
        text: 'Analyse current and emerging interactive technologies',
        level: 3,
        category: 'Analysis',
        domain: 'User Interaction'
      },
      {
        id: '3',
        text: 'Realise, test and transfer the user experience of an interactive product, prototype, system or service based on the design with tools and techniques appropriate for the project phasing',
        level: 3,
        category: 'Realise',
        domain: 'User Interaction'
      },
      {
        id: '4',
        text: 'Analyze organizational processes and data flows',
        level: 2,
        category: 'Analysis',
        domain: 'Organisational processes'
      },
      {
        id: '5',
        text: 'Design software architecture and infrastructure solutions',
        level: 3,
        category: 'Design',
        domain: 'Infrastructure'
      }
    ],
    appendices: [
      {
        id: '1',
        fileName: 'Scoring-Rubrics.pdf',
        fileType: 'pdf',
        url: '/files/scoring-rubrics.pdf'
      },
      {
        id: '2',
        fileName: 'Project-Guidelines.pdf',
        fileType: 'pdf',
        url: '/files/project-guidelines.pdf'
      }
    ],
    learningObjectives: [
      'Understand the principles of software engineering',
      'Apply design patterns and best practices',
      'Develop software using agile methodologies',
      'Implement testing strategies'
    ],
    assessmentMethods: [
      { name: 'Written Exam', percentage: 40 },
      { name: 'Project Work', percentage: 40 },
      { name: 'Portfolio', percentage: 20 }
    ],
    prerequisites: ['Programming Basics', 'Data Structures']
  },
  '2': {
    id: '2',
    name: 'Business Strategy',
    code: 'BS-201',
    credits: 5,
    creditType: 'EC',
    period: 1,
    year: 2,
    curriculumId: '2',
    description: 'This module explores strategic business management concepts and their practical applications in modern organizations.',
    chapters: [
      {
        id: '1',
        number: 1,
        title: 'Strategic Planning',
        content: 'Introduction to strategic planning, vision, mission, and organizational goals.'
      },
      {
        id: '2',
        number: 2,
        title: 'Market Analysis',
        content: 'Tools and techniques for analyzing market conditions and competitive landscapes.'
      }
    ],
    competencies: [
      {
        id: '1',
        text: 'Analyze business processes and organizational structures',
        level: 3,
        category: 'Analysis',
        domain: 'Organisational processes'
      },
      {
        id: '2',
        text: 'Advise on strategic business decisions',
        level: 3,
        category: 'Advise',
        domain: 'Organisational processes'
      }
    ],
    appendices: [
      {
        id: '1',
        fileName: 'Case-Studies.pdf',
        fileType: 'pdf',
        url: '/files/case-studies.pdf'
      }
    ],
    learningObjectives: [
      'Develop strategic thinking capabilities',
      'Analyze competitive environments',
      'Create business plans',
      'Evaluate strategic options'
    ],
    assessmentMethods: [
      { name: 'Case Analysis', percentage: 60 },
      { name: 'Final Presentation', percentage: 40 }
    ],
    prerequisites: ['Introduction to Business']
  }
};

export function addModule(module: Omit<Module, 'id'>) {
  const newId = (Math.max(...mockModules.map(m => parseInt(m.id))) + 1).toString();
  const newModule = { ...module, id: newId };
  
  // add to mockModules array
  mockModules.push({
    id: newId,
    name: module.name,
    credits: module.credits,
    curriculumId: module.curriculumId || ''
  });
  
  // add to mockModuleDetails
  mockModuleDetails[newId] = newModule as Module;
  
  return newModule;
}

export function updateModule(id: string, updates: Partial<Module>) {
  // update in mockModules array
  const moduleIndex = mockModules.findIndex(m => m.id === id);
  if (moduleIndex !== -1) {
    mockModules[moduleIndex] = {
      ...mockModules[moduleIndex],
      name: updates.name || mockModules[moduleIndex].name,
      credits: updates.credits || mockModules[moduleIndex].credits,
    };
  }
  
  // update in mockModuleDetails
  if (mockModuleDetails[id]) {
    mockModuleDetails[id] = {
      ...mockModuleDetails[id],
      ...updates
    };
  }
  
  return mockModuleDetails[id];
}

export function deleteModule(id: string) {
  // remove from mockModules array
  mockModules = mockModules.filter(m => m.id !== id);
  
  // remove from mockModuleDetails
  delete mockModuleDetails[id];
}