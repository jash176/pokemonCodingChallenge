// components/Input.js
import React from 'react';
import { View, TextInput, Text, StyleSheet, TextInputProps } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../utils/theme';

interface InputProps extends TextInputProps {
  label?: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  secureTextEntry?: boolean;
  error?: string;
  icon?: React.ReactNode;
  rightIcon?: React.ReactNode;
}
const Input = ({
  label,
  value,
  onChangeText,
  placeholder,
  secureTextEntry,
  error,
  icon,
  rightIcon,
  ...props
}: InputProps) => {
  return (
    <View style={styles.container}>
      {label && <Text style={styles.label}>{label}</Text>}
      <View style={[styles.inputContainer, error && styles.inputError]}>
        {icon && <View style={styles.iconContainer}>{icon}</View>}
        <TextInput
          style={styles.input}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={COLORS.gray}
          secureTextEntry={secureTextEntry}
          {...props}
        />
        {rightIcon && <View style={styles.rightIconContainer}>{rightIcon}</View>}
      </View>
      {error && <Text style={styles.errorText}>{error}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: SPACING.m,
  },
  label: {
    fontSize: FONT_SIZES.medium,
    marginBottom: SPACING.xs,
    color: COLORS.dark,
    fontWeight: '500',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.lightGray,
    borderRadius: BORDER_RADIUS.medium,
    backgroundColor: COLORS.white,
    height: 50,
    paddingHorizontal: SPACING.m,
  },
  inputError: {
    borderColor: COLORS.error,
  },
  input: {
    flex: 1,
    color: COLORS.dark,
    fontSize: FONT_SIZES.medium,
  },
  iconContainer: {
    marginRight: SPACING.s,
  },
  rightIconContainer: {
    marginLeft: SPACING.s,
  },
  errorText: {
    color: COLORS.error,
    fontSize: FONT_SIZES.small,
    marginTop: SPACING.xs,
  },
});

export default Input;