import React from "react";
import { Dimensions } from "react-native";
import Constants from "./Constants";

// Get screen dimensions
const { width, height } = Dimensions.get("screen");

const GRID_SIZE = 20; // Number of grid cells (not pixel size)
Constants.GRID_SIZE = GRID_SIZE;

// Function to get random position near the center within grid boundaries
const getRandomPositionNearCenter = () => {
  const centerBuffer = 2;
  const centerX = Math.floor(GRID_SIZE / 2);
  const centerY = Math.floor(GRID_SIZE / 2);

  const minX = Math.max(centerX - centerBuffer, 0);
  const maxX = Math.min(centerX + centerBuffer, GRID_SIZE - 1);
  const minY = Math.max(centerY - centerBuffer, 0);
  const maxY = Math.min(centerY + centerBuffer, GRID_SIZE - 1);

  const x = Math.floor(Math.random() * (maxX - minX + 1)) + minX;
  const y = Math.floor(Math.random() * (maxY - minY + 1)) + minY;

  return [x, y];
};

const getRandomLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters.charAt(Math.floor(Math.random() * letters.length));
};

const setRandomDirection = (head) => {
  const directions = [
    { xspeed: 1, yspeed: 0 },
    { xspeed: -1, yspeed: 0 },
    { xspeed: 0, yspeed: 1 },
    { xspeed: 0, yspeed: -1 },
  ];

  const randomDirection = directions[Math.floor(Math.random() * directions.length)];
  head.xspeed = randomDirection.xspeed;
  head.yspeed = randomDirection.yspeed;
};

const GameLoop = (entities, { events, dispatch }) => {
  const { head, food, tail } = entities;

  if (!food) {
    console.error("Food entity is undefined");
    return entities;
  }

  let gameOver = false;

  if (events.length) {
    events.forEach((event) => {
      switch (event.type) {
        case "reset-food":
          food.position = getRandomPositionNearCenter();
          food.letter = getRandomLetter();
          break;
        case "move-snake-to-food":
          head.movingTowardsFood = true;
          break;
        case "move-snake-randomly":
          head.movingTowardsFood = false;
          setRandomDirection(head);
          break;
        case "game-over":
          gameOver = true;
          dispatch({ type: "game-over" });
          break;
        case "restart":
          head.position = [Math.floor(GRID_SIZE / 2), Math.floor(GRID_SIZE / 2)];
          head.xspeed = 0;
          head.yspeed = 0;
          head.nextMove = head.updateFrequency;
          head.movingTowardsFood = false;
          head.letter = "";

          tail.elements = [];

          food.position = getRandomPositionNearCenter();
          food.letter = getRandomLetter();

          dispatch({ type: "game-restart" });
          break;
        default:
          break;
      }
    });
  }

  if (!gameOver) {
    if (head.movingTowardsFood) {
      const xDiff = food.position[0] - head.position[0];
      const yDiff = food.position[1] - head.position[1];

      if (Math.abs(xDiff) >= Math.abs(yDiff)) {
        head.xspeed = xDiff > 0 ? 1 : xDiff < 0 ? -1 : 0;
        head.yspeed = 0;
      } else {
        head.xspeed = 0;
        head.yspeed = yDiff > 0 ? 1 : yDiff < 0 ? -1 : 0;
      }
    }

    head.nextMove -= 1;
    if (head.nextMove <= 0) {
      head.nextMove = head.updateFrequency;

      const prevPosition = [...head.position];
      const newXPosition = head.position[0] + head.xspeed;
      const newYPosition = head.position[1] + head.yspeed;

      // ✅ Handle Wall Collision
      if (newXPosition < 0 || newXPosition >= GRID_SIZE || newYPosition < 0 || newYPosition >= GRID_SIZE) {
        console.log(`Game over: Snake hit the wall at (${newXPosition}, ${newYPosition})`);
        gameOver = true;
        dispatch({ type: "game-over" });
      } else {
        head.position[0] = newXPosition;
        head.position[1] = newYPosition;

        // ✅ Handle Food Collision
        if (head.position[0] === food.position[0] && head.position[1] === food.position[1]) {
          console.log("Food eaten");

          // Add the current food's letter to the head
          head.letter = food.letter;

          // ✅ Add to tail correctly
          tail.elements.unshift([...prevPosition, food.letter]);

          dispatch({ type: "food-eaten" });

          // ✅ Set new food position and letter
          food.position = getRandomPositionNearCenter();
          food.letter = getRandomLetter();

          head.movingTowardsFood = false;
        } else {
          // ✅ Update Tail Position
          if (tail.elements.length > 0) {
            tail.elements.unshift([...prevPosition, tail.elements[0][2]]);
            tail.elements.pop();
          }

          // ✅ Handle Self-Collision
          const selfCollision = tail.elements.some(
            (segment) => segment[0] === newXPosition && segment[1] === newYPosition
          );
          if (selfCollision) {
            console.log("Snake collided with itself");
            gameOver = true;
            dispatch({ type: "game-over" });
          }
        }
      }
    }
  }

  return entities;
};

export default GameLoop;
