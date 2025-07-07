import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'admin' | 'hr' | 'viewer';
  permissions: string[];
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => void;
  checkAuth: () => boolean;
}

const mockUsers = [
  {
    id: '1',
    email: 'admin@vestas.com',
    password: 'admin123',
    name: 'Admin User',
    role: 'super_admin' as const,
    permissions: ['all']
  },
  {
    id: '2', 
    email: 'hr@vestas.com',
    password: 'hr123',
    name: 'HR Manager',
    role: 'hr' as const,
    permissions: ['view_hires', 'edit_hires', 'create_hires']
  }
];

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,

      login: async (email: string, password: string) => {
        // Mock authentication
        const user = mockUsers.find(u => u.email === email && u.password === password);
        
        if (user) {
          const { password: _, ...userWithoutPassword } = user;
          set({ user: userWithoutPassword, isAuthenticated: true });
          return { success: true };
        }
        
        return { success: false, error: 'Invalid email or password' };
      },

      logout: () => {
        set({ user: null, isAuthenticated: false });
      },

      checkAuth: () => {
        return get().isAuthenticated;
      }
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated })
    }
  )
);