import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { COLORS, BORDER_RADIUS, SPACING, FONT_SIZES } from '../utils/theme';
interface ButtonProps {
    testID?: string;
    title: string;
    onPress: () => void;
    type?: 'primary' | 'secondary' | 'outline' | 'google';
    loading?: boolean;
    icon?: React.ReactNode;
    style?: any;
    disabled?: boolean;
}
const Button = ({ title, onPress, type = 'primary', loading = false, icon, style, disabled, testID }: ButtonProps) => {
    const buttonStyles = [
        styles.button,
        type === 'primary' && styles.primaryButton,
        type === 'secondary' && styles.secondaryButton,
        type === 'outline' && styles.outlineButton,
        type === 'google' && styles.googleButton,
        style,
    ];

    const textStyles = [
        styles.text,
        type === 'primary' && styles.primaryText,
        type === 'secondary' && styles.secondaryText,
        type === 'outline' && styles.outlineText,
        type === 'google' && styles.googleText,
    ];

    return (
        <TouchableOpacity
            testID={testID}
            style={buttonStyles}
            onPress={onPress}
            disabled={loading || disabled}
            activeOpacity={0.8}
        >
            {loading ? (
                <ActivityIndicator size="small" color={type === 'primary' ? COLORS.white : COLORS.primary} />
            ) : (
                <>
                    {icon && icon}
                    <Text style={textStyles}>{title}</Text>
                </>
            )}
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    button: {
        height: 50,
        borderRadius: BORDER_RADIUS.medium,
        paddingHorizontal: SPACING.m,
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'row',
        marginVertical: SPACING.s,
    },
    primaryButton: {
        backgroundColor: COLORS.primary,
    },
    secondaryButton: {
        backgroundColor: COLORS.secondary,
    },
    outlineButton: {
        backgroundColor: 'transparent',
        borderWidth: 2,
        borderColor: COLORS.primary,
    },
    googleButton: {
        backgroundColor: COLORS.white,
        borderWidth: 1,
        borderColor: COLORS.lightGray,
    },
    text: {
        fontSize: FONT_SIZES.large,
        fontWeight: 'bold',
    },
    primaryText: {
        color: COLORS.white,
    },
    secondaryText: {
        color: COLORS.white,
    },
    outlineText: {
        color: COLORS.primary,
    },
    googleText: {
        color: COLORS.dark,
        marginLeft: SPACING.s,
    },
});

export default Button;