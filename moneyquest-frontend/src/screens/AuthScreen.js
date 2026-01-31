import React, { useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    TextInput,
} from "react-native";
import { useAuth } from "../context/AuthContext";
import { COLORS } from "../styles/theme";

export default function AuthScreen({ navigation }) {
    const { login } = useAuth();
    const [email, setEmail] = useState("adventurer@moneyquest.com");
    const [password, setPassword] = useState("");

    const handleLogin = () => {
        login(email);
        // Navigation is handled by App.js state
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>MoneyQuest</Text>
            <Text style={styles.subtitle}>金錢與冒險的旅程</Text>

            <TextInput
                style={styles.input}
                value={email}
                onChangeText={setEmail}
                placeholder="輸入 Email"
                autoCapitalize="none"
            />
            <TextInput
                style={styles.input}
                value={password}
                onChangeText={setPassword}
                placeholder="密碼 (Mock)"
                secureTextEntry
            />

            <TouchableOpacity style={styles.button} onPress={handleLogin}>
                <Text style={styles.buttonText}>開始冒險</Text>
            </TouchableOpacity>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F9FB",
        padding: 20,
    },
    title: {
        fontSize: 32,
        fontWeight: "bold",
        color: COLORS.primary,
        marginBottom: 10,
    },
    subtitle: { fontSize: 16, color: "#555", marginBottom: 40 },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "white",
        borderRadius: 10,
        paddingHorizontal: 15,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: "#ddd",
    },
    button: {
        width: "100%",
        height: 50,
        backgroundColor: COLORS.primary,
        borderRadius: 10,
        justifyContent: "center",
        alignItems: "center",
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
        elevation: 5,
    },
    buttonText: { color: "white", fontSize: 18, fontWeight: "bold" },
});
