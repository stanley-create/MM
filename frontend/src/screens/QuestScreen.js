import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ProgressBarAndroid, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { getQuests } from '../services/api';

// Cross-platform Progress Bar
const ProgressBar = ({ progress }) => (
    <View style={{ height: 10, backgroundColor: '#e0e0e0', borderRadius: 5, flex: 1, marginRight: 10 }}>
        <View style={{ width: `${progress * 100}%`, backgroundColor: '#4169E1', height: '100%', borderRadius: 5 }} />
    </View>
);

export default function QuestScreen() {
    const [quests, setQuests] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadQuests();
    }, []);

    const loadQuests = async () => {
        setLoading(true);
        const data = await getQuests();
        setQuests(data);
        setLoading(false);
    };

    const renderQuest = ({ item }) => (
        <View style={styles.card}>
            <View style={styles.cardHeader}>
                <Text style={styles.title}>{item.title}</Text>
                <View style={styles.rewardBadge}>
                    <Text style={styles.rewardText}>+{item.reward_exp} EXP</Text>
                </View>
            </View>
            <Text style={styles.desc}>{item.description}</Text>
            <View style={styles.progressRow}>
                <ProgressBar progress={item.progress / item.target} />
                <Text style={styles.progressText}>{item.progress}/{item.target}</Text>
            </View>
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Active Quests</Text>
                <TouchableOpacity onPress={loadQuests}>
                    <Ionicons name="reload" size={24} color="#4169E1" />
                </TouchableOpacity>
            </View>

            {loading ? (
                <ActivityIndicator size="large" color="#4169E1" />
            ) : (
                <FlatList
                    data={quests}
                    renderItem={renderQuest}
                    keyExtractor={item => item.id}
                    contentContainerStyle={{ paddingBottom: 20 }}
                />
            )}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#f4f6f8', padding: 20 },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    headerTitle: { fontSize: 24, fontWeight: 'bold', color: '#333' },
    card: { backgroundColor: 'white', borderRadius: 15, padding: 15, marginBottom: 15, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 5, elevation: 3 },
    cardHeader: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 10 },
    title: { fontSize: 18, fontWeight: 'bold', color: '#333' },
    rewardBadge: { backgroundColor: '#FFF8E1', paddingVertical: 4, paddingHorizontal: 8, borderRadius: 10 },
    rewardText: { color: '#FFD700', fontWeight: 'bold' },
    desc: { color: '#666', marginBottom: 15 },
    progressRow: { flexDirection: 'row', alignItems: 'center' },
    progressText: { color: '#888', marginLeft: 5 }
});
