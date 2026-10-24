import { StyleSheet, Text, View } from "react-native";
import { SPACING, COLORS, FONT_SIZE } from "../styles/theme";

function formatShortDate(value) {
    const date = new Date(Number(value));
    return Number.isNaN(date.getTime()) ? '' : date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short' });
}

export default function CommentCard({ comment }) {
    return (
        <View key={`${comment.username}-${comment.createdAt}`} style={styles.comment}>
            <View style={styles.commentAvatar}><Text style={styles.commentAvatarText}>{comment.username?.charAt(0).toUpperCase() || '?'}</Text></View>
            <View style={styles.commentBody}>
                <View style={styles.commentMeta}><Text style={styles.commentUsername}>{comment.username}</Text><Text style={styles.commentDate}>{formatShortDate(comment.createdAt)}</Text></View>
                <Text style={styles.commentText}>{comment.content}</Text>
            </View>
        </View>
    )
}

const styles = StyleSheet.create({
    comment: {
        flexDirection: 'row',
        gap: SPACING.md,
        marginBottom: SPACING.xl
    },
    commentAvatar: {
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
})