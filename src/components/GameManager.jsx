import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Graphics } from "@pixi/react";
import Orbs from "./Orbs";

const GameManager = () => {
  const snakeLength = 5;
  const width = 600;
  const height = 300;
  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: 0xffe4c4,
    },
  };

  const initialSnake = Array(snakeLength).fill({ x: 300, y: 150 });
  const [snake, setSnake] = useState(initialSnake);
  const [direction, setDirection] = useState({ x: 0, y: 0 });
  const [orbs, setOrbs] = useState({ x: 550, y: 250 });
  const [score, setScore] = useState(0);
  const [enableCollisions, setCollisions] = useState(false);
  const [counter, setCounter] = useState(0);
  const [snakeSpeed, setSnakeSpeed] = useState(100);
  const [lastScoreUpdated, setLastScoreUpdated] = useState(0);

  const drawSnake = useCallback(
    (g) => {
      g.clear();
      //canvas border
      g.lineStyle(10, 0x000000);
      g.drawRect(0, 0, width, height);
      g.endFill();

      //snake
      g.lineStyle(0);
      g.beginFill(0xff700b);
      snake.forEach((rect) => {
        g.drawRect(rect.x, rect.y, 15, 15);
      });
      g.endFill();
    },
    [snake]
  );

  //movement
  const handleKeyDown = (e) => {
    let newDirection = { ...direction };

    switch (e.key) {
      case "ArrowUp":
        if (direction.y !== 10) {
          newDirection = { x: 0, y: -10 };
        }
        break;
      case "ArrowDown":
        if (direction.y !== -10) {
          newDirection = { x: 0, y: 10 };
        }
        break;
      case "ArrowLeft":
        if (direction.x !== 10) {
          newDirection = { x: -10, y: 0 };
        }
        break;
      case "ArrowRight":
        if (direction.x !== -10) {
          newDirection = { x: 10, y: 0 };
        }
        break;
      default:
        break;
    }
    setDirection(newDirection);
  };

  const collisionDetection = (snake, orb) => {
    const head = snake[0];
    const snakeRadius = 15 / 2;
    const orbRadius = 5;

    const dx = head.x + snakeRadius - orb.x;
    const dy = head.y + snakeRadius - orb.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    return distance <= snakeRadius + orbRadius;
  };

  const collisionDetectionEdges = (snake) => {
    const head = snake[0];
    if (
      head.x > width - 15 ||
      head.y > height - 15 ||
      head.x < 0 ||
      head.y < 0
    ) {
      return true;
    }
    return false;
  };

  const collisionDetectionSnake = (snake) => {
    const head = snake[0];
    for (let i = 1; i < snake.length; i++) {
      if (head.x === snake[i].x && head.y === snake[i].y && enableCollisions) {
        return true;
      }
    }
    return false;
  };

  const spawnOrbs = () => {
    setOrbs((prevOrb) => {
      const minX = 5;
      const maxX = 545;
      const minY = 5;
      const maxY = 245;
      const randX = Math.floor(minX + Math.random() * (maxX - minX));
      const randY = Math.floor(minY + Math.random() * (maxY - minY));
      return { ...prevOrb, x: randX, y: randY };
    });
  };

  const handleSnake = () => {
    setSnake((prevSnake) => {
      const head = prevSnake[0];
      const newHead = { x: head.x + direction.x, y: head.y + direction.y };
      //check for collision
      if (collisionDetection([newHead], orbs)) {
        increaseScore(score);
        growSnake();
        spawnOrbs();
      }
      return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
    });
  };

  const gameOver = () => {
    if (collisionDetectionEdges(snake) || collisionDetectionSnake(snake)) {
      setSnake(initialSnake);
      setDirection({ x: 0, y: 0 });
      setScore(0);
      setCollisions(false);
      setSnakeSpeed(100);
    }
  };

  const increaseScore = (currentScore) => {
    setScore(++currentScore);
  };

  const checkCounter = () => {
    setCounter((counter) => counter + 1);
    if (counter > 3) {
      setCollisions(true);
    }
  };

  const growSnake = () => {
    setSnake((prevSnake) => {
      const tail = prevSnake[prevSnake.length - 1];
      const newTail = { x: tail.x + direction.x, y: tail.y + direction.y };
      return [...prevSnake, newTail];
    });
  };

  const progressiveDifficultly = () => {
    if (
      score % 3 === 0 &&
      score !== 0 &&
      score !== lastScoreUpdated &&
      snakeSpeed >= 30
    ) {
      setSnakeSpeed((snakeSpeed) => snakeSpeed - 5);
      setLastScoreUpdated(score);
    }
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSnake();
      progressiveDifficultly();
      gameOver();
    }, snakeSpeed);

    return () => {
      clearInterval(interval);
    };
  }, [direction, orbs, snake, score]);

  useEffect(() => {
    const interval = setInterval(() => {
      checkCounter();
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, [counter]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <div className="stage">
      <Stage {...stageProps}>
        <Orbs orbs={orbs} spawnOrbs={spawnOrbs} />
        <Graphics draw={drawSnake} />
      </Stage>
      <p className="scoreText">SCORE: {score}</p>
    </div>
  );
};

export default GameManager;
