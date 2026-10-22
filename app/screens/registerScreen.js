import { Link } from "@react-navigation/native";
import { useState } from "react";
import { Button, StatusBar, StyleSheet, Text, TextInput, View } from "react-native";
import PrimaryButton from "../components/primaryButton";

export default function RegisterScreen() {
    const [firstName, setFirstName] = useState('')
    const [lastName, setLastName] = useState('')
    const [email, setEmail] = useState('')
    const [username, setUsername] = useState('')
    const [password, setPassword] = useState('')

    return (
        <View style={styles.container}>
            <View style={{ width: '100%', gap: 8 }}>
                <Text>Name</Text>
                <View style={{
                    flexDirection: 'row',
                    gap: 4
                }}>
                    <TextInput
                        placeholder="First name"
                        style={{ ...styles.input, flex: 1 }}
                        value={firstName}
                        onChangeText={(text) => { setFirstName(text) }}
                    />
                    <TextInput
                        placeholder="Surname"
                        style={{ ...styles.input, flex: 1 }}
                        value={lastName}
                        onChangeText={(text) => { setLastName(text) }}
                    />

                </View>

                <Text>Username</Text>
                <TextInput
                    placeholder="johndoe / janedoe"
                    style={styles.input}
                    value={username}
                    onChangeText={(text) => { setUsername(text) }}
                    autoCapitalize="none"

                />

                <Text>E-mail</Text>
                <TextInput
                    style={styles.input}
                    placeholder="example@mail.com"
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />

                <PrimaryButton title={'Register'} onPress={() => { }} />
                <Text style={{ alignSelf: 'center' }}>Already have an account ? <Link screen={'Login'}>Login</Link></Text>

            </View>
            <StatusBar style="auto" />
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
        padding: 16
    },
    input: {
        borderColor: "gray",
        borderWidth: 1,
        borderRadius: 8,
        padding: 8,
    },
});