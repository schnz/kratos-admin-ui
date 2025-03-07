import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { findUserByCredentials, UserCredentials, UserRole } from '../config/users';

// Define user interface
export interface User {
  username: string;
  role: UserRole;
  displayName: string;
  email: string;
}

// Define auth store interface
interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; 
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
  hasPermission: (requiredRole: UserRole) => boolean;
  setLoading: (isLoading: boolean) => void; 
}

// Create auth store with persistence
export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      isAuthenticated: false,
      isLoading: true, 
      
      setLoading: (isLoading: boolean) => set({ isLoading }),
      
      login: async (username: string, password: string) => {
        // Find user from our config
        const userRecord = findUserByCredentials(username, password);
        
        if (userRecord) {
          const user: User = {
            username: userRecord.username,
            role: userRecord.role,
            displayName: userRecord.displayName,
            email: userRecord.email
          };
          
          set({ user, isAuthenticated: true });
          return true;
        }
        
        return false;
      },
      
      logout: () => {
        set({ user: null, isAuthenticated: false });
      },
      
      hasPermission: (requiredRole: UserRole) => {
        const { user } = get();
        
        if (!user) return false;
        
        // Admin can access everything
        if (user.role === UserRole.ADMIN) return true;
        
        // Check if user has the required role
        return user.role === requiredRole;
      },
    }),
    {
      name: 'kratos-admin-auth',
      partialize: (state) => ({ user: state.user, isAuthenticated: state.isAuthenticated }),
      onRehydrateStorage: () => (state) => {
        // When storage is rehydrated, set loading to false
        if (state) {
          state.setLoading(false);
        }
      },
    }
  )
);

// Hooks for easier access to auth store
export const useUser = () => useAuthStore((state) => state.user);
export const useIsAuthenticated = () => useAuthStore((state) => state.isAuthenticated);
export const useIsAuthLoading = () => useAuthStore((state) => state.isLoading);
export const useLogin = () => useAuthStore((state) => state.login);
export const useLogout = () => useAuthStore((state) => state.logout);
export const useHasPermission = () => useAuthStore((state) => state.hasPermission);

// Re-export UserRole for backward compatibility
export { UserRole } from '../config/users';
