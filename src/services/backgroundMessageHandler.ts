import notifee from '@notifee/react-native';
import messaging from '@react-native-firebase/messaging';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message received:', remoteMessage);
  
  // Create a channel
  const channelId = await notifee.createChannel({
    id: 'pokemon',
    name: 'Pokemon Notifications',
    importance: 4, // HIGH
  });

  // Extract data from the remote message
  const { title, body, imageUrl, pokemonId, pokemonName } = remoteMessage.data || {};

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
      importance: 4, // HIGH
      pressAction: {
        id: 'default',
      },
    },
  });
});