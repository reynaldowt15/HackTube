import { Ionicons } from "@expo/vector-icons";
import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../styles/theme";

export default function BrandMark() {
  return (
    <View style={styles.container}>
      <View style={styles.logo}>
        <Ionicons
          name="play"
          size={19}
          color={COLORS.white}
        />
      </View>
      <Text style={styles.name}>
        Hack<Text style={styles.accent}>Tube</Text>
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  largeContainer: {
    flexDirection: "column",
    gap: SPACING.sm,
  },
  logo: {
    width: 32,
    height: 23,
    borderRadius: RADIUS.sm,
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
  },
  largeLogo: {
    width: 52,
    height: 38,
    borderRadius: RADIUS.md,
  },
  name: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
    letterSpacing: -0.6,
  },
  largeName: {
    fontSize: FONT_SIZE.xxl,
    letterSpacing: -0.8,
  },
  accent: {
    color: COLORS.primary,
  },
});
