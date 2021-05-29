/**
 * @format
 */

import {AppRegistry, Platform} from 'react-native';
import App from './App';
import {name as appName} from './app.json';
import PushNotification from 'react-native-push-notification';

PushNotification.configure({
  popInitialNotification: true,
  requestPermissions: Platform.OS === 'ios',
});

PushNotification.createChannel({
  channelId: 'genshin-fanapp-channel-id',
  channelName: 'Genshin FanApp Notification Channel',
  channelDescription: 'A channel to categorise Genshin FanApp notifications',
  soundName: 'default',
  importance: 4,
  vibrate: true,
});

// PushNotification.getChannels(function (channel_ids) {
//   channel_ids.forEach(c => {
//     PushNotification.deleteChannel(c);
//   });
// });

AppRegistry.registerComponent(appName, () => App);
