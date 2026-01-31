import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ImageBackground, ScrollView, RefreshControl } from 'react-native';
import { COLORS } from '../styles/theme';
import NpcBubble from '../components/NpcBubble';
import { recordAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const AdventureScreen = () => {
    const [dashboard, setDashboard] = useState({
        rpg: {
            level: 1,
            xp: 0,
            xp_to_next_level: 1000,
            map_progress: 0,
            title: "初級冒險者"
        },
        today_spend: 0,
        today_carbon: 0
    });

    const [refreshing, setRefreshing] = useState(false);
    const [npcMessage, setNpcMessage] = useState("");
    const [npcVisible, setNpcVisible] = useState(false);

    const fetchStatus = async () => {
        try {
            const res = await recordAPI.getStatus();
            setDashboard(res.data);
        } catch (e) {
            console.log("Error fetching status", e);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchStatus();
        setRefreshing(false);
    };

    // Calculate map visibility based on progress
    const mapOpacity = 0.3 + (dashboard.rpg.map_progress * 0.7);

    return (
        <View style={styles.container}>
            {/* RPG Map Background (Simulated with colors and icons) */}
            <View style={[styles.mapContainer, { opacity: mapOpacity }]}>
                <View style={styles.grid}>
                    {Array(16).fill(0).map((_, i) => (
                        <View key={i} style={styles.gridItem}>
                            {dashboard.rpg.map_progress > (i / 16) && (
                                <Ionicons
                                    name={i % 3 === 0 ? "leaf" : (i % 5 === 0 ? "home" : "trail-sign")}
                                    size={40}
                                    color={COLORS.primary}
                                />
                            )}
                        </View>
                    ))}
                </View>
            </View>

            <ScrollView
                contentContainerStyle={styles.overlay}
                refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
            >
                {/* Header / Stats */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.85)']}
                    style={styles.header}
                >
                    <View style={styles.profileSection}>
                        <View style={styles.avatar}>
                            <Ionicons name="person" size={40} color={COLORS.white} />
                        </View>
                        <View>
                            <Text style={styles.title}>{dashboard.rpg.title}</Text>
                            <Text style={styles.levelText}>等級 {dashboard.rpg.level}</Text>
                        </View>
                    </View>

                    <View style={styles.xpBarContainer}>
                        <View style={[styles.xpBar, { width: `${(dashboard.rpg.xp / dashboard.rpg.xp_to_next_level) * 100}%` }]} />
                        <Text style={styles.xpText}>{dashboard.rpg.xp} / {dashboard.rpg.xp_to_next_level} XP</Text>
                    </View>
                </LinearGradient>

                {/* Dashboard */}
                <LinearGradient
                    colors={['rgba(255,255,255,0.95)', 'rgba(255,255,255,0.8)']}
                    style={styles.dashboard}
                >
                    <Text style={styles.dashTitle}>今日冒險統計</Text>
                    <View style={styles.statRow}>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>金幣消耗</Text>
                            <Text style={styles.statValue}>{dashboard.today_spend.toLocaleString()}</Text>
                        </View>
                        <View style={styles.statItem}>
                            <Text style={styles.statLabel}>碳足跡</Text>
                            <Text style={styles.statValue}>{dashboard.today_carbon.toFixed(2)} kg</Text>
                        </View>
                    </View>
                </LinearGradient>
            </ScrollView>

            <NpcBubble
                message={npcMessage || "歡迎回來，冒險者！今日也有好好記帳嗎？"}
                visible={true} // For demo
                onHide={() => setNpcVisible(false)}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#E0F2F1', // Light mint
    },
    mapContainer: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: '#C8E6C9',
        justifyContent: 'center',
        alignItems: 'center',
    },
    grid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        width: '100%',
        height: '100%',
    },
    gridItem: {
        width: '25%',
        height: '25%',
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 0.5,
        borderColor: 'rgba(0,0,0,0.05)',
    },
    overlay: {
        flex: 1,
        padding: 20,
        paddingTop: 60,
    },
    header: {
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        borderWidth: 1,
        borderColor: COLORS.primary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    profileSection: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 15,
    },
    avatar: {
        width: 60,
        height: 60,
        borderRadius: 30,
        backgroundColor: COLORS.secondary,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 15,
    },
    title: {
        fontSize: 14,
        color: COLORS.secondary,
        fontWeight: 'bold',
    },
    levelText: {
        fontSize: 22,
        fontWeight: '900',
        color: COLORS.text,
    },
    xpBarContainer: {
        height: 20,
        backgroundColor: '#eee',
        borderRadius: 10,
        overflow: 'hidden',
        position: 'relative',
        justifyContent: 'center',
    },
    xpBar: {
        height: '100%',
        backgroundColor: COLORS.accent,
    },
    xpText: {
        position: 'absolute',
        alignSelf: 'center',
        fontSize: 10,
        fontWeight: 'bold',
        color: '#333',
    },
    dashboard: {
        borderRadius: 20,
        padding: 20,
        borderWidth: 1,
        borderColor: COLORS.secondary,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 3.84,
        elevation: 5,
    },
    dashTitle: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 15,
        color: COLORS.secondary,
    },
    statRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    statItem: {
        alignItems: 'center',
        flex: 1,
    },
    statLabel: {
        fontSize: 12,
        color: '#666',
        marginBottom: 5,
    },
    statValue: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
});

export default AdventureScreen;
