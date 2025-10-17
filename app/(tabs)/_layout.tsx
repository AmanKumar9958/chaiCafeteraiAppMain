// File: app/(tabs)/_layout.jsx
import { Ionicons } from '@expo/vector-icons';
import { Tabs } from 'expo-router';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={({ route }) => ({
        headerShown: false,
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: string | undefined;
          if (route.name === 'index') iconName = focused ? 'home' : 'home-outline';
          else if (route.name === 'cart') iconName = focused ? 'cart' : 'cart-outline';
          else if (route.name === 'orders') iconName = focused ? 'receipt' : 'receipt-outline';
          else if (route.name === 'profile') iconName = focused ? 'person-circle' : 'person-circle-outline';
          return <Ionicons name={iconName as any} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#ea580c',
        tabBarInactiveTintColor: 'gray',
        tabBarShowLabel: false,
      })}
    >
      <Tabs.Screen name="index" />
      <Tabs.Screen name="cart" />
      <Tabs.Screen name="orders" />
      <Tabs.Screen name="profile" />
    </Tabs>
  );
}