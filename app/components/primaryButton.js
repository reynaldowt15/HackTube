import { ActivityIndicator, Pressable, StyleSheet, Text } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../styles/theme";

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
      accessibilityRole="button"
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
    minHeight: 52,
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.xl,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.primary,
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
