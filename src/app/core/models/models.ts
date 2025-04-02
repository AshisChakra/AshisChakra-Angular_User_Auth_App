// User model
export interface User {
  id: number;
  name: string;
  email: string;
  avatar?: string;
  role: string;
}

// Profile model
export interface Profile {
  userId: number;
  bio: string;
  location: string;
  website?: string;
  socialLinks?: {
    twitter?: string;
    facebook?: string;
    linkedin?: string;
  };
}

// Table data model
export interface TableData {
  id: number;
  name: string;
  category: string;
  date: string;
  status: string;
  amount: number;
  [key: string]: any; // Allow string indexing for dynamic access
}

// Notification model
export interface Notification {
  id: number;
  type: 'success' | 'error' | 'info';
  message: string;
  duration?: number;
  dismissible?: boolean;
}

// Auth models
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}
