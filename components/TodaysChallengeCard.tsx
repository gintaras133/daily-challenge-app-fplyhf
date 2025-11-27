
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface TodaysChallengeCardProps {
  task: string;
  constraint: string;
  skillMastery: string;
  duration: string;
  suggestion: string;
  partner: string;
}

export default function TodaysChallengeCard({ 
  task, 
  constraint, 
  skillMastery,
  duration,
  suggestion,
  partner 
}: TodaysChallengeCardProps) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeHeaderText}>Today&apos;s Task</Text>
      </View>

      <View style={styles.challengeContent}>
        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Task:</Text>
          <Text style={styles.challengeValue}>{task}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Constraint:</Text>
          <Text style={styles.challengeValue}>{constraint}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Skill Mastery:</Text>
          <Text style={styles.challengeValue}>{skillMastery}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Duration:</Text>
          <Text style={styles.challengeValue}>{duration}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Suggestion:</Text>
          <Text style={styles.suggestionText}>{suggestion}</Text>
        </View>

        <View style={styles.partnerSection}>
          <Text style={styles.partnerLabel}>Partner:</Text>
          <Text style={styles.partnerValue}>{partner}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  challengeCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    borderWidth: 4,
    borderColor: colors.accent,
    overflow: 'hidden',
  },
  challengeHeader: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    alignItems: 'center',
  },
  challengeHeaderText: {
    color: colors.secondary,
    fontSize: 20,
    fontWeight: '700',
  },
  challengeContent: {
    padding: 24,
  },
  challengeSection: {
    marginBottom: 20,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
  },
  challengeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 26,
  },
  suggestionText: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    fontStyle: 'italic',
    lineHeight: 26,
  },
  partnerSection: {
    paddingTop: 16,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
    marginTop: 4,
  },
  partnerLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.textMuted,
    marginBottom: 8,
  },
  partnerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
