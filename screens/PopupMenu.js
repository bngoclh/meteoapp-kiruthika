// PopupMenu.js
import React from 'react';
import { View, Text, TouchableOpacity, Modal } from 'react-native';

const PopupMenu = ({ visible, onClose, onNotificationPress, onReportIssuePress, onUnitsPress }) => {
  return (
    <Modal visible={visible} transparent animationType="slide">
      <View style={{ flex: 1, backgroundColor: 'rgba(0, 0, 0, 0.5)', justifyContent: 'center', alignItems: 'center' }}>
        <View style={{ backgroundColor: 'white', padding: 20, borderRadius: 10, elevation: 5 }}>
          <TouchableOpacity onPress={onNotificationPress} style={{ paddingVertical: 10 }}>
            <Text>Notifications</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onReportIssuePress} style={{ paddingVertical: 10 }}>
            <Text>Signaler un problème</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onUnitsPress} style={{ paddingVertical: 10 }}>
            <Text>Unités</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onClose} style={{ marginTop: 20 }}>
            <Text style={{ color: 'blue' }}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
};

export default PopupMenu; 
