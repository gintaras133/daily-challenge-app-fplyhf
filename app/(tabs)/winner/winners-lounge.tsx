
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
    },
  ];

  const handleWinnerDetail = (winnerId: number) => {
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
            onPress={() => handleWinnerDetail(winner.id)}
          >
            <View style={styles.winnerHeader}>
              <View style={styles.winnerHeaderInfo}>
                <Text style={styles.username}>{winner.username}</Text>
                <Text style={styles.date}>{winner.date}</Text>
              </View>
              <View style={styles.rankBadge}>
                <Text style={styles.rankText}>{winner.rank}</Text>
              </View>
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
  },
  backToWinnerText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
