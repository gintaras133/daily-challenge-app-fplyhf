
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";

export default function WinnerScreen() {
  // Sample data - in a real app, this would come from an API
  const winner = {
    username: "@winner_user",
    date: "November 25, 2025",
    avatarColor: "#ffcc00",
  };

  const yesterdayChallenge = {
    challenge: "Assemble furniture in 60 seconds",
    environment: "Your living room or any indoor space",
    phrase: "Where's the instructions manual?!",
    partner: "CapCut",
    likes: 45200,
    views: 98500,
    engagement: 94,
    shareCount: 2341,
  };

  const timeUntilNext = {
    hours: 2,
    minutes: 10,
  };

  const handleWinnersLounge = () => {
    console.log('Navigate to Winners Lounge');
    router.push('/winner/winners-lounge');
  };

  const handleShare = () => {
    console.log('Share video');
    // In a real app, this would open share dialog
  };

  const handleWatchAgain = () => {
    console.log('Watch video again');
    // In a real app, this would replay the winning video
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Winner Announcement Section */}
        <View style={styles.winnerSection}>
          <View style={styles.trophyRow}>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              size={32} 
              color="#ffffff"
            />
            <Text style={styles.lastWinnerTitle}>LAST WINNER</Text>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              size={32} 
              color="#ffffff"
            />
          </View>

          <View style={styles.timerContainer}>
            <IconSymbol 
              ios_icon_name="clock.fill" 
              size={20} 
              color="#ffffff"
            />
            <Text style={styles.timerText}>
              New one announced in {timeUntilNext.hours} hours {timeUntilNext.minutes} min
            </Text>
          </View>

          <Text style={styles.congratsText}>Congratulations to our champion! 🎉</Text>
        </View>

        {/* Winner Video Card */}
        <View style={styles.winnerCard}>
          <View style={styles.placeBadge}>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              size={20} 
              color="#ffffff"
            />
            <Text style={styles.placeBadgeText}>1st Place</Text>
          </View>

          <View style={styles.videoPreview}>
            <Text style={styles.videoPlaceholder}>Winning Video</Text>
          </View>

          <View style={styles.winnerInfo}>
            <View style={[styles.avatar, { backgroundColor: winner.avatarColor }]} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{winner.username}</Text>
              <Text style={styles.date}>{winner.date}</Text>
            </View>
            <TouchableOpacity style={styles.followButton}>
              <Text style={styles.followButtonText}>Follow</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Yesterday's Challenge Card */}
        <View style={styles.challengeCardContainer}>
          <Text style={styles.yesterdayTitle}>Yesterday&apos;s Challenge</Text>
          <TodaysChallengeCard
            challenge={yesterdayChallenge.challenge}
            environment={yesterdayChallenge.environment}
            phrase={yesterdayChallenge.phrase}
            partner={yesterdayChallenge.partner}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="heart.fill" 
                size={20} 
                color="#ff6b6b"
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{(yesterdayChallenge.likes / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="eye.fill" 
                size={20} 
                color="#5dade2"
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{(yesterdayChallenge.views / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                ios_icon_name="chart.line.uptrend.xyaxis" 
                size={20} 
                color="#51cf66"
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{yesterdayChallenge.engagement}%</Text>
                <Text style={styles.statLabel}>Engagement</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <IconSymbol 
                ios_icon_name="square.and.arrow.up" 
                size={20} 
                color="#ffffff"
              />
              <Text style={styles.actionButtonText}>Share</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.watchAgainButton} onPress={handleWatchAgain}>
              <Text style={styles.actionButtonText}>Watch Again</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Social Share Message */}
        <Text style={styles.shareMessage}>
          <Text style={styles.shareMessageBold}>This video was shared {yesterdayChallenge.shareCount.toLocaleString()} times on social media!</Text> 🚀
        </Text>

        {/* Winners Lounge Button */}
        <TouchableOpacity 
          style={styles.winnersLoungeButton}
          onPress={handleWinnersLounge}
          activeOpacity={0.8}
        >
          <View style={styles.loungeButtonContent}>
            <IconSymbol 
              ios_icon_name="party.popper.fill" 
              size={28} 
              color="#ffffff"
            />
            <View style={styles.loungeTextContainer}>
              <Text style={styles.loungeButtonTitle}>VIEW WINNERS LOUNGE</Text>
              <Text style={styles.loungeButtonSubtitle}>See all past champions & challenges</Text>
            </View>
            <IconSymbol 
              ios_icon_name="trophy.fill" 
              size={28} 
              color="#ffffff"
            />
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.secondary,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  winnerSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  trophyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 12,
  },
  lastWinnerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 2,
  },
  timerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 12,
  },
  timerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
  },
  congratsText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  winnerCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
  },
  placeBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  placeBadgeText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  videoPreview: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: '#d9d9d9',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  videoPlaceholder: {
    color: '#888888',
    fontSize: 18,
    fontWeight: '500',
  },
  winnerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },
  userInfo: {
    flex: 1,
  },
  username: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '400',
  },
  followButton: {
    backgroundColor: '#ff6b6b',
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  challengeCardContainer: {
    marginBottom: 24,
  },
  yesterdayTitle: {
    color: '#ffffff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
    textAlign: 'center',
  },
  statsCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 16,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.3)',
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  shareButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#5dade2',
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  watchAgainButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  shareMessage: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  shareMessageBold: {
    fontWeight: '700',
  },
  winnersLoungeButton: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
    shadowColor: colors.primary,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
  },
  loungeButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: 16,
  },
  loungeTextContainer: {
    flex: 1,
    alignItems: 'center',
  },
  loungeButtonTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  loungeButtonSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
});
