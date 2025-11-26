
import React from 'react';
import { NativeTabs, Icon, Label } from 'expo-router/unstable-native-tabs';

export default function TabLayout() {
  return (
    <NativeTabs>
      <NativeTabs.Trigger key="home" name="(home)">
        <Icon sf="house.fill" />
        <Label>Home</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="vote" name="vote">
        <Icon sf="hand.thumbsup.fill" />
        <Label>Vote</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="community" name="community">
        <Icon sf="person.2.fill" />
        <Label>Community</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="winner" name="winner">
        <Icon sf="trophy.fill" />
        <Label>Winner</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="library" name="library">
        <Icon sf="play.rectangle.on.rectangle.fill" />
        <Label>Library</Label>
      </NativeTabs.Trigger>
      <NativeTabs.Trigger key="profile" name="profile">
        <Icon sf="person.fill" />
        <Label>Profile</Label>
      </NativeTabs.Trigger>
    </NativeTabs>
  );
}
