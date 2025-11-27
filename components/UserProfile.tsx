
import React from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface UserProfileProps {
  username: string;
  avatarUrl?: string;
  size?: 'small' | 'medium' | 'large';
  showUsername?: boolean;
  additionalInfo?: string;
}

export function UserProfile({ 
  username, 
  avatarUrl, 
  size = 'medium',
  showUsername = true,
  additionalInfo 
}: UserProfileProps) {
  const sizeMap = {
    small: 32,
    medium: 48,
    large: 64,
  };

  const avatarSize = sizeMap[size];
  const fontSize = size === 'small' ? 14 : size === 'large' ? 18 : 16;

  return (
    <View style={styles.container}>
      {avatarUrl ? (
        <Image 
          source={{ uri: avatarUrl }} 
          style={[styles.avatar, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}
        />
      ) : (
        <View style={[styles.avatarPlaceholder, { width: avatarSize, height: avatarSize, borderRadius: avatarSize / 2 }]}>
          <Text style={styles.avatarInitial}>{username.charAt(1).toUpperCase()}</Text>
        </View>
      )}
      {showUsername && (
        <View style={styles.textContainer}>
          <Text style={[styles.username, { fontSize }]}>{username}</Text>
          {additionalInfo && (
            <Text style={styles.additionalInfo}>{additionalInfo}</Text>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    backgroundColor: colors.secondary,
  },
  avatarPlaceholder: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarInitial: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  textContainer: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontWeight: '600',
    marginBottom: 2,
  },
  additionalInfo: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '400',
  },
});
