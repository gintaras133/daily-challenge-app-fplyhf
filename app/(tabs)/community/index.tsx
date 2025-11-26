
import React from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

interface FriendVideo {
  id: string;
  username: string;
  timeAgo: string;
  likes: number;
  views: number;
  avatarColor: string;
}

export default function CommunityScreen() {
  // Sample data - in a real app, this would come from an API
  const todayChallenge = {
    title: "Do 20 push-ups",
    sponsor: "IKEA Sponsor",
    status: "Active",
  };

  const friendsVideos: FriendVideo[] = [
    {
      id: '1',
      username: '@sarah_adventures',
      timeAgo: '2h ago',
      likes: 234,
      views: 1240,
      avatarColor: '#ff6b6b',
    },
    {
      id: '2',
      username: '@mike_creates',
      timeAgo: '3h ago',
      likes: 567,
      views: 2130,
      avatarColor: '#ff6b6b',
    },
    {
      id: '3',
      username: '@emma_vibes',
      timeAgo: '4h ago',
      likes: 891,
      views: 3450,
      avatarColor: '#ff6b6b',
    },
    {
      id: '4',
      username: '@alex_creative',
      timeAgo: '5h ago',
      likes: 432,
      views: 1890,
      avatarColor: '#ff6b6b',
    },
  ];

  const communityStats = {
    friendsActive: 24,
    totalVideos: 156,
    timeLeft: '8h',
  };

  const handleMyLibrary = () => {
    router.push('/(tabs)/library');
  };

  const handleWinnersLounge = () => {
    router.push('/(tabs)/winner');
  };

  const handleLoadMore = () => {
    console.log('Load more friends videos');
  };

  return (
    <View style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <View style={styles.headerIcon}>
            <IconSymbol android_material_icon_name="people" size={28} color="#ffffff" />
          </View>
          <Text style={styles.headerTitle}>COMMUNITY HUB</Text>
          <Text style={styles.headerSubtitle}>See what your friends created today!</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtonsRow}>
          <TouchableOpacity style={styles.myLibraryButton} onPress={handleMyLibrary}>
            <IconSymbol android_material_icon_name="video-library" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>My Library</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.winnersLoungeButton} onPress={handleWinnersLounge}>
            <IconSymbol android_material_icon_name="emoji-events" size={20} color="#ffffff" />
            <Text style={styles.actionButtonText}>Winners Lounge</Text>
          </TouchableOpacity>
        </View>

        {/* Today's Challenge Card */}
        <View style={styles.todayChallengeCard}>
          <View style={styles.challengeIconRow}>
            <IconSymbol android_material_icon_name="schedule" size={20} color="#ffffff" />
            <Text style={styles.todayChallengeTitle}>Today&apos;s Challenge</Text>
          </View>
          <Text style={styles.challengeText}>{todayChallenge.title} • {todayChallenge.sponsor}</Text>
          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{todayChallenge.status}</Text>
          </View>
        </View>

        {/* Friends' Today Videos Section */}
        <Text style={styles.sectionTitle}>Friends&apos; Today Videos</Text>

        {/* Video Cards */}
        {friendsVideos.map((video, index) => (
          <View key={index} style={styles.videoCard}>
            <View style={styles.videoThumbnail}>
              <Text style={styles.videoPlaceholder}>Video</Text>
            </View>

            <View style={styles.videoInfo}>
              <View style={styles.videoHeader}>
                <View style={[styles.avatar, { backgroundColor: video.avatarColor }]} />
                <View style={styles.userDetails}>
                  <Text style={styles.username}>{video.username}</Text>
                  <Text style={styles.timeAgo}>{video.timeAgo}</Text>
                </View>
              </View>

              <Text style={styles.videoDescription}>
                Nailed the IKEA challenge! 🎯{'\n'}#BubblesBubbles
              </Text>

              <View style={styles.videoStats}>
                <View style={styles.statItem}>
                  <IconSymbol android_material_icon_name="favorite" size={16} color="#ff6b6b" />
                  <Text style={styles.statText}>{video.likes}</Text>
                </View>
                <View style={styles.statItem}>
                  <IconSymbol android_material_icon_name="visibility" size={16} color="#666666" />
                  <Text style={styles.statText}>{video.views}</Text>
                </View>
              </View>
            </View>
          </View>
        ))}

        {/* Load More Button */}
        <TouchableOpacity style={styles.loadMoreButton} onPress={handleLoadMore}>
          <Text style={styles.loadMoreText}>Load More Friends</Text>
        </TouchableOpacity>

        {/* Community Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.friendsActive}</Text>
            <Text style={styles.statLabel}>Friends Active</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.totalVideos}</Text>
            <Text style={styles.statLabel}>Total Videos</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>{communityStats.timeLeft}</Text>
            <Text style={styles.statLabel}>Left Today</Text>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#9b7dd4',
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  headerIcon: {
    marginBottom: 12,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: 8,
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 15,
    fontWeight: '500',
  },
  actionButtonsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  myLibraryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
  },
  winnersLoungeButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    borderRadius: 20,
    gap: 8,
  },
  actionButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  todayChallengeCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 20,
    padding: 20,
    marginBottom: 24,
  },
  challengeIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
  },
  todayChallengeTitle: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  challengeText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    marginBottom: 12,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#51cf66',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 12,
  },
  statusText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: '700',
  },
  sectionTitle: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 16,
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
  },
  videoThumbnail: {
    width: '100%',
    height: 120,
    backgroundColor: '#d9d9d9',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  videoPlaceholder: {
    color: '#888888',
    fontSize: 16,
    fontWeight: '500',
  },
  videoInfo: {
    gap: 12,
  },
  videoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  userDetails: {
    flex: 1,
  },
  username: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '400',
  },
  videoDescription: {
    color: '#333333',
    fontSize: 14,
    fontWeight: '500',
    lineHeight: 20,
  },
  videoStats: {
    flexDirection: 'row',
    gap: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 24,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '800',
    marginBottom: 4,
  },
  statLabel: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '600',
  },
});
