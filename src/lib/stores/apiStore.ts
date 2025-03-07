import { create } from 'zustand';

type ApiState = {
  isConnected: boolean;
  lastError: Error | null;
  setApiConnected: (connected: boolean) => void;
  setApiError: (error: Error | null) => void;
};

export const useApiStore = create<ApiState>((set) => ({
  isConnected: false,
  lastError: null,
  setApiConnected: (connected) => set({ isConnected: connected }),
  setApiError: (error) => set({ lastError: error }),
}));
