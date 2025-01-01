import React from "react";

import { Layout } from "@/components";
import { GameScene } from "@/scenes";

type Props = {};

const Game = (props: Props) => {
  return (
    <Layout>
      <GameScene />
    </Layout>
  );
};

export default Game;
