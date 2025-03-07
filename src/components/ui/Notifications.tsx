import { useEffect, useState } from 'react';
import { Alert, AlertTitle, Snackbar, Stack } from '@mui/material';
import { useNotifications, useRemoveNotification } from '@/lib/stores/notificationStore';

export function NotificationCenter() {
  const notifications = useNotifications();
  const removeNotification = useRemoveNotification();
  const [activeNotifications, setActiveNotifications] = useState<string[]>([]);
  
  useEffect(() => {
    // Keep track of which notifications are currently displayed
    const notificationIds = notifications.map(n => n.id);
    setActiveNotifications(prev => {
      const newActive = [...prev];
      
      // Add new notifications
      notificationIds.forEach(id => {
        if (!prev.includes(id)) {
          newActive.push(id);
        }
      });
      
      // Remove missing notifications
      return newActive.filter(id => notificationIds.includes(id));
    });
  }, [notifications]);
  
  const handleClose = (id: string) => {
    removeNotification(id);
  };
  
  return (
    <Stack spacing={2} sx={{ 
      position: 'fixed', 
      bottom: 16, 
      right: 16, 
      zIndex: 2000,
      maxWidth: '100%',
      width: 400,
    }}>
      {notifications.map((notification) => (
        <Snackbar
          key={notification.id}
          open={true}
          anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
          sx={{ position: 'static', mb: 1 }} // Static position within parent stack
        >
          <Alert
            severity={notification.type}
            onClose={() => handleClose(notification.id)}
            sx={{ width: '100%' }}
          >
            {notification.title && (
              <AlertTitle>{notification.title}</AlertTitle>
            )}
            {notification.message}
          </Alert>
        </Snackbar>
      ))}
    </Stack>
  );
}
