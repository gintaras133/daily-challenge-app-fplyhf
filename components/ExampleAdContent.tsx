
import React from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { colors } from '@/styles/commonStyles';
import { 
  getHorizontalPadding, 
  getSpacing, 
  getBorderRadius, 
  getFontSizes 
} from '@/utils/responsive';

/**
 * Example Ad Content Component
 * 
 * This is a sample ad component that demonstrates how content
 * will be displayed within the ResponsiveAdContainer.
 * 
 * Replace this with your actual ad content.
 */
export default function ExampleAdContent() {
  const fontSizes = getFontSizes();
  const spacing = getSpacing();
  const horizontalPadding = getHorizontalPadding();

  const handleAdClick = () => {
    console.log('Ad clicked!');
    // Add your ad click tracking/navigation logic here
  };

  return (
    <View style={styles.container}>
      {/* Ad Header */}
      <View style={[styles.header, { paddingHorizontal: horizontalPadding, paddingTop: spacing * 4 }]}>
        <Text style={[styles.headerText, { fontSize: fontSizes.hero }]}>
          SPECIAL OFFER
        </Text>
        <Text style={[styles.subheaderText, { fontSize: fontSizes.large, marginTop: spacing }]}>
          Limited Time Only
        </Text>
      </View>

      {/* Ad Image/Content Area */}
      <View style={[styles.contentArea, { marginVertical: spacing * 3 }]}>
        <View style={[
          styles.imagePlaceholder, 
          { 
            borderRadius: getBorderRadius('large'),
            marginHorizontal: horizontalPadding,
          }
        ]}>
          <Text style={[styles.placeholderText, { fontSize: fontSizes.medium }]}>
            Your Ad Content Here
          </Text>
          <Text style={[styles.placeholderSubtext, { fontSize: fontSizes.small, marginTop: spacing }]}>
            Image, Video, or Custom Component
          </Text>
        </View>
      </View>

      {/* Ad Description */}
      <View style={[styles.descriptionArea, { paddingHorizontal: horizontalPadding, marginBottom: spacing * 2 }]}>
        <Text style={[styles.descriptionText, { fontSize: fontSizes.medium, lineHeight: fontSizes.medium * 1.6 }]}>
          Get 50% off your first purchase! This amazing offer is available for a limited time only. 
          Don&apos;t miss out on this incredible opportunity.
        </Text>
      </View>

      {/* Call to Action Button */}
      <View style={[styles.ctaContainer, { paddingHorizontal: horizontalPadding }]}>
        <TouchableOpacity 
          style={[
            styles.ctaButton, 
            { 
              paddingVertical: spacing * 2,
              borderRadius: getBorderRadius('large'),
            }
          ]}
          onPress={handleAdClick}
        >
          <Text style={[styles.ctaButtonText, { fontSize: fontSizes.large }]}>
            CLAIM OFFER NOW
          </Text>
        </TouchableOpacity>
      </View>

      {/* Ad Footer */}
      <View style={[styles.footer, { paddingHorizontal: horizontalPadding, marginTop: spacing * 3 }]}>
        <Text style={[styles.footerText, { fontSize: fontSizes.small }]}>
          Terms and conditions apply
        </Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'space-between',
  },
  header: {
    alignItems: 'center',
  },
  headerText: {
    fontWeight: '900',
    color: colors.text,
    textAlign: 'center',
    letterSpacing: 2,
  },
  subheaderText: {
    fontWeight: '600',
    color: colors.text,
    textAlign: 'center',
  },
  contentArea: {
    flex: 1,
    justifyContent: 'center',
  },
  imagePlaceholder: {
    backgroundColor: colors.primary,
    aspectRatio: 16 / 9,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.accent,
  },
  placeholderText: {
    fontWeight: '700',
    color: colors.text,
  },
  placeholderSubtext: {
    fontWeight: '500',
    color: colors.text,
    opacity: 0.7,
  },
  descriptionArea: {
    alignItems: 'center',
  },
  descriptionText: {
    fontWeight: '500',
    color: colors.text,
    textAlign: 'center',
  },
  ctaContainer: {
    width: '100%',
  },
  ctaButton: {
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  ctaButtonText: {
    fontWeight: '700',
    color: colors.text,
    letterSpacing: 1,
  },
  footer: {
    alignItems: 'center',
    paddingBottom: 20,
  },
  footerText: {
    fontWeight: '400',
    color: colors.text,
    opacity: 0.6,
  },
});
