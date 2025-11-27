
import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router } from 'expo-router';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function EmailConfirmedScreen() {
  const [countdown, setCountdown] = useState(3);

  useEffect(() => {
    // Countdown timer
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          // Redirect to login after countdown
          router.replace('/auth/login');
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <View style={styles.iconCircle}>
            <IconSymbol
              ios_icon_name="checkmark.circle.fill"
              android_material_icon_name="check_circle"
              size={80}
              color="#4CAF50"
            />
          </View>
        </View>

        <Text style={styles.title}>Email Verified!</Text>
        <Text style={styles.subtitle}>
          Your email has been successfully verified.
        </Text>

        <View style={styles.successBox}>
          <Text style={styles.successText}>
            ✅ Your BLOOP account is now active
          </Text>
        </View>

        <View style={styles.redirectBox}>
          <ActivityIndicator size="small" color={colors.primary} />
          <Text style={styles.redirectText}>
            Redirecting to login in {countdown}...
          </Text>
        </View>

        <View style={styles.brandBox}>
          <Text style={styles.brandText}>BLOOP Team</Text>
          <Text style={styles.brandTagline}>Break the Loop.</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
  },
  content: {
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    gap: 24,
  },
  iconContainer: {
    marginBottom: 16,
  },
  iconCircle: {
    width: 140,
    height: 140,
    borderRadius: 70,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: '#4CAF50',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textHeader,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  successBox: {
    backgroundColor: '#4CAF50',
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: '#2E7D32',
    width: '100%',
  },
  successText: {
    fontSize: 16,
    color: '#ffffff',
    fontWeight: '600',
    textAlign: 'center',
  },
  redirectBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginTop: 16,
  },
  redirectText: {
    fontSize: 14,
    color: colors.text,
  },
  brandBox: {
    marginTop: 32,
    alignItems: 'center',
    gap: 4,
  },
  brandText: {
    fontSize: 18,
    fontWeight: '700',
    color: colors.textHeader,
  },
  brandTagline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontStyle: 'italic',
  },
});
