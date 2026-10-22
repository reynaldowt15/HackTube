import { Link } from "@react-navigation/native";
import { Button, StatusBar, StyleSheet, Text, View } from "react-native";

export default function LoginScreen() {
    return (
        <View style={styles.container}>
            <Text>Login Screen</Text>
            <Text>Don't have an account ? <Link screen={'Register'}>Register</Link></Text>
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
    },
});