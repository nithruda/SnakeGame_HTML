import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

const Levels = ({ navigation }) => {
  const chooseDifficulty = (level) => {
    navigation.navigate('GameScreen', { difficulty: level }); // Pass difficulty
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Difficulty Level</Text>
      <TouchableOpacity style={styles.button} onPress={() => chooseDifficulty('Easy')}>
        <Text style={styles.buttonText}>Easy</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => chooseDifficulty('Medium')}>
        <Text style={styles.buttonText}>Medium</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={() => chooseDifficulty('Hard')}>
        <Text style={styles.buttonText}>Hard</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f4f4f4',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#333',
  },
  button: {
    paddingVertical: 15,
    paddingHorizontal: 30,
    backgroundColor: '#333',
    borderRadius: 8,
    marginVertical: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 5,
  },
  buttonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default Levels;
