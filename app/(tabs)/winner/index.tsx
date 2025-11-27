
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import TodaysChallengeCard from "@/components/TodaysChallengeCard";
import { useTask } from "@/contexts/TaskContext";

export default function WinnerScreen() {
  const { todayTask } = useTask();

  // Sample data - in a real app, this would come from an API
  const winner = {
    username: "@winner_user",
    date: "November 25, 2025",
    avatarColor: colors.primary,
  };

  const yesterdayStats = {
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
              android_material_icon_name="emoji-events" 
              size={32} 
              color={colors.text}
            />
            <Text style={styles.lastWinnerTitle}>LAST WINNER</Text>
            <IconSymbol 
              android_material_icon_name="emoji-events" 
              size={32} 
              color={colors.text}
            />
          </View>

          <View style={styles.timerContainer}>
            <IconSymbol 
              android_material_icon_name="schedule" 
              size={20} 
              color={colors.text}
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
              android_material_icon_name="emoji-events" 
              size={20} 
              color={colors.text}
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
          <Text style={styles.yesterdayTitle}>Yesterday&apos;s Task</Text>
          <TodaysChallengeCard
            task={todayTask.task}
            constraint={todayTask.constraint}
            skillMastery={todayTask.skillMastery}
            duration={todayTask.duration}
            suggestion={todayTask.suggestion}
            partner={todayTask.partner}
          />
        </View>

        {/* Stats Section */}
        <View style={styles.statsCard}>
          <View style={styles.statsContainer}>
            <View style={styles.statItem}>
              <IconSymbol 
                android_material_icon_name="favorite" 
                size={20} 
                color={colors.accent}
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{(yesterdayStats.likes / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Likes</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                android_material_icon_name="visibility" 
                size={20} 
                color={colors.secondary}
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{(yesterdayStats.views / 1000).toFixed(1)}k</Text>
                <Text style={styles.statLabel}>Views</Text>
              </View>
            </View>

            <View style={styles.statItem}>
              <IconSymbol 
                android_material_icon_name="trending-up" 
                size={20} 
                color={colors.primary}
              />
              <View style={styles.statTextContainer}>
                <Text style={styles.statNumber}>{yesterdayStats.engagement}%</Text>
                <Text style={styles.statLabel}>Engagement</Text>
              </View>
            </View>
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShare}>
              <IconSymbol 
                android_material_icon_name="share" 
                size={20} 
                color={colors.text}
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
          <Text style={styles.shareMessageBold}>This video was shared {yesterdayStats.shareCount.toLocaleString()} times on social media!</Text> 🚀
        </Text>

        {/* Winners Lounge Button */}
        <TouchableOpacity 
          style={styles.winnersLoungeButton}
          onPress={handleWinnersLounge}
          activeOpacity={0.8}
        >
          <View style={styles.loungeButtonContent}>
            <IconSymbol 
              android_material_icon_name="celebration" 
              size={28} 
              color={colors.text}
            />
            <View style={styles.loungeTextContainer}>
              <Text style={styles.loungeButtonTitle}>VIEW WINNERS LOUNGE</Text>
              <Text style={styles.loungeButtonSubtitle}>See all past champions & challenges</Text>
            </View>
            <IconSymbol 
              android_material_icon_name="emoji-events" 
              size={28} 
              color={colors.text}
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
    paddingTop: 48,
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
    color: colors.text,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  congratsText: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  winnerCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    marginBottom: 24,
  },
  placeBadge: {
    position: 'absolute',
    top: 24,
    left: 24,
    backgroundColor: colors.accent,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    zIndex: 10,
  },
  placeBadgeText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  videoPreview: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  videoPlaceholder: {
    color: colors.text,
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
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  date: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '400',
  },
  followButton: {
    backgroundColor: colors.accent,
    paddingHorizontal: 24,
    paddingVertical: 10,
    borderRadius: 20,
  },
  followButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '700',
  },
  challengeCardContainer: {
    marginBottom: 24,
  },
  yesterdayTitle: {
    color: colors.text,
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
    borderBottomWidth: 2,
    borderBottomColor: colors.accent,
  },
  statItem: {
    alignItems: 'center',
    gap: 8,
  },
  statTextContainer: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
  },
  statLabel: {
    color: colors.text,
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
    backgroundColor: colors.secondary,
    paddingVertical: 14,
    borderRadius: 16,
    gap: 8,
  },
  watchAgainButton: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.accent,
    paddingVertical: 14,
    borderRadius: 16,
  },
  actionButtonText: {
    color: colors.text,
    fontSize: 15,
    fontWeight: '700',
  },
  shareMessage: {
    color: colors.text,
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
    backgroundColor: colors.accent,
    borderRadius: 24,
    padding: 24,
    marginBottom: 24,
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
    color: colors.text,
    fontSize: 18,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 4,
  },
  loungeButtonSubtitle: {
    color: colors.text,
    fontSize: 13,
    fontWeight: '500',
  },
});
