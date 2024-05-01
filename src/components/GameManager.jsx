import React, { useCallback, useEffect, useRef, useState } from "react";
import { Stage, Graphics } from "@pixi/react";

const GameManager = () => {
  const width = 600;
  const height = 300;
  const stageProps = {
    height,
    width,
    options: {
      backgroundColor: 0xffe4c4,
    },
  };

  const [position, setPosition] = useState({ x: 300, y: 150 });
  const [direction, setDirection] = useState({ x: 0, y: 0 });

  //movement
  const handleKeyDown = (e) => {
    let newDirection = { ...direction };
    switch (e.key) {
      case "ArrowUp":
        newDirection = { x: 0, y: -10 };
        break;
      case "ArrowDown":
        newDirection = { x: 0, y: 10 };
        break;
      case "ArrowLeft":
        newDirection = { x: -10, y: 0 };
        break;
      case "ArrowRight":
        newDirection = { x: 10, y: 0 };
        break;
      default:
        break;
    }
    setDirection(newDirection);
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setPosition((prevPosition) => ({
        x: prevPosition.x + direction.x,
        y: prevPosition.y + direction.y,
      }));
    }, 100);

    return () => {
      clearInterval(interval);
    };
  }, [direction]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [handleKeyDown]);

  const draw = useCallback(
    (g) => {
      g.clear();
      //canvas border
      g.lineStyle(2, 0x000000, 1);
      g.drawRect(0, 0, width, height);

      //snake
      g.beginFill(0xff700b, 1);
      g.drawRect(position.x, position.y, 15, 15);
      g.lineStyle(2, 0xff00ff, 1);
    },
    [position]
  );

  return (
    <Stage {...stageProps}>
      <Graphics draw={draw} />
    </Stage>
  );
};

export default GameManager;
