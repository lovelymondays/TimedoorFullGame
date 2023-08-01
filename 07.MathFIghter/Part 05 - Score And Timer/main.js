// import framework dari folder phaser
import Phaser from "phaser";

import MathFighterScene from "./scenes/MathFighterScene";

const config = {
  type: Phaser.AUTO,
  width: 480, //atur lebar
  height: 640, //atur tinggi
  physics: {
    default: "arcade", // library Arcade Phaser
    arcade: {
      gravity: { y: 200 }, //atur gravitasi
    },
  },
  scene: [MathFighterScene, GameOverScene], //atur scene
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
export default new Phaser.Game(config);
