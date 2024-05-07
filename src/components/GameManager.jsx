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

  const drawSnake = useCallback(
    (g) => {
      g.clear();
      //canvas border
      g.lineStyle(2, 0x000000, 1);
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
        console.log("collision detected");
        growSnake();
        spawnOrbs();
      }
      return [newHead, ...prevSnake.slice(0, prevSnake.length - 1)];
    });
  };

  const growSnake = () => {
    setSnake((prevSnake) => {
      const tail = prevSnake[prevSnake.length - 1];
      const newTail = { x: tail.x + direction.x, y: tail.y + direction.y };
      return [...prevSnake, newTail];
    });
  };

  useEffect(() => {
    const interval = setInterval(() => {
      handleSnake();
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [direction, orbs]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  return (
    <Stage {...stageProps}>
      <Orbs orbs={orbs} spawnOrbs={spawnOrbs} />
      <Graphics draw={drawSnake} />
    </Stage>
  );
};

export default GameManager;
