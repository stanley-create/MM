import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import AdventureScreen from './src/screens/AdventureScreen';
import { AnalysisScreen, TaskScreen, GuildScreen, SettingsScreen } from './src/screens/Screens';
import { COLORS } from './src/styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { View, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import RecordModal from './src/components/RecordModal';
import { recordAPI } from './src/services/api';

const Tab = createBottomTabNavigator();

const RecordButton = ({ onPress }) => (
  <TouchableOpacity
    style={styles.recordButton}
    onPress={onPress}
  >
    <Ionicons name="add" size={32} color={COLORS.white} />
  </TouchableOpacity>
);

export default function App() {
  const [modalVisible, setModalVisible] = useState(false);

  const handleSaveRecord = async (data) => {
    try {
      const res = await recordAPI.create(data);
      Alert.alert("冒險達成！", res.data.npc_message);
    } catch (e) {
      Alert.alert("同步失敗", "連不上冒險公會，請檢查網路。");
    }
  };

  return (
    <NavigationContainer>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          tabBarIcon: ({ focused, color, size }) => {
            let iconName;
            if (route.name === 'Adventure') iconName = focused ? 'map' : 'map-outline';
            else if (route.name === 'Analysis') iconName = focused ? 'bar-chart' : 'bar-chart-outline';
            else if (route.name === 'Tasks') iconName = focused ? 'list' : 'list-outline';
            else if (route.name === 'Guild') iconName = focused ? 'people' : 'people-outline';

            return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary,
          tabBarInactiveTintColor: 'gray',
          tabBarStyle: { height: 60, paddingBottom: 10 },
          headerShown: false,
        })}
      >
        <Tab.Screen name="Adventure" component={AdventureScreen} />
        <Tab.Screen name="Analysis" component={AnalysisScreen} />
        <Tab.Screen
          name="Record"
          component={View} // Dummy
          options={{
            tabBarButton: (props) => (
              <RecordButton {...props} onPress={() => setModalVisible(true)} />
            ),
          }}
        />
        <Tab.Screen name="Tasks" component={TaskScreen} />
        <Tab.Screen name="Guild" component={GuildScreen} />
      </Tab.Navigator>

      <RecordModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        onSave={handleSaveRecord}
      />
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  recordButton: {
    top: -20,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: COLORS.secondary,
    width: 60,
    height: 60,
    borderRadius: 30,
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
});
