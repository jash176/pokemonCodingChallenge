// Mock the react-native-reanimated module
jest.mock('react-native-reanimated', () => {
  const Reanimated = require('react-native-reanimated/mock');
  Reanimated.default.call = () => {};
  return Reanimated;
});

// Mock the react-native-gesture-handler module
jest.mock('react-native-gesture-handler', () => {
  return {
    GestureHandlerRootView: ({ children, style }) => children,
    Swipeable: ({ children }) => children,
    PanGestureHandler: ({ children }) => children,
    TapGestureHandler: ({ children }) => children,
    ScrollView: require('react-native').ScrollView,
    Switch: require('react-native').Switch,
    TextInput: require('react-native').TextInput,
    State: {},
    Directions: {},
  };
});

// Mock Notifee
jest.mock('@notifee/react-native', () => {
  return {
    __esModule: true,
    default: {
      createChannel: jest.fn(() => Promise.resolve('channel-id')),
      displayNotification: jest.fn(() => Promise.resolve()),
      onForegroundEvent: jest.fn(() => jest.fn()), // Return unsubscribe function
      onBackgroundEvent: jest.fn(),
      getInitialNotification: jest.fn(() => Promise.resolve(null)),
      cancelNotification: jest.fn(() => Promise.resolve()),
      cancelAllNotifications: jest.fn(() => Promise.resolve()),
      getNotificationSettings: jest.fn(() => Promise.resolve({
        authorizationStatus: 2, // AUTHORIZED
      })),
      requestPermission: jest.fn(() => Promise.resolve({
        authorizationStatus: 2, // AUTHORIZED
      })),
      registerForegroundService: jest.fn(() => jest.fn()),
    },
    EventType: {
      DISMISSED: 0,
      PRESS: 1,
      ACTION_PRESS: 2,
      DELIVERED: 3,
      TRIGGER_NOTIFICATION_CREATED: 4,
    },
    AndroidImportance: {
      DEFAULT: 3,
      MIN: 1,
      LOW: 2,
      HIGH: 4,
      MAX: 5,
    },
    AndroidStyle: {
      BIGPICTURE: 0,
      BIGTEXT: 1,
      INBOX: 2,
      MESSAGING: 3,
    },
    AuthorizationStatus: {
      NOT_DETERMINED: 0,
      DENIED: 1,
      AUTHORIZED: 2,
      PROVISIONAL: 3,
    },
  };
});

// Mock Firebase messaging
jest.mock('@react-native-firebase/messaging', () => {
  return () => ({
    hasPermission: jest.fn(() => Promise.resolve(true)),
    requestPermission: jest.fn(() => Promise.resolve(true)),
    getToken: jest.fn(() => Promise.resolve('mock-token')),
    onMessage: jest.fn(() => Promise.resolve()),
    onNotificationOpenedApp: jest.fn(() => Promise.resolve()),
    getInitialNotification: jest.fn(() => Promise.resolve()),
    setBackgroundMessageHandler: jest.fn(),
    subscribeToTopic: jest.fn(),
    unsubscribeFromTopic: jest.fn(),
  });
});

// Mock Firebase app
jest.mock('@react-native-firebase/app', () => {
  return () => ({
    app: jest.fn(() => ({})),
    messaging: jest.fn(() => ({})),
  });
});

// Mock Firebase auth
jest.mock('@react-native-firebase/auth', () => {
  const mockUser = {
    uid: 'test-uid',
    email: 'test@example.com',
    displayName: 'Test User',
    emailVerified: true,
    isAnonymous: false,
    metadata: {
      creationTime: new Date().toISOString(),
      lastSignInTime: new Date().toISOString(),
    },
    providerData: [],
    refreshToken: 'mock-refresh-token',
    phoneNumber: null,
    photoURL: null,
    providerId: 'firebase',
    tenantId: null,
  };

  return () => ({
    currentUser: mockUser,
    signInWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    createUserWithEmailAndPassword: jest.fn(() => Promise.resolve({ user: mockUser })),
    signOut: jest.fn(() => Promise.resolve()),
    onAuthStateChanged: jest.fn((callback) => {
      callback(mockUser);
      return jest.fn(); // Return unsubscribe function
    }),
    signInWithCredential: jest.fn(() => Promise.resolve({ user: mockUser })),
  });
});

// Mock Google Sign-In
jest.mock('@react-native-google-signin/google-signin', () => {
  return {
    GoogleSignin: {
      configure: jest.fn(),
      hasPlayServices: jest.fn(() => Promise.resolve(true)),
      signIn: jest.fn(() => Promise.resolve({
        idToken: 'mock-id-token',
        user: {
          id: 'mock-id',
          name: 'Mock User',
          email: 'mock@example.com',
          photo: 'https://example.com/photo.jpg',
        },
      })),
      signOut: jest.fn(() => Promise.resolve()),
      isSignedIn: jest.fn(() => Promise.resolve(false)),
      getTokens: jest.fn(() => Promise.resolve({
        idToken: 'mock-id-token',
        accessToken: 'mock-access-token',
      })),
    },
    statusCodes: {
      SIGN_IN_CANCELLED: 0,
      IN_PROGRESS: 1,
      PLAY_SERVICES_NOT_AVAILABLE: 2,
    },
  };
});

// Set up global space for React Native
global.__reanimatedWorkletInit = jest.fn();