import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { useAuth } from "../context/AuthContext";

export default function AuthScreen({ navigation }) {
  const { login } = useAuth();
  const [email, setEmail] = useState("adventurer@moneyquest.com");
  const [password, setPassword] = useState("");

  const handleLogin = () => {
    login(email);
    navigation.replace("MainBox");
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>MoneyQuest</Text>
      <Text style={styles.subtitle}>Your Financial Adventure Awaits</Text>

      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        placeholder="Enter Email"
        autoCapitalize="none"
      />
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        placeholder="Password (Mock)"
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Start Adventure</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f0f8ff",
    padding: 20,
  },
  title: {
    fontSize: 32,
    fontWeight: "bold",
    color: "#228B22",
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
    backgroundColor: "#228B22",
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
