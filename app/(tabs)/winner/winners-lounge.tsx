
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";
import VideoComparisonModal from "@/components/VideoComparisonModal";

export default function WinnersLoungeScreen() {
  const [clickedVideos, setClickedVideos] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [currentComparisonPair, setCurrentComparisonPair] = useState<number>(0);

  // Sample data for previous winners
  const previousWinners = [
    {
      id: '1',
      username: "@jessica_films",
      avatarUrl: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop",
      date: "Nov 25, 2025",
      challenge: "Dance in a library",
      phrase: "Shhh... it's party time!",
      sponsor: "Spotify",
      likes: 45200,
      views: 98500,
      engagement: 94,
      rank: "#1",
    },
    {
      id: '2',
      username: "@yoga_queen",
      avatarUrl: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&h=200&fit=crop",
      date: "Nov 24, 2025",
      challenge: "Yoga pose at a bus stop",
      phrase: "Namaste everyone!",
      sponsor: "Lululemon",
      likes: 38400,
      views: 82100,
      engagement: 91,
      rank: "#2",
    },
    {
      id: '3',
      username: "@singin_sam",
      avatarUrl: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop",
      date: "Nov 23, 2025",
      challenge: "Sing in a car wash",
      phrase: "Splish splash taking a bath!",
      sponsor: "Shell",
      likes: 52300,
      views: 105600,
      engagement: 96,
      rank: "#3",
    },
    {
      id: '4',
      username: "@chef_mike",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
      date: "Nov 22, 2025",
      challenge: "Cook an egg on the street",
      phrase: "Too hot to handle!",
      sponsor: "HelloFresh",
      likes: 41900,
      views: 89200,
      engagement: 89,
      rank: "#4",
    },
  ];

  // Additional video pairs for the comparison modal
  const comparisonPairs = [
    {
      video1: {
        id: '5',
        username: '@winner_a',
        avatarUrl: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop',
      },
      video2: {
        id: '6',
        username: '@winner_b',
        avatarUrl: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=200&h=200&fit=crop',
      },
    },
    {
      video1: {
        id: '7',
        username: '@winner_c',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      },
      video2: {
        id: '8',
        username: '@winner_d',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      },
    },
  ];

  const handleVideoClick = (videoId: string) => {
    console.log('Winner video clicked:', videoId);
    
    // Add to clicked videos if not already clicked
    if (!clickedVideos.includes(videoId)) {
      const newClickedVideos = [...clickedVideos, videoId];
      setClickedVideos(newClickedVideos);
      
      // Show comparison modal after 1 or 2 videos are clicked
      if (newClickedVideos.length === 1 || newClickedVideos.length === 2) {
        setShowComparisonModal(true);
      }
    }
  };

  const handleComparisonVote = (videoId: string | 'neither') => {
    console.log('Comparison vote:', videoId);
    
    // Move to next comparison pair if available
    if (currentComparisonPair < comparisonPairs.length - 1) {
      setCurrentComparisonPair(currentComparisonPair + 1);
      setShowComparisonModal(true);
    } else {
      // Reset for next round
      setCurrentComparisonPair(0);
    }
  };

  const handleCloseModal = () => {
    setShowComparisonModal(false);
  };

  const handleWinnerDetail = (winnerId: string) => {
    console.log('Navigate to winner detail:', winnerId);
    router.push(`/(tabs)/winner?winnerId=${winnerId}`);
  };

  const handleLoadMore = () => {
    console.log('Load more winners');
    // In a real app, this would load more winners from API
  };

  const handleBackToWinner = () => {
    console.log('Navigate back to Winner screen');
    router.push('/(tabs)/winner');
  };

  const currentPair = comparisonPairs[currentComparisonPair];

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToWinner}
          >
            <IconSymbol 
              android_material_icon_name="arrow-back" 
              ios_icon_name="arrow.left"
              size={28} 
              color={colors.text}
            />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <IconSymbol 
            android_material_icon_name="emoji-events" 
            ios_icon_name="trophy.fill"
            size={40} 
            color={colors.text}
          />
          <Text style={styles.title}>WINNERS LOUNGE</Text>
          <Text style={styles.subtitle}>Hall of Fame - Past Challenge Winners</Text>
        </View>

        {/* Stats Section */}
        <View style={styles.statsSection}>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>156</Text>
            <Text style={styles.statLabel}>Total Winners</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>2.4M</Text>
            <Text style={styles.statLabel}>Total Views</Text>
          </View>
          <View style={styles.statBox}>
            <Text style={styles.statNumber}>92%</Text>
            <Text style={styles.statLabel}>Avg Engagement</Text>
          </View>
        </View>

        {/* Winners List */}
        {previousWinners.map((winner, index) => (
          <TouchableOpacity 
            key={index} 
            style={styles.winnerCard}
            onPress={() => handleVideoClick(winner.id)}
          >
            <View style={styles.winnerHeader}>
              <View style={styles.winnerHeaderInfo}>
                <View style={styles.userRow}>
                  <Image 
                    source={{ uri: winner.avatarUrl }} 
                    style={styles.avatar}
                  />
                  <View style={styles.userTextInfo}>
                    <Text style={styles.username}>{winner.username}</Text>
                    <Text style={styles.date}>{winner.date}</Text>
                  </View>
                </View>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{winner.rank}</Text>
              </View>
              {clickedVideos.includes(winner.id) && (
                <View style={styles.clickedBadge}>
                  <IconSymbol
                    android_material_icon_name="check-circle"
                    ios_icon_name="checkmark.circle.fill"
                    size={24}
                    color={colors.accent}
                  />
                </View>
              )}
            </View>

            <View style={styles.challengeInfo}>
              <Text style={styles.challengeLabel}>Challenge:</Text>
              <Text style={styles.challengeValue}>{winner.challenge}</Text>

              <Text style={styles.challengeLabel}>Phrase:</Text>
              <View style={styles.phraseBox}>
                <Text style={styles.phraseText}>{winner.phrase}</Text>
              </View>

              <Text style={styles.challengeLabel}>Sponsor:</Text>
              <Text style={styles.sponsorValue}>{winner.sponsor}</Text>
            </View>

            <View style={styles.statsRow}>
              <View style={styles.statItem}>
                <IconSymbol 
                  android_material_icon_name="favorite" 
                  ios_icon_name="heart.fill"
                  size={18} 
                  color={colors.accent}
                />
                <Text style={styles.statText}>{(winner.likes / 1000).toFixed(1)}k</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  android_material_icon_name="visibility" 
                  ios_icon_name="eye.fill"
                  size={18} 
                  color={colors.text}
                />
                <Text style={styles.statText}>{(winner.views / 1000).toFixed(1)}k</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  android_material_icon_name="trending-up" 
                  ios_icon_name="chart.line.uptrend.xyaxis"
                  size={18} 
                  color={colors.text}
                />
                <Text style={styles.statText}>{winner.engagement}%</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}

        {/* Load More Button */}
        <TouchableOpacity 
          style={styles.loadMoreButton}
          onPress={handleLoadMore}
        >
          <Text style={styles.loadMoreText}>Load More Winners</Text>
        </TouchableOpacity>

        {/* Back to Winner Screen */}
        <TouchableOpacity 
          style={styles.backToWinnerButton}
          onPress={handleBackToWinner}
        >
          <Text style={styles.backToWinnerText}>← Back to Latest Winner</Text>
        </TouchableOpacity>
      </ScrollView>

      {/* Video Comparison Modal */}
      <VideoComparisonModal
        visible={showComparisonModal}
        onClose={handleCloseModal}
        onVote={handleComparisonVote}
        video1={currentPair.video1}
        video2={currentPair.video2}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: colors.secondary,
    borderRadius: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: colors.text,
    fontSize: 12,
    fontWeight: '500',
  },
  winnerCard: {
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 18,
    marginBottom: 12,
    position: 'relative',
  },
  winnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    justifyContent: 'space-between',
  },
  winnerHeaderInfo: {
    flex: 1,
  },
  userRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: colors.secondary,
  },
  userTextInfo: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 2,
  },
  date: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '400',
    opacity: 0.8,
  },
  rankBadge: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 12,
  },
  rankText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
  },
  clickedBadge: {
    position: 'absolute',
    top: -8,
    right: -8,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 4,
  },
  challengeInfo: {
    marginBottom: 16,
  },
  challengeLabel: {
    color: colors.textMuted,
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  challengeValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phraseBox: {
    backgroundColor: colors.accent,
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 12,
    marginBottom: 4,
  },
  phraseText: {
    color: colors.secondary,
    fontSize: 16,
    fontWeight: '600',
    fontStyle: 'italic',
  },
  sponsorValue: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 2,
    borderTopColor: colors.accent,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
  },
  loadMoreButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadMoreText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
  backToWinnerButton: {
    alignItems: 'center',
    paddingVertical: 16,
    marginBottom: 16,
  },
  backToWinnerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
