import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";

import { COLORS, FONT_SIZE, POST_IMAGE_PLACEHOLDER, SPACING } from "../styles/theme";
import { formatDate } from "../utils/formatDate";

export default function PostCard({ post }) {
  const navigation = useNavigation();
  const commentsCount = post.comments?.length ?? 0;
  const likesCount = post.likes?.length ?? 0;

  return (
    <Pressable
      onPress={() => navigation.navigate("Detail", { postId: post._id })}
      accessibilityRole="button"
      accessibilityLabel={`Open post by ${post.Author?.username || "unknown user"}`}
    >
      <View style={styles.card}>
        <Image
          source={{ uri: post.imgUrl || POST_IMAGE_PLACEHOLDER }}
          style={styles.postImage}
          resizeMode="contain"
        />

        <View style={styles.captionContainer}>
          <Text style={styles.caption}>{post.content}</Text>

          <View style={styles.metadataRow}>
            <Text style={styles.captionUsername}>
              {post.Author?.username || "Unknown user"}
            </Text>
            <Text style={styles.secondaryText}>
              <Ionicons name="chatbubble-outline" size={14} color={COLORS.secondaryText} /> {commentsCount}
            </Text>
            <Text style={styles.secondaryText}>
              <Ionicons name="heart-outline" size={14} color={COLORS.secondaryText} /> {likesCount}
            </Text>
            <Text style={styles.secondaryText}>{formatDate(post.createdAt)}</Text>
          </View>
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: {
    marginBottom: SPACING.sm,
    backgroundColor: COLORS.background,
  },
  postImage: {
    width: "100%",
    aspectRatio: 2,
    backgroundColor: COLORS.surface,
  },
  captionContainer: {
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.lg,
  },
  caption: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    lineHeight: 21,
  },
  metadataRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: SPACING.sm,
    rowGap: SPACING.xs,
  },
  captionUsername: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  secondaryText: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.xs,
  },
});
