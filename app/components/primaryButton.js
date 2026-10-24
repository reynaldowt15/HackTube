
import { ActivityIndicator, Pressable, Text, StyleSheet } from "react-native";
import { COLORS, SPACING, FONT_SIZE } from "../styles/theme";

export default function PrimaryButton({
    title,
    onPress,
    loading = false,
    disabled = false,
}) {
    const isDisabled = disabled || loading;

    return (
        <Pressable
            onPress={onPress}
            disabled={isDisabled}
            style={({ pressed }) => [
                styles.button,
                pressed && !isDisabled && styles.pressed,
                isDisabled && styles.disabled,
            ]}
        >
            {loading ? (
                <ActivityIndicator color={COLORS.white} />
            ) : (
                <Text style={styles.buttonText}>{title}</Text>
            )}
        </Pressable>
    );
}

const styles = StyleSheet.create({
    button: {
        backgroundColor: COLORS.primary,
        minHeight: 52,
        borderRadius: 12,
        alignItems: "center",
        justifyContent: "center",
        paddingHorizontal: SPACING.xl,
        marginTop: SPACING.lg,
        elevation: 2,
    },

    pressed: {
        backgroundColor: COLORS.primaryDark,
        transform: [{ scale: 0.98 }],
    },

    disabled: {
        opacity: 0.6,
    },

    buttonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
        letterSpacing: 0.3,
    },
});
