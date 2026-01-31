import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Dimensions, TouchableOpacity } from 'react-native';
import LottieView from 'lottie-react-native';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { getRecords } from '../services/api';

const { width } = Dimensions.get('window');

// Mock NPC Asset (using a placeholder URL or local require)
const NPC_IMAGE = { uri: 'https://cdn-icons-png.flaticon.com/512/4712/4712035.png' }; // Cute Elf/Mage placeholder

export default function DashboardScreen({ navigation }) {
    const [stats, setStats] = useState({ level: 5, exp: 450, carbon: 12.5 });
    const [npcMessage, setNpcMessage] = useState("Welcome back, traveler! The forest looks greener today.");

    useEffect(() => {
        // Load initial stats
    }, []);

    return (
        <View style={styles.container}>
            {/* Header - Level & EXP */}
            <View style={styles.header}>
                <View style={styles.levelBadge}>
                    <Text style={styles.levelText}>{stats.level}</Text>
                </View>
                <View style={styles.expBarContainer}>
                    <Text style={styles.expText}>EXP {stats.exp} / 1000</Text>
                    <View style={styles.expBarBackground}>
                        <View style={[styles.expBarFill, { width: '45%' }]} />
                    </View>
                </View>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                    <Text style={{ fontSize: 24 }}>⚙️</Text>
                </TouchableOpacity>
            </View>

            {/* Interactive Map Area */}
            <View style={styles.mapArea}>
                {/* Background Lottie Map - Green clouds/particles */}
                <LottieView
                    autoPlay
                    loop
                    style={StyleSheet.absoluteFillObject}
                    source={require('../assets/animations/map_placeholder.json')}
                />

                {/* Map overlays / interactions */}
                <Text style={styles.mapLabel}>Green Valley</Text>
            </View>

            {/* NPC Interaction Area */}
            <View style={styles.npcContainer}>
                <Image source={NPC_IMAGE} style={styles.npcSprite} />
                <View style={styles.dialogBubble}>
                    <Text style={styles.dialogText}>{npcMessage}</Text>
                    <Text style={styles.dialogSub}>- Elder Tree</Text>
                </View>
            </View>

            {/* Quick Stats/Analysis Card */}
            <View style={styles.statsCard}>
                <Text style={styles.cardTitle}>Impact Report</Text>
                <Text style={styles.carbonText}>🌱 {stats.carbon} kg CO2 Saved</Text>
                <Text style={styles.predictText}>Prediction: Low spending this week!</Text>
            </View>

        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
    header: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 20, marginBottom: 10 },
    levelBadge: {
        width: 50, height: 50, borderRadius: 25, backgroundColor: COLORS.accent,
        alignItems: 'center', justifyContent: 'center', marginRight: 10,
        borderWidth: 3, borderColor: COLORS.white,
        ...SHADOWS.medium
    },
    levelText: { fontSize: 24, fontWeight: 'bold', color: COLORS.text },
    expBarContainer: { flex: 1, marginRight: 10 },
    expText: { color: COLORS.text, fontSize: 12, marginBottom: 5, fontWeight: 'bold' },
    expBarBackground: { height: 10, backgroundColor: '#ddd', borderRadius: 5, overflow: 'hidden' },
    expBarFill: { height: '100%', backgroundColor: COLORS.primary },

    mapArea: {
        width: width - 40, height: 300, alignSelf: 'center',
        borderRadius: SIZES.radius, overflow: 'hidden', backgroundColor: '#e6f7ff',
        marginBottom: -30, // Overlap with NPC
        borderWidth: 2, borderColor: COLORS.white
    },
    mapLabel: { position: 'absolute', top: 20, left: 20, backgroundColor: 'rgba(255,255,255,0.8)', padding: 5, borderRadius: 8 },

    npcContainer: { flexDirection: 'row', alignItems: 'flex-end', paddingHorizontal: 20, marginBottom: 20, zIndex: 1 },
    npcSprite: { width: 100, height: 100, resizeMode: 'contain' },
    dialogBubble: {
        flex: 1, backgroundColor: COLORS.white, padding: 15, borderRadius: 20,
        borderBottomLeftRadius: 0, marginLeft: 10, marginBottom: 20,
        ...SHADOWS.light
    },
    dialogText: { color: COLORS.text, fontSize: 14, lineHeight: 20 },
    dialogSub: { color: '#999', fontSize: 10, textAlign: 'right', marginTop: 5 },

    statsCard: {
        marginHorizontal: 20, padding: 20, backgroundColor: COLORS.white, borderRadius: SIZES.radius,
        ...SHADOWS.medium, alignItems: 'center'
    },
    cardTitle: { fontSize: 18, fontWeight: 'bold', color: COLORS.text, marginBottom: 10 },
    carbonText: { fontSize: 22, color: COLORS.success, fontWeight: 'bold' },
    predictText: { marginTop: 5, color: COLORS.secondary, fontStyle: 'italic' }
});
