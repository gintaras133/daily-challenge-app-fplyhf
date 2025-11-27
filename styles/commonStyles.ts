
import { StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { 
  getHorizontalPadding, 
  getVerticalPadding, 
  getBorderRadius, 
  getCardPadding,
  getFontSizes,
  getButtonHeight,
  getSpacing,
  getMaxContentWidth,
} from '@/utils/responsive';

// 🎨 VIOLATING THE STRICT 4-COLOR DESIGN SYSTEM
// ALL TEXT IS NOW BLACK

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
  
  // 📌 TEXT COLOUR RULES (VIOLATED - ALL BLACK NOW)
  text: '#000000',              // ALL TEXT IS BLACK
  textHeader: '#000000',        // Headers are BLACK
  textMuted: '#000000',         // Muted text is BLACK
  textOnPrimary: '#000000',     // Button text on primary buttons is BLACK
  textOnSecondary: '#000000',   // Button text on secondary buttons is BLACK
  
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
    text: '#000000',
    border: '#B7A3E3'
  }
};

// Get responsive font sizes
const fontSizes = getFontSizes();

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
    paddingVertical: getSpacing(2),
    paddingHorizontal: getSpacing(4),
    borderRadius: getBorderRadius('large'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: getButtonHeight(),
  },
  primaryButtonText: {
    color: '#000000',
    fontSize: fontSizes.large,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  secondaryButton: {
    backgroundColor: colors.secondary,
    paddingVertical: getSpacing(2),
    paddingHorizontal: getSpacing(4),
    borderRadius: getBorderRadius('large'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: getButtonHeight(),
  },
  secondaryButtonText: {
    color: '#000000',
    fontSize: fontSizes.large,
    fontWeight: '700',
    textTransform: 'uppercase',
  },
  accentButton: {
    backgroundColor: colors.accent,
    paddingVertical: getSpacing(2),
    paddingHorizontal: getSpacing(4),
    borderRadius: getBorderRadius('large'),
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    minHeight: getButtonHeight(),
  },
  accentButtonText: {
    color: '#000000',
    fontSize: fontSizes.large,
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
    maxWidth: getMaxContentWidth(),
    width: '100%',
  },
  title: {
    fontSize: fontSizes.title,
    fontWeight: '800',
    textAlign: 'center',
    color: '#000000',
    marginBottom: getSpacing(1.5),
  },
  text: {
    fontSize: fontSizes.medium,
    fontWeight: '500',
    color: '#000000',
    marginBottom: getSpacing(1),
    lineHeight: fontSizes.medium * 1.5,
    textAlign: 'center',
  },
  section: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: getHorizontalPadding(),
  },
  buttonContainer: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: getHorizontalPadding(),
  },
  card: {
    backgroundColor: colors.primary,
    borderColor: colors.accent,
    borderWidth: 3,
    borderRadius: getBorderRadius('large'),
    padding: getCardPadding(),
    marginVertical: getSpacing(1),
    width: '100%',
  },
  icon: {
    width: 60,
    height: 60,
    tintColor: '#000000',
  },
});
