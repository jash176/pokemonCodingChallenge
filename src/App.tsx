import React, { useEffect, useRef } from 'react';
import { AuthProvider } from './contexts/auth';
import { TeamProvider } from './contexts/team';
import AppNavigator from './navigation/AppNavigator';
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from './api/queryClient';
import { NotificationService } from './services/NotificationService';
import { NavigationContainerRef } from '@react-navigation/native';

// Import the background handler to ensure it's registered
import './services/backgroundMessageHandler';

export default function App() {

  useEffect(() => {
    // Initialize notifications
    NotificationService.initialize();
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <TeamProvider>
          <AppNavigator />
        </TeamProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
}