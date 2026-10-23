import { Link, useNavigation } from "@react-navigation/native";
import { useState } from "react";
import { StatusBar, Text, TextInput, View } from "react-native";
import PrimaryButton from "../components/primaryButton";
import { componentStyle } from "../styles/componentStyle";

export default function LoginScreen() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const navigation = useNavigation()

    const pressLogin = () => {
        navigation.navigate('Home')
    }

    return (
        <View style={componentStyle.container}>
            <View style={{ width: '100%', gap: 8 }}>
                <Text>E-mail</Text>
                <TextInput
                    style={componentStyle.input}
                    placeholder="example@mail.com"
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                    keyboardType="email-address"
                    autoCapitalize="none"
                />

                <Text>Password</Text>
                <TextInput
                    style={componentStyle.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                    secureTextEntry={true}
                    autoCapitalize="none"
                />

                <PrimaryButton label={'Login'} onPress={pressLogin} />
                <Text style={{ alignSelf: 'center' }}>Don't have an account ? <Link screen={'Register'}>Register</Link></Text>
            </View>
            <StatusBar style="auto" />
        </View>
    )
}