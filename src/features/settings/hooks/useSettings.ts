import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface KratosEndpoints {
  publicUrl: string;
  adminUrl: string;
}

export interface SettingsStoreState {
  kratosEndpoints: KratosEndpoints;
  setKratosEndpoints: (endpoints: KratosEndpoints) => void;
  resetToDefaults: () => void;
  isValidUrl: (url: string) => boolean;
  isLoaded: boolean;
  loadDefaults: () => Promise<void>;
}

let serverDefaults: KratosEndpoints | null = null;

async function fetchServerDefaults(): Promise<KratosEndpoints> {
  if (serverDefaults) {
    return serverDefaults;
  }

  try {
    const response = await fetch('/api/config');
    if (response.ok) {
      const config = await response.json();
      serverDefaults = {
        publicUrl: config.kratosPublicUrl,
        adminUrl: config.kratosAdminUrl,
      };
      return serverDefaults;
    }
  } catch (error) {
    console.warn('Failed to fetch server config:', error);
  }

  // Fallback to localhost
  const fallback = {
    publicUrl: 'http://localhost:4433',
    adminUrl: 'http://localhost:4434',
  };
  serverDefaults = fallback;
  return fallback;
}

// Initial endpoints - will be replaced by server defaults on load
const INITIAL_ENDPOINTS: KratosEndpoints = {
  publicUrl: '',
  adminUrl: '',
};

export const useSettingsStore = create<SettingsStoreState>()(
  persist(
    (set, get) => ({
      kratosEndpoints: INITIAL_ENDPOINTS,
      isLoaded: false,

      loadDefaults: async () => {
        const defaults = await fetchServerDefaults();
        set({
          kratosEndpoints: defaults,
          isLoaded: true,
        });

        // Set cookies for middleware to read
        if (typeof document !== 'undefined') {
          document.cookie = `kratos-public-url=${encodeURIComponent(defaults.publicUrl)}; path=/; SameSite=Strict`;
          document.cookie = `kratos-admin-url=${encodeURIComponent(defaults.adminUrl)}; path=/; SameSite=Strict`;
        }
      },

      setKratosEndpoints: (endpoints: KratosEndpoints) => {
        set({ kratosEndpoints: endpoints });

        // Set cookies for middleware to read
        if (typeof document !== 'undefined') {
          document.cookie = `kratos-public-url=${encodeURIComponent(endpoints.publicUrl)}; path=/; SameSite=Strict`;
          document.cookie = `kratos-admin-url=${encodeURIComponent(endpoints.adminUrl)}; path=/; SameSite=Strict`;
        }
      },

      resetToDefaults: async () => {
        const defaultEndpoints = await fetchServerDefaults();
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
        // When storage is rehydrated, check if we have stored endpoints
        if (state?.kratosEndpoints) {
          // Set cookies for middleware to read
          if (typeof document !== 'undefined') {
            document.cookie = `kratos-public-url=${encodeURIComponent(state.kratosEndpoints.publicUrl)}; path=/; SameSite=Strict`;
            document.cookie = `kratos-admin-url=${encodeURIComponent(state.kratosEndpoints.adminUrl)}; path=/; SameSite=Strict`;
          }
        } else {
          // If no stored endpoints, load defaults from server
          state?.loadDefaults();
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
export const useLoadDefaults = () => useSettingsStore((state) => state.loadDefaults);
export const useSettingsLoaded = () => useSettingsStore((state) => state.isLoaded);
