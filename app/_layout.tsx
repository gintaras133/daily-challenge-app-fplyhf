
import { DarkTheme, DefaultTheme, ThemeProvider } from '@react-navigation/native';
import { useFonts } from 'expo-font';
import { Stack, router } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';
import 'react-native-reanimated';
import { useColorScheme, View, Text, ActivityIndicator, StyleSheet } from 'react-native';
import { AuthProvider, useAuth } from '@/contexts/AuthContext';
import { TaskProvider } from '@/contexts/TaskContext';
import { colors } from '@/styles/commonStyles';

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
    console.log('=== AUTH STATE DEBUG ===');
    console.log('Loading:', loading);
    console.log('Profile Checked:', profileChecked);
    console.log('Session exists:', !!session);
    console.log('User Profile:', userProfile);
    console.log('Onboarding completed:', userProfile?.onboarding_completed);
    console.log('========================');

    if (!loading && profileChecked) {
      if (!session) {
        // No session, redirect to login
        console.log('No session - redirecting to login');
        router.replace('/auth/login');
      } else if (!userProfile || !userProfile.onboarding_completed) {
        // Session exists but onboarding not completed
        console.log('Session exists but onboarding not completed - redirecting to onboarding');
        router.replace('/auth/onboarding');
      } else {
        // Session exists and onboarding completed
        console.log('Session and onboarding complete - redirecting to home');
        router.replace('/(tabs)/(home)');
      }
    }
  }, [session, userProfile, loading, profileChecked]);

  // Show loading screen while fonts are loading or auth is checking
  if (!loaded || loading || !profileChecked) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingTitle}>BLOOP</Text>
        <ActivityIndicator size="large" color={colors.primary} style={styles.loadingSpinner} />
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
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

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.background,
  },
  loadingTitle: {
    fontSize: 48,
    fontWeight: '900',
    color: '#003399',
    letterSpacing: 2,
    marginBottom: 40,
  },
  loadingSpinner: {
    marginBottom: 20,
  },
  loadingText: {
    fontSize: 16,
    color: colors.text,
    fontWeight: '600',
  },
});
