
import React, { useState } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Platform } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { router } from 'expo-router';

type FilterType = 'all' | 'winners' | 'top10';

interface Challenge {
  id: string;
  date: string;
  title: string;
  sponsor: string;
  likes: number;
  views: number;
  place: number;
  isWinner: boolean;
}

export default function LibraryScreen() {
  const [activeFilter, setActiveFilter] = useState<FilterType>('all');

  // Sample data - in a real app, this would come from an API
  const stats = {
    videos: 5,
    wins: 1,
    totalLikes: 5466,
  };

  const challenges: Challenge[] = [
    {
      id: '1',
      date: 'Nov 25, 2025',
      title: 'Dance in a library',
      sponsor: 'Spotify',
      likes: 892,
      views: 3420,
      place: 1,
      isWinner: true,
    },
    {
      id: '2',
      date: 'Nov 24, 2025',
      title: 'Yoga pose at a bus stop',
      sponsor: 'Lululemon',
      likes: 567,
      views: 2140,
      place: 12,
      isWinner: false,
    },
    {
      id: '3',
      date: 'Nov 23, 2025',
      title: 'Sing in a car wash',
      sponsor: 'Shell',
      likes: 1234,
      views: 4560,
      place: 3,
      isWinner: false,
    },
    {
      id: '4',
      date: 'Nov 22, 2025',
      title: 'Cook an egg on the street',
      sponsor: 'HelloFresh',
      likes: 432,
      views: 1890,
      place: 24,
      isWinner: false,
    },
    {
      id: '5',
      date: 'Nov 21, 2025',
      title: 'Breakdance in an elevator',
      sponsor: 'RedBull',
      likes: 2341,
      views: 8920,
      place: 2,
      isWinner: false,
    },
  ];

  const getFilteredChallenges = () => {
    switch (activeFilter) {
      case 'winners':
        return challenges.filter(c => c.isWinner);
      case 'top10':
        return challenges.filter(c => c.place <= 10);
      default:
        return challenges;
    }
  };

  const filteredChallenges = getFilteredChallenges();

  return (
    <View style={styles.container}>
      <LinearGradient colors={['#ff9999', '#ffb3b3']} style={styles.gradient}>
        <ScrollView
          style={styles.scrollView}
          contentContainerStyle={styles.scrollContent}
          showsVerticalScrollIndicator={false}
        >
          {/* Header */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <IconSymbol android_material_icon_name="video-library" size={32} color="#ffffff" />
              <Text style={styles.title}>MY LIBRARY</Text>
            </View>
            <Text style={styles.subtitle}>Your personal challenge archive</Text>
          </View>

          {/* Stats Section */}
          <View style={styles.statsContainer}>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.videos}</Text>
              <Text style={styles.statLabel}>Videos</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.wins}</Text>
              <Text style={styles.statLabel}>Wins</Text>
            </View>
            <View style={styles.statCard}>
              <Text style={styles.statNumber}>{stats.totalLikes}</Text>
              <Text style={styles.statLabel}>Total Likes</Text>
            </View>
          </View>

          {/* Filter Buttons */}
          <View style={styles.filterContainer}>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'all' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('all')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'all' && styles.filterButtonTextActive,
                ]}
              >
                All Videos
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.filterButton,
                activeFilter === 'winners' && styles.filterButtonActive,
              ]}
              onPress={() => setActiveFilter('winners')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'winners' && styles.filterButtonTextActive,
                ]}
              >
                Winners Only
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.filterButton, activeFilter === 'top10' && styles.filterButtonActive]}
              onPress={() => setActiveFilter('top10')}
            >
              <Text
                style={[
                  styles.filterButtonText,
                  activeFilter === 'top10' && styles.filterButtonTextActive,
                ]}
              >
                Top 10
              </Text>
            </TouchableOpacity>
          </View>

          {/* Challenge List */}
          {filteredChallenges.map((challenge, index) => (
            <View key={index} style={styles.challengeCard}>
              {/* Video Thumbnail */}
              <View style={styles.thumbnailContainer}>
                <View style={styles.thumbnail}>
                  <IconSymbol android_material_icon_name="play-arrow" size={48} color="#ffffff" />
                </View>
                {challenge.isWinner && (
                  <View style={styles.winnerBadge}>
                    <IconSymbol android_material_icon_name="emoji-events" size={16} color="#ffffff" />
                  </View>
                )}
                <View style={styles.placeBadge}>
                  <Text style={styles.placeBadgeText}>#{challenge.place}</Text>
                </View>
              </View>

              {/* Challenge Details */}
              <View style={styles.challengeDetails}>
                <View style={styles.dateRow}>
                  <IconSymbol android_material_icon_name="calendar-today" size={14} color="#666666" />
                  <Text style={styles.dateText}>{challenge.date}</Text>
                </View>

                <Text style={styles.challengeTitle}>{challenge.title}</Text>
                <Text style={styles.sponsorText}>Sponsor: {challenge.sponsor}</Text>

                <View style={styles.statsRow}>
                  <View style={styles.statItem}>
                    <IconSymbol android_material_icon_name="favorite" size={16} color="#ff6b6b" />
                    <Text style={styles.statItemText}>{challenge.likes}</Text>
                  </View>
                  <View style={styles.statItem}>
                    <IconSymbol android_material_icon_name="visibility" size={16} color="#666666" />
                    <Text style={styles.statItemText}>{challenge.views}</Text>
                  </View>
                </View>

                {/* Action Buttons */}
                <View style={styles.actionButtons}>
                  <TouchableOpacity style={styles.watchButton}>
                    <Text style={styles.watchButtonText}>Watch</Text>
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol android_material_icon_name="download" size={20} color="#666666" />
                  </TouchableOpacity>
                  <TouchableOpacity style={styles.iconButton}>
                    <IconSymbol android_material_icon_name="delete" size={20} color="#ff6b6b" />
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          ))}

          {/* Download All Button */}
          <TouchableOpacity style={styles.downloadAllButton}>
            <Text style={styles.downloadAllButtonText}>Download All Videos</Text>
          </TouchableOpacity>

          {/* Back to Community Hub Button */}
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => router.push('/(tabs)/community')}
          >
            <IconSymbol android_material_icon_name="arrow-back" size={20} color="#ffffff" />
            <Text style={styles.backButtonText}>Back to Community Hub</Text>
          </TouchableOpacity>
        </ScrollView>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ff9999',
  },
  gradient: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingTop: Platform.OS === 'android' ? 48 : 60,
    paddingHorizontal: 20,
    paddingBottom: 140,
  },
  header: {
    alignItems: 'center',
    marginBottom: 24,
  },
  titleSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '800',
    color: '#ffffff',
    letterSpacing: 1,
  },
  subtitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#ffffff',
    marginTop: 4,
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: 12,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 16,
    padding: 16,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 32,
    fontWeight: '800',
    color: '#ffffff',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#ffffff',
  },
  filterContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 24,
  },
  filterButton: {
    flex: 1,
    backgroundColor: '#ffffff',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 20,
    alignItems: 'center',
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
  },
  filterButtonText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#666666',
  },
  filterButtonTextActive: {
    color: '#ffffff',
  },
  challengeCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 16,
    marginBottom: 16,
    flexDirection: 'row',
    gap: 16,
    boxShadow: '0px 2px 8px rgba(0, 0, 0, 0.1)',
    elevation: 3,
  },
  thumbnailContainer: {
    position: 'relative',
  },
  thumbnail: {
    width: 120,
    height: 160,
    backgroundColor: '#d0d0d0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  winnerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    width: 28,
    height: 28,
    alignItems: 'center',
    justifyContent: 'center',
  },
  placeBadge: {
    position: 'absolute',
    bottom: 8,
    left: 8,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    borderRadius: 12,
    paddingHorizontal: 10,
    paddingVertical: 4,
  },
  placeBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: '700',
  },
  challengeDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  dateRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginBottom: 8,
  },
  dateText: {
    fontSize: 12,
    color: '#666666',
    fontWeight: '500',
  },
  challengeTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
    marginBottom: 4,
  },
  sponsorText: {
    fontSize: 13,
    color: '#666666',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 16,
    marginBottom: 12,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  statItemText: {
    fontSize: 13,
    color: '#666666',
    fontWeight: '600',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  watchButton: {
    flex: 1,
    backgroundColor: '#4A90E2',
    paddingVertical: 10,
    borderRadius: 20,
    alignItems: 'center',
  },
  watchButtonText: {
    color: '#ffffff',
    fontSize: 14,
    fontWeight: '700',
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#e0e0e0',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ffffff',
  },
  downloadAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    marginBottom: 16,
  },
  downloadAllButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  backButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 12,
  },
  backButtonText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
