import Phaser from "phaser";

var platforms;
var player;
var cursors;

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
      }
    });

    this.horizontalWrap(this.player);
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
}
