
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// Strict 4-Color Design System for Bloop
export const colors = {
  // Background Colour – Main Colour
  // Large surfaces, app backgrounds
  background: '#FF8F8F',
  
  // Primary Colour – Main Action / Brand
  // Primary buttons and core actions
  primary: '#FFF1CB',
  
  // Secondary Colour – Secondary Actions
  // Optional buttons, smaller actions, supportive UI
  secondary: '#C2E2FA',
  
  // Accent Colour – Key Indicators / Highlights
  // Attention elements, alerts, minimal usage
  accent: '#B7A3E3',
  
  // Derived colors for text (for readability on backgrounds)
  text: '#000000',         // Black text for light backgrounds
  textLight: '#333333',    // Dark grey for secondary text
  textSecondary: '#666666', // Medium grey for tertiary text
  
  // For cards and surfaces that need to stand out from background
  card: '#FFFFFF',
  border: '#FFF1CB',       // Using primary color for borders
  
  // Legacy gradient colors (can be removed if not needed)
  gradient1: '#FF8F8F',
  gradient2: '#FF8F8F',
  
  // Alternative backgrounds using the 4-color system
  backgroundAlt: '#FFF1CB', // Using primary as alternative background
};

export const buttonStyles = StyleSheet.create({
  instructionsButton: {
    backgroundColor: colors.primary,
    alignSelf: 'center',
    width: '100%',
  },
  backButton: {
    backgroundColor: colors.secondary,
    alignSelf: 'center',
    width: '100%',
  },
  primaryButton: {
    backgroundColor: colors.primary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  accentButton: {
    backgroundColor: colors.accent,
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
  },
  accentButtonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
});

export const commonStyles = StyleSheet.create({
  wrapper: {
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
  },
  container: {
    flex: 1,
    backgroundColor: colors.background,
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    maxWidth: 800,
    width: '100%',
  },
  title: {
    fontSize: 24,
    fontWeight: '800',
    textAlign: 'center',
    color: colors.text,
    marginBottom: 10
  },
  text: {
    fontSize: 16,
    fontWeight: '500',
    color: colors.text,
    marginBottom: 8,
    lineHeight: 24,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  card: {
    backgroundColor: colors.card,
    borderColor: colors.border,
    borderWidth: 3,
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    width: '100%',
    boxShadow: '0px 4px 12px rgba(0, 0, 0, 0.1)',
    elevation: 4,
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: "white",
  },
});
