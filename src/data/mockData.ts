import { Module, Curriculum } from '../types';

// shared mock modules data
export let mockModules = [
  { id: '1', name: 'Software Engineering', credits: 7, curriculumId: '1' },
  { id: '2', name: 'Business Strategy', credits: 5, curriculumId: '2' },
  { id: '3', name: 'Database Systems', credits: 5, curriculumId: '1' },
  { id: '4', name: 'Machine Learning', credits: 8, curriculumId: '1' },
  { id: '5', name: 'Human Anatomy', credits: 6, curriculumId: '' },
  { id: '6', name: 'Art History', credits: 4, curriculumId: '' },
  { id: '7', name: 'Financial Accounting', credits: 5, curriculumId: '' },
  { id: '8', name: 'Introduction to Psychology', credits: 6, curriculumId: '' },
];

// mock curricula data
export let mockCurricula: Curriculum[] = [
  { 
    id: '1', 
    name: 'Bachelor of Computer Science', 
    year: 2024, 
    description: 'A comprehensive program covering fundamental and advanced topics in computer science.',
    duration: 4,
    totalCredits: 240,
    modules: [] 
  },
  { 
    id: '2', 
    name: 'Master of Business Administration', 
    year: 2024,
    description: 'An advanced program focusing on business strategy, leadership, and management.',
    duration: 2,
    totalCredits: 120,
    modules: [] 
  },
];

// enhanced mock module data
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
  },
  '3': {
    id: '3',
    name: 'Database Systems',
    code: 'DB-301',
    credits: 5,
    creditType: 'EC',
    period: 3,
    year: 1,
    curriculumId: '1',
    description: 'This module covers database design, SQL, and database management systems.',
    chapters: [],
    competencies: [],
    appendices: []
  },
  '4': {
    id: '4',
    name: 'Machine Learning',
    code: 'ML-401',
    credits: 8,
    creditType: 'EC',
    period: 4,
    year: 4,
    curriculumId: '1',
    description: 'Introduction to machine learning algorithms and their applications.',
    chapters: [],
    competencies: [],
    appendices: []
  },
  '5': {
    id: '5',
    name: 'Human Anatomy',
    code: 'HA-101',
    credits: 6,
    creditType: 'EC',
    period: 1,
    year: 1,
    curriculumId: '',
    description: 'Study of human body structure and systems.',
    chapters: [],
    competencies: [],
    appendices: []
  },
  '6': {
    id: '6',
    name: 'Art History',
    code: 'AH-201',
    credits: 4,
    creditType: 'EC',
    period: 1,
    year: 1,
    curriculumId: '',
    description: 'Survey of art history from ancient to modern times.',
    chapters: [],
    competencies: [],
    appendices: []
  },
  '7': {
    id: '7',
    name: 'Financial Accounting',
    code: 'FA-301',
    credits: 5,
    creditType: 'EC',
    period: 1,
    year: 1,
    curriculumId: '',
    description: 'Principles of financial accounting and reporting.',
    chapters: [],
    competencies: [],
    appendices: []
  },
  '8': {
    id: '8',
    name: 'Introduction to Psychology',
    code: 'PSY-101',
    credits: 6,
    creditType: 'EC',
    period: 1,
    year: 1,
    curriculumId: '',
    description: 'Overview of psychological theories and concepts.',
    chapters: [],
    competencies: [],
    appendices: []
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

// curriculum CRUD operations
export function getCurriculumById(id: string): Curriculum | undefined {
  const curriculum = mockCurricula.find(c => c.id === id);
  if (curriculum) {
    // populate modules array with actual modules
    const curriculumModules = mockModules
      .filter(m => m.curriculumId === id)
      .map(m => mockModuleDetails[m.id])
      .filter(Boolean) as Module[];
    return { ...curriculum, modules: curriculumModules };
  }
  return undefined;
}

export function addCurriculum(curriculum: Omit<Curriculum, 'id'>) {
  const newId = (Math.max(...mockCurricula.map(c => parseInt(c.id))) + 1).toString();
  const newCurriculum = { ...curriculum, id: newId };
  mockCurricula.push(newCurriculum);
  return newCurriculum;
}

export function updateCurriculum(id: string, updates: Partial<Curriculum>) {
  const index = mockCurricula.findIndex(c => c.id === id);
  if (index !== -1) {
    mockCurricula[index] = {
      ...mockCurricula[index],
      ...updates
    };
    return mockCurricula[index];
  }
  return null;
}

export function deleteCurriculum(id: string) {
  mockCurricula = mockCurricula.filter(c => c.id !== id);
  // also remove all modules associated with this curriculum
  mockModules = mockModules.filter(m => m.curriculumId !== id);
}

// get all modules available for scheduling (not yet assigned to a period)
export function getAvailableModules(): Module[] {
  return Object.values(mockModuleDetails);
}