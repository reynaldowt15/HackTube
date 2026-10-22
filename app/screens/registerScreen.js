import { Link } from "@react-navigation/native";
import { StatusBar, StyleSheet, Text, View } from "react-native";

export default function RegisterScreen() {
    return (
        <View style={styles.container}>
            <Text>Register Screen</Text>
            <Text>Already have an account ? <Link screen={'Login'}>Login</Link></Text>
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