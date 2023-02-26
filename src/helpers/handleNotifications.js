import PushNotification from 'react-native-push-notification';

export const scheduleNotification = ({id, title, message, date}) => {
  PushNotification.localNotificationSchedule({
    id,
    channelId: 'genshin-fanapp-channel-id',
    title,
    message,
    date,
    allowWhileIdle: true,
  });
};

export const cancelNotification = id => {
  PushNotification.cancelLocalNotifications({id});
};
