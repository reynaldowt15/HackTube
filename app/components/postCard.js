import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

export default function PostCard({ post }) {
    return (
        <Pressable
            onPress={() => { console.log(`postCard Pressed`, post.id) }}
        >
            <View style={styles.card}>

                {/* Post image */}
                <Image
                    source={{ uri: post.image }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                {/* Caption */}
                <View style={styles.captionContainer}>
                    <Text style={styles.caption}>
                        {post.caption}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.captionUsername}>
                            {post.username}{' '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            {`• `}<Ionicons
                                name="chatbubble-outline"
                                size={14}
                                color={COLORS.text}
                            />{post.comments}{' '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color={COLORS.text}
                            />{post.likes} {'- '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            {post.timeAgo}
                        </Text>
                    </View>
                </View>
            </View>
        </Pressable>
    );
}

const styles = StyleSheet.create({
    card: {
        backgroundColor: COLORS.background,
        marginBottom: SPACING.sm,
    },
    postImage: {
        width: '100%',
        aspectRatio: 4 / 2,
        backgroundColor: COLORS.surface,
    },
    captionContainer: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.sm,
        paddingBottom: SPACING.lg,
        gap: SPACING.sm,
    },
    caption: {
        fontSize: FONT_SIZE.sm,
        lineHeight: 21,
        color: COLORS.text,
    },
    captionUsername: {
        fontWeight: '700',
    },
    secondaryText: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.sm,
    },
});
