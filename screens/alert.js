// alert.js

import { Notifications } from 'expo';
import * as Permissions from 'expo-permissions';
import { getData } from '../utils/asyncStorage';
import { fetchWeatherForecast } from '../api/weather'; // Import the function to fetch weather forecast

// Function to request permissions for notifications
const registerForPushNotifications = async () => {
  const { status: existingStatus } = await Permissions.getAsync(Permissions.NOTIFICATIONS);
  let finalStatus = existingStatus;

  if (existingStatus !== 'granted') {
    const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
    finalStatus = status;
  }

  if (finalStatus !== 'granted') {
    console.log('Failed to get push token for push notification!');
    return;
  }

  const token = await Notifications.getExpoPushTokenAsync();
  return token;
};

// Function to send notification
const sendNotification = async (title, body) => {
  await Notifications.presentLocalNotificationAsync({
    title,
    body,
    ios: {
      sound: true,
    },
    android: {
      sound: true,
      priority: 'high',
      sticky: false,
      vibrate: true,
    },
  });
};

// Function to handle weather alerts
const handleWeatherAlerts = async () => {
  try {
    // Fetch user preferences from AsyncStorage
    const notificationsEnabled = await getData('notificationsEnabled');
    const temperatureThresholdHigh = await getData('temperatureThresholdHigh');

    if (notificationsEnabled && temperatureThresholdHigh) {
      // Fetch weather forecast
      const weatherForecast = await fetchWeatherForecast({ cityName: 'YourCity', days: '1' }); // Provide the appropriate city name
      const currentTemperature = weatherForecast?.current?.temp_c;

      if (currentTemperature && parseFloat(currentTemperature) > parseFloat(temperatureThresholdHigh)) {
        // Send notification if current temperature exceeds the threshold
        sendNotification('Alert!!', 'High temperature caution.');
      }
      // Add more conditions for other weather parameters (e.g., wind speed, precipitation) as needed
    }
  } catch (error) {
    console.error('Error handling weather alerts:', error);
  }
};

export { registerForPushNotifications, handleWeatherAlerts };
