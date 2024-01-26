import React, { useState } from 'react';
import { View, Text, Switch, TextInput, Button, StyleSheet } from 'react-native';
import { getData, storeData } from '../utils/asyncStorage';

const NotificationsScreen = () => {
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [temperatureThresholdHigh, setTemperatureThresholdHigh] = useState('');
  const [temperatureThresholdLow, setTemperatureThresholdLow] = useState('');
  const [windSpeedThreshold, setWindSpeedThreshold] = useState('');
  const [precipitationThreshold, setPrecipitationThreshold] = useState('');
  const [showWindNotification, setShowWindNotification] = useState(false);
  const [showPrecipitationNotification, setShowPrecipitationNotification] = useState(false);

  const savePreferences = async () => {
    try {
      // Save preferences to AsyncStorage
      await storeData('notificationsEnabled', JSON.stringify(notificationsEnabled));
      await storeData('temperatureThresholdHigh', temperatureThresholdHigh);
      await storeData('temperatureThresholdLow', temperatureThresholdLow);
      await storeData('showWindNotification', JSON.stringify(showWindNotification));
      await storeData('showPrecipitationNotification', JSON.stringify(showPrecipitationNotification));
  
      console.log('Preferences saved successfully!');
  
      // Retrieve saved preferences for verification
      const savedNotificationsEnabled = await getData('notificationsEnabled');
      const savedTemperatureThresholdHigh = await getData('temperatureThresholdHigh');
      const savedTemperatureThresholdLow = await getData('temperatureThresholdLow');
      const savedShowWindNotification = await getData('showWindNotification');
      const savedShowPrecipitationNotification = await getData('showPrecipitationNotification');
  
      console.log('Saved Preferences:');
      console.log('notificationsEnabled:', savedNotificationsEnabled);
      console.log('temperatureThresholdHigh:', savedTemperatureThresholdHigh);
      console.log('temperatureThresholdLow:', savedTemperatureThresholdLow);
      console.log('showWindNotification:', savedShowWindNotification);
      console.log('showPrecipitationNotification:', savedShowPrecipitationNotification);
    } catch (error) {
      console.error('Error saving preferences:', error);
    }
  };
  
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notification Settings</Text>
      <View style={styles.preference}>
        <Text>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={(value) => {
            setNotificationsEnabled(value);
            if (!value) {
              setShowWindNotification(false);
              setShowPrecipitationNotification(false);
            }
          }}
        />
      </View>
      {notificationsEnabled && (
        <>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Temperature Threshold (°C)</Text>
            <View style={styles.thresholdTypeContainer}>
              <View style={styles.checkboxContainer}>
                <Text>High:</Text>
                <Switch
                  value={!!temperatureThresholdHigh}
                  onValueChange={(value) => setTemperatureThresholdHigh(value ? '0' : '')}
                  disabled={!notificationsEnabled}
                />
                {!!temperatureThresholdHigh && (
                  <TextInput
                    style={[styles.input, !notificationsEnabled && styles.disabled]}
                    placeholder="High temperature threshold"
                    value={temperatureThresholdHigh}
                    onChangeText={setTemperatureThresholdHigh}
                    keyboardType="numeric"
                    editable={notificationsEnabled}
                  />
                )}
              </View>
              <Text>°C</Text>
            </View>
          </View>
          <View style={styles.section}>
            <View style={styles.thresholdTypeContainer}>
              <View style={styles.checkboxContainer}>
                <Text>Low:</Text>
                <Switch
                  value={!!temperatureThresholdLow}
                  onValueChange={(value) => setTemperatureThresholdLow(value ? '0' : '')}
                  disabled={!notificationsEnabled}
                />
                {!!temperatureThresholdLow && (
                  <TextInput
                    style={[styles.input, !notificationsEnabled && styles.disabled]}
                    placeholder="Low temperature threshold"
                    value={temperatureThresholdLow}
                    onChangeText={setTemperatureThresholdLow}
                    keyboardType="numeric"
                    editable={notificationsEnabled}
                  />
                )}
              </View>
              <Text>°C</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Wind Speed Threshold (mph)</Text>
            <View style={styles.thresholdTypeContainer}>
              <Switch
                value={showWindNotification}
                onValueChange={(value) => setShowWindNotification(value)}
                disabled={!notificationsEnabled}
              />
              {showWindNotification && (
                <TextInput
                  style={[styles.input, !notificationsEnabled && styles.disabled]}
                  placeholder="Wind speed threshold"
                  value={windSpeedThreshold}
                  onChangeText={setWindSpeedThreshold}
                  keyboardType="numeric"
                  editable={notificationsEnabled}
                />
              )}
              <Text>mph</Text>
            </View>
          </View>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Precipitation Threshold (mm)</Text>
            <View style={styles.thresholdTypeContainer}>
              <Switch
                value={showPrecipitationNotification}
                onValueChange={(value) => setShowPrecipitationNotification(value)}
                disabled={!notificationsEnabled}
              />
              {showPrecipitationNotification && (
                <TextInput
                  style={[styles.input, !notificationsEnabled && styles.disabled]}
                  placeholder="Precipitation threshold"
                  value={precipitationThreshold}
                  onChangeText={setPrecipitationThreshold}
                  keyboardType="numeric"
                  editable={notificationsEnabled}
                />
              )}
              <Text>mm</Text>
            </View>
          </View>
        </>
      )}
      <Button title="Save Preferences" onPress={savePreferences} disabled={!notificationsEnabled} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  section: {
    marginBottom: 20,
    width: '100%',
  },
  sectionTitle: {
    fontSize: 18,
    marginBottom: 10,
    fontWeight: 'bold',
  },
  preference: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
    width: '100%',
  },
  thresholdTypeContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    paddingHorizontal: 10,
    marginTop: 5,
    width: '70%',
  },
  disabled: {
    backgroundColor: '#f2f2f2',
    color: '#999',
  },
});

export default NotificationsScreen;
