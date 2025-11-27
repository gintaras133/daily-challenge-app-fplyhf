
import React from 'react';
import { View, StyleSheet, Dimensions, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// iPhone 17 Pro Max dimensions (approximate - using iPhone 15 Pro Max as reference)
const IPHONE_17_PRO_MAX_WIDTH = 430;
const IPHONE_17_PRO_MAX_HEIGHT = 932;

interface ResponsiveAdContainerProps {
  children: React.ReactNode;
  backgroundColor?: string;
}

/**
 * ResponsiveAdContainer
 * 
 * This component automatically adjusts content to:
 * - Mobile devices: Full screen width (auto-align)
 * - Desktop/Web: Constrained to iPhone 17 Pro Max dimensions (430x932)
 * 
 * Usage:
 * <ResponsiveAdContainer>
 *   <YourAdContent />
 * </ResponsiveAdContainer>
 */
export default function ResponsiveAdContainer({ 
  children, 
  backgroundColor = '#000000' 
}: ResponsiveAdContainerProps) {
  
  // Determine if we're on a desktop/large screen
  const isDesktop = Platform.OS === 'web' && SCREEN_WIDTH > IPHONE_17_PRO_MAX_WIDTH;
  
  // Calculate container dimensions
  const containerWidth = isDesktop ? IPHONE_17_PRO_MAX_WIDTH : SCREEN_WIDTH;
  const containerHeight = isDesktop ? IPHONE_17_PRO_MAX_HEIGHT : SCREEN_HEIGHT;
  
  console.log('ResponsiveAdContainer - Platform:', Platform.OS);
  console.log('ResponsiveAdContainer - Screen Width:', SCREEN_WIDTH);
  console.log('ResponsiveAdContainer - Is Desktop:', isDesktop);
  console.log('ResponsiveAdContainer - Container Width:', containerWidth);
  console.log('ResponsiveAdContainer - Container Height:', containerHeight);
  
  if (isDesktop) {
    // Desktop: Center the content and constrain to iPhone 17 Pro Max size
    return (
      <View style={[styles.desktopWrapper, { backgroundColor }]}>
        <View 
          style={[
            styles.desktopContainer,
            {
              width: containerWidth,
              height: containerHeight,
              maxWidth: containerWidth,
              maxHeight: containerHeight,
            }
          ]}
        >
          {children}
        </View>
      </View>
    );
  }
  
  // Mobile: Full screen, auto-align
  return (
    <View style={styles.mobileContainer}>
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  desktopWrapper: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  },
  desktopContainer: {
    overflow: 'hidden',
    borderRadius: 20,
    boxShadow: '0px 10px 40px rgba(0, 0, 0, 0.3)',
    // Add subtle border to make it look like a phone frame
    borderWidth: 2,
    borderColor: '#333333',
  },
  mobileContainer: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});
