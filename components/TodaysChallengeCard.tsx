
import React from 'react';
import { StyleSheet, View, Text } from 'react-native';
import { colors } from '@/styles/commonStyles';
import VideoPreview from '@/components/VideoPreview';

interface TodaysChallengeCardProps {
  challenge: string;
  guidelines: string;
  conqueredFear: string;
  duration: string;
  reward: string;
  partner?: string;
  showTitle?: boolean;
  sampleVideoUrl?: string;
}

export default function TodaysChallengeCard({ 
  challenge, 
  guidelines, 
  conqueredFear,
  duration,
  reward,
  partner,
  showTitle = false,
  sampleVideoUrl
}: TodaysChallengeCardProps) {
  return (
    <View style={styles.challengeCard}>
      {showTitle && (
        <View style={styles.challengeHeader}>
          <Text style={styles.challengeHeaderText}>Today&apos;s Task</Text>
        </View>
      )}

      <View style={styles.challengeContent}>
        {/* Sample Video Preview */}
        {sampleVideoUrl && (
          <View style={styles.videoSection}>
            <Text style={styles.videoLabel}>Sample Video:</Text>
            <View style={styles.videoContainer}>
              <VideoPreview
                videoUrl={sampleVideoUrl}
                width={280}
                height={160}
                borderRadius={16}
                showPlayButton={true}
                autoPlay={false}
                muted={true}
              />
            </View>
            <Text style={styles.videoHint}>Watch this example to get inspired!</Text>
          </View>
        )}

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Challenge:</Text>
          <Text style={styles.challengeValue}>{challenge}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Guidelines:</Text>
          <Text style={styles.challengeValue}>{guidelines}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Conquered fear:</Text>
          <Text style={styles.challengeValue}>{conqueredFear}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Duration:</Text>
          <Text style={styles.challengeValue}>{duration}</Text>
        </View>

        <View style={styles.challengeSection}>
          <Text style={styles.challengeLabel}>Reward:</Text>
          <Text style={styles.rewardText}>{reward}</Text>
        </View>

        {partner && (
          <View style={styles.partnerSection}>
            <Text style={styles.partnerLabel}>Partner:</Text>
            <Text style={styles.partnerValue}>{partner}</Text>
          </View>
        )}
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
  videoSection: {
    marginBottom: 24,
    alignItems: 'center',
  },
  videoLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 12,
    alignSelf: 'flex-start',
  },
  videoContainer: {
    width: '100%',
    alignItems: 'center',
    marginBottom: 8,
  },
  videoHint: {
    fontSize: 13,
    fontStyle: 'italic',
    color: colors.textMuted,
    textAlign: 'center',
  },
  challengeSection: {
    marginBottom: 20,
  },
  challengeLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 8,
  },
  challengeValue: {
    fontSize: 18,
    fontWeight: '500',
    color: colors.text,
    lineHeight: 26,
  },
  rewardText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.accent,
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
    fontWeight: 'bold',
    color: colors.textMuted,
    marginBottom: 8,
  },
  partnerValue: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.text,
  },
});
