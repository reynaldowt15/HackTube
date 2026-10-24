import { gql } from '@apollo/client';
import { useMutation, useQuery } from '@apollo/client/react';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import {
    ActivityIndicator,
    Alert,
    Image,
    Pressable,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    View
} from 'react-native';
import { useState } from 'react';
import { COLORS, FONT_SIZE, SPACING } from '../styles/theme';
import CommentCard from '../components/commentCard';
import { SafeAreaView } from 'react-native-safe-area-context';

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

function formatDate(value) {
    const date = new Date(Number(value));
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' });
}

export default function DetailScreen() {
    const navigation = useNavigation();
    const route = useRoute();
    const postId = route.params?.postId;
    const [comment, setComment] = useState('');
    const { loading, data, error, refetch } = useQuery(GET_POST, { variables: { postId }, skip: !postId });
    const [addComment, { loading: isSubmittingComment }] = useMutation(ADD_COMMENT);
    const [addLike, { loading: isLiking }] = useMutation(ADD_LIKE);

    const submitComment = async () => {
        const content = comment.trim();
        if (!content || isSubmittingComment) return;
        try {
            await addComment({ variables: { postId, content } });
            setComment('');
            await refetch();
        } catch (mutationError) {
            Alert.alert('Comment not sent', mutationError.message || 'Please try again.');
        }
    };

    const likePost = async () => {
        if (isLiking) return;
        try {
            await addLike({ variables: { postId } });
            await refetch();
        } catch (mutationError) {
            Alert.alert('Like not added', mutationError.message || 'Please try again.');
        }
    };

    if (loading) return <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>;

    if (error || !data?.postById) return (
        <View style={styles.centered}>
            <Text style={styles.errorTitle}>Post unavailable</Text>
            <Text style={styles.errorBody}>{error?.message || 'This post could not be found.'}</Text>
            <Pressable style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Try again</Text></Pressable>
        </View>
    );

    const post = data.postById;
    const comments = post.comments || [];
    const likes = post.likes || [];

    return (
        <SafeAreaView style={styles.container}>
            <View style={styles.header}>
                <Pressable accessibilityLabel="Go back" hitSlop={10} onPress={() => navigation.goBack()} style={styles.backButton}>
                    <Ionicons name="arrow-back" size={24} color={COLORS.text} />
                </Pressable>
                <Text style={styles.headerTitle}>Post</Text><View style={styles.headerSpacer} />
            </View>

            <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
                <View style={styles.authorRow}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>{post.Author?.username?.charAt(0).toUpperCase() || '?'}</Text>
                    </View>
                    <View>
                        <Text style={styles.username}>{post.Author?.username || 'Unknown user'}</Text>
                        <Text style={styles.metadata}>{formatDate(post.createdAt)}</Text>
                    </View>
                </View>

                <Image
                    source={{ uri: post.imgUrl || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                <Text style={styles.postContent}>{post.content}</Text>

                {post.tags?.length > 0 && <View style={styles.tags}>{post.tags.map((tag, index) => <Text key={index} style={styles.tag}>#{tag}</Text>)}</View>}

                <View style={styles.divider} />

                <View style={styles.actions}>
                    <Pressable accessibilityLabel={`Like post. ${likes.length} likes`} disabled={isLiking} onPress={likePost} style={({ pressed }) => [styles.actionButton, pressed && styles.pressed]}>
                        <Ionicons name="heart-outline" size={24} color={COLORS.text} />
                        <Text style={styles.actionText}>{isLiking ? 'Liking...' : likes.length}</Text>
                    </Pressable>
                    <View style={styles.actionButton}><Ionicons name="chatbubble-outline" size={22} color={COLORS.text} /><Text style={styles.actionText}>{comments.length}</Text></View>
                </View>

                <View style={styles.commentsHeader}>
                    <Text style={styles.sectionTitle}>Comments</Text>
                    <Text style={styles.commentCount}>{comments.length}</Text>
                </View>

                {comments.length === 0
                    ?
                    <Text style={styles.emptyComments}>No comments yet. Start the conversation.</Text>
                    :
                    comments.map((comment, index) => (
                        <CommentCard key={index} comment={comment} />
                    ))
                }
            </ScrollView>

            <View style={styles.composer}>
                <TextInput
                    value={comment}
                    onChangeText={setComment}
                    placeholder="Add a comment..."
                    placeholderTextColor={COLORS.muted}
                    style={styles.commentInput}
                    multiline maxLength={500}
                    returnKeyType="send"
                    onSubmitEditing={submitComment}
                />
                <Pressable accessibilityLabel="Send comment" disabled={!comment.trim() || isSubmittingComment} onPress={submitComment} style={({ pressed }) => [styles.sendButton, (!comment.trim() || isSubmittingComment) && styles.sendButtonDisabled, pressed && styles.pressed]}>
                    <Ionicons name="arrow-up" size={20} color={COLORS.white} />
                </Pressable>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background
    },
    header: {
        height: 56,
        flexDirection: 'row',
        alignItems: 'center',
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: COLORS.border,
        paddingHorizontal: SPACING.lg
    },
    backButton: {
        width: 40,
        height: 40,
        justifyContent: 'center',
        alignItems: 'flex-start'
    },
    headerTitle: {
        flex: 1, fontSize: FONT_SIZE.lg,
        fontWeight: '700', color: COLORS.text,
        textAlign: 'center'
    },
    headerSpacer: {
        width: 40
    },
    postImage: {
        width: '100%',
        aspectRatio: 4 / 2,
        backgroundColor: COLORS.surface,
    },
    content: {
        padding: SPACING.lg,
        paddingBottom: SPACING.xxl
    },
    authorRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.md,
        marginBottom: SPACING.sm
    },
    avatar: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        alignItems: 'center',
        justifyContent: 'center'
    },
    avatarText: {
        color: COLORS.white,
        fontWeight: '800',
        fontSize: FONT_SIZE.md
    },
    username: {
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
        fontWeight: '700'
    },
    metadata: {
        marginTop: 2,
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.xs
    },
    postContent: {
        marginTop: SPACING.lg,
        color: COLORS.text,
        fontSize: FONT_SIZE.lg,
        lineHeight: 27
    },
    tags: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        gap: SPACING.sm,
        marginTop: SPACING.md
    },
    tag: {
        color:
            COLORS.primary,
        fontSize: FONT_SIZE.sm,
        fontWeight: '600'
    },
    divider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.border,
        marginTop: SPACING.sm
    },
    actions: {
        flexDirection: 'row',
        gap: SPACING.xl,
        paddingVertical: SPACING.md
    },
    actionButton: {
        minHeight: 36,
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm
    },
    actionText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
        fontWeight: '600'
    },
    commentsHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: SPACING.sm,
        marginTop: SPACING.md,
        marginBottom: SPACING.lg
    },
    sectionTitle: {
        color: COLORS.text,
        fontSize: FONT_SIZE.lg,
        fontWeight: '800'
    },
    commentCount: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.sm,
        fontWeight: '600'
    },
    emptyComments: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        lineHeight: 22
    },
    comment: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl
    }, commentAvatar: {
        width: 32,
        height: 32,
        borderRadius: 16,
        backgroundColor: COLORS.surface,
        alignItems: 'center',
        justifyContent: 'center'
    },
    commentAvatarText: {
        color: COLORS.secondaryText,
        fontWeight: '800',
        fontSize: FONT_SIZE.sm
    },
    commentBody: {
        flex: 1
    },
    commentMeta: {
        flexDirection: 'row',
        alignItems: 'baseline',
        gap: SPACING.sm
    },
    commentUsername: {
        color: COLORS.text,
        fontSize: FONT_SIZE.sm,
        fontWeight: '700'
    },
    commentDate: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.xs
    },
    commentText: {
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
        lineHeight: 22,
        marginTop: 3
    },
    composer: {
        flexDirection: 'row',
        alignItems: 'flex-end',
        gap: SPACING.sm,
        borderTopWidth: StyleSheet.hairlineWidth,
        borderTopColor: COLORS.border,
        backgroundColor: COLORS.background,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md
    },
    commentInput: {
        flex: 1,
        maxHeight: 100,
        minHeight: 42,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 21,
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm
    },
    sendButton: {
        width: 42,
        height: 42,
        borderRadius: 21,
        backgroundColor: COLORS.primary,
        justifyContent: 'center',
        alignItems: 'center'
    },
    sendButtonDisabled: {
        backgroundColor: COLORS.muted
    },
    pressed: {
        opacity: 0.72
    },
    errorTitle: {
        color: COLORS.text,
        fontSize: FONT_SIZE.xl,
        fontWeight: '800'
    },
    errorBody: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        textAlign: 'center',
        marginTop: SPACING.sm
    },
    retryButton: {
        marginTop: SPACING.lg,
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.md,
        borderRadius: 20
    },
    retryText: {
        color: COLORS.white,
        fontWeight: '700'
    },
});