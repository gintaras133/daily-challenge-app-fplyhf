
import React from 'react';
import { Stack } from 'expo-router';
import FloatingTabBar, { TabBarItem } from '@/components/FloatingTabBar';

export default function TabLayout() {
  // Define the tabs configuration
  const tabs: TabBarItem[] = [
    {
      name: '(home)',
      route: '/(tabs)/(home)/',
      icon: 'home',
      label: 'Home',
    },
    {
      name: 'vote',
      route: '/(tabs)/vote',
      icon: 'how-to-vote',
      label: 'Vote',
    },
    {
      name: 'winner',
      route: '/(tabs)/winner',
      icon: 'emoji-events',
      label: 'Winner',
    },
    {
      name: 'library',
      route: '/(tabs)/library',
      icon: 'video-library',
      label: 'Library',
    },
    {
      name: 'profile',
      route: '/(tabs)/profile',
      icon: 'person',
      label: 'Profile',
    },
  ];

  // For Android and Web, use Stack navigation with custom floating tab bar
  return (
    <>
      <Stack
        screenOptions={{
          headerShown: false,
          animation: 'none', // Remove fade animation to prevent black screen flash
        }}
      >
        <Stack.Screen key="home" name="(home)" />
        <Stack.Screen key="vote" name="vote" />
        <Stack.Screen key="winner" name="winner" />
        <Stack.Screen key="library" name="library" />
        <Stack.Screen key="profile" name="profile" />
      </Stack>
      <FloatingTabBar tabs={tabs} />
    </>
  );
}
