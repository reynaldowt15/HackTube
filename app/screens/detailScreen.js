import { gql } from "@apollo/client";
import { useMutation, useQuery } from "@apollo/client/react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import CommentCard from "../components/commentCard";
import { commonStyles } from "../styles/commonStyles";
import {
  COLORS,
  FONT_SIZE,
  POST_IMAGE_PLACEHOLDER,
  RADIUS,
  SPACING,
} from "../styles/theme";
import { formatDate } from "../utils/formatDate";

const GET_POST = gql`
  query PostById($postId: String!) {
    postById(postId: $postId) {
      _id
      content
      tags
      imgUrl
      comments {
        content
        username
        createdAt
        updatedAt
      }
      likes {
        username
        createdAt
        updatedAt
      }
      createdAt
      Author {
        username
      }
    }
  }
`;

const ADD_COMMENT = gql`
  mutation AddComment($postId: String, $content: String) {
    addComment(postId: $postId, content: $content) {
      content
      username
      createdAt
      updatedAt
    }
  }
`;

const ADD_LIKE = gql`
  mutation AddLike($postId: String) {
    addLike(postId: $postId) {
      username
      createdAt
      updatedAt
    }
  }
`;

export default function DetailScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const postId = route.params?.postId;
  const [comment, setComment] = useState("");

  const { loading, data, error, refetch } = useQuery(GET_POST, {
    variables: { postId },
    skip: !postId,
  });
  const [addComment, { loading: isSubmittingComment }] = useMutation(ADD_COMMENT);
  const [addLike, { loading: isLiking }] = useMutation(ADD_LIKE);

  const submitComment = async () => {
    const content = comment.trim();
    if (!content || isSubmittingComment) return;

    try {
      await addComment({ variables: { postId, content } });
      setComment("");
      await refetch();
    } catch (mutationError) {
      Alert.alert(
        "Comment not sent",
        mutationError.message || "Please try again."
      );
    }
  };

  const likePost = async () => {
    if (isLiking) return;

    try {
      await addLike({ variables: { postId } });
      await refetch();
    } catch (mutationError) {
      Alert.alert(
        "Like not added",
        mutationError.message || "Please try again."
      );
    }
  };

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error || !data?.postById) {
    return (
      <View style={commonStyles.centered}>
        <Text style={commonStyles.errorTitle}>Post unavailable</Text>
        <Text style={commonStyles.errorMessage}>
          {error?.message || "This post could not be found."}
        </Text>
        <Pressable style={commonStyles.retryButton} onPress={() => refetch()}>
          <Text style={commonStyles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const post = data.postById;
  const comments = post.comments ?? [];
  const likes = post.likes ?? [];

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.screen}>
        <View style={styles.header}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            hitSlop={10}
            onPress={() => navigation.goBack()}
            style={styles.backButton}
          >
            <Ionicons name="arrow-back" size={24} color={COLORS.text} />
          </Pressable>
          <Text style={styles.headerTitle}>Post</Text>
          <View style={styles.headerSpacer} />
        </View>

        <ScrollView
          contentContainerStyle={styles.content}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.authorRow}>
            <View style={styles.avatar}>
              <Text style={styles.avatarText}>
                {post.Author?.username?.charAt(0).toUpperCase() || "?"}
              </Text>
            </View>
            <View>
              <Text style={styles.username}>
                {post.Author?.username || "Unknown user"}
              </Text>
              <Text style={styles.metadata}>
                {formatDate(post.createdAt, {
                  day: "numeric",
                  month: "short",
                  year: "numeric",
                })}
              </Text>
            </View>
          </View>

          <Image
            source={{ uri: post.imgUrl || POST_IMAGE_PLACEHOLDER }}
            style={styles.postImage}
            resizeMode="contain"
          />

          <Text style={styles.postContent}>{post.content}</Text>

          {post.tags?.length > 0 && (
            <View style={styles.tags}>
              {post.tags.map((tag, index) => (
                <Text key={`${tag}-${index}`} style={styles.tag}>
                  #{tag}
                </Text>
              ))}
            </View>
          )}

          <View style={styles.divider} />

          <View style={styles.actions}>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`Like post. ${likes.length} likes`}
              disabled={isLiking}
              onPress={likePost}
              style={({ pressed }) => [
                styles.actionButton,
                pressed && styles.pressed,
              ]}
            >
              <Ionicons name="heart-outline" size={24} color={COLORS.text} />
              <Text style={styles.actionText}>
                {isLiking ? "Liking..." : likes.length}
              </Text>
            </Pressable>

            <View style={styles.actionButton}>
              <Ionicons
                name="chatbubble-outline"
                size={22}
                color={COLORS.text}
              />
              <Text style={styles.actionText}>{comments.length}</Text>
            </View>
          </View>

          <View style={styles.commentsHeader}>
            <Text style={styles.sectionTitle}>Comments</Text>
            <Text style={styles.commentCount}>{comments.length}</Text>
          </View>

          {comments.length === 0 ? (
            <Text style={styles.emptyComments}>
              No comments yet. Start the conversation.
            </Text>
          ) : (
            comments.map((item, index) => (
              <CommentCard key={`${item.username}-${item.createdAt ?? index}`} comment={item} />
            ))
          )}
        </ScrollView>

        <View style={styles.composer}>
          <TextInput
            value={comment}
            onChangeText={setComment}
            placeholder="Add a comment..."
            placeholderTextColor={COLORS.muted}
            style={styles.commentInput}
            multiline
            maxLength={500}
            returnKeyType="send"
            onSubmitEditing={submitComment}
          />
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Send comment"
            disabled={!comment.trim() || isSubmittingComment}
            onPress={submitComment}
            style={({ pressed }) => [
              styles.sendButton,
              (!comment.trim() || isSubmittingComment) && styles.sendButtonDisabled,
              pressed && styles.pressed,
            ]}
          >
            <Ionicons name="arrow-up" size={20} color={COLORS.white} />
          </Pressable>
        </View>
      </SafeAreaView>

    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  header: {
    height: 56,
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: SPACING.lg,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    width: 40,
    height: 40,
    alignItems: "flex-start",
    justifyContent: "center",
  },
  headerTitle: {
    flex: 1,
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "700",
    textAlign: "center",
  },
  headerSpacer: {
    width: 40,
  },
  content: {
    padding: SPACING.lg,
  },
  authorRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.sm,
  },
  avatar: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.softRed,
  },
  avatarText: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.md,
    fontWeight: "800",
  },
  username: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "700",
  },
  metadata: {
    marginTop: 2,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.xs,
  },
  postImage: {
    width: "100%",
    aspectRatio: 1,
    backgroundColor: COLORS.surface,
    borderRadius: RADIUS.md,
  },
  postContent: {
    marginTop: SPACING.lg,
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    lineHeight: 27,
  },
  tags: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: SPACING.sm,
    marginTop: SPACING.md,
  },
  tag: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  divider: {
    height: StyleSheet.hairlineWidth,
    marginTop: SPACING.md,
    backgroundColor: COLORS.border,
  },
  actions: {
    flexDirection: "row",
    gap: SPACING.xl,
    paddingVertical: SPACING.md,
  },
  actionButton: {
    minHeight: 36,
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
  },
  actionText: {
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    fontWeight: "600",
  },
  commentsHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.sm,
    marginTop: SPACING.md,
    marginBottom: SPACING.lg,
  },
  sectionTitle: {
    color: COLORS.text,
    fontSize: FONT_SIZE.lg,
    fontWeight: "800",
  },
  commentCount: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
    fontWeight: "600",
  },
  emptyComments: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.md,
    lineHeight: 22,
  },
  composer: {
    flexDirection: "row",
    alignItems: "flex-end",
    gap: SPACING.sm,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.md,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: COLORS.border,
    backgroundColor: COLORS.background,
  },
  commentInput: {
    flex: 1,
    maxHeight: 100,
    minHeight: 42,
    paddingHorizontal: SPACING.lg,
    paddingVertical: SPACING.sm,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: RADIUS.pill,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
  },
  sendButton: {
    width: 42,
    height: 42,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: RADIUS.pill,
    backgroundColor: COLORS.primary,
  },
  sendButtonDisabled: {
    backgroundColor: COLORS.muted,
  },
  pressed: {
    opacity: 0.72,
  },
});
