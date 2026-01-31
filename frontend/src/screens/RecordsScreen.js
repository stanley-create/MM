import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Modal, Image } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SIZES, SHADOWS } from '../constants/theme';
import { createRecord } from '../services/api';

export default function RecordsScreen({ navigation }) {
    // Stage: 0 = Input, 1 = Preview/NPC
    const [stage, setStage] = useState(0);
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('Food');
    const [description, setDescription] = useState('');
    const [loading, setLoading] = useState(false);

    // Mock data for preview
    const [previewData, setPreviewData] = useState(null);

    const handleConfirm = async () => {
        // Submit logic
        setLoading(true);
        try {
            const res = await createRecord({
                amount: parseFloat(amount),
                category,
                description,
                transaction_type: 'expense'
            });
            Alert.alert("Success", res.message, [
                { text: "OK", onPress: () => navigation.goBack() }
            ]);
        } catch (e) {
            Alert.alert("Error", "Could not save.");
        } finally {
            setLoading(false);
        }
    };

    const toPreview = () => {
        if (!amount) return;
        setPreviewData({
            amount,
            category,
            carbon_est: (parseFloat(amount) * 0.01).toFixed(2), // Rough stub
            exp_est: 35
        });
        setStage(1);
    };

    const renderInputStage = () => (
        <View style={styles.stageContainer}>
            <Text style={styles.headerTitle}>New Entry</Text>

            <View style={styles.inputCard}>
                <Text style={styles.label}>Amount (NTD)</Text>
                <TextInput
                    style={styles.amountInput}
                    value={amount}
                    onChangeText={setAmount}
                    keyboardType="numeric"
                    placeholder="0"
                    autoFocus
                />
            </View>

            <View style={styles.categoryContainer}>
                {['Food', 'Transport', 'Shop', 'Ent.', 'Bill'].map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[styles.catChip, category === cat && styles.catChipActive]}
                        onPress={() => setCategory(cat)}
                    >
                        <Text style={[styles.catText, category === cat && styles.catTextActive]}>{cat}</Text>
                    </TouchableOpacity>
                ))}
            </View>

            <TextInput
                style={styles.descInput}
                value={description}
                onChangeText={setDescription}
                placeholder="What did you buy?"
            />

            <View style={styles.row}>
                <TouchableOpacity style={styles.scanBtn} onPress={() => Alert.alert("Cam", "Open OCR")}>
                    <Ionicons name="scan" size={24} color={COLORS.primary} />
                    <Text style={{ color: COLORS.primary }}>Scan</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.nextBtn} onPress={toPreview}>
                    <Text style={styles.nextBtnText}>Preview</Text>
                    <Ionicons name="arrow-forward" size={20} color="white" />
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderPreviewStage = () => (
        <View style={styles.stageContainer}>
            <Text style={styles.headerTitle}>Confirm?</Text>

            <View style={styles.previewCard}>
                <Text style={styles.previewLabel}>You are spending:</Text>
                <Text style={styles.previewAmount}>${previewData.amount}</Text>
                <Text style={styles.previewCat}>{previewData.category} - {description || 'No Desc'}</Text>

                <View style={styles.divider} />

                <View style={styles.statRow}>
                    <Text>🔥 Est. Carbon:</Text>
                    <Text style={{ fontWeight: 'bold', color: COLORS.error }}>{previewData.carbon_est} kg</Text>
                </View>
                <View style={styles.statRow}>
                    <Text>✨ Est. EXP:</Text>
                    <Text style={{ fontWeight: 'bold', color: COLORS.accent }}>+{previewData.exp_est} EXP</Text>
                </View>
            </View>

            <TouchableOpacity style={styles.confirmBtn} onPress={handleConfirm}>
                <Text style={styles.confirmText}>{loading ? "Saving..." : "Record & Save"}</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.backBtn} onPress={() => setStage(0)}>
                <Text style={{ color: '#999' }}>Back to Edit</Text>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={styles.container}>
            <TouchableOpacity style={styles.closeBtn} onPress={() => navigation.goBack()}>
                <Ionicons name="close" size={30} color={COLORS.text} />
            </TouchableOpacity>
            {stage === 0 ? renderInputStage() : renderPreviewStage()}
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: '#fff', padding: 20, paddingTop: 60 },
    closeBtn: { position: 'absolute', top: 50, right: 20, zIndex: 10 },
    stageContainer: { flex: 1, alignItems: 'center' },
    headerTitle: { fontSize: 28, fontWeight: 'bold', color: COLORS.text, marginBottom: 30 },

    inputCard: { width: '100%', marginBottom: 20 },
    label: { fontSize: 16, color: '#999', marginBottom: 5 },
    amountInput: { fontSize: 48, fontWeight: 'bold', color: COLORS.primary, borderBottomWidth: 1, borderColor: '#eee', paddingBottom: 10 },

    categoryContainer: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'center', marginBottom: 20 },
    catChip: { paddingVertical: 10, paddingHorizontal: 15, borderRadius: 20, backgroundColor: '#f0f0f0', margin: 5 },
    catChipActive: { backgroundColor: COLORS.primary },
    catText: { color: '#666' },
    catTextActive: { color: 'white', fontWeight: 'bold' },

    descInput: { width: '100%', padding: 15, backgroundColor: '#f9f9f9', borderRadius: 15, marginBottom: 30 },

    row: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', alignItems: 'center' },
    scanBtn: { alignItems: 'center', padding: 10 },
    nextBtn: { flexDirection: 'row', backgroundColor: COLORS.text, paddingVertical: 15, paddingHorizontal: 40, borderRadius: 30, alignItems: 'center' },
    nextBtnText: { color: 'white', fontWeight: 'bold', fontSize: 18, marginRight: 10 },

    previewCard: { width: '100%', padding: 30, backgroundColor: COLORS.background, borderRadius: 20, alignItems: 'center', marginBottom: 30 },
    previewAmount: { fontSize: 40, fontWeight: 'bold', color: COLORS.text, marginVertical: 10 },
    previewCat: { fontSize: 18, color: '#666', marginBottom: 20 },
    divider: { height: 1, width: '100%', backgroundColor: '#ddd', marginBottom: 20 },
    statRow: { flexDirection: 'row', width: '100%', justifyContent: 'space-between', marginBottom: 10 },

    confirmBtn: { width: '100%', backgroundColor: COLORS.accent, padding: 15, borderRadius: 30, alignItems: 'center', marginBottom: 15 },
    confirmText: { fontSize: 20, fontWeight: 'bold', color: COLORS.text },
    backBtn: { padding: 10 }
});
