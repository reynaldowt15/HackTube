import {
    View,
    Text,
    StyleSheet,
    TextInput,
    Alert,
    StatusBar,
    ScrollView,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useState } from "react";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import PrimaryButton from "../components/primaryButton";
import { COLORS, SPACING, FONT_SIZE } from "../styles/theme";
import { useNavigation } from "@react-navigation/native";
import { SafeAreaView } from "react-native-safe-area-context";

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
    const navigation = useNavigation()

    const [content, setContent] = useState("");
    const [imgUrl, setImgUrl] = useState("");
    const [tags, setTags] = useState("");

    const [addPost, { loading }] = useMutation(POST_MUTATION);

    const pressAdd = async () => {
        let splitTags
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
            navigation.navigate('Home')
        } catch (error) {
            Alert.alert("Add Post Failed", error.message);
        }
    };

    return (
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

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="image-outline"
                            size={20}
                            color={COLORS.secondaryText}
                        />

                        <TextInput
                            placeholder="https://example.com/image.jpg"
                            placeholderTextColor={COLORS.muted}
                            style={styles.inputText}
                            value={imgUrl}
                            onChangeText={setImgUrl}
                            autoCapitalize="none"
                            keyboardType="url"
                        />
                    </View>

                    <Text style={styles.helperText}>
                        Add an image URL to include a photo in your post.
                    </Text>

                    <Text style={styles.label}>Content</Text>

                    <View style={[styles.inputContainer, styles.contentContainer]}>
                        <TextInput
                            placeholder="What's happening?"
                            placeholderTextColor={COLORS.muted}
                            style={styles.contentInput}
                            value={content}
                            onChangeText={setContent}
                            multiline
                            textAlignVertical="top"
                        />
                    </View>

                    <Text style={styles.label}>Tags</Text>

                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="pricetag-outline"
                            size={20}
                            color={COLORS.secondaryText}
                        />

                        <TextInput
                            placeholder="Beach, Holiday, Weekend"
                            placeholderTextColor={COLORS.muted}
                            style={styles.inputText}
                            value={tags}
                            onChangeText={setTags}
                            autoCapitalize="none"
                        />
                    </View>

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
        borderRadius: 14,
        backgroundColor: "#FFF0F2",
        alignItems: "center",
        justifyContent: "center",
    },

    headerText: {
        flex: 1,
    },

    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.text,
    },

    subtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.secondaryText,
        marginTop: SPACING.xs,
    },

    form: {
        width: "100%",
        gap: SPACING.sm,
    },

    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.text,
        marginTop: SPACING.md,
    },

    inputContainer: {
        minHeight: 52,
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        backgroundColor: COLORS.surface,
    },

    inputText: {
        flex: 1,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        paddingVertical: SPACING.md,
    },

    contentContainer: {
        minHeight: 160,
        alignItems: "flex-start",
        paddingVertical: SPACING.md,
    },

    contentInput: {
        width: "100%",
        minHeight: 130,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        lineHeight: 23,
    },

    helperText: {
        fontSize: FONT_SIZE.xs,
        color: COLORS.secondaryText,
        marginTop: -SPACING.xs,
    },
});
