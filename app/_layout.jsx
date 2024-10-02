import React from 'react';
import { Stack } from 'expo-router';
import { TailwindProvider } from 'tailwindcss-react-native';

// Layout component for setting up navigation and passing data
const Layout = () => {
  return (
    <TailwindProvider>
      <Stack>
        {/* Define your screens here */}
        <Stack.Screen name="screens/Login" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Register" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Home" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ItemDetail" options={{ headerShown: false }} />
        <Stack.Screen name="screens/ChatScreen" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Cart" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Order" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Orders" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Profile" options={{ headerShown: false }} />
        <Stack.Screen name="screens/Map" options={{ headerShown: false }} />
        <Stack.Screen name="screens/predict" options={{ headerShown: false }} />
        <Stack.Screen name="screens/trend" options={{ headerShown: false }} />
      </Stack>
    </TailwindProvider>
  );
};

export default Layout;
