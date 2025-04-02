import React from 'react';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { DetailsScreen, HomeScreen, TeamScreen, SettingsScreen } from '../screens';
import { useAuth } from '../contexts/auth';
import LoginScreen from '../screens/LoginScreen';
import RegisterScreen from '../screens/RegisterScreen';
import notifee, { EventType } from '@notifee/react-native';
import { TeamProvider } from '../contexts/team';
import { navigateTo, navigationRef } from '../utils/navigationRef';

const Stack = createNativeStackNavigator();
const AuthStack = createNativeStackNavigator();

function AuthNavigator() {
  return (
    <AuthStack.Navigator screenOptions={{ headerShown: false }}>
      <AuthStack.Screen name="Login" component={LoginScreen} />
      <AuthStack.Screen name="Register" component={RegisterScreen} />
    </AuthStack.Navigator>
  );
}

function RootNavigator() {
  return (
    <TeamProvider>

      <Stack.Navigator>
        <Stack.Screen name="Home" component={HomeScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Details" component={DetailsScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Teams" component={TeamScreen} options={{ headerShown: false }} />
        <Stack.Screen name="Settings" component={SettingsScreen} options={{ headerShown: false }} />
      </Stack.Navigator>
    </TeamProvider>
  );
}

export default function AppNavigator() {
  const { isAuthenticated } = useAuth();

  // Handle notification press when app is in quit state
  React.useEffect(() => {
    // Check if app was opened from a notification
    notifee.getInitialNotification().then(initialNotification => {
      if (initialNotification) {
        const { pokemonUrl, pokemonName } = initialNotification.notification?.data || {};

        // Delay navigation to ensure navigation is ready
        setTimeout(() => {
          if (pokemonUrl && pokemonName) {
            navigateTo('Details', {
              url: pokemonUrl,
              name: pokemonName
            });
          }
        }, 1000);
      }
    });

    // Set up background event listener
    return notifee.onBackgroundEvent(async ({ type, detail }) => {
      if (type === EventType.PRESS) {
        const { pokemonName, pokemonUrl } = detail.notification?.data || {};

        if (pokemonName && pokemonUrl) {
          navigateTo('Details', {
            name: pokemonName,
            url: pokemonUrl
          });
        }
      }
    });
  }, []);

  return (
    <NavigationContainer ref={navigationRef}>
      {isAuthenticated ? <RootNavigator /> : <AuthNavigator />}
    </NavigationContainer>
  );
}
