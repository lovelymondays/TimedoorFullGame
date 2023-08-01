// import framework dari folder phaser
import Phaser from "phaser";

import GameScene from "./scenes/MathFighterScene"; //import kelas GameScene

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
  scene: [GameScene], //atur scene
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
};
export default new Phaser.Game(config);
