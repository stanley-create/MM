import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  TextInput,
  Alert,
} from "react-native";

export default function CommunityScreen() {
  const [messages, setMessages] = useState([
    {
      id: "1",
      user: "ElfRanger",
      text: "Just saved 5kg Carbon by walking!",
      type: "chat",
    },
    {
      id: "2",
      user: "MageAccountant",
      text: "Great job! +50 EXP bonus sent.",
      type: "chat",
    },
  ]);
  const [inputText, setInputText] = useState("");

  const handleSend = () => {
    if (!inputText.trim()) return;
    setMessages([
      ...messages,
      {
        id: Date.now().toString(),
        user: "Adventurer (You)",
        text: inputText,
        type: "chat",
      },
    ]);
    setInputText("");
  };

  const handleJoinGuild = () => {
    Alert.alert("Guild Joined", "Welcome to 'Eco Warriors'!");
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.guildName}>Guild: Eco Warriors</Text>
        <Text style={styles.members}>Members: 24/50</Text>
      </View>

      <FlatList
        data={messages}
        keyExtractor={(item) => item.id}
        style={styles.chatList}
        renderItem={({ item }) => (
          <View
            style={[
              styles.msgContainer,
              item.user.includes("(You)") ? styles.myMsg : styles.theirMsg,
            ]}
          >
            <Text style={styles.sender}>{item.user}</Text>
            <Text style={styles.msgText}>{item.text}</Text>
          </View>
        )}
      />

      <View style={styles.inputArea}>
        <TextInput
          style={styles.input}
          value={inputText}
          onChangeText={setInputText}
          placeholder="Encourage your guild..."
        />
        <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
          <Text style={{ color: "white", fontWeight: "bold" }}>Send</Text>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={styles.joinBtn} onPress={handleJoinGuild}>
        <Text style={styles.joinText}>Manage Guild</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#f4f6f8" },
  header: {
    padding: 20,
    backgroundColor: "white",
    borderBottomWidth: 1,
    borderColor: "#eee",
  },
  guildName: { fontSize: 20, fontWeight: "bold", color: "#228B22" },
  members: { color: "#666" },
  chatList: { flex: 1, padding: 10 },
  msgContainer: {
    marginVertical: 5,
    padding: 10,
    borderRadius: 10,
    maxWidth: "80%",
  },
  myMsg: { alignSelf: "flex-end", backgroundColor: "#DCF8C6" },
  theirMsg: { alignSelf: "flex-start", backgroundColor: "white" },
  sender: { fontSize: 10, color: "#888", marginBottom: 2 },
  msgText: { fontSize: 16 },
  inputArea: { flexDirection: "row", padding: 10, backgroundColor: "white" },
  input: {
    flex: 1,
    backgroundColor: "#f0f0f0",
    borderRadius: 20,
    paddingHorizontal: 15,
    marginRight: 10,
    height: 40,
  },
  sendBtn: {
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#228B22",
    borderRadius: 20,
    paddingHorizontal: 20,
  },
  joinBtn: {
    margin: 10,
    backgroundColor: "#4169E1",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
  },
  joinText: { color: "white", fontWeight: "bold" },
});
