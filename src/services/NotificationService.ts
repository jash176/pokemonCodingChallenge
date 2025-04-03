import notifee, {
  EventType,
  AndroidImportance,
  AndroidStyle,
} from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';
import {StorageUtils} from '../utils/storage';
import {navigateTo, navigationRef} from '../utils/navigationRef';
export const NotificationService = {
  // Set navigation reference for navigation from outside React components

  // Initialize notifications
  initialize: async () => {
    // Request permission
    console.log('Requesting notification permission...');
    await NotificationService.requestPermission();

    // Register foreground handler
    messaging().onMessage(async remoteMessage => {
      console.log('Foreground notification received:', remoteMessage);
      await NotificationService.displayNotification(remoteMessage);
    });

    // Set up notification listeners
    notifee.onForegroundEvent(({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          NotificationService.handleNotificationPress(detail.notification);
          break;
      }
    });

    notifee.onBackgroundEvent(async ({type, detail}) => {
      switch (type) {
        case EventType.PRESS:
          console.log('User pressed notification', detail.notification);
          NotificationService.handleNotificationPress(detail.notification);
          break;
      }
    })

    // Get FCM token
    const token = await messaging().getToken();
    console.log('FCM Token:', token);

    // Subscribe to topic for all users
    await messaging().subscribeToTopic('pokemon_updates');
  },

  // Request notification permissions
  requestPermission: async () => {
    try {
      // Request permissions for Firebase messaging
      const messagingAuthStatus = await messaging().requestPermission();

      // Request permissions for Notifee
      await notifee.requestPermission();

      const enabled =
        messagingAuthStatus === messaging.AuthorizationStatus.AUTHORIZED ||
        messagingAuthStatus === messaging.AuthorizationStatus.PROVISIONAL;
      console.log('messagingAuthStatus:', messagingAuthStatus);
      // Store the notification preference in AsyncStorage or Redux or any other state management solution you are using.
      // For example, if you are using Redux, you can dispatch an action to update the state.
      // Here, we are using AsyncStorage as an example.
      if (enabled) {
        StorageUtils.setItem('notifications_enabled', true);
      }

      return enabled;
    } catch (e) {
      console.log(e);
      return false;
    }
  },

  // Check if notifications are enabled
  isEnabled: async () => {
    const settings = await notifee.getNotificationSettings();
    return settings.authorizationStatus >= 1; // AUTHORIZED or PROVISIONAL
  },

  // Display a notification
  displayNotification: async (remoteMessage: any) => {
    // Create a channel (required for Android)
    const channelId = await notifee.createChannel({
      id: 'pokemon',
      name: 'Pokemon Notifications',
      importance: AndroidImportance.HIGH,
    });

    // Extract data from the remote message
    const {title, body, imageUrl, pokemonId, pokemonName} =
      remoteMessage.data || {};

    // Display the notification
    await notifee.displayNotification({
      title: title as string || remoteMessage.notification?.title || 'Pokemon Update',
      body: body as string || remoteMessage.notification?.body || 'Check out this Pokemon!',
      data: {
        pokemonId,
        pokemonName,
        url: remoteMessage.data?.url as string || "",
      },
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
        style: imageUrl
          ? {
              type: AndroidStyle.BIGPICTURE,
              picture: imageUrl,
            }
          : undefined,
      },
      ios: {
        attachments: imageUrl ? [{url: imageUrl}] : undefined,
      },
    });
  },

  // Handle notification press
  handleNotificationPress: (notification: any) => {
    if (!navigationRef) {
      console.log('Navigation ref not set');
      return;
    }

    const {pokemonId, pokemonName, url} = notification?.data || {};

    if (pokemonId || pokemonName) {
      navigateTo('Details', {
        id: pokemonId,
        name: pokemonName,
        url,
      });
    }
  },

  // Send a test notification (for development)
  sendTestNotification: async () => {
    const channelId = await notifee.createChannel({
      id: 'pokemon',
      name: 'Pokemon Notifications',
      importance: AndroidImportance.HIGH,
    });

    await notifee.displayNotification({
      title: 'Test Notification',
      body: 'This is a test Pokemon notification',
      data: {
        pokemonId: '25',
        pokemonName: 'pikachu',
      },
      android: {
        channelId,
        importance: AndroidImportance.HIGH,
        pressAction: {
          id: 'default',
        },
      },
    });
  },

  getFcmToken: async () => {
    const hasPermission = await NotificationService.isEnabled();
    if (!hasPermission) {
      console.log('Notification permission not granted');
      return null;
    }
    return await messaging().getToken();
  },
};
