
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";
import VideoComparisonModal from "@/components/VideoComparisonModal";

interface VideoData {
  id: string;
  username: string;
  timeAgo: string;
  views: number;
  avatarUrl: string;
  videoUrl?: string;
}

export default function VoteScreen() {
  const [selectedVote, setSelectedVote] = useState<'video1' | 'video2' | 'neither' | null>(null);
  const [clickedVideos, setClickedVideos] = useState<string[]>([]);
  const [showComparisonModal, setShowComparisonModal] = useState(false);
  const [currentComparisonPair, setCurrentComparisonPair] = useState<number>(0);

  // Sample data - in a real app, this would come from an API
  const video1: VideoData = {
    id: '1',
    username: "@sarah_creates",
    timeAgo: "2 hours ago",
    views: 124,
    avatarUrl: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=200&h=200&fit=crop",
  };

  const video2: VideoData = {
    id: '2',
    username: "@mike_vision",
    timeAgo: "1 hour ago",
    views: 98,
    avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop",
  };

  // Additional video pairs for the comparison modal
  const comparisonPairs = [
    {
      video1: {
        id: '3',
        username: '@emma_vibes',
        avatarUrl: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=200&h=200&fit=crop',
      },
      video2: {
        id: '4',
        username: '@alex_creative',
        avatarUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=200&h=200&fit=crop',
      },
    },
    {
      video1: {
        id: '5',
        username: '@lisa_films',
        avatarUrl: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=200&h=200&fit=crop',
      },
      video2: {
        id: '6',
        username: '@john_edits',
        avatarUrl: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=200&h=200&fit=crop',
      },
    },
  ];

  const handleVideoClick = (videoId: string) => {
    console.log('Video clicked:', videoId);
    
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

  const handleVote = (vote: 'video1' | 'video2' | 'neither') => {
    setSelectedVote(vote);
    console.log('Voted for:', vote);
    // In a real app, this would send the vote to the backend
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
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Choose today&apos;s winner!</Text>
            <Text style={styles.headerSubtitle}>Always driven by the community</Text>
          </View>
        </View>

        {/* Video 1 */}
        <TouchableOpacity 
          style={styles.videoCard}
          onPress={() => handleVideoClick(video1.id)}
          activeOpacity={0.8}
        >
          <View style={styles.videoPreview}>
            <Text style={styles.videoPlaceholder}>Video Preview 1</Text>
            {clickedVideos.includes(video1.id) && (
              <View style={styles.clickedBadge}>
                <IconSymbol
                  android_material_icon_name="check-circle"
                  ios_icon_name="checkmark.circle.fill"
                  size={32}
                  color={colors.accent}
                />
              </View>
            )}
          </View>
          
          <View style={styles.videoInfo}>
            <Image 
              source={{ uri: video1.avatarUrl }} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{video1.username}</Text>
              <Text style={styles.timeAgo}>{video1.timeAgo}</Text>
            </View>
            <View style={styles.viewsContainer}>
              <IconSymbol 
                android_material_icon_name="visibility" 
                size={18} 
                color={colors.text}
              />
              <Text style={styles.viewsText}>{video1.views} views</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* VS Badge */}
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {/* Video 2 */}
        <TouchableOpacity 
          style={styles.videoCard}
          onPress={() => handleVideoClick(video2.id)}
          activeOpacity={0.8}
        >
          <View style={styles.videoPreview}>
            <Text style={styles.videoPlaceholder}>Video Preview 2</Text>
            {clickedVideos.includes(video2.id) && (
              <View style={styles.clickedBadge}>
                <IconSymbol
                  android_material_icon_name="check-circle"
                  ios_icon_name="checkmark.circle.fill"
                  size={32}
                  color={colors.accent}
                />
              </View>
            )}
          </View>
          
          <View style={styles.videoInfo}>
            <Image 
              source={{ uri: video2.avatarUrl }} 
              style={styles.avatar}
            />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{video2.username}</Text>
              <Text style={styles.timeAgo}>{video2.timeAgo}</Text>
            </View>
            <View style={styles.viewsContainer}>
              <IconSymbol 
                android_material_icon_name="visibility" 
                size={18} 
                color={colors.text}
              />
              <Text style={styles.viewsText}>{video2.views} views</Text>
            </View>
          </View>
        </TouchableOpacity>

        {/* Voting Buttons */}
        <View style={styles.votingButtons}>
          <TouchableOpacity 
            style={[
              styles.voteButton, 
              styles.video1Button,
              selectedVote === 'video1' && styles.selectedButton
            ]}
            onPress={() => handleVote('video1')}
          >
            <IconSymbol 
              android_material_icon_name="thumb-up" 
              size={24} 
              color={colors.text}
            />
            <Text style={styles.voteButtonText}>Video 1</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.voteButton, 
              styles.neitherButton,
              selectedVote === 'neither' && styles.selectedButton
            ]}
            onPress={() => handleVote('neither')}
          >
            <Text style={styles.voteButtonText}>Neither</Text>
          </TouchableOpacity>

          <TouchableOpacity 
            style={[
              styles.voteButton, 
              styles.video2Button,
              selectedVote === 'video2' && styles.selectedButton
            ]}
            onPress={() => handleVote('video2')}
          >
            <IconSymbol 
              android_material_icon_name="thumb-up" 
              size={24} 
              color={colors.text}
            />
            <Text style={styles.voteButtonText}>Video 2</Text>
          </TouchableOpacity>
        </View>
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
    backgroundColor: colors.accent,
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
    marginBottom: 32,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: colors.text,
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: colors.primary,
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
  },
  videoPreview: {
    width: '100%',
    aspectRatio: 9 / 16,
    backgroundColor: colors.secondary,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    position: 'relative',
  },
  videoPlaceholder: {
    color: colors.text,
    fontSize: 18,
    fontWeight: '500',
  },
  clickedBadge: {
    position: 'absolute',
    top: 12,
    right: 12,
    backgroundColor: colors.primary,
    borderRadius: 20,
    padding: 4,
  },
  videoInfo: {
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
  userInfo: {
    flex: 1,
  },
  username: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  timeAgo: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '400',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewsText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '500',
  },
  vsBadge: {
    alignSelf: 'center',
    backgroundColor: colors.background,
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginVertical: 8,
  },
  vsText: {
    color: colors.text,
    fontSize: 20,
    fontWeight: '700',
    letterSpacing: 2,
  },
  votingButtons: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 24,
    marginBottom: 24,
  },
  voteButton: {
    flex: 1,
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
    borderRadius: 16,
    gap: 8,
  },
  video1Button: {
    backgroundColor: colors.secondary,
  },
  neitherButton: {
    backgroundColor: colors.background,
  },
  video2Button: {
    backgroundColor: colors.primary,
  },
  selectedButton: {
    opacity: 0.7,
    borderWidth: 3,
    borderColor: colors.accent,
  },
  voteButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '700',
  },
});
