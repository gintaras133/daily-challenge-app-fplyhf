
import "react-native-reanimated";
import React, { useEffect } from "react";
import { useFonts } from "expo-font";
import { Stack, router, useSegments } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { SystemBars } from "react-native-edge-to-edge";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useColorScheme, Alert } from "react-native";
import { useNetworkState } from "expo-network";
import {
  DarkTheme,
  DefaultTheme,
  Theme,
  ThemeProvider,
} from "@react-navigation/native";
import { StatusBar } from "expo-status-bar";
import { WidgetProvider } from "@/contexts/WidgetContext";
import { AuthProvider, useAuth } from "@/contexts/AuthContext";

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export const unstable_settings = {
  initialRouteName: "(tabs)",
};

function RootLayoutNav() {
  const { session, user, userProfile, loading } = useAuth();
  const segments = useSegments();
  const colorScheme = useColorScheme();
  const networkState = useNetworkState();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === 'auth';
    const inTabsGroup = segments[0] === '(tabs)';

    console.log('Navigation check:', {
      session: !!session,
      user: !!user,
      userProfile: !!userProfile,
      onboardingCompleted: userProfile?.onboarding_completed,
      inAuthGroup,
      inTabsGroup,
      segments,
    });

    if (!session) {
      // User is not signed in, redirect to login
      if (!inAuthGroup) {
        router.replace('/auth/login');
      }
    } else if (session && user) {
      // User is signed in
      if (!userProfile || !userProfile.onboarding_completed) {
        // User hasn't completed onboarding
        if (segments[1] !== 'onboarding') {
          router.replace('/auth/onboarding');
        }
      } else {
        // User has completed onboarding, allow access to app
        if (inAuthGroup) {
          router.replace('/(tabs)/(home)/');
        }
      }
    }
  }, [session, user, userProfile, loading, segments]);

  React.useEffect(() => {
    if (
      !networkState.isConnected &&
      networkState.isInternetReachable === false
    ) {
      Alert.alert(
        "🔌 You are offline",
        "You can keep using the app! Your changes will be saved locally and synced when you are back online."
      );
    }
  }, [networkState.isConnected, networkState.isInternetReachable]);

  const CustomDefaultTheme: Theme = {
    ...DefaultTheme,
    dark: false,
    colors: {
      primary: "rgb(0, 122, 255)",
      background: "rgb(242, 242, 247)",
      card: "rgb(255, 255, 255)",
      text: "rgb(0, 0, 0)",
      border: "rgb(216, 216, 220)",
      notification: "rgb(255, 59, 48)",
    },
  };

  const CustomDarkTheme: Theme = {
    ...DarkTheme,
    colors: {
      primary: "rgb(10, 132, 255)",
      background: "rgb(1, 1, 1)",
      card: "rgb(28, 28, 30)",
      text: "rgb(255, 255, 255)",
      border: "rgb(44, 44, 46)",
      notification: "rgb(255, 69, 58)",
    },
  };

  return (
    <ThemeProvider
      value={colorScheme === "dark" ? CustomDarkTheme : CustomDefaultTheme}
    >
      <Stack
        screenOptions={{
          headerShown: false,
        }}
      >
        <Stack.Screen name="auth" />
        <Stack.Screen name="(tabs)" />
        <Stack.Screen
          name="modal"
          options={{
            presentation: "modal",
            title: "Standard Modal",
          }}
        />
        <Stack.Screen
          name="formsheet"
          options={{
            presentation: "formSheet",
            title: "Form Sheet Modal",
            sheetGrabberVisible: true,
            sheetAllowedDetents: [0.5, 0.8, 1.0],
            sheetCornerRadius: 20,
          }}
        />
        <Stack.Screen
          name="transparent-modal"
          options={{
            presentation: "transparentModal",
            headerShown: false,
          }}
        />
      </Stack>
      <SystemBars style={"auto"} />
    </ThemeProvider>
  );
}

export default function RootLayout() {
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <>
      <StatusBar style="auto" animated />
      <GestureHandlerRootView style={{ flex: 1 }}>
        <WidgetProvider>
          <AuthProvider>
            <RootLayoutNav />
          </AuthProvider>
        </WidgetProvider>
      </GestureHandlerRootView>
    </>
  );
}
