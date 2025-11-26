
import React, { useState } from 'react';
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
import { router } from 'expo-router';
import { supabase } from '@/app/integrations/supabase/client';
import { useAuth } from '@/contexts/AuthContext';
import { colors } from '@/styles/commonStyles';
import CountryPicker, { Country } from '@/components/CountryPicker';
import PhoneInput from '@/components/PhoneInput';

export default function OnboardingScreen() {
  const { user, refreshProfile } = useAuth();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    age: '',
    username: '',
    town: '',
    phoneNumber: '',
  });
  const [selectedCountry, setSelectedCountry] = useState<Country | null>(null);
  const [usernameError, setUsernameError] = useState('');

  const checkUsernameAvailability = async (username: string) => {
    if (username.length < 3) {
      setUsernameError('Username must be at least 3 characters');
      return false;
    }

    try {
      const { data, error } = await supabase
        .from('user_profiles')
        .select('username')
        .eq('username', username)
        .single();

      if (data) {
        setUsernameError('Username already taken');
        return false;
      }

      setUsernameError('');
      return true;
    } catch (error) {
      console.log('Username available');
      setUsernameError('');
      return true;
    }
  };

  const handleUsernameBlur = async () => {
    if (formData.username) {
      await checkUsernameAvailability(formData.username);
    }
  };

  const validateForm = () => {
    if (!formData.fullName.trim()) {
      Alert.alert('Error', 'Please enter your full name');
      return false;
    }

    const age = parseInt(formData.age);
    if (isNaN(age) || age < 1) {
      Alert.alert('Error', 'Please enter a valid age');
      return false;
    }

    if (age < 13) {
      Alert.alert(
        'Age Restriction',
        'Sorry, you must be at least 13 years old to use this app.',
        [
          {
            text: 'OK',
            onPress: async () => {
              await supabase.auth.signOut();
              router.replace('/auth/login');
            },
          },
        ]
      );
      return false;
    }

    if (formData.username.length < 3) {
      Alert.alert('Error', 'Username must be at least 3 characters');
      return false;
    }

    if (usernameError) {
      Alert.alert('Error', usernameError);
      return false;
    }

    if (!selectedCountry) {
      Alert.alert('Error', 'Please select your country');
      return false;
    }

    if (!formData.town.trim()) {
      Alert.alert('Error', 'Please enter your town');
      return false;
    }

    if (!formData.phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your telephone number');
      return false;
    }

    return true;
  };

  const handleSubmit = async () => {
    if (!validateForm()) {
      return;
    }

    const isUsernameAvailable = await checkUsernameAvailability(formData.username);
    if (!isUsernameAvailable) {
      return;
    }

    setLoading(true);

    try {
      const fullPhoneNumber = `${selectedCountry?.dialCode} ${formData.phoneNumber}`;
      
      const { error } = await supabase.from('user_profiles').insert({
        id: user?.id,
        full_name: formData.fullName.trim(),
        age: parseInt(formData.age),
        username: formData.username.trim(),
        country: selectedCountry?.name || '',
        town: formData.town.trim(),
        telephone_number: fullPhoneNumber,
        onboarding_completed: true,
      });

      if (error) {
        console.error('Error creating profile:', error);
        Alert.alert('Error', error.message);
        return;
      }

      await refreshProfile();
      router.replace('/(tabs)/(home)/');
    } catch (error: any) {
      console.error('Error:', error);
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
        <Text style={styles.title}>Complete Your Profile</Text>
        <Text style={styles.subtitle}>
          Tell us a bit about yourself to get started
        </Text>
      </View>

      <View style={styles.form}>
        <View style={styles.inputContainer}>
          <Text style={styles.label}>Full Name *</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            placeholderTextColor={colors.text}
            value={formData.fullName}
            onChangeText={(text) => setFormData({ ...formData, fullName: text })}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Age *</Text>
          <TextInput
            style={styles.input}
            placeholder="18"
            placeholderTextColor={colors.text}
            value={formData.age}
            onChangeText={(text) => setFormData({ ...formData, age: text })}
            keyboardType="number-pad"
            maxLength={3}
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Username *</Text>
          <TextInput
            style={[styles.input, usernameError && styles.inputError]}
            placeholder="johndoe123"
            placeholderTextColor={colors.text}
            value={formData.username}
            onChangeText={(text) => {
              setFormData({ ...formData, username: text });
              setUsernameError('');
            }}
            onBlur={handleUsernameBlur}
            autoCapitalize="none"
            editable={!loading}
          />
          {usernameError ? (
            <Text style={styles.errorText}>{usernameError}</Text>
          ) : null}
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Country *</Text>
          <CountryPicker
            selectedCountry={selectedCountry}
            onSelectCountry={setSelectedCountry}
            disabled={loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Town *</Text>
          <TextInput
            style={styles.input}
            placeholder="New York"
            placeholderTextColor={colors.text}
            value={formData.town}
            onChangeText={(text) => setFormData({ ...formData, town: text })}
            autoCapitalize="words"
            editable={!loading}
          />
        </View>

        <View style={styles.inputContainer}>
          <PhoneInput
            label="Telephone Number *"
            country={selectedCountry}
            value={formData.phoneNumber}
            onChangeText={(text) => setFormData({ ...formData, phoneNumber: text })}
            editable={!loading}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, loading && styles.buttonDisabled]}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color={colors.text} />
          ) : (
            <Text style={styles.buttonText}>Complete Setup</Text>
          )}
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
    paddingBottom: 40,
  },
  header: {
    marginBottom: 32,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.text,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: colors.text,
  },
  form: {
    gap: 20,
  },
  inputContainer: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
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
    borderWidth: 3,
  },
  errorText: {
    color: '#FF3B30',
    fontSize: 12,
    marginTop: 4,
    fontWeight: '600',
  },
  button: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    minHeight: 52,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
});
