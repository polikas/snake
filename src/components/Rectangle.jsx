import React, { useCallback } from "react";
import { Stage, Graphics } from "@pixi/react";

const Rectangle = () => {
  const draw = useCallback((g) => {
    g.clear();
    g.lineStyle(2, 0x0000ff, 1);
    g.beginFill(0xff700b, 1);
    g.drawRect(200, 150, 15, 15);
    g.lineStyle(2, 0xff00ff, 1);
  }, []);

  return (
    <Stage width={600} height={300} options={{ backgroundColor: 0xffffff }}>
      <Graphics draw={draw} />
    </Stage>
  );
};

export default Rectangle;
