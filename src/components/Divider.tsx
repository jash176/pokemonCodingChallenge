// components/Divider.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS, SPACING, FONT_SIZES } from '../utils/theme';

interface DividerProps {
  text?: string;
}

const Divider = ({ text }: DividerProps) => {
  return (
    <View style={styles.container}>
      <View style={styles.line} />
      {text && <Text style={styles.text}>{text}</Text>}
      <View style={styles.line} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: SPACING.m,
  },
  line: {
    flex: 1,
    height: 1,
    backgroundColor: COLORS.lightGray,
  },
  text: {
    color: COLORS.gray,
    paddingHorizontal: SPACING.m,
    fontSize: FONT_SIZES.small,
  },
});

export default Divider;