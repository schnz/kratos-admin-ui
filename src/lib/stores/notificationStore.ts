import { create } from 'zustand';

export type NotificationType = 'info' | 'success' | 'warning' | 'error';

export interface Notification {
  id: string;
  type: NotificationType;
  message: string;
  title?: string;
  duration?: number; // in milliseconds
}

interface NotificationState {
  notifications: Notification[];
  addNotification: (notification: Omit<Notification, 'id'>) => void;
  removeNotification: (id: string) => void;
  clearNotifications: () => void;
}

export const useNotificationStore = create<NotificationState>((set) => ({
  notifications: [],
  addNotification: (notification) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newNotification = {
      id,
      duration: 5000, // default duration
      ...notification,
    };
    
    set((state) => ({
      notifications: [...state.notifications, newNotification],
    }));

    // Auto-remove notification after its duration
    if (newNotification.duration !== Infinity) {
      setTimeout(() => {
        set((state) => ({
          notifications: state.notifications.filter((n) => n.id !== id),
        }));
      }, newNotification.duration);
    }
    
    return id;
  },
  removeNotification: (id) =>
    set((state) => ({
      notifications: state.notifications.filter((n) => n.id !== id),
    })),
  clearNotifications: () => set({ notifications: [] }),
}));

// Convenience hooks
export const useNotifications = () => useNotificationStore((state) => state.notifications);
export const useAddNotification = () => useNotificationStore((state) => state.addNotification);
export const useRemoveNotification = () => useNotificationStore((state) => state.removeNotification);
export const useClearNotifications = () => useNotificationStore((state) => state.clearNotifications);

// Helper function to use outside of React components
export const notify = {
  info: (message: string, title?: string, duration?: number) =>
    useNotificationStore.getState().addNotification({ type: 'info', message, title, duration }),
  success: (message: string, title?: string, duration?: number) =>
    useNotificationStore.getState().addNotification({ type: 'success', message, title, duration }),
  warning: (message: string, title?: string, duration?: number) =>
    useNotificationStore.getState().addNotification({ type: 'warning', message, title, duration }),
  error: (message: string, title?: string, duration?: number) =>
    useNotificationStore.getState().addNotification({ type: 'error', message, title, duration }),
};
