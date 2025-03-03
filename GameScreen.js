import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');
const GRID_SIZE = 10; // Smaller grid for better visibility
const CELL_SIZE = Math.min(width, height) / (GRID_SIZE + 2);
const ALPHABETS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

const generateFood = () => ({
  x: Math.floor(Math.random() * GRID_SIZE),
  y: Math.floor(Math.random() * GRID_SIZE),
  letter: ALPHABETS[Math.floor(Math.random() * ALPHABETS.length)],
});

const GameScreen = () => {
  const [snake, setSnake] = useState([{ x: 5, y: 5 }]);
  const [food, setFood] = useState(generateFood());
  const [targetLetter, setTargetLetter] = useState(food.letter);
  const [gameOver, setGameOver] = useState(false);

  useEffect(() => {
    setTargetLetter(food.letter);
  }, [food]);

  const moveSnake = () => {
    if (gameOver) return;
    let newSnake = [...snake];
    let head = { ...newSnake[0] };

    if (head.x < food.x) head.x++;
    else if (head.x > food.x) head.x--;
    else if (head.y < food.y) head.y++;
    else if (head.y > food.y) head.y--;

    // Check collision with itself
    if (newSnake.some(segment => segment.x === head.x && segment.y === head.y)) {
      setGameOver(true);
      return;
    }

    newSnake.unshift(head);

    if (head.x === food.x && head.y === food.y) {
      setFood(generateFood());
    } else {
      newSnake.pop();
    }

    setSnake(newSnake);
  };

  const handleLetterPress = (letter) => {
    if (letter === targetLetter) {
      moveSnake();
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Snake Game</Text>
      {gameOver && <Text style={styles.gameOverText}>Game Over! Restart the app.</Text>}
      <View style={[styles.gameBoard, { width: CELL_SIZE * GRID_SIZE, height: CELL_SIZE * GRID_SIZE }]}>
        {[...Array(GRID_SIZE)].map((_, row) => (
          <View key={row} style={styles.row}>
            {[...Array(GRID_SIZE)].map((_, col) => {
              let isSnake = snake.some(segment => segment.x === col && segment.y === row);
              let isFood = food.x === col && food.y === row;
              return (
                <View key={col} style={[styles.cell, isSnake ? styles.snake : isFood ? styles.food : null, { width: CELL_SIZE, height: CELL_SIZE }]}>
                  {isFood && <Text style={styles.foodText}>{food.letter}</Text>}
                </View>
              );
            })}
          </View>
        ))}
      </View>
      <View style={styles.keyboard}>
        {ALPHABETS.map((letter) => (
          <TouchableOpacity key={letter} style={styles.key} onPress={() => handleLetterPress(letter)}>
            <Text style={styles.keyText}>{letter}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#1e1e2e' },
  title: { fontSize: 24, fontWeight: 'bold', color: 'white', marginBottom: 10 },
  gameOverText: { fontSize: 20, color: 'red', marginBottom: 10 },
  gameBoard: { flexDirection: 'column', borderWidth: 2, borderColor: 'white', backgroundColor: '#222' },
  row: { flexDirection: 'row' },
  cell: { borderWidth: 1, borderColor: '#444', justifyContent: 'center', alignItems: 'center' },
  snake: { backgroundColor: 'green' },
  food: { backgroundColor: 'red' },
  foodText: { color: 'white', fontSize: 18, fontWeight: 'bold' },
  keyboard: { flexWrap: 'wrap', flexDirection: 'row', justifyContent: 'center', marginTop: 20 },
  key: { width: 30, height: 30, margin: 5, backgroundColor: '#555', justifyContent: 'center', alignItems: 'center', borderRadius: 5 },
  keyText: { color: 'white', fontSize: 16, fontWeight: 'bold' },
});

export default GameScreen;
