
import React from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TextInputProps,
} from 'react-native';
import { colors } from '@/styles/commonStyles';
import { Country } from './CountryPicker';

interface PhoneInputProps extends Omit<TextInputProps, 'value' | 'onChangeText'> {
  country: Country | null;
  value: string;
  onChangeText: (text: string) => void;
  label?: string;
  error?: string;
}

export default function PhoneInput({
  country,
  value,
  onChangeText,
  label,
  error,
  ...textInputProps
}: PhoneInputProps) {
  const formatPhoneNumber = (text: string) => {
    // Remove all non-numeric characters
    const cleaned = text.replace(/\D/g, '');
    return cleaned;
  };

  const handleChangeText = (text: string) => {
    const formatted = formatPhoneNumber(text);
    onChangeText(formatted);
  };

  const displayValue = value ? `${country?.dialCode || ''} ${value}` : '';

  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {country && (
          <View style={styles.countryCodeContainer}>
            <Text style={styles.flag}>{country.flag}</Text>
            <Text style={styles.dialCode}>{country.dialCode}</Text>
          </View>
        )}
        <TextInput
          style={styles.input}
          placeholder={country ? 'Phone number' : 'Select country first'}
          placeholderTextColor={colors.text}
          value={value}
          onChangeText={handleChangeText}
          keyboardType="phone-pad"
          editable={!!country}
          {...textInputProps}
        />
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
      {country && value && (
        <Text style={styles.fullNumber}>Full number: {displayValue}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: 8,
  },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.text,
  },
  inputContainer: {
    backgroundColor: colors.primary,
    borderWidth: 2,
    borderColor: colors.accent,
    borderRadius: 12,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  inputError: {
    borderColor: '#FF3B30',
    borderWidth: 3,
  },
  countryCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    paddingLeft: 16,
    paddingRight: 12,
    borderRightWidth: 1,
    borderRightColor: colors.accent,
  },
  flag: {
    fontSize: 20,
  },
  dialCode: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  input: {
    flex: 1,
    padding: 16,
    fontSize: 16,
    color: colors.text,
  },
  errorText: {
    fontSize: 12,
    color: '#FF3B30',
    fontWeight: '600',
  },
  fullNumber: {
    fontSize: 12,
    color: colors.text,
    fontStyle: 'italic',
  },
});
