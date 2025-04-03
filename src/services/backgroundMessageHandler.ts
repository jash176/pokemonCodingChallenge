import messaging from '@react-native-firebase/messaging';
import { NotificationService } from './NotificationService';

// Register background handler
messaging().setBackgroundMessageHandler(async (remoteMessage) => {
  console.log('Background message received:', remoteMessage);
  NotificationService.displayNotification(remoteMessage)
});