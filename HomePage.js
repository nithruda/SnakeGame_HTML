import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Animated } from "react-native";

const HomePage = ({ navigation }) => {
    return (
        <Animated.View style={styles.container}> 
            <TouchableOpacity 
                style={styles.playButton} 
                onPress={() => navigation.navigate('Levels')}
            >
                <Text style={styles.playButtonText}>Play</Text>
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#f4f4f4",
    },
    playButton: {
        paddingVertical: 15,
        paddingHorizontal: 35,
        backgroundColor: "#333333",
        borderRadius: 8,
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 6 },
        shadowOpacity: 0.1,
        shadowRadius: 12,
        elevation: 5,
    },
    playButtonText: {
        fontSize: 22,
        fontWeight: "bold",
        color: "#ffffff",
        textAlign: "center",
    },
});

export default HomePage;