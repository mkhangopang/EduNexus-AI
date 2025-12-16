
export enum UserRole {
  APP_ADMIN = 'APP_ADMIN',
  ENTERPRISE_ADMIN = 'ENTERPRISE_ADMIN',
  TEACHER = 'TEACHER'
}

export enum AppView {
  DASHBOARD = 'DASHBOARD',
  DOCUMENTS = 'DOCUMENTS',
  EDITOR = 'EDITOR',
  AI_TOOLS = 'AI_TOOLS',
  CHAT = 'CHAT',
  SETTINGS = 'SETTINGS',
  BRAIN_CONTROL = 'BRAIN_CONTROL', // Admin Only
  AI_TRAINING = 'AI_TRAINING', // Admin Only - New
  TEAM_MANAGEMENT = 'TEAM_MANAGEMENT' // Enterprise Only
}

export interface User {
  id: string;
  name: string;
  role: UserRole;
  avatar: string;
  plan: 'free' | 'pro' | 'enterprise';
}

export interface Document {
  id: string;
  name: string;
  type: 'pdf' | 'docx' | 'txt';
  size: string;
  uploadedAt: string;
  status: 'processed' | 'processing' | 'error';
  content?: string;
  lastModifiedBy?: string;
  // Personalization Metadata
  subject?: string;
  gradeLevel?: string;
  summary?: string;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'model';
  content: string;
  timestamp: number;
  isQueued?: boolean;
}

export interface AITool {
  id: string;
  name: string;
  description: string;
  icon: string;
  promptTemplate: string;
  minPlan: 'free' | 'pro' | 'enterprise';
}

export interface Collaborator {
  id: string;
  name: string;
  avatar: string;
  color: string; // Hex code for their cursor/avatar ring
  status: 'online' | 'idle';
  cursor?: {
    x: number;
    y: number;
  };
}
