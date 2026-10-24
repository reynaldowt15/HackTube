import { gql } from "@apollo/client";
import { useMutation } from "@apollo/client/react";
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
  View,
} from "react-native";

import AppTextInput from "../components/appTextInput";
import PrimaryButton from "../components/primaryButton";
import { COLORS, FONT_SIZE, SPACING } from "../styles/theme";

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
          <View style={styles.header}>
            <Text style={styles.title}>Create your account</Text>
            <Text style={styles.subtitle}>
              Join the community and share your moments.
            </Text>
          </View>

          <View style={styles.form}>
            <Text style={styles.label}>Name</Text>
            <View style={styles.nameRow}>
              <AppTextInput
                placeholder="First name"
                inputStyle={styles.nameInput}
                value={firstName}
                onChangeText={setFirstName}
                autoCapitalize="words"
              />
              <AppTextInput
                placeholder="Surname"
                inputStyle={styles.nameInput}
                value={lastName}
                onChangeText={setLastName}
                autoCapitalize="words"
              />
            </View>

            <Text style={styles.label}>Username</Text>
            <AppTextInput
              icon="person-outline"
              placeholder="johndoe"
              value={username}
              onChangeText={setUsername}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>E-mail</Text>
            <AppTextInput
              icon="mail-outline"
              placeholder="example@mail.com"
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text style={styles.label}>Password</Text>
            <AppTextInput
              icon="lock-closed-outline"
              placeholder="Create a password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              autoCorrect={false}
            />

            <PrimaryButton
              title="Register"
              onPress={pressRegister}
              loading={loading}
            />

            <View style={styles.footer}>
              <Text style={styles.footerText}>
                Already have an account?
              </Text>
              <Link screen="Login" style={styles.loginLink}>
                Login
              </Link>
            </View>
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
    paddingVertical: SPACING.xxl,
  },
  header: {
    alignItems: "center",
    marginBottom: SPACING.xl,
  },
  title: {
    marginTop: SPACING.xl,
    color: COLORS.text,
    fontSize: FONT_SIZE.xl,
    fontWeight: "800",
  },
  subtitle: {
    marginTop: SPACING.sm,
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
    textAlign: "center",
    lineHeight: 21,
  },
  form: {
    gap: SPACING.sm,
  },
  label: {
    marginTop: SPACING.sm,
    color: COLORS.text,
    fontSize: FONT_SIZE.sm,
    fontWeight: "700",
  },
  nameRow: {
    flexDirection: "row",
    gap: SPACING.sm,
  },
  nameInput: {
    flex: 1,
    minWidth: 0,
  },
  footer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    alignItems: "center",
    gap: SPACING.xs,
    marginTop: SPACING.lg,
  },
  footerText: {
    color: COLORS.secondaryText,
    fontSize: FONT_SIZE.sm,
  },
  loginLink: {
    color: COLORS.primary,
    fontSize: FONT_SIZE.sm,
    fontWeight: "800",
  },
});
