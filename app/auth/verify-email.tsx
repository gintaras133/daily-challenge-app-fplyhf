
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';
import { colors } from '@/styles/commonStyles';
import { IconSymbol } from '@/components/IconSymbol';

export default function VerifyEmailScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState((params.email as string) || '');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  useEffect(() => {
    if (resendCooldown > 0) {
      const timer = setTimeout(() => {
        setResendCooldown(resendCooldown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
  }, [resendCooldown]);

  const handleResendEmail = async () => {
    if (!email) {
      Alert.alert('Error', 'Email address not found. Please sign up again.');
      router.replace('/auth/login');
      return;
    }

    setLoading(true);

    try {
      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: email,
        options: {
          emailRedirectTo: 'https://natively.dev/email-confirmed',
        },
      });

      if (error) {
        Alert.alert('Error', error.message);
      } else {
        Alert.alert(
          'Email Sent',
          'A new verification email has been sent. Please check your inbox.',
          [{ text: 'OK' }]
        );
        setResendCooldown(60); // 60 second cooldown
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChangeEmail = () => {
    Alert.alert(
      'Change Email',
      'To change your email address, please sign up again with a different email.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Sign Up Again',
          onPress: () => router.replace('/auth/login'),
        },
      ]
    );
  };

  const handleBackToLogin = () => {
    router.replace('/auth/login');
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
    >
      <View style={styles.iconContainer}>
        <View style={styles.iconCircle}>
          <IconSymbol
            ios_icon_name="envelope.fill"
            android_material_icon_name="email"
            size={64}
            color={colors.primary}
          />
        </View>
      </View>

      <View style={styles.header}>
        <Text style={styles.title}>Welcome to BLOOP</Text>
        <Text style={styles.subtitle}>
          Your next-gen productivity engine is ready to roll.
        </Text>
      </View>

      <View style={styles.content}>
        <Text style={styles.mainText}>
          Your Account is almost ready.
        </Text>
        <Text style={styles.description}>
          Please confirm your email to finalize your setup.
        </Text>

        {email && (
          <View style={styles.emailBox}>
            <Text style={styles.emailLabel}>Verification email sent to:</Text>
            <Text style={styles.emailText}>{email}</Text>
          </View>
        )}

        <View style={styles.infoBox}>
          <IconSymbol
            ios_icon_name="info.circle.fill"
            android_material_icon_name="info"
            size={20}
            color={colors.text}
          />
          <Text style={styles.infoText}>
            Check your inbox and click the confirmation link to activate your account.
          </Text>
        </View>

        <View style={styles.brandBox}>
          <Text style={styles.brandText}>
            🔒 Your account identity is important. Verification keeps your data protected.
          </Text>
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, (loading || resendCooldown > 0) && styles.buttonDisabled]}
          onPress={handleResendEmail}
          disabled={loading || resendCooldown > 0}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>
              {resendCooldown > 0
                ? `Resend in ${resendCooldown}s`
                : 'Send Verification Email'}
            </Text>
          )}
        </TouchableOpacity>

        <View style={styles.footer}>
          <Text style={styles.footerText}>Didn&apos;t receive anything?</Text>
          <View style={styles.footerActions}>
            <TouchableOpacity
              onPress={handleResendEmail}
              disabled={loading || resendCooldown > 0}
            >
              <Text
                style={[
                  styles.footerLink,
                  (loading || resendCooldown > 0) && styles.footerLinkDisabled,
                ]}
              >
                Resend
              </Text>
            </TouchableOpacity>
            <Text style={styles.footerSeparator}> • </Text>
            <TouchableOpacity onPress={handleChangeEmail} disabled={loading}>
              <Text style={[styles.footerLink, loading && styles.footerLinkDisabled]}>
                Change Email
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <TouchableOpacity
          style={styles.backButton}
          onPress={handleBackToLogin}
          disabled={loading}
        >
          <Text style={styles.backButtonText}>Back to Login</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.bottomBrand}>
        <Text style={styles.bottomBrandText}>BLOOP Team</Text>
        <Text style={styles.bottomBrandTagline}>Break the Loop.</Text>
        <Text style={styles.bottomBrandSubtext}>
          Powered by a tradition of reliability. Built for tomorrow&apos;s creators.
        </Text>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  contentContainer: {
    padding: 24,
    paddingTop: Platform.OS === 'android' ? 60 : 80,
    paddingBottom: 40,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 24,
  },
  iconCircle: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: colors.secondary,
    borderWidth: 3,
    borderColor: colors.accent,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 32,
    alignItems: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textHeader,
    marginBottom: 8,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  content: {
    gap: 20,
  },
  mainText: {
    fontSize: 20,
    fontWeight: '600',
    color: colors.textHeader,
    textAlign: 'center',
  },
  description: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
    lineHeight: 24,
  },
  emailBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.accent,
    alignItems: 'center',
  },
  emailLabel: {
    fontSize: 12,
    color: colors.textMuted,
    marginBottom: 4,
  },
  emailText: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  infoBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.accent,
    flexDirection: 'row',
    gap: 12,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  brandBox: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  brandText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    marginTop: 8,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  footer: {
    alignItems: 'center',
    gap: 8,
    marginTop: 8,
  },
  footerText: {
    fontSize: 14,
    color: colors.text,
  },
  footerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  footerLink: {
    fontSize: 14,
    color: colors.text,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
  footerLinkDisabled: {
    opacity: 0.5,
  },
  footerSeparator: {
    fontSize: 14,
    color: colors.text,
  },
  backButton: {
    padding: 12,
    alignItems: 'center',
    marginTop: 8,
  },
  backButtonText: {
    fontSize: 14,
    color: colors.textMuted,
    textDecorationLine: 'underline',
  },
  bottomBrand: {
    marginTop: 40,
    alignItems: 'center',
    gap: 4,
  },
  bottomBrandText: {
    fontSize: 16,
    fontWeight: '700',
    color: colors.textHeader,
  },
  bottomBrandTagline: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
    fontStyle: 'italic',
  },
  bottomBrandSubtext: {
    fontSize: 12,
    color: colors.textMuted,
    textAlign: 'center',
    marginTop: 8,
    lineHeight: 18,
  },
});
