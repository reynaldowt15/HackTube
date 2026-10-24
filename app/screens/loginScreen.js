
import { Link, useNavigation } from "@react-navigation/native";
import { useContext, useState } from "react";
import {
    Alert,
    StatusBar,
    Text,
    TextInput,
    View,
    StyleSheet,
    Pressable,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
} from "react-native";

import { Ionicons } from "@expo/vector-icons";
import PrimaryButton from "../components/primaryButton";
import { AuthContext } from "../context/authContext";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { setItem } from "expo-secure-store";

import { COLORS, SPACING, FONT_SIZE } from "../styles/theme";

const LOGIN_MUTATION = gql`
mutation Mutation($email: String, $password: String) {
  login(email: $email, password: $password) {
    token
  }
}
`;

export default function LoginScreen() {
    const { setIsSignIn } = useContext(AuthContext);

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [login, { loading }] = useMutation(LOGIN_MUTATION);

    const pressLogin = async () => {
        try {
            const response = await login({
                variables: { email, password },
            });

            const token = response.data.login.token;

            setItem("token", token);

            setIsSignIn(true);
        } catch (error) {
            Alert.alert("Login Failed", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar
                barStyle="dark-content"
                backgroundColor={COLORS.background}
            />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                <View style={styles.container}>

                    {/* Welcome Message */}
                    <View style={styles.welcomeSection}>
                        <Text style={styles.title}>
                            Welcome back
                        </Text>

                        <Text style={styles.subtitle}>
                            Sign in to continue to your account.
                        </Text>
                    </View>

                    {/* Login Form */}
                    <View style={styles.form}>

                        {/* Email */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Email address
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="mail-outline"
                                    size={20}
                                    color={COLORS.secondaryText}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="example@mail.com"
                                    placeholderTextColor={COLORS.muted}
                                    value={email}
                                    onChangeText={(text) => {
                                        setEmail(text);
                                    }}
                                    keyboardType="email-address"
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Password */}
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>
                                Password
                            </Text>

                            <View style={styles.inputWrapper}>
                                <Ionicons
                                    name="lock-closed-outline"
                                    size={20}
                                    color={COLORS.secondaryText}
                                />

                                <TextInput
                                    style={styles.input}
                                    placeholder="Enter your password"
                                    placeholderTextColor={COLORS.muted}
                                    value={password}
                                    onChangeText={(text) => {
                                        setPassword(text);
                                    }}
                                    secureTextEntry={true}
                                    autoCapitalize="none"
                                    autoCorrect={false}
                                />
                            </View>
                        </View>

                        {/* Login Button */}
                        <PrimaryButton
                            title="Login"
                            onPress={pressLogin}
                            loading={loading}
                        />

                    </View>

                    {/* Register Link */}
                    <View style={styles.registerContainer}>
                        <Text style={styles.registerText}>
                            Don't have an account?
                        </Text>

                        <Link
                            screen="Register"
                            style={styles.registerLink}
                        >
                            Register
                        </Link>
                    </View>

                </View>
            </ScrollView>
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
        justifyContent: "center",
    },

    container: {
        width: "100%",
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
        alignSelf: "center",
        maxWidth: 500,
    },

    brandSection: {
        alignItems: "center",
        marginBottom: SPACING.xxl,
    },

    logoContainer: {
        width: 64,
        height: 46,
        borderRadius: 14,
        backgroundColor: COLORS.primary,
        justifyContent: "center",
        alignItems: "center",
        marginBottom: SPACING.md,
    },

    brandName: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.8,
    },

    brandSubtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.secondaryText,
        marginTop: SPACING.xs,
        textAlign: "center",
    },

    welcomeSection: {
        marginBottom: SPACING.xl,
    },

    title: {
        fontSize: FONT_SIZE.xxl,
        fontWeight: "800",
        color: COLORS.text,
        letterSpacing: -0.5,
    },

    subtitle: {
        fontSize: FONT_SIZE.md,
        color: COLORS.secondaryText,
        marginTop: SPACING.sm,
        lineHeight: 23,
    },

    form: {
        gap: SPACING.lg,
    },

    inputGroup: {
        gap: SPACING.sm,
    },

    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "700",
        color: COLORS.text,
    },

    inputWrapper: {
        flexDirection: "row",
        alignItems: "center",
        minHeight: 54,
        paddingHorizontal: SPACING.lg,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 14,
        backgroundColor: COLORS.surface,
        gap: SPACING.md,
    },

    input: {
        flex: 1,
        color: COLORS.text,
        fontSize: FONT_SIZE.md,
        paddingVertical: SPACING.md,
    },

    registerContainer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: SPACING.xs,
        marginTop: SPACING.xxl,
    },

    registerText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.secondaryText,
    },

    registerLink: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.primary,
        fontWeight: "800",
    },
});
