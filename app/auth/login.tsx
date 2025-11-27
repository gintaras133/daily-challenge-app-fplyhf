
import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
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

export default function LoginScreen() {
  const params = useLocalSearchParams();
  const [email, setEmail] = useState((params.email as string) || '');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [isSignUp, setIsSignUp] = useState((params.invited as string) === 'true');
  const [passwordError, setPasswordError] = useState('');
  const [wasInvited, setWasInvited] = useState((params.invited as string) === 'true');

  useEffect(() => {
    if (params.email) {
      setEmail(params.email as string);
    }
    if (params.invited === 'true') {
      setIsSignUp(true);
      setWasInvited(true);
    }
  }, [params]);

  const validatePassword = (pass: string): boolean => {
    if (pass.length < 7) {
      setPasswordError('Password must be at least 7 characters long');
      return false;
    }
    setPasswordError('');
    return true;
  };

  const handlePasswordChange = (text: string) => {
    setPassword(text);
    if (isSignUp && text.length > 0) {
      validatePassword(text);
    } else {
      setPasswordError('');
    }
  };

  const handleEmailAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      Alert.alert('Error', 'Please enter a valid email address');
      return;
    }

    // Validate password length for sign up
    if (isSignUp && !validatePassword(password)) {
      Alert.alert('Error', 'Password must be at least 7 characters long');
      return;
    }

    setLoading(true);

    try {
      if (isSignUp) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: 'https://natively.dev/email-confirmed',
          },
        });

        if (error) {
          Alert.alert('Sign Up Error', error.message);
        } else if (data.user && !data.session) {
          Alert.alert(
            'Verify Your Email',
            'Please check your email inbox and click the confirmation link to verify your account before signing in.',
            [{ text: 'OK' }]
          );
          // Clear the form after successful signup
          setEmail('');
          setPassword('');
          setPasswordError('');
          setIsSignUp(false);
        } else if (data.session) {
          console.log('Sign up successful with session');
          router.replace('/auth/onboarding');
        }
      } else {
        const { data, error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) {
          // Display the error message from Supabase
          Alert.alert('Sign In Error', error.message);
        } else if (data.session) {
          console.log('Sign in successful');
          // Navigation will be handled by AuthContext
        }
      }
    } catch (error: any) {
      Alert.alert('Error', error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView 
      style={styles.container}
      contentContainerStyle={styles.contentContainer}
      keyboardShouldPersistTaps="handled"
    >
      <View style={styles.header}>
        <Text style={styles.title}>Welcome to Bloop!</Text>
        <Text style={styles.subtitle}>
          {isSignUp ? 'Create your account' : 'Sign in to continue'}
        </Text>
        {wasInvited && (
          <View style={[styles.infoBox, styles.invitedBox]}>
            <Text style={styles.infoText}>
              🎉 You&apos;ve been invited! Complete your registration below.
            </Text>
          </View>
        )}
        {isSignUp && !wasInvited && (
          <View style={styles.infoBox}>
            <Text style={styles.infoText}>
              💡 Use your Gmail address to sign up. You can also be invited by existing users!
            </Text>
          </View>
        )}
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Email</Text>
          <TextInput
            style={styles.input}
            placeholder="your.email@example.com"
            placeholderTextColor={colors.textMuted}
            value={email}
            onChangeText={setEmail}
            autoCapitalize="none"
            keyboardType="email-address"
            autoComplete="email"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>
            Password {isSignUp && '(minimum 7 characters)'}
          </Text>
          <TextInput
            style={[
              styles.input,
              passwordError ? styles.inputError : null
            ]}
            placeholder="Enter your password"
            placeholderTextColor={colors.textMuted}
            value={password}
            onChangeText={handlePasswordChange}
            secureTextEntry
            autoCapitalize="none"
            autoComplete="password"
            editable={!loading}
          />
          {passwordError ? (
            <Text style={styles.errorText}>{passwordError}</Text>
          ) : null}
        </View>

        <TouchableOpacity
          style={[styles.button, styles.primaryButton, loading && styles.buttonDisabled]}
          onPress={handleEmailAuth}
          disabled={loading || (isSignUp && !!passwordError)}
        >
          {loading ? (
            <ActivityIndicator color={colors.textOnPrimary} />
          ) : (
            <Text style={styles.buttonText}>
              {isSignUp ? 'Sign Up' : 'Sign In'}
            </Text>
          )}
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.switchButton}
          onPress={() => {
            setIsSignUp(!isSignUp);
            setPasswordError('');
          }}
          disabled={loading}
        >
          <Text style={styles.switchButtonText}>
            {isSignUp
              ? 'Already have an account? Sign In'
              : "Don't have an account? Sign Up"}
          </Text>
        </TouchableOpacity>
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
  },
  header: {
    marginBottom: 40,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: colors.textHeader,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
  },
  infoBox: {
    backgroundColor: colors.secondary,
    borderRadius: 12,
    padding: 12,
    marginTop: 16,
    borderWidth: 2,
    borderColor: colors.accent,
  },
  invitedBox: {
    backgroundColor: '#4CAF50',
    borderColor: '#2E7D32',
  },
  infoText: {
    fontSize: 14,
    color: colors.text,
    lineHeight: 20,
  },
  form: {
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textHeader,
  },
  input: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  inputError: {
    borderColor: '#FF3B30',
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    marginTop: 4,
  },
  button: {
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
  },
  primaryButton: {
    backgroundColor: colors.primary,
    marginTop: 8,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.textOnPrimary,
    fontSize: 16,
    fontWeight: '600',
  },
  switchButton: {
    padding: 8,
    alignItems: 'center',
  },
  switchButtonText: {
    color: colors.text,
    fontSize: 14,
    fontWeight: '600',
    textDecorationLine: 'underline',
  },
});
