import React, { useCallback, useEffect } from "react";
import { Graphics } from "@pixi/react";

const Orbs = ({ orbs, spawnOrbs }) => {

  const drawOrbs = useCallback(
    (g) => {
      g.clear();
      //orbs
      g.lineStyle(0);
      g.beginFill(0x000000, 1);
      g.drawCircle(orbs.x, orbs.y, 3);
      g.endFill();
    },
    [orbs]
  );

  useEffect(() => {
    spawnOrbs();
  }, []);

  return <Graphics draw={drawOrbs} />;
};

export default Orbs;
