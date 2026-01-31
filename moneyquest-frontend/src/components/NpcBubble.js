import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';
import { COLORS } from '../styles/theme';

const NpcBubble = ({ message, visible, onHide }) => {
    const [fadeAnim] = useState(new Animated.Value(0));

    useEffect(() => {
        if (visible) {
            Animated.sequence([
                Animated.timing(fadeAnim, {
                    toValue: 1,
                    duration: 500,
                    useNativeDriver: true,
                }),
                Animated.delay(3000),
                Animated.timing(fadeAnim, {
                    toValue: 0,
                    duration: 500,
                    useNativeDriver: true,
                }),
            ]).start(() => onHide && onHide());
        }
    }, [visible]);

    if (!visible) return null;

    return (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <View style={styles.bubble}>
                <Text style={styles.npcText}>🦉 NPC: {message}</Text>
            </View>
            <View style={styles.triangle} />
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        padding: 10,
        position: 'absolute',
        bottom: 100,
        alignSelf: 'center',
        width: '80%',
        zIndex: 1000,
    },
    bubble: {
        backgroundColor: COLORS.white,
        padding: 15,
        borderRadius: 20,
        borderWidth: 2,
        borderColor: COLORS.primary,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
    },
    npcText: {
        fontSize: 16,
        color: COLORS.text,
        textAlign: 'center',
        fontWeight: '600',
    },
    triangle: {
        width: 0,
        height: 0,
        backgroundColor: 'transparent',
        borderStyle: 'solid',
        borderLeftWidth: 10,
        borderRightWidth: 10,
        borderTopWidth: 15,
        borderLeftColor: 'transparent',
        borderRightColor: 'transparent',
        borderTopColor: COLORS.primary,
        alignSelf: 'center',
        marginTop: -2,
    },
});

export default NpcBubble;
