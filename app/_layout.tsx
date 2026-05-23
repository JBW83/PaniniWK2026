import React from "react";
import { Tabs } from "expo-router";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarPosition: "top",
        tabBarShowLabel: true,

        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: "700",
        },

        tabBarStyle: {
          height: 64,
        },

        tabBarActiveTintColor: "#2563EB",
        tabBarInactiveTintColor: "#6B7280",
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: "Dashboard",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="home" size={size ?? 22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="explore"
        options={{
          title: "Verzameling",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="soccer-ball-o" size={size ?? 22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="trades"
        options={{
          title: "Dubbelen",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="exchange" size={size ?? 22} color={color} />
          ),
        }}
      />

      <Tabs.Screen
        name="missing"
        options={{
          title: "Ontbrekend",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="bookmark" size={size ?? 22} color={color} />
          ),
        }}
      />
    </Tabs>
  );
}