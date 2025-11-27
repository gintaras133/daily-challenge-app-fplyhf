
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

function RootLayoutNav() {
  const colorScheme = useColorScheme();
  const { session, userProfile, loading, profileChecked } = useAuth();

  const [loaded] = useFonts({
    SpaceMono: require('../assets/fonts/SpaceMono-Regular.ttf'),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  useEffect(() => {
    if (!loading && profileChecked) {
      console.log('Session:', session);
      console.log('User Profile:', userProfile);
      
      if (!session) {
        // No session, redirect to login
        router.replace('/auth/login');
      } else if (!userProfile || !userProfile.onboarding_completed) {
        // Session exists but onboarding not completed
        router.replace('/auth/onboarding');
      } else {
        // Session exists and onboarding completed
        router.replace('/(tabs)/(home)');
      }
    }
  }, [session, userProfile, loading, profileChecked]);

  if (!loaded || loading || !profileChecked) {
    return null;
  }

  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="auth" options={{ headerShown: false }} />
        <Stack.Screen name="+not-found" />
        <Stack.Screen 
          name="modal" 
          options={{ 
            presentation: 'modal',
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="formsheet" 
          options={{ 
            presentation: 'formSheet',
            sheetAllowedDetents: [0.5, 0.8],
            sheetGrabberVisible: true,
            headerShown: false 
          }} 
        />
        <Stack.Screen 
          name="transparent-modal" 
          options={{ 
            presentation: 'transparentModal',
            animation: 'fade',
            headerShown: false 
          }} 
        />
      </Stack>
      <StatusBar style="auto" />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <TaskProvider>
        <RootLayoutNav />
      </TaskProvider>
    </AuthProvider>
  );
}
