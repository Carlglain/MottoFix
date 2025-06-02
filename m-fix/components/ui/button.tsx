import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';

type ButtonProps = {
  onPress: () => void;
  children: React.ReactNode;
  variant?: 'primary' | 'secondary';
  style?: ViewStyle;
  disabled?: boolean;
};

const Button = ({ onPress, children, variant = 'primary', style, disabled = false }: ButtonProps) => {
  const backgroundColor = variant === 'primary' ? '#4CAF50' : '#888';
  const combinedStyles = [
    styles.button,
    { backgroundColor: disabled ? '#555' : backgroundColor },
    style,
  ];

  return (
    <TouchableOpacity
      onPress={onPress}
      style={combinedStyles}
      activeOpacity={0.8}
      disabled={disabled}
    >
      <Text style={styles.text}>{children}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  text: {
    color: '#fff',
    fontWeight: 'bold',
  },
});

export default Button;
