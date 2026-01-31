import React, { useState } from 'react';
import { Modal, View, Text, TextInput, TouchableOpacity, StyleSheet, FlatList, ScrollView } from 'react-native';
import { COLORS } from '../styles/theme';
import { Ionicons } from '@expo/vector-icons';

const CATEGORIES = [
    { id: '1', name: '飲食', icon: 'fast-food' },
    { id: '2', name: '交通', icon: 'bus' },
    { id: '3', name: '娛樂', icon: 'game-controller' },
    { id: '4', name: '購物', icon: 'cart' },
    { id: '5', name: '住房', icon: 'business' },
    { id: '6', name: '醫療', icon: 'medical' },
    { id: '7', name: '收入', icon: 'cash' },
    { id: '8', name: '其他', icon: 'ellipsis-horizontal' },
];

const RecordModal = ({ visible, onClose, onSave }) => {
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('飲食');
    const [note, setNote] = useState('');

    const handleSave = () => {
        if (!amount) return;
        onSave({
            amount: parseFloat(amount),
            category,
            description: note,
            is_income: category === '收入',
        });
        setAmount('');
        setNote('');
        onClose();
    };

    const simulateOCR = () => {
        alert("正在掃描發票... (模擬)");
        setTimeout(() => {
            setAmount('150');
            setCategory('飲食');
            setNote('午餐發票');
        }, 1500);
    };

    return (
        <Modal visible={visible} animationType="slide" transparent>
            <View style={styles.modalOverlay}>
                <View style={styles.modalContent}>
                    <View style={styles.header}>
                        <Text style={styles.title}>新增冒險紀錄</Text>
                        <TouchableOpacity onPress={onClose}>
                            <Ionicons name="close" size={28} color={COLORS.text} />
                        </TouchableOpacity>
                    </View>

                    <ScrollView showsVerticalScrollIndicator={false}>
                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>金額 (NTD)</Text>
                            <TextInput
                                style={styles.amountInput}
                                value={amount}
                                onChangeText={setAmount}
                                keyboardType="numeric"
                                placeholder="0"
                                autoFocus
                            />
                        </View>

                        <View style={styles.toolsRow}>
                            <TouchableOpacity style={styles.toolBtn} onPress={simulateOCR}>
                                <Ionicons name="scan" size={24} color={COLORS.secondary} />
                                <Text style={styles.toolText}>掃描發票</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.toolBtn}>
                                <Ionicons name="mic" size={24} color={COLORS.secondary} />
                                <Text style={styles.toolText}>語音輸入</Text>
                            </TouchableOpacity>
                        </View>

                        <Text style={styles.label}>分類</Text>
                        <View style={styles.categoryGrid}>
                            {CATEGORIES.map((item) => (
                                <TouchableOpacity
                                    key={item.id}
                                    style={[
                                        styles.categoryItem,
                                        category === item.name && styles.categoryItemActive,
                                    ]}
                                    onPress={() => setCategory(item.name)}
                                >
                                    <Ionicons
                                        name={item.icon}
                                        size={24}
                                        color={category === item.name ? COLORS.white : COLORS.primary}
                                    />
                                    <Text style={[
                                        styles.categoryText,
                                        category === item.name && styles.categoryTextActive,
                                    ]}>{item.name}</Text>
                                </TouchableOpacity>
                            ))}
                        </View>

                        <View style={styles.inputGroup}>
                            <Text style={styles.label}>備註</Text>
                            <TextInput
                                style={styles.noteInput}
                                value={note}
                                onChangeText={setNote}
                                placeholder="寫下冒險心得..."
                            />
                        </View>

                        <TouchableOpacity style={styles.saveBtn} onPress={handleSave}>
                            <Text style={styles.saveBtnText}>儲存紀錄</Text>
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)',
        justifyContent: 'flex-end',
    },
    modalContent: {
        backgroundColor: COLORS.white,
        borderTopLeftRadius: 30,
        borderTopRightRadius: 30,
        padding: 20,
        maxHeight: '90%',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'between',
        alignItems: 'center',
        marginBottom: 20,
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        color: COLORS.primary,
        flex: 1,
    },
    inputGroup: {
        marginBottom: 20,
    },
    label: {
        fontSize: 14,
        color: '#666',
        marginBottom: 8,
    },
    amountInput: {
        fontSize: 36,
        fontWeight: 'bold',
        borderBottomWidth: 2,
        borderBottomColor: COLORS.primary,
        paddingVertical: 10,
        color: COLORS.text,
    },
    categoryGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
        marginBottom: 20,
    },
    categoryItem: {
        width: '23%',
        aspectRatio: 1,
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 15,
        backgroundColor: '#F0F0F0',
        marginBottom: 10,
    },
    categoryItemActive: {
        backgroundColor: COLORS.primary,
    },
    categoryText: {
        fontSize: 12,
        marginTop: 5,
        color: COLORS.primary,
    },
    categoryTextActive: {
        color: COLORS.white,
    },
    noteInput: {
        backgroundColor: '#F0F0F0',
        borderRadius: 10,
        padding: 15,
        fontSize: 16,
    },
    toolsRow: {
        flexDirection: 'row',
        marginBottom: 20,
        gap: 10,
    },
    toolBtn: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#E8F0FE',
        padding: 12,
        borderRadius: 10,
        gap: 5,
    },
    toolText: {
        color: COLORS.secondary,
        fontWeight: '600',
    },
    saveBtn: {
        backgroundColor: COLORS.secondary,
        padding: 18,
        borderRadius: 15,
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 30,
    },
    saveBtnText: {
        color: COLORS.white,
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default RecordModal;
