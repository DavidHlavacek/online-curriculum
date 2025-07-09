// User Types
export interface User {
  id: string;
  email: string;
  role: 'admin' | 'student' | 'guest';
  name?: string;
}

// Navigation Types
export type StackType = 'auth' | 'home' | 'getStarted';

export interface NavigationState {
  currentStack: StackType;
  isAuthenticated: boolean;
  user: User | null;
}

// Chapter Types
export interface Chapter {
  id: string;
  number: number;
  title: string;
  content: string;
}

// Competency Types
export interface Competency {
  id: string;
  text: string;
  level: number;
  category: 'Analysis' | 'Advise' | 'Design' | 'Realise' | 'Manage & Control';
  domain: 'User Interaction' | 'Organisational processes' | 'Infrastructure' | 'Software' | 'Hardware-interfacing';
  archCode?: string; // For HBO-i API integration
}

// Appendix Types
export interface Appendix {
  id: string;
  fileName: string;
  fileType: string;
  fileSize?: number;
  uploadDate?: Date;
  url: string;
}

// Module Types
export interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  creditType?: 'EC' | 'ECTS';
  period: number;
  year: number;
  description?: string;
  curriculumId?: string;
  curriculumType?: string;
  chapters?: Chapter[];
  competencies?: Competency[];
  appendices?: Appendix[];
  learningObjectives?: string[];
  assessmentMethods?: AssessmentMethod[];
  prerequisites?: string[];
}

// Assessment Types
export interface AssessmentMethod {
  name: string;
  percentage: number;
  description?: string;
}

export interface Curriculum {
  id: string;
  name: string;
  year: number;
  description?: string;
  duration: number; // in years
  totalCredits?: number;
  modules: Module[];
} 