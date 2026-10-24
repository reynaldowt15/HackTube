import { View, FlatList, StyleSheet, ActivityIndicator, Pressable, Text, StatusBar } from 'react-native';
import { gql } from '@apollo/client';
import { useQuery } from '@apollo/client/react';
import { COLORS, SPACING, FONT_SIZE } from '../styles/theme';
import { useCallback, useRef } from 'react';
import { useFocusEffect } from '@react-navigation/native';

import AppHeader from '../components/header';
import PostCard from '../components/postCard';

const GET_POSTS = gql`
query Posts {
  posts {
    _id
    content
    tags
    imgUrl
    comments {
      content
      username
    }
    likes {
      username
    }
    createdAt
    Author {
      username
    }
  }
}
`

export default function HomeScreen() {
    const { loading, data, error, refetch } = useQuery(GET_POSTS)

    const firstFocus = useRef(true);

    useFocusEffect(
        useCallback(() => {
            // useQuery already fetches data when the screen mounts.
            if (firstFocus.current) {
                firstFocus.current = false;
                return;
            }

            // Fetch fresh posts whenever the user returns to Home.
            refetch();
        }, [refetch])
    );


    if (loading) {
        return (
            <View style={styles.centered}><ActivityIndicator size="large" color={COLORS.primary} /></View>
        )
    }

    if (error) {
        return (
            <View style={styles.centered}>
                <Text style={styles.errorTitle}>Post unavailable</Text>
                <Text style={styles.errorBody}>{error?.message || "There's something wrong."}</Text>
                <Pressable style={styles.retryButton} onPress={() => refetch()}><Text style={styles.retryText}>Try again</Text></Pressable>
            </View>
        )
    };

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <AppHeader />

            <FlatList
                data={data.posts}
                keyExtractor={(item) => item._id}
                renderItem={({ item }) => <PostCard post={item} />}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.feed}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: COLORS.background,
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: SPACING.xl,
        backgroundColor: COLORS.background
    },
    feed: {
        paddingBottom: SPACING.lg,
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
