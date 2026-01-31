import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { COLORS } from '../styles/theme';
import { analysisAPI } from '../services/api';
import { Ionicons } from '@expo/vector-icons';

const AnalysisScreen = () => {
    const [report, setReport] = useState(null);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const fetchAnalysis = async () => {
        try {
            const res = await analysisAPI.getAnalysis();
            setReport(res.data);
        } catch (e) {
            console.log("Error analysis", e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAnalysis();
    }, []);

    const onRefresh = async () => {
        setRefreshing(true);
        await fetchAnalysis();
        setRefreshing(false);
    };

    if (loading) return <View style={styles.center}><Text>正在讀取預言...</Text></View>;

    return (
        <ScrollView
            style={styles.container}
            refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        >
            <View style={styles.header}>
                <Ionicons name="sparkles" size={40} color={COLORS.accent} />
                <Text style={styles.headerTitle}>AI 冒險分析</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>冒險預言 (RPG Advice)</Text>
                <Text style={styles.adviceText}>{report?.rpg_advice}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>支出總結</Text>
                <Text style={styles.summaryText}>{report?.summary}</Text>
                <Text style={styles.predictionText}>預測下月支出：{report?.prediction_next_month.toFixed(0)} NTD</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>碳足跡分析</Text>
                <Text style={styles.carbonText}>{report?.carbon_analysis}</Text>
            </View>

            <View style={styles.card}>
                <Text style={styles.cardTitle}>金幣流向 (分類)</Text>
                {Object.entries(report?.category_breakdown || {}).map(([cat, amt]) => (
                    <View key={cat} style={styles.catRow}>
                        <Text style={styles.catName}>{cat}</Text>
                        <View style={styles.catBarBack}>
                            <View style={[styles.catBarFront, { width: `${Math.min(100, (amt / 5000) * 100)}%` }]} />
                        </View>
                        <Text style={styles.catAmt}>{amt}</Text>
                    </View>
                ))}
            </View>

            <View style={{ height: 100 }} />
        </ScrollView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F7F9FB',
        padding: 20,
        paddingTop: 60,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 30,
        gap: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    card: {
        backgroundColor: COLORS.white,
        borderRadius: 20,
        padding: 20,
        marginBottom: 20,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3,
    },
    cardTitle: {
        fontSize: 16,
        fontWeight: 'bold',
        color: COLORS.secondary,
        marginBottom: 10,
    },
    adviceText: {
        fontSize: 17,
        fontStyle: 'italic',
        color: COLORS.text,
        lineHeight: 24,
    },
    summaryText: {
        fontSize: 24,
        fontWeight: 'bold',
        color: COLORS.primary,
    },
    predictionText: {
        marginTop: 10,
        color: '#666',
        fontSize: 14,
    },
    carbonText: {
        color: COLORS.primary,
        fontSize: 16,
        fontWeight: '600',
    },
    catRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 10,
    },
    catName: {
        width: 60,
        fontSize: 14,
    },
    catBarBack: {
        flex: 1,
        height: 8,
        backgroundColor: '#eee',
        borderRadius: 4,
        marginHorizontal: 10,
        overflow: 'hidden',
    },
    catBarFront: {
        height: '100%',
        backgroundColor: COLORS.secondary,
    },
    catAmt: {
        width: 60,
        textAlign: 'right',
        fontSize: 14,
        fontWeight: 'bold',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
});

export default AnalysisScreen;
