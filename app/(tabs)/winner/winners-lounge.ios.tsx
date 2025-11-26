
import React from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import { router } from "expo-router";

export default function WinnersLoungeScreen() {
  // Sample data for previous winners
  const previousWinners = [
    {
      id: 1,
      username: "@winner_user",
      date: "Nov 25, 2025",
      challenge: "Dance in a library",
      phrase: "Shhh... it's party time!",
      sponsor: "Spotify",
      likes: 45200,
      views: 98500,
      engagement: 94,
      rank: "#1",
      avatarColor: "#ffcc00",
    },
    {
      id: 2,
      username: "@yoga_queen",
      date: "Nov 24, 2025",
      challenge: "Yoga pose at a bus stop",
      phrase: "Namaste everyone!",
      sponsor: "Lululemon",
      likes: 38400,
      views: 82100,
      engagement: 91,
      rank: "#2",
      avatarColor: "#ff9999",
    },
    {
      id: 3,
      username: "@singin_sam",
      date: "Nov 23, 2025",
      challenge: "Sing in a car wash",
      phrase: "Splish splash taking a bath!",
      sponsor: "Shell",
      likes: 52300,
      views: 105600,
      engagement: 96,
      rank: "#3",
      avatarColor: "#99ccff",
    },
    {
      id: 4,
      username: "@chef_mike",
      date: "Nov 22, 2025",
      challenge: "Cook an egg on the street",
      phrase: "Too hot to handle!",
      sponsor: "HelloFresh",
      likes: 41900,
      views: 89200,
      engagement: 89,
      rank: "#4",
      avatarColor: "#99ff99",
    },
  ];

  const handleWatchVideo = (winnerId: number) => {
    console.log('Watch video for winner:', winnerId);
    // In a real app, this would play the winner's video
  };

  const handleShareWinner = (winnerId: number) => {
    console.log('Share winner:', winnerId);
    // In a real app, this would open share dialog
  };

  const handleLoadMore = () => {
    console.log('Load more winners');
    // In a real app, this would load more winners from API
  };

  const handleBackToWinner = () => {
    console.log('Navigate back to Winner screen');
    router.push('/(tabs)/winner');
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
          <TouchableOpacity 
            style={styles.backButton}
            onPress={handleBackToWinner}
          >
            <IconSymbol 
              ios_icon_name="arrow.left"
              size={28} 
              color="#ffffff"
            />
          </TouchableOpacity>
        </View>

        {/* Title Section */}
        <View style={styles.titleSection}>
          <IconSymbol 
            ios_icon_name="trophy.fill"
            size={40} 
            color="#ffffff"
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
          <View key={index} style={styles.winnerCard}>
            <View style={styles.winnerHeader}>
              <View style={[styles.avatar, { backgroundColor: winner.avatarColor }]}>
                <IconSymbol 
                  ios_icon_name="trophy.fill"
                  size={24} 
                  color="#ffffff"
                />
              </View>
              <View style={styles.winnerHeaderInfo}>
                <Text style={styles.username}>{winner.username}</Text>
                <Text style={styles.date}>{winner.date}</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{winner.rank}</Text>
              </View>
            </View>

            <View style={styles.videoPreview}>
              <IconSymbol 
                ios_icon_name="play.fill"
                size={60} 
                color="#ffffff"
              />
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
                  ios_icon_name="heart.fill"
                  size={18} 
                  color="#ff6b6b"
                />
                <Text style={styles.statText}>{(winner.likes / 1000).toFixed(1)}k</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="eye.fill"
                  size={18} 
                  color="#5dade2"
                />
                <Text style={styles.statText}>{(winner.views / 1000).toFixed(1)}k</Text>
              </View>
              <View style={styles.statItem}>
                <IconSymbol 
                  ios_icon_name="chart.line.uptrend.xyaxis"
                  size={18} 
                  color="#51cf66"
                />
                <Text style={styles.statText}>{winner.engagement}%</Text>
              </View>
            </View>

            <View style={styles.actionButtons}>
              <TouchableOpacity 
                style={styles.watchButton}
                onPress={() => handleWatchVideo(winner.id)}
              >
                <Text style={styles.watchButtonText}>Watch Video</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.shareButton}
                onPress={() => handleShareWinner(winner.id)}
              >
                <Text style={styles.shareButtonText}>Share Winner</Text>
              </TouchableOpacity>
            </View>
          </View>
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
  header: {
    marginBottom: 24,
  },
  backButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleSection: {
    alignItems: 'center',
    marginBottom: 24,
  },
  title: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: 2,
    marginTop: 12,
    marginBottom: 8,
  },
  subtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  statsSection: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 32,
    paddingVertical: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
  },
  statBox: {
    alignItems: 'center',
  },
  statNumber: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 12,
    fontWeight: '500',
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
  winnerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    gap: 12,
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 24,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerHeaderInfo: {
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
  rankBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  rankText: {
    color: '#000000',
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
  challengeInfo: {
    marginBottom: 16,
  },
  challengeLabel: {
    color: '#666666',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 4,
    marginTop: 8,
  },
  challengeValue: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  phraseBox: {
    backgroundColor: '#f5f5f5',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    marginBottom: 4,
  },
  phraseText: {
    color: '#000000',
    fontSize: 15,
    fontWeight: '500',
    fontStyle: 'italic',
  },
  sponsorValue: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '700',
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderBottomWidth: 1,
    borderColor: '#e0e0e0',
    marginBottom: 16,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statText: {
    color: '#000000',
    fontSize: 14,
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
  },
  watchButton: {
    flex: 1,
    backgroundColor: '#5dade2',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '700',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 14,
    borderRadius: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#5dade2',
  },
  shareButtonText: {
    color: '#5dade2',
    fontSize: 15,
    fontWeight: '700',
  },
  loadMoreButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 20,
    alignItems: 'center',
    marginBottom: 16,
  },
  loadMoreText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  backToWinnerButton: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  backToWinnerText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
