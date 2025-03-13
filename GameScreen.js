import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, Text, View, StatusBar, TouchableOpacity, Dimensions } from "react-native";
import { GameEngine } from "react-native-game-engine";
import Constants from "./Constants";
import GameLoop from "./GameLoop";
import Food from "./Components/Food";
import Head from "./Components/Head";
import Tail from "./Components/Tail";
import Levels from "./Levels"; // Import Levels component

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';

const getRandomPositionWithinBounds = () => {
  const x = Math.floor(Math.random() * Constants.GRID_SIZE);
  const y = Math.floor(Math.random() * Constants.GRID_SIZE);
  return [x, y];
};

export default function GameScreen() {
  const engine = useRef(null);
  const [isGameRunning, setIsGameRunning] = useState(false);
  const [isGameStarted, setIsGameStarted] = useState(false);
  const [currentFood, setCurrentFood] = useState(alphabet[Math.floor(Math.random() * alphabet.length)]);
  const [score, setScore] = useState(0);
  const [wrong, setWrong] = useState(0);
  const [tail, setTail] = useState([]);
  const [difficulty, setDifficulty] = useState(null);
  const [isGameOver, setIsGameOver] = useState(false);

  useEffect(() => {
    if (difficulty) {
      startGame(difficulty); // Start game once difficulty is selected
    }
  }, [difficulty]);

  const startGame = (level) => {
    setIsGameStarted(true);
    setIsGameRunning(true);
    setDifficulty(level);
    resetGame(level);
  };

  const resetGame = (level) => {
    setScore(0);
    setWrong(0);
    setTail([]);
    setIsGameOver(false);
    setIsGameRunning(true);

    const newFood = alphabet[Math.floor(Math.random() * alphabet.length)];
    setCurrentFood(newFood);
    const newFoodPosition = getRandomPositionWithinBounds();
    const headStartPosition = getRandomPositionWithinBounds();

    if (engine.current) {
      engine.current.swap({
        head: {
          position: headStartPosition,
          size: Constants.CELL_SIZE,
          updateFrequency: getSnakeSpeed(level),
          nextMove: getSnakeSpeed(level),
          xspeed: 7,
          yspeed: 0,
          moving: false,
          currentFood: newFood,
          renderer: <Head />,
        },
        food: {
          position: newFoodPosition,
          size: Constants.CELL_SIZE,
          currentFood: newFood,
          renderer: <Food />,
        },
        tail: {
          size: Constants.CELL_SIZE,
          elements: tail,
          renderer: <Tail />,
        },
      });
      engine.current.dispatch({ type: "reset-food", position: newFoodPosition, newFood });
    }
  };

  const getSnakeSpeed = (level) => {
    switch (level) {
      case "Easy":
        return 40;
      case "Medium":
        return 25;
      case "Hard":
        return 10;
      default:
        return 30;
    }
  };

  const handleGameEvent = (event) => {
    if (event.type === "game-over") {
      setIsGameRunning(false);
      setIsGameOver(true);
    }
  };

  const boardSize = width * 0.6;

  // ✅ Show Levels screen if game hasn't started
  if (!isGameStarted) {
    return <Levels onSelectDifficulty={setDifficulty} />;
  }

  return (
    <View style={styles.container}>
      <StatusBar hidden={true} />
      {!isGameOver && (
        <>
          <View style={styles.scoreContainer}>
            <Text style={styles.scoreText}>Score: {score}</Text>
            <Text style={styles.scoreText}>Wrong: {wrong}</Text>
          </View>
          <View style={styles.gameArea}>
            <GameEngine
              ref={engine}
              style={[styles.board, { width: boardSize, height: boardSize }]}
              entities={{
                head: {
                  position: [0, 0],
                  size: Constants.CELL_SIZE,
                  updateFrequency: getSnakeSpeed(difficulty),
                  nextMove: getSnakeSpeed(difficulty),
                  xspeed: 0,
                  yspeed: 0,
                  moving: false,
                  currentFood: currentFood,
                  renderer: <Head />,
                },
                food: {
                  position: getRandomPositionWithinBounds(),
                  size: Constants.CELL_SIZE,
                  currentFood: currentFood,
                  renderer: <Food />,
                },
                tail: {
                  size: Constants.CELL_SIZE,
                  elements: tail,
                  renderer: <Tail />,
                },
              }}
              systems={[GameLoop]}
              running={isGameRunning}
              onEvent={handleGameEvent}
            />
          </View>
        </>
      )}
      {isGameOver && (
        <View style={styles.restartContainer}>
          <Text style={styles.gameover}>Game Over!</Text>
          <TouchableOpacity style={styles.restartButton} onPress={() => resetGame(difficulty)}>
            <Text style={styles.restartButtonText}>Restart Game</Text>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
}

const { width, height } = Dimensions.get("window");

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f6e0b5",
  },
  scoreContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#721c24",
  },
  gameArea: {
    alignItems: "center",
  },
  restartContainer: {
    justifyContent: "center",
    alignItems: "center",
  },
  gameover: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#d9534f",
    marginBottom: 10,
  },
  restartButton: {
    backgroundColor: "#5cb85c",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
  restartButtonText: {
    color: "#fff",
    fontSize: 18,
    fontWeight: "bold",
  },
});

