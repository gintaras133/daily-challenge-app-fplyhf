
import React, { useState, useEffect } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface VideoOption {
  id: string;
  username: string;
  avatarUrl: string;
  thumbnailUrl?: string;
}

interface VideoComparisonModalProps {
  visible: boolean;
  onClose: () => void;
  onVote: (videoId: string | 'neither') => void;
  video1: VideoOption;
  video2: VideoOption;
}

const { width: SCREEN_WIDTH } = Dimensions.get('window');
const MODAL_WIDTH = Math.min(SCREEN_WIDTH - 48, 400);

export default function VideoComparisonModal({
  visible,
  onClose,
  onVote,
  video1,
  video2,
}: VideoComparisonModalProps) {
  const [selectedVideo, setSelectedVideo] = useState<string | null>(null);

  useEffect(() => {
    if (!visible) {
      setSelectedVideo(null);
    }
  }, [visible]);

  const handleVote = (videoId: string | 'neither') => {
    setSelectedVideo(videoId);
    console.log('User voted for:', videoId);
    
    // Add a small delay for visual feedback before closing
    setTimeout(() => {
      onVote(videoId);
      onClose();
    }, 300);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onClose}>
            <IconSymbol
              android_material_icon_name="close"
              ios_icon_name="xmark"
              size={24}
              color={colors.text}
            />
          </TouchableOpacity>

          {/* Title */}
          <Text style={styles.title}>Which video do you prefer?</Text>

          {/* Video Options Container */}
          <View style={styles.videosContainer}>
            {/* Video 1 */}
            <TouchableOpacity
              style={[
                styles.videoOption,
                selectedVideo === video1.id && styles.selectedVideoOption,
              ]}
              onPress={() => handleVote(video1.id)}
              activeOpacity={0.8}
            >
              <View style={styles.videoThumbnail}>
                {video1.thumbnailUrl ? (
                  <Image
                    source={{ uri: video1.thumbnailUrl }}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <View style={styles.placeholderThumbnail}>
                    <IconSymbol
                      android_material_icon_name="play-circle"
                      ios_icon_name="play.circle.fill"
                      size={40}
                      color={colors.text}
                    />
                  </View>
                )}
              </View>
              <View style={styles.videoInfo}>
                <Image
                  source={{ uri: video1.avatarUrl }}
                  style={styles.avatar}
                />
                <Text style={styles.username} numberOfLines={1}>
                  {video1.username}
                </Text>
              </View>
              <View style={styles.voteButton}>
                <IconSymbol
                  android_material_icon_name="thumb-up"
                  ios_icon_name="hand.thumbsup.fill"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.voteButtonText}>Video 1</Text>
              </View>
            </TouchableOpacity>

            {/* Video 2 */}
            <TouchableOpacity
              style={[
                styles.videoOption,
                selectedVideo === video2.id && styles.selectedVideoOption,
              ]}
              onPress={() => handleVote(video2.id)}
              activeOpacity={0.8}
            >
              <View style={styles.videoThumbnail}>
                {video2.thumbnailUrl ? (
                  <Image
                    source={{ uri: video2.thumbnailUrl }}
                    style={styles.thumbnailImage}
                  />
                ) : (
                  <View style={styles.placeholderThumbnail}>
                    <IconSymbol
                      android_material_icon_name="play-circle"
                      ios_icon_name="play.circle.fill"
                      size={40}
                      color={colors.text}
                    />
                  </View>
                )}
              </View>
              <View style={styles.videoInfo}>
                <Image
                  source={{ uri: video2.avatarUrl }}
                  style={styles.avatar}
                />
                <Text style={styles.username} numberOfLines={1}>
                  {video2.username}
                </Text>
              </View>
              <View style={styles.voteButton}>
                <IconSymbol
                  android_material_icon_name="thumb-up"
                  ios_icon_name="hand.thumbsup.fill"
                  size={20}
                  color={colors.text}
                />
                <Text style={styles.voteButtonText}>Video 2</Text>
              </View>
            </TouchableOpacity>
          </View>

          {/* Neither Button */}
          <TouchableOpacity
            style={[
              styles.neitherButton,
              selectedVideo === 'neither' && styles.selectedNeitherButton,
            ]}
            onPress={() => handleVote('neither')}
            activeOpacity={0.8}
          >
            <Text style={styles.neitherButtonText}>Neither</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalContainer: {
    width: MODAL_WIDTH,
    backgroundColor: colors.secondary,
    borderRadius: 24,
    padding: 20,
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: colors.text,
    marginBottom: 20,
    textAlign: 'center',
    paddingHorizontal: 20,
  },
  videosContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
    width: '100%',
  },
  videoOption: {
    flex: 1,
    backgroundColor: colors.primary,
    borderRadius: 16,
    padding: 12,
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedVideoOption: {
    borderColor: colors.accent,
    opacity: 0.8,
  },
  videoThumbnail: {
    width: '100%',
    aspectRatio: 9 / 16,
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 12,
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  placeholderThumbnail: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoInfo: {
    alignItems: 'center',
    marginBottom: 8,
    width: '100%',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: colors.secondary,
    marginBottom: 6,
  },
  username: {
    fontSize: 12,
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  voteButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: colors.secondary,
    borderRadius: 12,
    width: '100%',
  },
  voteButtonText: {
    fontSize: 14,
    fontWeight: '700',
    color: colors.text,
  },
  neitherButton: {
    backgroundColor: colors.background,
    paddingVertical: 14,
    paddingHorizontal: 32,
    borderRadius: 16,
    width: '100%',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: 'transparent',
  },
  selectedNeitherButton: {
    borderColor: colors.accent,
    opacity: 0.8,
  },
  neitherButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.text,
  },
});
