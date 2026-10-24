import { useCallback, useRef } from "react";
import { useFocusEffect } from "@react-navigation/native";
import { gql } from "@apollo/client";
import { useQuery } from "@apollo/client/react";
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppHeader from "../components/header";
import PostCard from "../components/postCard";
import { commonStyles } from "../styles/commonStyles";
import { COLORS, FONT_SIZE, SPACING } from "../styles/theme";

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
`;

export default function HomeScreen() {
  const { loading, data, error, refetch } = useQuery(GET_POSTS);
  const firstFocus = useRef(true);

  useFocusEffect(
    useCallback(() => {
      // useQuery fetches data on mount; only refetch on later visits.
      if (firstFocus.current) {
        firstFocus.current = false;
        return;
      }

      refetch();
    }, [refetch])
  );

  if (loading) {
    return (
      <View style={commonStyles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  if (error) {
    return (
      <View style={commonStyles.centered}>
        <Text style={commonStyles.errorTitle}>Posts unavailable</Text>
        <Text style={commonStyles.errorMessage}>
          {error.message || "There's something wrong."}
        </Text>
        <Pressable style={commonStyles.retryButton} onPress={() => refetch()}>
          <Text style={commonStyles.retryText}>Try again</Text>
        </Pressable>
      </View>
    );
  }

  const posts = data?.posts ?? [];

  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="dark-content"
        backgroundColor={COLORS.background}
      />
      <AppHeader />
      <FlatList
        data={posts}
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
  feed: {
    paddingBottom: SPACING.lg,
  },
});
