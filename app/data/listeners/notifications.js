import React from 'react';
import {
	Alert,
	NetInfo,
} from 'react-native';
import base64 from 'base-64';
import {NotificationsAndroid, PendingNotifications} from 'react-native-notifications';

function setupAPN()
{
	// register device token for notifications
    NotificationsAndroid.refreshToken();
    NotificationsAndroid.setRegistrationTokenUpdateListener((deviceToken) => {
      // send to server to allow for notifications
      global.deviceToken = deviceToken;
      Alert.alert('Ganji', 'Notification token: ' + deviceToken, [{text: 'OK'}]);
    });
    // setup notification listeners
    NotificationsAndroid.setNotificationReceivedListener((notification) => {
      // notification received on device in background or foreground
      pushNotifications(notification.getData(), 'any');
    });
    NotificationsAndroid.setNotificationReceivedInForegroundListener((notification) => {
      // notification received on device in foreground
      pushNotifications(notification.getData(), 'fore');
    });
    NotificationsAndroid.setNotificationOpenedListener((notification) => {
      // notification opened by device user
      pushNotifications(notification.getData(), 'open');
    });
    // setup means to get pending notifications
    PendingNotifications.getInitialNotification().then((notification) => {
      pushNotifications( (notification ? notification.getData() : 'N/A'), 'pending');
    })  	
    .catch((err) => console.error("getInitialNotifiation() failed", err));
}

function pushNotifications(data, mode)
{
  var dataStr = JSON.stringify(data);
  if (mode === 'any')
  {
	Alert.alert('Ganji', 'Notification was received: ' + dataStr, [{text: 'OK'}]);
  }
  else if (mode === 'fore')
  {
	Alert.alert('Ganji', 'Notification was received in foreground: ' + dataStr, [{text: 'OK'}]);
  }
  else if (mode === 'pending')
  {
	if (dataStr !== '"N/A"')
	{
	  Alert.alert('Ganji', 'Notifications opened while app was unavailable: ' + dataStr, [{text: 'OK'}]);
	}
  }
  else
  {
	Alert.alert('Ganji', 'Notification was opened: ' + dataStr, [{text: 'OK'}]);
  }
}

export const setupAPNSystem = setupAPN;