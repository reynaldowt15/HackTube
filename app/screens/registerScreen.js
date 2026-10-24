
import { Link, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import {
    Alert,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    TextInput,
    View,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";

import PrimaryButton from "../components/primaryButton";
import { COLORS, SPACING, FONT_SIZE } from "../styles/theme";

const REGISTER_MUTATION = gql`
  mutation Register(
    $name: String
    $username: String
    $email: String
    $password: String
  ) {
    register(
      name: $name
      username: $username
      email: $email
      password: $password
    ) {
      _id
      username
      email
    }
  }
`;

export default function RegisterScreen() {
    const navigation = useNavigation();

    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [email, setEmail] = useState("");
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [register, { loading }] = useMutation(REGISTER_MUTATION);

    const pressRegister = async () => {
        try {
            await register({
                variables: {
                    name: firstName + " " + lastName,
                    username,
                    email,
                    password,
                },
            });

            navigation.navigate("Login");
        } catch (error) {
            Alert.alert("Register Failed", error.message);
        }
    };

    return (
        <KeyboardAvoidingView
            style={styles.screen}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <StatusBar barStyle="dark-content" backgroundColor={COLORS.background} />

            <ScrollView
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >

                <View style={styles.form}>
                    <Text style={styles.label}>Name</Text>

                    <View style={styles.nameRow}>
                        <TextInput
                            placeholder="First name"
                            placeholderTextColor={COLORS.muted}
                            style={[styles.input, styles.nameInput]}
                            value={firstName}
                            onChangeText={setFirstName}
                            autoCapitalize="words"
                        />

                        <TextInput
                            placeholder="Surname"
                            placeholderTextColor={COLORS.muted}
                            style={[styles.input, styles.nameInput]}
                            value={lastName}
                            onChangeText={setLastName}
                            autoCapitalize="words"
                        />
                    </View>

                    <Text style={styles.label}>Username</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="person-outline"
                            size={19}
                            color={COLORS.secondaryText}
                        />
                        <TextInput
                            placeholder="johndoe"
                            placeholderTextColor={COLORS.muted}
                            style={styles.inputText}
                            value={username}
                            onChangeText={setUsername}
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>E-mail</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="mail-outline"
                            size={19}
                            color={COLORS.secondaryText}
                        />
                        <TextInput
                            placeholder="example@mail.com"
                            placeholderTextColor={COLORS.muted}
                            style={styles.inputText}
                            value={email}
                            onChangeText={setEmail}
                            keyboardType="email-address"
                            autoCapitalize="none"
                        />
                    </View>

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.inputContainer}>
                        <Ionicons
                            name="lock-closed-outline"
                            size={19}
                            color={COLORS.secondaryText}
                        />
                        <TextInput
                            placeholder="Create a password"
                            placeholderTextColor={COLORS.muted}
                            style={styles.inputText}
                            value={password}
                            onChangeText={setPassword}
                            secureTextEntry
                            autoCapitalize="none"
                        />
                    </View>

                    <PrimaryButton
                        title="Register"
                        onPress={pressRegister}
                        loading={loading}
                    />

                    <View style={styles.footer}>
                        <Text style={styles.footerText}>
                            Already have an account?{" "}
                        </Text>
                        <Link screen="Login" style={styles.loginLink}>
                            Login
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
        paddingHorizontal: SPACING.xl,
        paddingVertical: SPACING.xxl,
    },

    header: {
        alignItems: "center",
        marginBottom: SPACING.xxl,
    },

    logoContainer: {
        width: 52,
        height: 38,
        borderRadius: 11,
        backgroundColor: COLORS.primary,
        alignItems: "center",
        justifyContent: "center",
        marginBottom: SPACING.sm,
    },

    brandName: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.text,
    },

    brandAccent: {
        color: COLORS.primary,
    },

    title: {
        fontSize: FONT_SIZE.xl,
        fontWeight: "800",
        color: COLORS.text,
        marginTop: SPACING.xl,
    },

    subtitle: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.secondaryText,
        textAlign: "center",
        marginTop: SPACING.sm,
    },

    form: {
        width: "100%",
        gap: SPACING.sm,
    },

    label: {
        fontSize: FONT_SIZE.sm,
        fontWeight: "600",
        color: COLORS.text,
        marginTop: SPACING.sm,
    },

    nameRow: {
        flexDirection: "row",
        gap: SPACING.sm,
    },

    nameInput: {
        flex: 1,
    },

    input: {
        minHeight: 50,
        borderWidth: 1,
        borderColor: COLORS.border,
        borderRadius: 12,
        paddingHorizontal: SPACING.md,
        fontSize: FONT_SIZE.md,
        color: COLORS.text,
        backgroundColor: COLORS.surface,
    },

    inputContainer: {
        minHeight: 50,
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

    footer: {
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        marginTop: SPACING.lg,
    },

    footerText: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.secondaryText,
    },

    loginLink: {
        fontSize: FONT_SIZE.sm,
        color: COLORS.primary,
        fontWeight: "700",
    },
});
