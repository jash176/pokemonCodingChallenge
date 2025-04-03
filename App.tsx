import React, { useEffect } from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { Query, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './src/api/queryClient';
import { AuthProvider } from './src/contexts/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';
import { NotificationService } from './src/services/NotificationService';
import './src/services/backgroundMessageHandler';
GoogleSignin.configure({
  webClientId: '621545797946-bn5k431lams66re71iamr3h21isk1lv8.apps.googleusercontent.com',
});
const App = () => {
  useEffect(() => {
    // Initialize notifications
    NotificationService.initialize();
  }, []);
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView style={{flex: 1}}>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App