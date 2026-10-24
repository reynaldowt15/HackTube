import { useCallback, useContext, useRef, useState } from "react";
import { AuthContext } from "../context/authContext";
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    ScrollView,
    Pressable,
    ActivityIndicator,
    Alert,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useQuery, useMutation } from "@apollo/client/react";
import { AVATAR_COLORS, COLORS, FONT_SIZE, RADIUS, SPACING } from "../styles/theme";
import { commonStyles } from "../styles/commonStyles";
import { SafeAreaView } from "react-native-safe-area-context";
import PrimaryButton from "../components/primaryButton";
import { deleteItemAsync } from "expo-secure-store";
import { useFocusEffect } from "@react-navigation/native";

// Get the current user's profile
const GET_PROFILE = gql`
  query UserById {
    userById {
      _id
      name
      username
      email
      followers {
        _id
        name
        username
        email
      }
      following {
        _id
        name
        username
        email
      }
    }
  }
`;

// Search users by name or username
const SEARCH_USERS = gql`
  query UserByUsernameOrName($search: String) {
    userByUsernameOrName(search: $search) {
      _id
      name
      username
    }
  }
`;

// Follow another account
const FOLLOW_ACCOUNT = gql`
  mutation FollowAccount($idFollowing: String) {
    followAccount(idFollowing: $idFollowing)
  }
`;

function Avatar({ username, size = 48 }) {
    const colorIndex = (username?.length ?? 0) % AVATAR_COLORS.length;

    return (
        <View
            style={[
                styles.avatar,
                {
                    width: size,
                    height: size,
                    borderRadius: size / 2,
                    backgroundColor: AVATAR_COLORS[colorIndex],
                },
            ]}
        >
            <Text
                style={[
                    styles.avatarText,
                    { fontSize: size * 0.4 },
                ]}
            >
                {(username || "U").charAt(0).toUpperCase()}
            </Text>
        </View>
    );
}

