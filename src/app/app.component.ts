import {Component} from '@angular/core';

import {environment} from '../environments/environment';

/**
 * Application component.
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {
    /**
     * Game instance.
     */
    public game: Phaser.Game;
    private cursors;
    private player;
    /**
     * Game configuration.
     */
    public readonly gameConfig: GameConfig;

    constructor() {
        const app = this;
        this.gameConfig = {
            title: environment.title,
            version: environment.version,
            type: Phaser.CANVAS,
            width: 800,
            height: 600,
            physics: {
                default: 'arcade',
                arcade: {
                    gravity: {y: 300},
                    debug: false
                }
            },
            scene: {
                preload: function () {app.preload(this); },
                create:  function () {app.create(this); },
                update:  function () {app.update(this); },
            }
        };
    }

    /**
     * Game ready event handler.
     *
     * @param game Game instance.
     */
    public onGameReady(game: Phaser.Game): void {
        this.game = game;
    }

    preload(gameCtx) {
        gameCtx.load.image('sky', 'assets/sky.png');
        gameCtx.load.image('ground', 'assets/platform.png');
        gameCtx.load.image('star', 'assets/star.png');
        gameCtx.load.image('bomb', 'assets/bomb.png');
        gameCtx.load.spritesheet('dude',
            'assets/dude.png',
            {frameWidth: 32, frameHeight: 48}
        );
    }

    create(gameCtx) {
        gameCtx.add.image(400, 300, 'sky');
        const platforms = gameCtx.physics.add.staticGroup();

        platforms.create(400, 568, 'ground').setScale(2).refreshBody();

        platforms.create(600, 400, 'ground');
        platforms.create(50, 250, 'ground');
        platforms.create(750, 220, 'ground');
        this.player = gameCtx.physics.add.sprite(100, 450, 'dude');
        this.player.setBounce(0.2);
        this.player.setCollideWorldBounds(true);
        gameCtx.anims.create({
            key: 'left',
            frames: gameCtx.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
            frameRate: 10,
            repeat: -1
        });

        gameCtx.anims.create({
            key: 'turn',
            frames: [ { key: 'dude', frame: 4 } ],
            frameRate: 20
        });

        gameCtx.anims.create({
            key: 'right',
            frames: gameCtx.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
            frameRate: 10,
            repeat: -1
        });
        gameCtx.physics.add.collider(this.player, platforms);
        this.cursors = gameCtx.input.keyboard.createCursorKeys();
        const stars = gameCtx.physics.add.group({
            key: 'star',
            repeat: 11,
            setXY: { x: 12, y: 0, stepX: 70 }
        });
        stars.children.iterate(function (child) {
            child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));
        });
        gameCtx.physics.add.collider(stars, platforms);
        gameCtx.physics.add.overlap(this.player, stars, function  (p, star) {
            star.disableBody(true, true);
        }, null, this);
    }

    update(gameCtx) {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
            this.player.anims.play('left', true);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
            this.player.anims.play('right', true);
        } else {
            this.player.setVelocityX(0);
            this.player.anims.play('turn');
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }
    }
}
