import {
    View,
    Text,
    Image,
    Pressable,
    StyleSheet,
} from 'react-native';
import { COLORS, SPACING, FONT_SIZE } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';

function formatDate(value) {
    if (value == null || value === '') {
        return '';
    }

    const date = /^\d+$/.test(String(value).trim())
        ? new Date(Number(value))
        : new Date(value);

    if (Number.isNaN(date.getTime())) {
        return '';
    }

    return date.toLocaleDateString('id-ID');
}

export default function PostCard({ post }) {
    const navigation = useNavigation()
    return (
        <Pressable
            onPress={() => {
                navigation.navigate('Detail', { postId: post._id })
            }}
        >
            <View style={styles.card}>

                {/* Post image */}
                <Image
                    source={{ uri: post.imgUrl || 'https://developers.elementor.com/docs/assets/img/elementor-placeholder-image.png' }}
                    style={styles.postImage}
                    resizeMode="cover"
                />

                {/* Caption */}
                <View style={styles.captionContainer}>
                    <Text style={styles.caption}>
                        {post.content}
                    </Text>

                    <View style={{ flexDirection: 'row', flexWrap: 'wrap' }}>
                        <Text style={styles.captionUsername}>
                            {post.Author.username}{' '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            {`• `}<Ionicons
                                name="chatbubble-outline"
                                size={14}
                                color={COLORS.text}
                            />{post.comments.length}{' '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            <Ionicons
                                name="heart-outline"
                                size={14}
                                color={COLORS.text}
                            />{post.likes.length} {'- '}
                        </Text>

                        <Text style={styles.secondaryText}>
                            {formatDate(post.createdAt)}
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
