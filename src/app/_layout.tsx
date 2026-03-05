/**
 * Echo - Root Layout for Expo Router
 * This replaces the NavigationContainer approach
 */

import { useFonts } from 'expo-font'
import { Stack } from 'expo-router'
import * as SplashScreen from 'expo-splash-screen'
import { StatusBar } from 'expo-status-bar'
import React, { useEffect } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { AppProvider } from '../../context/AppContext'

// Prevent the splash screen from auto-hiding before fonts are loaded
SplashScreen.preventAutoHideAsync()

export default function RootLayout() {
  const [fontsLoaded, fontsError] = useFonts({
    'ClashDisplay-Bold': require('../assets/fonts/ClashDisplay-Bold.otf'),
    'ClashDisplay-Semibold': require('../assets/fonts/ClashDisplay-Semibold.otf'),
    'ClashDisplay-Medium': require('../assets/fonts/ClashDisplay-Medium.otf'),
    'ClashDisplay-Regular': require('../assets/fonts/ClashDisplay-Regular.otf'),
    'ClashDisplay-Light': require('../assets/fonts/ClashDisplay-Light.otf'),
    'ClashDisplay-Extralight': require('../assets/fonts/ClashDisplay-Extralight.otf'),
  })

  useEffect(() => {
    if (fontsLoaded || fontsError) {
      // Hide the splash screen after fonts are loaded
      SplashScreen.hideAsync()
    }
  }, [fontsLoaded, fontsError])

  if (!fontsLoaded && !fontsError) {
    return null
  }

  return (
    <SafeAreaProvider>
      <StatusBar style="light" />
      <AppProvider>
        <Stack
          screenOptions={{
            headerShown: false,
            contentStyle: { backgroundColor: '#0a0015' },
            animation: 'slide_from_right',
          }}
        >
          <Stack.Screen name="index" />
          <Stack.Screen name="connect-wallet" />
          <Stack.Screen name="device-verification" />
          <Stack.Screen name="dashboard" />
          <Stack.Screen name="settings" options={{ presentation: 'modal' }} />
          <Stack.Screen name="x-banner-update" />
        </Stack>
      </AppProvider>
    </SafeAreaProvider>
  )
}
