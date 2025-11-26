
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';

// 🎨 STRICT 4-COLOR DESIGN SYSTEM FOR BLOOP
// NO OTHER COLORS ALLOWED - ONLY THESE FOUR

export const colors = {
  // 1. Background Colour – Main Colour
  // Large surfaces, app backgrounds
  background: '#FF8F8F',
  
  // 2. Primary Colour – Main Action / Brand
  // Primary buttons and core actions
  primary: '#FFF1CB',
  
  // 3. Secondary Colour – Secondary Actions
  // Optional buttons, smaller actions, supportive UI
  secondary: '#C2E2FA',
  
  // 4. Accent Colour – Key Indicators / Highlights
  // Attention elements, alerts, minimal usage
  accent: '#B7A3E3',
  
  // 📌 TEXT COLOUR RULES (MANDATORY)
  // Since no black/white allowed, we assign meaning:
  text: '#B7A3E3',              // Primary text (Accent) → best contrast
  textHeader: '#B7A3E3',        // Headers (Accent)
  textMuted: '#C2E2FA',         // Muted text, timestamps, labels (Secondary)
  textOnPrimary: '#FF8F8F',     // Button text on primary buttons (Background)
  textOnSecondary: '#FF8F8F',   // Button text on secondary buttons (Background)
  
  // For backwards compatibility
  card: '#FFF1CB',              // Using primary color for cards
  border: '#B7A3E3',            // Using accent color for borders
};

// Natively theme configuration
export const theme = {
  colors: {
    background: '#FF8F8F',
    primary: '#FFF1CB',
    secondary: '#C2E2FA',
    accent: '#B7A3E3',
    text: '#B7A3E3',
    border: '#B7A3E3'
  }
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
    color: colors.textOnPrimary,
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
    color: colors.textOnSecondary,
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
    color: colors.textOnPrimary,
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
    color: colors.textHeader,
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
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderWidth: 3,
    borderRadius: 20,
    padding: 24,
    marginVertical: 8,
    width: '100%',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: colors.text,
  },
});
