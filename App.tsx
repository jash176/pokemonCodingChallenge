import React from 'react'
import AppNavigator from './src/navigation/AppNavigator'
import { Query, QueryClientProvider } from '@tanstack/react-query'
import { queryClient } from './src/api/queryClient';
import { AuthProvider } from './src/contexts/auth';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { GoogleSignin } from '@react-native-google-signin/google-signin';

GoogleSignin.configure({
  webClientId: '621545797946-bn5k431lams66re71iamr3h21isk1lv8.apps.googleusercontent.com',
});
const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <GestureHandlerRootView>
        <AuthProvider>
          <AppNavigator />
        </AuthProvider>
      </GestureHandlerRootView>
    </QueryClientProvider>
  )
}

export default App