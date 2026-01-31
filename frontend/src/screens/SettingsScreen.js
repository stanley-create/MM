import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch, TouchableOpacity } from 'react-native';
import { COLORS, SIZES } from '../constants/theme';
import { Ionicons } from '@expo/vector-icons';

export default function SettingsScreen({ navigation }) {
    const [lowPowerMode, setLowPowerMode] = useState(false);
    const [notifications, setNotifications] = useState(true);
    const [anonymousGuild, setAnonymousGuild] = useState(true);

    const SettingItem = ({ label, value, onValueChange, icon }) => (
        <View style={styles.itemRow}>
            <View style={styles.iconLabel}>
                <Ionicons name={icon} size={24} color={COLORS.primary} style={{ marginRight: 10 }} />
                <Text style={styles.label}>{label}</Text>
            </View>
            <Switch
                trackColor={{ false: "#767577", true: COLORS.primary }}
                thumbColor={value ? COLORS.accent : "#f4f3f4"}
                onValueChange={onValueChange}
                value={value}
            />
        </View>
    );

    return (
        <View style={styles.container}>
            <View style={styles.header}>
                <TouchableOpacity onPress={() => navigation.closeDrawer()}>
                    <Ionicons name="arrow-back" size={28} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.title}>Settings</Text>
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Game & Valid</Text>
                <SettingItem
                    label="Low Power Mode (Less Animation)"
                    icon="battery-charging"
                    value={lowPowerMode}
                    onValueChange={setLowPowerMode}
                />
                <SettingItem
                    label="Anonymous in Guild"
                    icon="eye-off"
                    value={anonymousGuild}
                    onValueChange={setAnonymousGuild}
                />
            </View>

            <View style={styles.section}>
                <Text style={styles.sectionHeader}>Notifications</Text>
                <SettingItem
                    label="Quest Reminders"
                    icon="notifications"
                    value={notifications}
                    onValueChange={setNotifications}
                />
            </View>

            <TouchableOpacity style={styles.resetBtn} onPress={() => alert("Data Reset!")}>
                <Text style={styles.resetText}>Reset All Data</Text>
            </TouchableOpacity>

            <Text style={styles.version}>MoneyQuest v2.0.0 (Beta)</Text>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50, paddingHorizontal: 20 },
    header: { flexDirection: 'row', alignItems: 'center', marginBottom: 30 },
    title: { fontSize: 24, fontWeight: 'bold', color: COLORS.text, marginLeft: 20 },
    section: { marginBottom: 30, backgroundColor: 'white', borderRadius: 15, padding: 15 },
    sectionHeader: { fontSize: 14, color: '#999', marginBottom: 15, textTransform: 'uppercase' },
    itemRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
    iconLabel: { flexDirection: 'row', alignItems: 'center' },
    label: { fontSize: 16, color: COLORS.text },
    resetBtn: { marginTop: 20, alignItems: 'center', padding: 15, borderColor: COLORS.error, borderWidth: 1, borderRadius: 15 },
    resetText: { color: COLORS.error, fontWeight: 'bold' },
    version: { marginTop: 40, textAlign: 'center', color: '#ccc' }
});
