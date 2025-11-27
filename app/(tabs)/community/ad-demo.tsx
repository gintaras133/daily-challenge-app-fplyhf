
import React from 'react';
import { View, StyleSheet, ScrollView, Text, TouchableOpacity } from 'react-native';
import { router } from 'expo-router';
import ResponsiveAdContainer from '@/components/ResponsiveAdContainer';
import ExampleAdContent from '@/components/ExampleAdContent';
import { colors } from '@/styles/commonStyles';
import { getSpacing, getFontSizes } from '@/utils/responsive';
import { IconSymbol } from '@/components/IconSymbol';

/**
 * Ad Demo Screen
 * 
 * This screen demonstrates the ResponsiveAdContainer component.
 * 
 * Behavior:
 * - On mobile devices: Content auto-aligns to full screen width
 * - On desktop: Content is constrained to iPhone 17 Pro Max size (430x932)
 *   and centered on the screen
 */
export default function AdDemoScreen() {
  const fontSizes = getFontSizes();
  const spacing = getSpacing();

  return (
    <ResponsiveAdContainer backgroundColor={colors.background}>
      <View style={styles.container}>
        {/* Back Button */}
        <TouchableOpacity 
          style={[styles.backButton, { top: spacing * 4, left: spacing * 2 }]}
          onPress={() => router.back()}
        >
          <IconSymbol 
            ios_icon_name="chevron.left" 
            android_material_icon_name="arrow-back" 
            size={24} 
            color={colors.text}
          />
        </TouchableOpacity>

        {/* Info Banner */}
        <View style={[styles.infoBanner, { padding: spacing * 2, marginTop: spacing * 8 }]}>
          <Text style={[styles.infoText, { fontSize: fontSizes.small }]}>
            📱 Mobile: Full screen width
          </Text>
          <Text style={[styles.infoText, { fontSize: fontSizes.small }]}>
            🖥️ Desktop: iPhone 17 Pro Max size (430×932)
          </Text>
        </View>

        {/* Ad Content */}
        <ExampleAdContent />
      </View>
    </ResponsiveAdContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  backButton: {
    position: 'absolute',
    zIndex: 100,
    backgroundColor: colors.secondary,
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
  },
  infoBanner: {
    backgroundColor: colors.secondary,
    marginHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  infoText: {
    color: colors.text,
    fontWeight: '600',
    textAlign: 'center',
    marginVertical: 2,
  },
});
