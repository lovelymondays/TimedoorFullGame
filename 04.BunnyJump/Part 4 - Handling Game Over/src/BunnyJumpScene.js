import Phaser from "phaser";
import Carrot from "../game/Carrot";

var platforms;
var player;
var cursors;
var carrots;
var carrotsCollected;
var replayButton;

export default class BunnyJumpScene extends Phaser.Scene {
  constructor() {
    super("bunny-jump-scene");
  }
  preload() {
    this.load.image("background", "images/bg_layer1.png");
    this.load.image("platform", "images/ground_grass.png");
    this.load.image("carrot", "images/carrot.png");
    this.load.image("bunny_jump", "images/bunny1_jump.png");
    this.load.image("bunny_stand", "images/bunny1_stand.png");
    this.load.audio("jumpSound", "sfx/phaseJump1.ogg");
  }
  create() {
    this.add.image(240, 320, "background").setScrollFactor(1, 0);
    // this.add.image(240, 320, "platform");
    this.platforms = this.physics.add.staticGroup();

    for (let i = 0; i < 5; i++) {
      // mengulangi 5 kali
      // x bernilai random dari 80-400
      const x = Phaser.Math.Between(80, 400);
      const y = 150 * i; // platform akan berjarak 150 px
      // membuat platform
      const platformChild = this.platforms.create(x, y, "platform");
      platformChild.setScale(0.5); //mengecilkan platform
      platformChild.refreshBody(); //merefresh platform.
      const body = platformChild.body;
      body.updateFromGameObject();
    }

    this.player = this.physics.add
      .sprite(240, 320, "bunny_stand")
      .setScale(0.5);

    this.physics.add.collider(this.player, this.platforms);

    this.player.body.checkCollision.up = false;
    this.player.body.checkCollision.left = false;
    this.player.body.checkCollision.right = false;

    // membuat camera mengikuti player
    this.cameras.main.startFollow(this.player);

    this.cursors = this.input.keyboard.createCursorKeys();

    // atur dead zone dengan nilai lebar layout dikalikan 1.5
    this.cameras.main.setDeadzone(this.scale.width * 1.5);

    this.carrots = this.physics.add.group({
      classType: Carrot,
    });

    this.physics.add.collider(this.platforms, this.carrots);

    this.physics.add.overlap(
      this.player,
      this.carrots,
      this.handleCollectCarrot,
      undefined,
      this
    );

    this.carrotsCollected = 0;

    const style = { color: "#000", fontSize: 24 };
    //tambahkan seperti di bawah ini
    this.carrotsCollectedText = this.add
      .text(240, 10, "Carrots: 0", style)
      .setScrollFactor(0)
      .setOrigin(0.5, 0);
  }

  update() {
    // variable lokal untuk memastikan player menyentuh bawah
    const touchingDown = this.player.body.touching.down;

    //kondisi jika player menyentuh bawah
    if (touchingDown) {
      //maka player akan meloncat dengan percepatan -300
      this.player.setVelocityY(-300); // -300 karena keatas
      //dan berubah animasi menjadi melompat
      this.player.setTexture("bunny_jump");

      this.sound.play("jumpSound");
    }

    //mencari percepatan player
    const vy = this.player.body.velocity.y;
    //jika percepatan lebih dari 0 dan animasi player bukan stand/berdiri
    if (vy > 0 && this.player.texture.key !== "bunny_stand") {
      // buat animasi player berdiri/stand
      this.player.setTexture("bunny_stand");
    }

    if (this.cursors.left.isDown && !touchingDown) {
      this.player.setVelocityX(-200);
    } else if (this.cursors.right.isDown && !touchingDown) {
      this.player.setVelocityX(200);
    } else {
      this.player.setVelocityX(0);
    }

    this.platforms.children.iterate((child) => {
      const platformChild = child;

      const scrollY = this.cameras.main.scrollY;
      if (platformChild.y >= scrollY + 700) {
        platformChild.y = scrollY - Phaser.Math.Between(50, 100);
        platformChild.body.updateFromGameObject();

        //panggil disini
        this.addCarrotAbove(platformChild);
      }
    });

    this.horizontalWrap(this.player);

    const bottomPlatform = this.findBottomMostPlatform();
    if (this.player.y > bottomPlatform.y + 200) {
      this.scene.start("game-over-scene");
    }
  }
  // buat method dengan parameter sprite
  horizontalWrap(sprite) {
    const halfWidth = sprite.displayWidth * 0.5;
    const gameWidth = this.scale.width;
    if (sprite.x < -halfWidth) {
      sprite.x = gameWidth + halfWidth;
    } else if (sprite.x > gameWidth + halfWidth) {
      sprite.x = -halfWidth;
    }
  }

  addCarrotAbove(sprite) {
    const y = sprite.y - sprite.displayHeight;
    const carrot = this.carrots.get(sprite.x, y, "carrot");
    // menambahkan fisik dari carrot.
    this.add.existing(carrot);
    carrot.body.setSize(carrot.width, carrot.height);

    //tambahkan 2 baris kode ini
    carrot.setActive(true); //mengaktifkan carrot
    carrot.setVisible(true); //menampilkan carrot

    //tambahkan kode di bawah ini
    this.physics.world.enable(carrot);

    return carrot;
  }

  handleCollectCarrot(player, carrot) {
    this.carrots.killAndHide(carrot);
    this.physics.world.disableBody(carrot.body);

    this.carrotsCollected++;

    const value = `Carrots: ${this.carrotsCollected}`;
    this.carrotsCollectedText.text = value;
  }

  findBottomMostPlatform() {
    //panggil children dari platforms global
    const platforms = this.platforms.getChildren();
    //ambil item pertama dari array platforms lokal
    let bottomPlatform = platforms[0];

    for (let i = 1; i < platforms.length; i++) {
      const platform = platforms[i];

      // tambahkan kondisi ini
      if (platform.y < bottomPlatform.y) {
        continue;
      }
      bottomPlatform = platform;
    }

    return bottomPlatform;
  }
}
