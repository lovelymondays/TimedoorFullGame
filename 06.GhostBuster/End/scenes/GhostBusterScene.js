import Phaser from 'phaser'
import Ghost from '../ui/Ghost'
import Bomb from '../ui/Bomb'


export default class GhostBusterScene extends Phaser.Scene
{
    constructor()
    {
        super('ghost-buster-scene')
    }

    init()
    {
        this.gameHalfWidth = this.scale.width * 0.5
        this.gameHalfHeight = this.scale.height * 0.5
        this.bomb = undefined
        this.ghost = undefined
        this.player = undefined
        this.cursor = undefined
        this.lastFired = 0
        this.score = 0
    }

    preload()
    {
        this.load.image('background','images/background.png')
        this.load.image('ground', 'images/ground.png')

        this.load.image('bomb','images/bomb.png')
        this.load.image('ghost', 'images/ghost.png')
        this.load.spritesheet('player', 'images/player.png',
            { frameWidth: 32, frameHeight: 32})
    }

    create()
    {
        this.add.image(this.gameHalfWidth, this.gameHalfHeight, 'background')

        const ground = this.physics.add.staticImage(this.gameHalfWidth, this.scale.height - 34, 'ground').setOffset(0,35)
        
        this.bomb = this.physics.add.group({
            classType: Bomb,
            runChildUpdate: true})

        this.ghost = this.physics.add.group({
            classType: Ghost,
            maxSize : 10,
            runChildUpdate : true
        })

        this.player = this.physics.add.sprite(this.gameHalfWidth, this.scale.height - 200, 'player').setCollideWorldBounds(true).setBounce(0.2)
        
        this.physics.add.collider(this.player, ground)

        this.cursor = this.input.keyboard.createCursorKeys()

        this.time.addEvent({
            delay: 1000,
            callback: this.spawnEnemy,
            callbackScope: this,
            loop: true
        })

        const style = {color: '#FFFFFF', fontSize:24 }
        this.scoreText = this.add.text(this.gameHalfWidth + 150, 10, 'Score: 0', style)
            .setScrollFactor(0)
            .setOrigin(0.5,0)

        // this.score = 0
        this.physics.add.overlap(
            this.ghost, 
            this.bomb, 
            this.hitGhost, 
            undefined, 
            this )
    }

    update(time)
    {
        this.movePlayer(this.player, time)
        
    }

    movePlayer(player, time) {
        this.createAnimation() 
        if(this.cursor.left.isDown){
            this.player.setVelocityX(-200)
            this.player.anims.play('left', true)
        } else if(this.cursor.right.isDown){
            this.player.setVelocityX(200)
            this.player.anims.play('right', true)
        } else { 
            this.player.setVelocityX(0)
            this.player.anims.play('stand-by', true)
        }

        if(this.cursor.space.isDown && time > this.lastFired){
            const bomb = this.bomb.get(0, 0, 'bomb')
            if(bomb) {
              bomb.fire(this.player.x, this.player.y)
              this.lastFired = time + 150
            }
        }
    }

    spawnEnemy()
    {
        const config = {
            speed : 30,
            rotation : 0
        }

        const ghost = this.ghost.get(0, 0, 'ghost', config)
        const ghostWidth  = ghost.displayWidth
        const positionX = Phaser.Math.Between(ghostWidth, this.scale.width - ghostWidth)

        if(ghost) {
            ghost.spawn(positionX)
        }

    }

    hitGhost(ghost, bomb)
    {
        ghost.die()
        bomb.erase()

        this.score++
        // const value = 
        this.scoreText.text = `Score: ${this.score}`

    }

    createAnimation()
    {
        this.anims.create({
            key: 'left',
            frames: this.anims.generateFrameNumbers('player', { start: 3, end: 5 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'right',
            frames: this.anims.generateFrameNumbers('player', { start: 6, end: 8 }),
            frameRate: 10,
            repeat: -1
        })

        this.anims.create({
            key: 'stand-by',
            frames:  [ { key: 'player', frame: 0 } ],
            frameRate: 10,
            repeat: -1
        })

    }
    

}