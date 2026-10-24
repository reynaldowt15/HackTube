import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
import { Link } from "@react-navigation/native";
import { setItem } from "expo-secure-store";
import { useContext, useState } from "react";
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StatusBar,
  StyleSheet,
  Text,
  View,
} from "react-native";

import AppTextInput from "../components/appTextInput";
import PrimaryButton from "../components/primaryButton";
import { AuthContext } from "../context/authContext";
import { COLORS, FONT_SIZE, SPACING } from "../styles/theme";

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
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={0}
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
        <View style={styles.content}>
          <View style={styles.welcomeSection}>
            <Text style={styles.title}>Welcome back</Text>
            <Text style={styles.description}>
              Sign in to continue to your account.
            </Text>
          </View>

          <View style={styles.form}>
            <View style={styles.inputGroup}>
              <Text style={styles.label}>Email address</Text>
              <AppTextInput
                icon="mail-outline"
                placeholder="example@mail.com"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <View style={styles.inputGroup}>
              <Text style={styles.label}>Password</Text>
              <AppTextInput
                icon="lock-closed-outline"
                placeholder="Enter your password"
                value={password}
                onChangeText={setPassword}
                secureTextEntry
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>

            <PrimaryButton
              title="Login"
              onPress={pressLogin}
              loading={loading}
            />
          </View>

          <View style={styles.registerContainer}>
            <Text style={styles.registerText}>
              Don't have an account?
            </Text>
            <Link screen="Register" style={styles.registerLink}>
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
  content: {
    width: "100%",
    maxWidth: 500,
    alignSelf: "center",
    paddingHorizontal: SPACING.xl,
    paddingVertical: SPACING.lg,
  },
  brandSection: {
    alignItems: "center",
    marginBottom: SPACING.xxl,
  },
  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
  },
  welcomeSection: {
    marginBottom: SPACING.xl,
  },
  title: {
    color: COLORS.text,
    fontSize: FONT_SIZE.xxl,
    fontWeight: "800",
    letterSpacing: -0.5,
  },
  description: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.md,
    lineHeight: 23,
  },
  form: {
    gap: SPACING.lg,
  },
  inputGroup: {
    gap: SPACING.sm,
  },
  label: {
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  registerContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.xxl,
  },
  registerText: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
  },
  registerLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
});
