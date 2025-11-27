
import React, { useState, useRef, useEffect } from 'react';
import { View, StyleSheet, TouchableOpacity, ActivityIndicator, Text } from 'react-native';
import { Video, ResizeMode, AVPlaybackStatus } from 'expo-av';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

interface VideoPreviewProps {
  videoUrl: string;
  width?: number;
  height?: number;
  borderRadius?: number;
  showPlayButton?: boolean;
  autoPlay?: boolean;
  muted?: boolean;
  onPress?: () => void;
}

export default function VideoPreview({
  videoUrl,
  width = 120,
  height = 160,
  borderRadius = 12,
  showPlayButton = true,
  autoPlay = false,
  muted = true,
  onPress,
}: VideoPreviewProps) {
  const videoRef = useRef<Video>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [loadAttempts, setLoadAttempts] = useState(0);

  useEffect(() => {
    console.log('=== VideoPreview Component ===');
    console.log('Video URL:', videoUrl);
    console.log('Dimensions:', width, 'x', height);
    console.log('Auto play:', autoPlay);
    
    // Reset states when URL changes
    setIsLoading(true);
    setHasError(false);
    setIsPlaying(false);
    setLoadAttempts(0);

    // Set a timeout to show error if video doesn't load
    const timeout = setTimeout(() => {
      if (isLoading) {
        console.warn('Video loading timeout after 10 seconds');
        setIsLoading(false);
        // Don't set error, just stop loading indicator
      }
    }, 10000);

    return () => clearTimeout(timeout);
  }, [videoUrl, autoPlay, height, width, isLoading]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      if (loadAttempts === 0) {
        console.log('✅ Video loaded successfully!');
        console.log('Duration:', status.durationMillis, 'ms');
        if (status.naturalSize) {
          console.log('Natural size:', status.naturalSize.width, 'x', status.naturalSize.height);
        }
      }
      
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
      setHasError(false);
      setLoadAttempts(prev => prev + 1);
    } else if (status.error) {
      console.error('❌ Playback error:', status.error);
      setHasError(true);
      setIsLoading(false);
    }
  };

  const handleError = (error: string) => {
    console.error('❌ Video error:', error);
    console.error('Failed URL:', videoUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('📹 Video onLoad triggered');
    setIsLoading(false);
    setHasError(false);
  };

  const handleReadyForDisplay = () => {
    console.log('✨ Video ready for display');
    setIsLoading(false);
  };

  const togglePlayPause = async () => {
    if (!videoRef.current) {
      console.log('⚠️ Video ref not available');
      return;
    }

    try {
      if (isPlaying) {
        await videoRef.current.pauseAsync();
        console.log('⏸️ Video paused');
      } else {
        await videoRef.current.playAsync();
        console.log('▶️ Video playing');
      }
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handlePress = () => {
    console.log('👆 Video preview pressed');
    if (onPress) {
      onPress();
    } else {
      togglePlayPause();
    }
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        {
          width,
          height,
          borderRadius,
        },
      ]}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      {hasError ? (
        <View style={[styles.errorContainer, { borderRadius }]}>
          <IconSymbol
            ios_icon_name="exclamationmark.triangle.fill"
            android_material_icon_name="error"
            size={32}
            color={colors.textMuted}
          />
          <Text style={styles.errorText}>Video unavailable</Text>
        </View>
      ) : (
        <>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={[styles.video, { borderRadius }]}
            resizeMode={ResizeMode.COVER}
            shouldPlay={false}
            isLooping={false}
            isMuted={true}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={handleError}
            onLoad={handleLoad}
            onReadyForDisplay={handleReadyForDisplay}
            useNativeControls={false}
            positionMillis={100}
          />
          
          {isLoading && (
            <View style={[styles.loadingOverlay, { borderRadius }]}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          )}

          {!isLoading && !hasError && showPlayButton && (
            <View style={styles.playButtonOverlay}>
              <View style={styles.playButtonBackground}>
                <IconSymbol
                  ios_icon_name="play.circle.fill"
                  android_material_icon_name="play-circle-filled"
                  size={48}
                  color="rgba(255, 255, 255, 0.95)"
                />
              </View>
            </View>
          )}
        </>
      )}
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.secondary,
    overflow: 'hidden',
    position: 'relative',
  },
  video: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    pointerEvents: 'none',
  },
  playButtonBackground: {
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    borderRadius: 50,
    padding: 4,
  },
  errorContainer: {
    width: '100%',
    height: '100%',
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
    padding: 12,
  },
  errorText: {
    color: colors.textMuted,
    fontSize: 11,
    textAlign: 'center',
    fontWeight: '500',
  },
});
