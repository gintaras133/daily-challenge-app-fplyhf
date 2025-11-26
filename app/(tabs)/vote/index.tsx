
import React, { useState } from "react";
import { StyleSheet, View, Text, TouchableOpacity, ScrollView, Image } from "react-native";
import { colors } from "@/styles/commonStyles";
import { IconSymbol } from "@/components/IconSymbol";

interface VideoData {
  id: number;
  username: string;
  timeAgo: string;
  views: number;
  avatarColor: string;
  videoUrl?: string;
}

export default function VoteScreen() {
  const [selectedVote, setSelectedVote] = useState<'video1' | 'video2' | 'neither' | null>(null);

  // Sample data - in a real app, this would come from an API
  const video1: VideoData = {
    id: 1,
    username: "@user_one",
    timeAgo: "2 hours ago",
    views: 124,
    avatarColor: "#ff6b6b",
  };

  const video2: VideoData = {
    id: 2,
    username: "@user_two",
    timeAgo: "1 hour ago",
    views: 98,
    avatarColor: "#51cf66",
  };

  const handleVote = (vote: 'video1' | 'video2' | 'neither') => {
    setSelectedVote(vote);
    console.log('Voted for:', vote);
    // In a real app, this would send the vote to the backend
  };

  return (
    <View style={styles.container}>
      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header with menu button */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.menuButton}>
            <IconSymbol 
              android_material_icon_name="menu" 
              size={28} 
              color="#000000"
            />
          </TouchableOpacity>
          
          <View style={styles.headerTextContainer}>
            <Text style={styles.headerTitle}>Whose today&apos;s winner!</Text>
            <Text style={styles.headerSubtitle}>Your vote helps train the scroll algorithm</Text>
          </View>
        </View>

        {/* Video 1 */}
        <View style={styles.videoCard}>
          <View style={styles.videoPreview}>
            <Text style={styles.videoPlaceholder}>Video Preview 1</Text>
          </View>
          
          <View style={styles.videoInfo}>
            <View style={[styles.avatar, { backgroundColor: video1.avatarColor }]} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{video1.username}</Text>
              <Text style={styles.timeAgo}>{video1.timeAgo}</Text>
            </View>
            <View style={styles.viewsContainer}>
              <IconSymbol 
                android_material_icon_name="visibility" 
                size={18} 
                color="#666666"
              />
              <Text style={styles.viewsText}>{video1.views} views</Text>
            </View>
          </View>
        </View>

        {/* VS Badge */}
        <View style={styles.vsBadge}>
          <Text style={styles.vsText}>VS</Text>
        </View>

        {/* Video 2 */}
        <View style={styles.videoCard}>
          <View style={styles.videoPreview}>
            <Text style={styles.videoPlaceholder}>Video Preview 2</Text>
          </View>
          
          <View style={styles.videoInfo}>
            <View style={[styles.avatar, { backgroundColor: video2.avatarColor }]} />
            <View style={styles.userInfo}>
              <Text style={styles.username}>{video2.username}</Text>
              <Text style={styles.timeAgo}>{video2.timeAgo}</Text>
            </View>
            <View style={styles.viewsContainer}>
              <IconSymbol 
                android_material_icon_name="visibility" 
                size={18} 
                color="#666666"
              />
              <Text style={styles.viewsText}>{video2.views} views</Text>
            </View>
          </View>
        </View>

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
              color="#ffffff"
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
              color="#ffffff"
            />
            <Text style={styles.voteButtonText}>Video 2</Text>
          </TouchableOpacity>
        </View>

        {/* Bottom Message */}
        <Text style={styles.bottomMessage}>
          These matchups help us show you better content! 🎯
        </Text>
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
    paddingTop: 48,
    paddingHorizontal: 24,
    paddingBottom: 120,
  },
  header: {
    marginBottom: 32,
  },
  menuButton: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  headerTextContainer: {
    alignItems: 'center',
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255, 255, 255, 0.9)',
    fontSize: 16,
    fontWeight: '500',
    textAlign: 'center',
  },
  videoCard: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 16,
    marginBottom: 16,
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.15)',
    elevation: 4,
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
  videoInfo: {
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
  timeAgo: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '400',
  },
  viewsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  viewsText: {
    color: '#666666',
    fontSize: 14,
    fontWeight: '500',
  },
  vsBadge: {
    alignSelf: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 24,
    marginVertical: 8,
  },
  vsText: {
    color: '#ffffff',
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
    backgroundColor: '#5dade2',
  },
  neitherButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
  },
  video2Button: {
    backgroundColor: '#f4d03f',
  },
  selectedButton: {
    opacity: 0.7,
    borderWidth: 3,
    borderColor: '#ffffff',
  },
  voteButtonText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: '700',
  },
  bottomMessage: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: '500',
    textAlign: 'center',
    lineHeight: 22,
    paddingHorizontal: 16,
  },
});
