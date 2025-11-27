
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
  const [isPlaying, setIsPlaying] = useState(autoPlay);

  useEffect(() => {
    console.log('VideoPreview mounted with URL:', videoUrl);
  }, [videoUrl]);

  const handlePlaybackStatusUpdate = (status: AVPlaybackStatus) => {
    if (status.isLoaded) {
      setIsLoading(false);
      setIsPlaying(status.isPlaying);
    }
  };

  const handleError = (error: string) => {
    console.error('Video preview error:', error);
    console.error('Video URL:', videoUrl);
    setHasError(true);
    setIsLoading(false);
  };

  const handleLoad = () => {
    console.log('Video loaded successfully:', videoUrl);
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
    } catch (error) {
      console.error('Error toggling play/pause:', error);
    }
  };

  const handlePress = () => {
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
          <Text style={styles.errorText}>Failed to load video</Text>
        </View>
      ) : (
        <>
          <Video
            ref={videoRef}
            source={{ uri: videoUrl }}
            style={[styles.video, { borderRadius }]}
            resizeMode={ResizeMode.COVER}
            shouldPlay={autoPlay}
            isLooping={false}
            isMuted={muted}
            onPlaybackStatusUpdate={handlePlaybackStatusUpdate}
            onError={handleError}
            onLoad={handleLoad}
            useNativeControls={false}
          />
          
          {isLoading && (
            <View style={styles.loadingOverlay}>
              <ActivityIndicator size="small" color={colors.accent} />
            </View>
          )}

          {showPlayButton && !isLoading && !hasError && (
            <View style={styles.playButtonOverlay}>
              <IconSymbol
                ios_icon_name={isPlaying ? 'pause.circle.fill' : 'play.circle.fill'}
                android_material_icon_name={isPlaying ? 'pause-circle' : 'play-circle'}
                size={48}
                color="rgba(255, 255, 255, 0.9)"
              />
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
  },
  loadingOverlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: colors.secondary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  playButtonOverlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.1)',
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
