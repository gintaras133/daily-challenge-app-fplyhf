
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { IconSymbol } from '@/components/IconSymbol';
import { colors } from '@/styles/commonStyles';

interface WinsStreaksCardProps {
  wins: number;
  streak: number;
}

export function WinsStreaksCard({ wins, streak }: WinsStreaksCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="trophy.fill"
            android_material_icon_name="emoji-events" 
            size={32} 
            color="#FFD700"
          />
        </View>
        <Text style={styles.number}>{wins}</Text>
        <Text style={styles.label}>Wins</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.iconContainer}>
          <IconSymbol 
            ios_icon_name="flame.fill"
            android_material_icon_name="local-fire-department" 
            size={32} 
            color="#FF6B35"
          />
        </View>
        <Text style={styles.number}>{streak}</Text>
        <Text style={styles.label}>Streak</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    gap: 16,
    justifyContent: 'center',
    alignItems: 'center',
    marginVertical: 20,
  },
  card: {
    backgroundColor: colors.secondary,
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: 120,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  iconContainer: {
    marginBottom: 8,
  },
  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 4,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
});
