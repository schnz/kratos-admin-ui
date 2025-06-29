'use client';

import { useEffect } from 'react';
import { useLoadDefaults, useSettingsLoaded, useKratosEndpoints } from '@/features/settings/hooks/useSettings';

export function SettingsInitializer() {
  const loadDefaults = useLoadDefaults();
  const isLoaded = useSettingsLoaded();
  const endpoints = useKratosEndpoints();

  useEffect(() => {
    // Check if we need to load defaults
    const shouldLoadDefaults =
      !isLoaded &&
      (!endpoints.publicUrl ||
        !endpoints.adminUrl ||
        endpoints.publicUrl === 'http://localhost:4433' ||
        endpoints.adminUrl === 'http://localhost:4434');

    if (shouldLoadDefaults) {
      loadDefaults();
    }
  }, [loadDefaults, isLoaded, endpoints]);

  return null;
}