export default function ProfileScreen() {
    const { setIsSignIn } = useContext(AuthContext);

    const [search, setSearch] = useState("");

    const {
        data: profileData,
        loading: profileLoading,
        error: profileError,
        refetch: refetchProfile,
    } = useQuery(GET_PROFILE);

    const {
        data: searchData,
        loading: searchLoading,
        error: searchError,
    } = useQuery(SEARCH_USERS, {
        variables: {
            search: search.trim(),
        },
        skip: search.trim().length === 0,
    });

    const [followAccount, { loading: followLoading }] = useMutation(
        FOLLOW_ACCOUNT,
        {
            refetchQueries: [{ query: GET_PROFILE }],
            awaitRefetchQueries: true,
        }
    );

    const profile = profileData?.userById;

    const followers = profile?.followers ?? [];
    const following = profile?.following ?? [];

    const followingIds = following.map((user) => user._id);

    // Exclude the current account from search results.
    const searchResults =
        searchData?.userByUsernameOrName?.filter(
            (user) => user._id !== profile?._id
        ) ?? [];

    const handleFollow = async (user) => {
        try {
            await followAccount({
                variables: {
                    idFollowing: user._id,
                },
            });

            Alert.alert(
                "Success",
                `You are now following @${user.username}`
            );
        } catch (error) {
            Alert.alert("Follow Failed", error.message);
        }
    };

    const handleLogout = async () => {
        await deleteItemAsync('token')
        setIsSignIn(false)
    }

    const firstFocus = useRef(true);

    useFocusEffect(
        useCallback(() => {
            // useQuery already fetches data when the screen mounts.
            if (firstFocus.current) {
                firstFocus.current = false;
                return;
            }

            // Fetch fresh posts whenever the user returns to Home.
            refetchProfile();
        }, [refetchProfile])
    );

    if (profileLoading) {
        return (
            <View style={commonStyles.centered}>
                <ActivityIndicator size="large" color={COLORS.primary} />
            </View>
        );
    }

    if (profileError) {
        return (
            <View style={commonStyles.centered}>
                <Ionicons
                    name="alert-circle-outline"
                    size={45}
                    color={COLORS.primary}
                />

                <Text style={commonStyles.errorTitle}>
                    Unable to load profile
                </Text>

                <Text style={commonStyles.errorMessage}>
                    {profileError.message}
                </Text>

                <Pressable
                    style={commonStyles.retryButton}
                    onPress={() => refetchProfile()}
                >
                    <Text style={commonStyles.retryText}>Try again</Text>
                </Pressable>
            </View>
        );
    }

    return (
        <SafeAreaView style={styles.safeArea}>
            <ScrollView
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                keyboardShouldPersistTaps="handled"
            >
                {/* Profile information */}
                <View style={styles.profileSection}>
                    <View style={styles.profileTop}>
                        <Avatar
                            username={profile?.username}
                            size={90}
                        />

                        <View style={styles.profileInfo}>
                            <Text style={styles.profileName}>
                                {profile?.name}
                            </Text>

                            <Text style={styles.username}>
                                @{profile?.username}
                            </Text>

                            <Text style={styles.email}>
                                {profile?.email}
                            </Text>
                        </View>
                    </View>

                    <PrimaryButton title="Logout" onPress={handleLogout} />

                    {/* Followers and following */}
                    <View style={styles.statsContainer}>
                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>
                                {followers.length}
                            </Text>

                            <Text style={styles.statLabel}>
                                Followers
                            </Text>
                        </View>

                        <View style={styles.statDivider} />

                        <View style={styles.stat}>
                            <Text style={styles.statNumber}>
                                {following.length}
                            </Text>

                            <Text style={styles.statLabel}>
                                Following
                            </Text>
                        </View>
                    </View>

                    <View style={styles.profileDivider} />
                </View>

                {/* Search section */}
                <View style={styles.searchSection}>
                    <Text style={styles.sectionTitle}>
                        Discover people
                    </Text>

                    <Text style={styles.sectionSubtitle}>
                        Find creators and connect with them.
                    </Text>

                    <View style={styles.searchInputWrapper}>
                        <Ionicons
                            name="search-outline"
                            size={21}
                            color={COLORS.secondaryText}
                        />

                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search name or username..."
                            placeholderTextColor={COLORS.muted}
                            value={search}
                            onChangeText={setSearch}
                            autoCapitalize="none"
                            autoCorrect={false}
                            returnKeyType="search"
                        />

                        {search.length > 0 && (
                            <Pressable
                                onPress={() => setSearch("")}
                                hitSlop={8}
                            >
                                <Ionicons
                                    name="close-circle"
                                    size={20}
                                    color={COLORS.muted}
                                />
                            </Pressable>
                        )}
                    </View>

                    {/* Search results */}
                    {search.trim().length > 0 && (
                        <View style={styles.resultsContainer}>
                            {searchLoading ? (
                                <ActivityIndicator
                                    color={COLORS.primary}
                                    style={styles.searchLoader}
                                />
                            ) : searchError ? (
                                <Text style={styles.emptyText}>
                                    {searchError.message}
                                </Text>
                            ) : searchResults.length === 0 ? (
                                <View style={styles.emptyResults}>
                                    <Ionicons
                                        name="person-outline"
                                        size={30}
                                        color={COLORS.muted}
                                    />

                                    <Text style={styles.emptyText}>
                                        No accounts found.
                                    </Text>
                                </View>
                            ) : (
                                searchResults.map((user) => {
                                    const isFollowing = followingIds.includes(
                                        user._id
                                    );

                                    return (
                                        <View
                                            key={user._id}
                                            style={styles.userCard}
                                        >
                                            <Avatar
                                                username={user.username}
                                                size={48}
                                            />

                                            <View style={styles.userInfo}>
                                                <Text style={styles.userName}>
                                                    {user.name}
                                                </Text>

                                                <Text style={styles.userUsername}>
                                                    @{user.username}
                                                </Text>
                                            </View>

                                            <Pressable
                                                onPress={() => handleFollow(user)}
                                                disabled={
                                                    isFollowing || followLoading
                                                }
                                                style={[
                                                    styles.followButton,
                                                    isFollowing &&
                                                    styles.followingButton,
                                                    followLoading &&
                                                    styles.disabledButton,
                                                ]}
                                            >
                                                <Text
                                                    style={[
                                                        styles.followButtonText,
                                                        isFollowing &&
                                                        styles.followingButtonText,
                                                    ]}
                                                >
                                                    {isFollowing
                                                        ? "Following"
                                                        : "Follow"}
                                                </Text>
                                            </Pressable>
                                        </View>
                                    );
                                })
                            )}
                        </View>
                    )}
                </View>


                {/* Followers list */}
                <View style={styles.followingSection}>
                    <View style={styles.followingHeader}>
                        <Text style={styles.sectionTitle}>
                            Followers
                        </Text>

                        <Text style={styles.followingCount}>
                            {followers.length} accounts
                        </Text>
                    </View>

                    {followers.length === 0 ? (
                        <View style={styles.emptyFollowing}>
                            <Ionicons
                                name="people-outline"
                                size={36}
                                color={COLORS.muted}
                            />

                            <Text style={styles.emptyFollowingTitle}>
                                You don't have any followers yet.
                            </Text>

                            <Text style={styles.emptyText}>
                                When someone follows you, they will appear here.
                            </Text>
                        </View>
                    ) : (
                        followers.map((user) => (
                            <View
                                key={user._id}
                                style={styles.userCard}
                            >
                                <Avatar
                                    username={user.username}
                                    size={48}
                                />

                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>
                                        {user.name}
                                    </Text>

                                    <Text style={styles.userUsername}>
                                        @{user.username}
                                    </Text>
                                </View>

                                <Ionicons
                                    name="person-circle-outline"
                                    size={24}
                                    color={COLORS.secondaryText}
                                />
                            </View>
                        ))
                    )}
                </View>


                {/* Following list */}
                <View style={styles.followingSection}>
                    <View style={styles.followingHeader}>
                        <Text style={styles.sectionTitle}>
                            Following
                        </Text>

                        <Text style={styles.followingCount}>
                            {following.length} accounts
                        </Text>
                    </View>

                    {following.length === 0 ? (
                        <View style={styles.emptyFollowing}>
                            <Ionicons
                                name="people-outline"
                                size={36}
                                color={COLORS.muted}
                            />

                            <Text style={styles.emptyFollowingTitle}>
                                You are not following anyone yet.
                            </Text>

                            <Text style={styles.emptyText}>
                                Search for accounts above to get started.
                            </Text>
                        </View>
                    ) : (
                        following.map((user) => (
                            <View
                                key={user._id}
                                style={styles.userCard}
                            >
                                <Avatar
                                    username={user.username}
                                    size={48}
                                />

                                <View style={styles.userInfo}>
                                    <Text style={styles.userName}>
                                        {user.name}
                                    </Text>

                                    <Text style={styles.userUsername}>
                                        @{user.username}
                                    </Text>
                                </View>

                                <View style={styles.followingBadge}>
                                    <Ionicons
                                        name="checkmark"
                                        size={FONT_SIZE.sm}
                                        color={COLORS.secondaryText}
                                    />

                                    <Text style={styles.followingBadgeText}>
                                        Following
                                    </Text>
                                </View>
                            </View>
                        ))
                    )}
                </View>

            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    safeArea: {
        flex: 1,
        paddingTop: SPACING.sm,
        backgroundColor: COLORS.background,
    },
    scrollContent: {
        paddingBottom: SPACING.xxl,
    },


    profileSection: {
        paddingHorizontal: SPACING.xl,
    },

    profileTop: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.lg,
    },

    avatar: {
        justifyContent: "center",
        alignItems: "center",
    },

    avatarText: {
        color: COLORS.secondaryText,
        fontWeight: "800",
    },

    profileInfo: {
        flex: 1,
    },

    profileName: {
        color: COLORS.text,
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        letterSpacing: -0.5,
    },

    username: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        marginTop: SPACING.xs,
    },

    email: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
    },

    statsContainer: {
        flexDirection: "row",
        alignItems: "center",
        marginTop: SPACING.xl,
        marginBottom: SPACING.xl,
        gap: SPACING.xl,
    },

    stat: {
        alignItems: "center",
    },

    statNumber: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.text,
    },

    statLabel: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.xs,
        marginTop: SPACING.xs,
    },

    statDivider: {
        width: 1,
        height: SPACING.xxl - 2,
        backgroundColor: COLORS.border,
    },

    profileDivider: {
        height: StyleSheet.hairlineWidth,
        backgroundColor: COLORS.border,
    },

    searchSection: {
        paddingHorizontal: SPACING.lg,
        paddingTop: SPACING.xl,
    },

    sectionTitle: {
        fontSize: FONT_SIZE.lg,
        fontWeight: "800",
        color: COLORS.text,
    },

    sectionSubtitle: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        marginTop: SPACING.sm,
    },

    searchInputWrapper: {
        minHeight: 50,
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.sm,
        paddingHorizontal: SPACING.md,
        marginTop: SPACING.md,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: RADIUS.pill,
        backgroundColor: COLORS.surface,
    },

    searchInput: {
        flex: 1,
        color: COLORS.text,
        fontSize: FONT_SIZE.sm,
        paddingVertical: SPACING.md,
    },

    resultsContainer: {
        marginTop: SPACING.md,
    },

    searchLoader: {
        padding: SPACING.lg,
    },

    userCard: {
        flexDirection: "row",
        alignItems: "center",
        paddingVertical: SPACING.md,
        gap: SPACING.md,
    },

    userInfo: {
        flex: 1,
    },

    userName: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.text,
    },

    userUsername: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        marginTop: SPACING.xs,
    },

    followButton: {
        backgroundColor: COLORS.primary,
        paddingHorizontal: SPACING.lg,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
    },

    followButtonText: {
        color: COLORS.white,
        fontSize: FONT_SIZE.md,
        fontWeight: "700",
    },

    followingButton: {
        backgroundColor: COLORS.surfaceMuted,
    },

    followingButtonText: {
        color: COLORS.secondaryText,
    },

    disabledButton: {
        opacity: 0.65,
    },

    emptyResults: {
        alignItems: "center",
        padding: SPACING.xl,
        gap: SPACING.sm,
    },

    emptyText: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.md,
        textAlign: "center",
    },

    followingSection: {
        paddingHorizontal: SPACING.xl,
        paddingTop: SPACING.xl,
    },

    followingHeader: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: SPACING.md,
    },

    followingCount: {
        fontSize: FONT_SIZE.md,
        color: COLORS.secondaryText,
    },

    followingBadge: {
        flexDirection: "row",
        alignItems: "center",
        gap: SPACING.xs,
        backgroundColor: COLORS.surfaceMuted,
        paddingHorizontal: SPACING.md,
        paddingVertical: SPACING.sm,
        borderRadius: RADIUS.pill,
    },

    followingBadgeText: {
        color: COLORS.secondaryText,
        fontSize: FONT_SIZE.xs,
        fontWeight: "600",
    },

    emptyFollowing: {
        alignItems: "center",
        paddingVertical: SPACING.xl,
        gap: SPACING.md,
    },

    emptyFollowingTitle: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.text,
        textAlign: "center",
    },




});
