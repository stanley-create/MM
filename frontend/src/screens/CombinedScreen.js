import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { COLORS } from '../constants/theme';
import QuestScreen from './QuestScreen';
import CommunityScreen from './CommunityScreen';

export default function CombinedScreen() {
    const [activeTab, setActiveTab] = useState('Quests');

    return (
        <View style={styles.container}>
            <View style={styles.topSwitch}>
                <TouchableOpacity
                    style={[styles.switchBtn, activeTab === 'Quests' && styles.activeSwitch]}
                    onPress={() => setActiveTab('Quests')}
                >
                    <Text style={[styles.switchText, activeTab === 'Quests' && styles.activeText]}>Quests</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    style={[styles.switchBtn, activeTab === 'Guild' && styles.activeSwitch]}
                    onPress={() => setActiveTab('Guild')}
                >
                    <Text style={[styles.switchText, activeTab === 'Guild' && styles.activeText]}>Guild</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.contentArea}>
                {activeTab === 'Quests' ? <QuestScreen /> : <CommunityScreen />}
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: COLORS.background, paddingTop: 50 },
    topSwitch: {
        flexDirection: 'row', marginHorizontal: 20, backgroundColor: 'white',
        borderRadius: 25, padding: 5, marginBottom: 10
    },
    switchBtn: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 20 },
    activeSwitch: { backgroundColor: COLORS.primary },
    switchText: { color: '#999', fontWeight: 'bold' },
    activeText: { color: 'white' },
    contentArea: { flex: 1 }
});
