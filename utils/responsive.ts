
import { Dimensions, Platform, StatusBar } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions (iPhone 11 Pro)
const BASE_WIDTH = 375;
const BASE_HEIGHT = 812;

// iPhone 17 Pro Max dimensions (approximate - using iPhone 15 Pro Max as reference)
export const IPHONE_17_PRO_MAX_WIDTH = 430;
export const IPHONE_17_PRO_MAX_HEIGHT = 932;

/**
 * Responsive width based on screen size
 * @param size - The size you want to scale
 * @returns Scaled width
 */
export const wp = (size: number): number => {
  return (SCREEN_WIDTH / BASE_WIDTH) * size;
};

/**
 * Responsive height based on screen size
 * @param size - The size you want to scale
 * @returns Scaled height
 */
export const hp = (size: number): number => {
  return (SCREEN_HEIGHT / BASE_HEIGHT) * size;
};

/**
 * Responsive font size based on screen width
 * @param size - The font size you want to scale
 * @returns Scaled font size
 */
export const fs = (size: number): number => {
  const scale = SCREEN_WIDTH / BASE_WIDTH;
  const newSize = size * scale;
  return Math.round(newSize);
};

/**
 * Get safe padding for top of screen (handles notches, status bars)
 */
export const getTopSafePadding = (): number => {
  if (Platform.OS === 'android') {
    // Android devices with notches
    return StatusBar.currentHeight ? StatusBar.currentHeight + 16 : 48;
  }
  // iOS handled by SafeAreaView
  return 0;
};

/**
 * Get safe padding for bottom of screen (handles home indicators, tab bars)
 */
export const getBottomSafePadding = (): number => {
  // Account for floating tab bar
  return 120;
};

/**
 * Check if device is a small screen (iPhone SE, etc.)
 */
export const isSmallDevice = (): boolean => {
  return SCREEN_WIDTH < 375 || SCREEN_HEIGHT < 667;
};

/**
 * Check if device is a large screen (iPhone Pro Max, iPad, etc.)
 */
export const isLargeDevice = (): boolean => {
  return SCREEN_WIDTH >= 414 || SCREEN_HEIGHT >= 896;
};

/**
 * Check if device is a tablet
 */
export const isTablet = (): boolean => {
  return SCREEN_WIDTH >= 768;
};

/**
 * Check if device is desktop/web with large screen
 */
export const isDesktop = (): boolean => {
  return Platform.OS === 'web' && SCREEN_WIDTH > IPHONE_17_PRO_MAX_WIDTH;
};

/**
 * Get responsive padding for horizontal spacing
 */
export const getHorizontalPadding = (): number => {
  if (isTablet()) {
    return wp(48);
  }
  if (isSmallDevice()) {
    return wp(16);
  }
  return wp(24);
};

/**
 * Get responsive padding for vertical spacing
 */
export const getVerticalPadding = (): number => {
  if (isSmallDevice()) {
    return hp(16);
  }
  return hp(24);
};

/**
 * Get responsive card padding
 */
export const getCardPadding = (): number => {
  if (isSmallDevice()) {
    return wp(12);
  }
  return wp(16);
};

/**
 * Get responsive border radius
 */
export const getBorderRadius = (size: 'small' | 'medium' | 'large' = 'medium'): number => {
  const sizes = {
    small: isSmallDevice() ? 8 : 12,
    medium: isSmallDevice() ? 12 : 16,
    large: isSmallDevice() ? 16 : 24,
  };
  return sizes[size];
};

/**
 * Get responsive icon size
 */
export const getIconSize = (size: 'small' | 'medium' | 'large' = 'medium'): number => {
  const sizes = {
    small: isSmallDevice() ? 16 : 20,
    medium: isSmallDevice() ? 20 : 24,
    large: isSmallDevice() ? 28 : 32,
  };
  return sizes[size];
};

/**
 * Get responsive button height
 */
export const getButtonHeight = (): number => {
  if (isSmallDevice()) {
    return hp(44);
  }
  return hp(56);
};

/**
 * Get responsive spacing between elements
 */
export const getSpacing = (multiplier: number = 1): number => {
  const baseSpacing = isSmallDevice() ? 8 : 12;
  return baseSpacing * multiplier;
};

/**
 * Get screen dimensions
 */
export const getScreenDimensions = () => {
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isSmall: isSmallDevice(),
    isLarge: isLargeDevice(),
    isTablet: isTablet(),
    isDesktop: isDesktop(),
  };
};

/**
 * Get responsive max width for content (useful for tablets and desktop)
 */
export const getMaxContentWidth = (): number => {
  if (isDesktop()) {
    return IPHONE_17_PRO_MAX_WIDTH;
  }
  if (isTablet()) {
    return 600;
  }
  return SCREEN_WIDTH;
};

/**
 * Calculate aspect ratio for responsive images/videos
 */
export const getAspectRatio = (width: number, height: number): number => {
  return width / height;
};

/**
 * Get responsive video card dimensions
 */
export const getVideoCardDimensions = () => {
  const cardWidth = SCREEN_WIDTH - (getHorizontalPadding() * 2) - (getCardPadding() * 2);
  const aspectRatio = 9 / 16; // Standard video aspect ratio
  const cardHeight = cardWidth / aspectRatio;
  
  return {
    width: cardWidth,
    height: cardHeight,
  };
};

/**
 * Get responsive avatar size
 */
export const getAvatarSize = (size: 'small' | 'medium' | 'large' = 'medium'): number => {
  const sizes = {
    small: isSmallDevice() ? 32 : 40,
    medium: isSmallDevice() ? 40 : 48,
    large: isSmallDevice() ? 56 : 64,
  };
  return sizes[size];
};

/**
 * Get responsive font sizes for different text types
 */
export const getFontSizes = () => {
  return {
    tiny: fs(10),
    small: fs(12),
    body: fs(14),
    medium: fs(16),
    large: fs(18),
    xlarge: fs(20),
    xxlarge: fs(24),
    title: fs(28),
    header: fs(32),
    hero: fs(36),
  };
};

/**
 * Get constrained dimensions for desktop view (iPhone 17 Pro Max size)
 */
export const getConstrainedDimensions = () => {
  if (isDesktop()) {
    return {
      width: IPHONE_17_PRO_MAX_WIDTH,
      height: IPHONE_17_PRO_MAX_HEIGHT,
      isConstrained: true,
    };
  }
  return {
    width: SCREEN_WIDTH,
    height: SCREEN_HEIGHT,
    isConstrained: false,
  };
};

export default {
  wp,
  hp,
  fs,
  getTopSafePadding,
  getBottomSafePadding,
  isSmallDevice,
  isLargeDevice,
  isTablet,
  isDesktop,
  getHorizontalPadding,
  getVerticalPadding,
  getCardPadding,
  getBorderRadius,
  getIconSize,
  getButtonHeight,
  getSpacing,
  getScreenDimensions,
  getMaxContentWidth,
  getAspectRatio,
  getVideoCardDimensions,
  getAvatarSize,
  getFontSizes,
  getConstrainedDimensions,
  IPHONE_17_PRO_MAX_WIDTH,
  IPHONE_17_PRO_MAX_HEIGHT,
};
