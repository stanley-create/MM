import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    TouchableOpacity,
    TextInput,
    Alert,
} from "react-native";
import { COLORS } from "../styles/theme";
import { communityAPI } from "../services/api"; // Will add this next

export default function CommunityScreen() {
    const [messages, setMessages] = useState([
        {
            id: "1",
            user: "精靈遊俠",
            text: "今天走路代替騎車，省了 5kg 碳排放！",
            type: "chat",
        },
        {
            id: "2",
            user: "會計法師",
            text: "太棒了！公會經驗值 +50。",
            type: "chat",
        },
    ]);
    const [inputText, setInputText] = useState("");
    const [guilds, setGuilds] = useState([]);

    useEffect(() => {
        fetchGuilds();
    }, []);

    const fetchGuilds = async () => {
        try {
            const res = await communityAPI.list();
            setGuilds(res.data);
        } catch (e) {
            console.log("Error fetching guilds", e);
        }
    };

    const handleSend = () => {
        if (!inputText.trim()) return;
        setMessages([
            ...messages,
            {
                id: Date.now().toString(),
                user: "冒險者 (你)",
                text: inputText,
                type: "chat",
            },
        ]);
        setInputText("");
    };

    const handleJoinGuild = (guildId) => {
        Alert.alert("公會", `歡迎加入公會！ (ID: ${guildId})`);
    };

    const renderGuildItem = ({ item }) => (
        <TouchableOpacity style={styles.guildCard} onPress={() => handleJoinGuild(item.id)}>
            <Text style={styles.guildName}>{item.name}</Text>
            <Text style={styles.guildDesc}>{item.description}</Text>
            <Text style={styles.guildStat}>碳積分: {item.total_carbon_saved} kg</Text>
        </TouchableOpacity>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.title}>冒險者公會</Text>
            </View>

            <Text style={styles.sectionTitle}>推薦公會</Text>
            <View style={{ height: 120 }}>
                <FlatList
                    data={guilds}
                    renderItem={renderGuildItem}
                    keyExtractor={item => item.id}
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    contentContainerStyle={{ paddingHorizontal: 20 }}
                />
            </View>

            <Text style={styles.sectionTitle}>公會聊天室</Text>
            <FlatList
                data={messages}
                keyExtractor={(item) => item.id}
                style={styles.chatList}
                renderItem={({ item }) => (
                    <View
                        style={[
                            styles.msgContainer,
                            item.user.includes("(你)") ? styles.myMsg : styles.theirMsg,
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
                    placeholder="鼓勵你的夥伴..."
                />
                <TouchableOpacity style={styles.sendBtn} onPress={handleSend}>
                    <Text style={{ color: "white", fontWeight: "bold" }}>發送</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: "#F7F9FB", paddingTop: 50 },
    header: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    title: { fontSize: 24, fontWeight: "bold", color: COLORS.primary },
    sectionTitle: { fontSize: 18, fontWeight: "bold", marginLeft: 20, marginVertical: 10, color: '#555' },
    guildCard: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 15,
        marginRight: 10,
        width: 200,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        elevation: 3,
    },
    guildName: { fontSize: 16, fontWeight: "bold", color: COLORS.secondary },
    guildDesc: { fontSize: 12, color: "#666", marginVertical: 5 },
    guildStat: { fontSize: 12, color: COLORS.primary, fontWeight: "bold" },
    chatList: { flex: 1, paddingHorizontal: 20 },
    msgContainer: {
        marginVertical: 5,
        padding: 10,
        borderRadius: 10,
        maxWidth: "80%",
    },
    myMsg: { alignSelf: "flex-end", backgroundColor: "#E0F2F1" },
    theirMsg: { alignSelf: "flex-start", backgroundColor: COLORS.white },
    sender: { fontSize: 10, color: "#888", marginBottom: 2 },
    msgText: { fontSize: 16, color: '#333' },
    inputArea: { flexDirection: "row", padding: 15, backgroundColor: "white", alignItems: 'center' },
    input: {
        flex: 1,
        backgroundColor: "#f0f0f0",
        borderRadius: 20,
        paddingHorizontal: 15,
        paddingVertical: 10,
        marginRight: 10,
        maxHeight: 40,
    },
    sendBtn: {
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: COLORS.primary,
        borderRadius: 20,
        paddingHorizontal: 20,
        paddingVertical: 10,
    },
});
