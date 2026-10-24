import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, TextInput, View } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../styles/theme";

/**
 * Shared text input for SocialTube forms.
 * Pass `icon` to render the input inside an icon field, or `containerStyle`
 * to customize the wrapper (for example, a multiline content field).
 */
export default function AppTextInput({
  icon,
  iconSize = 20,
  iconColor = COLORS.secondaryText,
  containerStyle,
  inputStyle,
  placeholderTextColor = COLORS.muted,
  ...inputProps
}) {
  const hasWrapper = Boolean(icon || containerStyle);

  const input = (
    <TextInput
      {...inputProps}
      placeholderTextColor={placeholderTextColor}
      style={[hasWrapper ? styles.wrappedInput : styles.input, inputStyle]}
    />
  );

  if (!hasWrapper) {
    return input;
  }

  return (
    <View style={[styles.wrapper, containerStyle]}>
      {icon ? (
        <Ionicons name={icon} size={iconSize} color={iconColor} />
      ) : null}
      {input}
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    minHeight: 52,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
  },
  input: {
    minHeight: 50,
    paddingHorizontal: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.md,
    backgroundColor: COLORS.surface,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  wrappedInput: {
    flex: 1,
    minHeight: 50,
    paddingVertical: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
});
