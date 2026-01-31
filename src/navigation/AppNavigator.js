import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { Ionicons } from "@expo/vector-icons";
import { View, TouchableOpacity, StyleSheet } from "react-native";

// Screens
import DashboardScreen from "../screens/DashboardScreen";
import RecordsScreen from "../screens/RecordsScreen";
import { QuestScreen, CommunityScreen, AuthScreen } from "../screens";
import CombinedScreen from "../screens/CombinedScreen";
import { COLORS } from "../constants/theme";

const Tab = createBottomTabNavigator();
const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

// Custom Floating Button
const CustomTabBarButton = ({ children, onPress }) => (
  <TouchableOpacity
    style={{
      top: -20,
      justifyContent: "center",
      alignItems: "center",
      ...styles.shadow,
    }}
    onPress={onPress}
  >
    <View
      style={{
        width: 70,
        height: 70,
        borderRadius: 35,
        backgroundColor: COLORS.accent,
      }}
    >
      {children}
    </View>
  </TouchableOpacity>
);

function MainTabs() {
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: false,
        tabBarStyle: {
          position: "absolute",
          bottom: 25,
          left: 20,
          right: 20,
          elevation: 0,
          backgroundColor: "#ffffff",
          borderRadius: 15,
          height: 90,
          ...styles.shadow,
        },
      }}
    >
      <Tab.Screen
        name="Dashboard"
        component={DashboardScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Ionicons
                name={focused ? "map" : "map-outline"}
                size={25}
                color={focused ? COLORS.primary : "#748c94"}
              />
            </View>
          ),
        }}
      />

      <Tab.Screen
        name="AddRecord"
        component={RecordsScreen} // This will be a modal trigger in reality
        options={{
          tabBarIcon: ({ focused }) => (
            <Ionicons name="add" size={35} color={COLORS.white} />
          ),
          tabBarButton: (props) => <CustomTabBarButton {...props} />,
        }}
        listeners={({ navigation }) => ({
          tabPress: (e) => {
            e.preventDefault();
            navigation.navigate("RecordModal");
          },
        })}
      />

      <Tab.Screen
        name="QuestComm"
        component={CombinedScreen}
        options={{
          tabBarIcon: ({ focused }) => (
            <View
              style={{
                alignItems: "center",
                justifyContent: "center",
                top: 10,
              }}
            >
              <Ionicons
                name={focused ? "people" : "people-outline"}
                size={25}
                color={focused ? COLORS.primary : "#748c94"}
              />
            </View>
          ),
        }}
      />
    </Tab.Navigator>
  );
}

import SettingsScreen from "../screens/SettingsScreen";

function DrawerNav() {
  return (
    <Drawer.Navigator
      screenOptions={{
        drawerActiveTintColor: COLORS.primary,
        headerShown: false, // We hide drawer header to use Tab's or Custom
      }}
    >
      <Drawer.Screen
        name="Home"
        component={MainTabs}
        options={{ title: "Adventure Map" }}
      />
      <Drawer.Screen
        name="Settings"
        component={SettingsScreen}
        options={{ title: "Settings" }}
      />
    </Drawer.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <Stack.Navigator initialRouteName="Auth">
      <Stack.Screen
        name="Auth"
        component={AuthScreen}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="MainBox"
        component={DrawerNav}
        options={{ headerShown: false }}
      />
      <Stack.Screen
        name="RecordModal"
        component={RecordsScreen}
        options={{
          presentation: "modal",
          headerShown: false,
          animation: "slide_from_bottom",
        }}
      />
    </Stack.Navigator>
  );
}

const styles = StyleSheet.create({
  shadow: {
    shadowColor: "#7F5DF0",
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.5,
    elevation: 5,
  },
});
