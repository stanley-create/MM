import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import AnalysisScreen from './AnalysisScreen';
import AdventureScreen from './AdventureScreen';

const PlaceholderScreen = ({ name }) => (
    <View style={styles.container}>
        <Text style={styles.text}>{name} Screen</Text>
        <Text style={styles.subText}>冒險者，此區域正在開發中...</Text>
    </View>
);

export { AdventureScreen, AnalysisScreen };
export const TaskScreen = () => <PlaceholderScreen name="Tasks" />;
export const GuildScreen = () => <PlaceholderScreen name="Guild" />;
export const SettingsScreen = () => <PlaceholderScreen name="Settings" />;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#fff',
    },
    text: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    subText: {
        fontSize: 14,
        color: '#888',
        marginTop: 10,
    },
});
