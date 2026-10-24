import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { useNavigation } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import AppTextInput from "../components/appTextInput";
import PrimaryButton from "../components/primaryButton";
import { COLORS, FONT_SIZE, RADIUS, SPACING } from "../styles/theme";

const POST_MUTATION = gql`
  mutation AddPost($content: String!, $tags: [String!], $imgUrl: String) {
    addPost(content: $content, tags: $tags, imgUrl: $imgUrl) {
      _id
      content
      tags
      imgUrl
      authorId
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
      updatedAt
    }
  }
`;

export default function CreateScreen() {
  const navigation = useNavigation();
  const [content, setContent] = useState("");
  const [imgUrl, setImgUrl] = useState("");
  const [tags, setTags] = useState("");
  const [addPost, { loading }] = useMutation(POST_MUTATION);

  const pressAdd = async () => {
    let splitTags;
    if (tags) {
      splitTags = tags.trim().split(",");
    }

    try {
      await addPost({
        variables: {
          imgUrl: imgUrl || null,
          content,
          tags: splitTags || [],
        },
      });
      setImgUrl("")
      setContent("")
      setTags("")
      navigation.navigate("Home");
    } catch (error) {
      Alert.alert("Add Post Failed", error.message);
    }
  };

  return (
    <KeyboardAvoidingView
      style={styles.screen}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
    >
      <SafeAreaView style={styles.screen}>
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.headerIcon}>
              <Ionicons name="create-outline" size={24} color={COLORS.primary} />
            </View>
            <View style={styles.headerText}>
              <Text style={styles.title}>Create a post</Text>
              <Text style={styles.subtitle}>
                Share something with your community.
              </Text>
            </View>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Image URL</Text>
            <AppTextInput
              icon="image-outline"
              placeholder="https://example.com/image.jpg"
              value={imgUrl}
              onChangeText={setImgUrl}
              autoCapitalize="none"
              keyboardType="url"
            />
            <Text style={styles.helperText}>
              Add an image URL to include a photo in your post.
            </Text>

            <Text style={styles.label}>Content</Text>
            <AppTextInput
              containerStyle={styles.contentContainer}
              inputStyle={styles.contentInput}
              placeholder="What's happening?"
              value={content}
              onChangeText={setContent}
              autoCapitalize="none"
              multiline
              textAlignVertical="top"
            />

            <Text style={styles.label}>Tags</Text>
            <AppTextInput
              icon="pricetag-outline"
              placeholder="Beach, Holiday, Weekend"
              value={tags}
              onChangeText={setTags}
              autoCapitalize="none"
            />
            <Text style={styles.helperText}>
              Separate each tag with a comma.
            </Text>

            <PrimaryButton
              title="Publish post"
              onPress={pressAdd}
              loading={loading}
            />
          </View>
        </ScrollView>
      </SafeAreaView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  scrollContent: {
    flexGrow: 1,
    padding: SPACING.xl,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: SPACING.md,
    marginBottom: SPACING.xl,
  },
  headerIcon: {
    width: 48,
    height: 48,
    borderRadius: RADIUS.lg,
    backgroundColor: COLORS.softRed,
    alignItems: "center",
    justifyContent: "center",
  },
  headerText: {
    flex: 1,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: SPACING.xs,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
  },
  form: {
    width: "100%",
    gap: SPACING.sm,
  },
  label: {
    marginTop: SPACING.md,
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  helperText: {
    marginTop: -SPACING.xs,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.xs,
    lineHeight: 18,
  },
  contentContainer: {
    minHeight: 160,
    alignItems: "flex-start",
    paddingVertical: SPACING.md,
  },
  contentInput: {
    width: "100%",
    minHeight: 130,
    paddingVertical: 0,
    color: COLORS.text,
    fontSize: FONT_SIZE.md,
    lineHeight: 23,
  },
});
