import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { setKratosConfig } from '@/services/kratos/config';

export interface KratosEndpoints {
  publicUrl: string;
  adminUrl: string;
}

export interface SettingsStoreState {
  kratosEndpoints: KratosEndpoints;
  setKratosEndpoints: (endpoints: KratosEndpoints) => void;
  resetToDefaults: () => void;
  isValidUrl: (url: string) => boolean;
}

const DEFAULT_ENDPOINTS: KratosEndpoints = {
  publicUrl: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL || 'http://localhost:4433',
  adminUrl: process.env.NEXT_PUBLIC_KRATOS_ADMIN_URL || 'http://localhost:4434',
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      kratosEndpoints: DEFAULT_ENDPOINTS,

      setKratosEndpoints: (endpoints: KratosEndpoints) => {
        set({ kratosEndpoints: endpoints });

        // Set cookies for middleware to read (client config stays as proxy paths)
        if (typeof document !== 'undefined') {
          document.cookie = `kratos-public-url=${encodeURIComponent(endpoints.publicUrl)}; path=/; SameSite=Strict`;
          document.cookie = `kratos-admin-url=${encodeURIComponent(endpoints.adminUrl)}; path=/; SameSite=Strict`;
        }
      },

      resetToDefaults: () => {
        const defaultEndpoints = {
          publicUrl: process.env.NEXT_PUBLIC_KRATOS_PUBLIC_URL || 'http://localhost:4433',
          adminUrl: process.env.NEXT_PUBLIC_KRATOS_ADMIN_URL || 'http://localhost:4434',
        };
        set({ kratosEndpoints: defaultEndpoints });

        // Set cookies for middleware to read
        if (typeof document !== 'undefined') {
          document.cookie = `kratos-public-url=${encodeURIComponent(defaultEndpoints.publicUrl)}; path=/; SameSite=Strict`;
          document.cookie = `kratos-admin-url=${encodeURIComponent(defaultEndpoints.adminUrl)}; path=/; SameSite=Strict`;
        }
      },

      isValidUrl: (url: string) => {
        try {
          new URL(url);
          return true;
        } catch {
          return false;
        }
      },
    }),
    {
      name: 'kratos-admin-settings',
      partialize: (state) => ({
        kratosEndpoints: state.kratosEndpoints,
      }),
      onRehydrateStorage: () => (state) => {
        // When storage is rehydrated, set cookies for middleware to read
        if (state?.kratosEndpoints) {
          // Set cookies for middleware to read
          if (typeof document !== 'undefined') {
            document.cookie = `kratos-public-url=${encodeURIComponent(state.kratosEndpoints.publicUrl)}; path=/; SameSite=Strict`;
            document.cookie = `kratos-admin-url=${encodeURIComponent(state.kratosEndpoints.adminUrl)}; path=/; SameSite=Strict`;
          }
        }
      },
    }
  )
);

// Convenience hooks
export const useKratosEndpoints = () => useSettingsStore((state) => state.kratosEndpoints);
export const useSetKratosEndpoints = () => useSettingsStore((state) => state.setKratosEndpoints);
export const useResetSettings = () => useSettingsStore((state) => state.resetToDefaults);
export const useIsValidUrl = () => useSettingsStore((state) => state.isValidUrl);
