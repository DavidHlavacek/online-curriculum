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

// Module/Curriculum Types (for future use)
export interface Module {
  id: string;
  name: string;
  code: string;
  credits: number;
  period: number;
  year: number;
  description?: string;
}

export interface Curriculum {
  id: string;
  name: string;
  year: number;
  modules: Module[];
} 