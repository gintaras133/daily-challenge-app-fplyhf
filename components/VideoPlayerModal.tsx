
import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  ActivityIndicator,
  Dimensions,
  StatusBar,
  Platform,
} from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';
import { BlurView } from 'expo-blur';

interface VideoPlayerModalProps {
  visible: boolean;
  videoUrl: string;
  videoTitle?: string;
  videoTask?: string;
  onClose: () => void;
}

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

export default function VideoPlayerModal({
  visible,
  videoUrl,
  videoTitle,
  videoTask,
  onClose,
}: VideoPlayerModalProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [duration, setDuration] = useState(0);
  const [position, setPosition] = useState(0);
  const [showControls, setShowControls] = useState(true);

  useEffect(() => {
    if (visible) {
      console.log('VideoPlayerModal opened with URL:', videoUrl);
      setIsLoading(true);
      setHasError(false);
      setIsPlaying(false);
      setPosition(0);
      setShowControls(true);
    } else {
      // Reset state when modal closes
      setIsPlaying(false);
      setPosition(0);
    }
  }, [visible, videoUrl]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setDuration(status.durationMillis || 0);
      setPosition(status.positionMillis || 0);

      // Auto-hide controls after 3 seconds of playback
      if (status.isPlaying && showControls) {
        setTimeout(() => {
          setShowControls(false);
        }, 3000);
      }

      // Handle video end
      if (status.didJustFinish) {
        setIsPlaying(false);
        setShowControls(true);
      }
    }
  };

  const handleError = (error: string) => {
    console.error('Video player error:', error);
    console.error('Video URL:', videoUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Video loaded successfully in modal:', videoUrl);
    setIsLoading(false);
    setHasError(false);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) return;

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
      } else {
        await videoRef.current.playAsync();
      }
      setShowControls(true);
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handleReplay = async () => {
    if (!videoRef.current) return;

    try {
      await videoRef.current.replayAsync();
      setShowControls(true);
    } catch (error) {
      console.error('Error replaying video:', error);
    }
  };

  const handleVideoPress = () => {
    setShowControls(!showControls);
  };

  const handleClose = async () => {
    if (videoRef.current) {
      try {
        await videoRef.current.stopAsync();
      } catch (error) {
        console.error('Error stopping video:', error);
      }
    }
    onClose();
  };

  const formatTime = (milliseconds: number) => {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const minutes = Math.floor(totalSeconds / 60);
    const seconds = totalSeconds % 60;
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const progressPercentage = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent={false}
      onRequestClose={handleClose}
      statusBarTranslucent
    >
      <View style={styles.modalContainer}>
        <StatusBar hidden />
        
        {/* Close Button */}
        <TouchableOpacity
          style={styles.closeButton}
          onPress={handleClose}
          activeOpacity={0.8}
        >
          <BlurView intensity={80} style={styles.closeButtonBlur}>
            <IconSymbol
              ios_icon_name="xmark"
              android_material_icon_name="close"
              size={24}
              color="#FFFFFF"
            />
          </BlurView>
        </TouchableOpacity>

        {/* Video Player */}
        <TouchableOpacity
          style={styles.videoContainer}
          onPress={handleVideoPress}
          activeOpacity={1}
        >
          {hasError ? (
            <View style={styles.errorContainer}>
              <IconSymbol
                ios_icon_name="exclamationmark.triangle.fill"
                android_material_icon_name="error"
                size={64}
                color="#FFFFFF"
              />
              <Text style={styles.errorText}>Failed to load video</Text>
              <TouchableOpacity style={styles.retryButton} onPress={handleClose}>
                <Text style={styles.retryButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <>
              <Video
                ref={videoRef}
                source={{ uri: videoUrl }}
                style={styles.video}
                resizeMode={ResizeMode.CONTAIN}
                shouldPlay={false}
                isLooping={false}
                isMuted={false}
                onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
                onError={handleError}
                onLoad={handleLoad}
                useNativeControls={false}
              />

              {isLoading && (
                <View style={styles.loadingOverlay}>
                  <ActivityIndicator size="large" color={colors.accent} />
                  <Text style={styles.loadingText}>Loading video...</Text>
                </View>
              )}

              {/* Controls Overlay */}
              {showControls && !isLoading && !hasError && (
                <View style={styles.controlsOverlay}>
                  {/* Video Info */}
                  {(videoTitle || videoTask) && (
                    <View style={styles.videoInfoContainer}>
                      <BlurView intensity={80} style={styles.videoInfoBlur}>
                        {videoTitle && (
                          <Text style={styles.videoTitleModal} numberOfLines={1}>
                            {videoTitle}
                          </Text>
                        )}
                        {videoTask && (
                          <Text style={styles.videoTaskModal} numberOfLines={1}>
                            {videoTask}
                          </Text>
                        )}
                      </BlurView>
                    </View>
                  )}

                  {/* Play/Pause Button */}
                  <TouchableOpacity
                    style={styles.playPauseButton}
                    onPress={togglePlayPause}
                    activeOpacity={0.8}
                  >
                    <IconSymbol
                      ios_icon_name={isPlaying ? 'pause.circle.fill' : 'play.circle.fill'}
                      android_material_icon_name={isPlaying ? 'pause-circle' : 'play-circle'}
                      size={80}
                      color="rgba(255, 255, 255, 0.95)"
                    />
                  </TouchableOpacity>

                  {/* Progress Bar */}
                  <View style={styles.progressContainer}>
                    <BlurView intensity={80} style={styles.progressBlur}>
                      <View style={styles.progressInfo}>
                        <Text style={styles.timeText}>{formatTime(position)}</Text>
                        <Text style={styles.timeText}>{formatTime(duration)}</Text>
                      </View>
                      <View style={styles.progressBarContainer}>
                        <View style={styles.progressBarBackground}>
                          <View
                            style={[
                              styles.progressBarFill,
                              { width: `${progressPercentage}%` },
                            ]}
                          />
                        </View>
                      </View>
                      
                      {/* Replay Button */}
                      {!isPlaying && position > 0 && position >= duration - 100 && (
                        <TouchableOpacity
                          style={styles.replayButton}
                          onPress={handleReplay}
                          activeOpacity={0.8}
                        >
                          <IconSymbol
                            ios_icon_name="arrow.clockwise"
                            android_material_icon_name="replay"
                            size={20}
                            color="#FFFFFF"
                          />
                          <Text style={styles.replayButtonText}>Replay</Text>
                        </TouchableOpacity>
                      )}
                    </BlurView>
                  </View>
                </View>
              )}
            </>
          )}
        </TouchableOpacity>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    backgroundColor: '#000000',
    justifyContent: 'center',
    alignItems: 'center',
  },
  closeButton: {
    position: 'absolute',
    top: Platform.OS === 'ios' ? 50 : 20,
    right: 20,
    zIndex: 1000,
    borderRadius: 20,
    overflow: 'hidden',
  },
  closeButtonBlur: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  videoContainer: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    justifyContent: 'center',
    alignItems: 'center',
  },
  video: {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 16,
  },
  loadingText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
  },
  controlsOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'space-between',
    paddingTop: Platform.OS === 'ios' ? 100 : 70,
    paddingBottom: 40,
  },
  videoInfoContainer: {
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  videoInfoBlur: {
    padding: 16,
    borderRadius: 12,
  },
  videoTitleModal: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 4,
  },
  videoTaskModal: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '500',
    opacity: 0.9,
  },
  playPauseButton: {
    alignSelf: 'center',
  },
  progressContainer: {
    paddingHorizontal: 20,
    borderRadius: 12,
    overflow: 'hidden',
    marginHorizontal: 20,
  },
  progressBlur: {
    padding: 16,
    borderRadius: 12,
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  timeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  progressBarContainer: {
    width: '100%',
    marginBottom: 12,
  },
  progressBarBackground: {
    width: '100%',
    height: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: colors.accent,
    borderRadius: 2,
  },
  replayButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    paddingVertical: 8,
  },
  replayButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  errorContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: 20,
    padding: 40,
  },
  errorText: {
    color: '#FFFFFF',
    fontSize: 18,
    textAlign: 'center',
    fontWeight: '500',
  },
  retryButton: {
    backgroundColor: colors.accent,
    paddingVertical: 12,
    paddingHorizontal: 32,
    borderRadius: 12,
    marginTop: 8,
  },
  retryButtonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
});
