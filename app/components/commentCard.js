import { StyleSheet, Text, View } from "react-native";
import { COLORS, FONT_SIZE, SPACING, RADIUS } from "../styles/theme";
import { formatDate } from "../utils/formatDate";

export default function CommentCard({ comment }) {
  return (
    <View style={styles.comment}>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>
          {comment.username?.charAt(0).toUpperCase() || "?"}
        </Text>
      </View>

      <View style={styles.body}>
        <View style={styles.metadata}>
          <Text style={styles.username}>{comment.username}</Text>
          <Text style={styles.date}>
            {formatDate(comment.createdAt, { day: "numeric", month: "short" })}
          </Text>
        </View>
        <Text style={styles.content}>{comment.content}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  comment: {
    flexDirection: "row",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: RADIUS.pill,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: COLORS.surface,
  },
  avatarText: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
  body: {
    flex: 1,
  },
  metadata: {
    flexDirection: "row",
    alignItems: "baseline",
    gap: SPACING.sm,
  },
  username: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  date: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.xs,
  },
  content: {
    marginTop: SPACING.xs - 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
});
