import { StyleSheet } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "./theme";

export const commonStyles = StyleSheet.create({
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: SPACING.xl,
    backgroundColor: COLORS.background,
  },
  errorTitle: {
    marginTop: SPACING.sm,
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    textAlign: "center",
  },
  errorMessage: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
    textAlign: "center",
  },
  retryButton: {
    marginTop: SPACING.lg,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },
  retryText: {
    color: COLORS.white,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
});
