
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';

interface TodaysChallengeCardProps {
  challenge: string;
  environment: string;
  phrase: string;
  partner: string;
}

export default function TodaysChallengeCard({ 
  challenge, 
  environment, 
  phrase, 
  partner 
}: TodaysChallengeCardProps) {
  return (
    <View style={styles.challengeCard}>
      <View style={styles.challengeHeader}>
        <Text style={styles.challengeHeaderText}>Today&apos;s Challenge</Text>
      </View>

      <View style={styles.challengeContent}>
        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Challenge:</Text>
          <Text style={styles.challengeValue}>{challenge}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Environment:</Text>
          <Text style={styles.challengeValue}>{environment}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Phrase to say:</Text>
          <Text style={styles.phraseText}>{phrase}</Text>
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
    marginBottom: 24,
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
  phraseText: {
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
