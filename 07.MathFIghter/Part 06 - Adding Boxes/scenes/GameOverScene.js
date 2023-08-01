import Phaser from "phaser";

export default class GameOverScene extends Phaser.Scene {
  constructor() {
    super("game-over-scene");
  }
  init(data) {
    this.score = data.score;
  }
  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("game-over-text", "images/gameover.png");
    this.load.image("replay-button", "images/replay.png");
  }
  create() {
    this.add.image(200, 320, "background");
    this.add.image(200, 200, "game-over-text");

    this.replayButton = this.add
      .image(200, 530, "replay-button")
      .setInteractive();

    this.replayButton.once(
      "pointerup",
      () => {
        this.scene.start("math-fighter-scene");
      },
      this
    );
    this.add.text(80, 300, "SCORE:", { fontSize: "60px", color: "#000" });
    this.add.text(300, 300, this.score, { fontSize: "60px", color: "#000" });
  }
}
