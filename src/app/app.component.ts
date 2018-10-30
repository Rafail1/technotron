import { Component } from '@angular/core';

import { environment } from '../environments/environment';

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
    /**
     * Game configuration.
     */
    public readonly gameConfig: GameConfig = {
        title: environment.title,
        version: environment.version,
        type: Phaser.CANVAS,
        width: 800,
        height: 600,
        physics: {
            default: 'arcade',
            arcade: {
                gravity: { y: 300 },
                debug: false
            }
        },
        scene: {
            preload: function () {
                this.load.image('sky', 'assets/sky.png');
                this.load.image('ground', 'assets/platform.png');
                this.load.image('star', 'assets/star.png');
                this.load.image('bomb', 'assets/bomb.png');
                this.load.spritesheet('dude',
                    'assets/dude.png',
                    { frameWidth: 32, frameHeight: 48 }
                );
            },
            create: function () {
                this.add.image(400, 300, 'sky');
                const platforms = this.physics.add.staticGroup();

                platforms.create(400, 568, 'ground').setScale(2).refreshBody();

                platforms.create(600, 400, 'ground');
                platforms.create(50, 250, 'ground');
                platforms.create(750, 220, 'ground');
                const player = this.physics.add.sprite(100, 450, 'dude');

                player.setBounce(0.2);
                player.setCollideWorldBounds(true);

                this.anims.create({
                    key: 'left',
                    frames: this.anims.generateFrameNumbers('dude', { start: 0, end: 3 }),
                    frameRate: 10,
                    repeat: -1
                });

                this.anims.create({
                    key: 'turn',
                    frames: [ { key: 'dude', frame: 4 } ],
                    frameRate: 20
                });

                this.anims.create({
                    key: 'right',
                    frames: this.anims.generateFrameNumbers('dude', { start: 5, end: 8 }),
                    frameRate: 10,
                    repeat: -1
                });
                this.physics.add.collider(player, platforms);
                const cursors = this.input.keyboard.createCursorKeys();
                if (cursors.left.isDown) {
                    player.setVelocityX(-160);
                    player.anims.play('left', true);
                } else if (cursors.right.isDown) {
                    player.setVelocityX(160);

                    player.anims.play('right', true);
                } else {
                    player.setVelocityX(0);

                    player.anims.play('turn');
                }

                if (cursors.up.isDown && player.body.touching.down) {
                    player.setVelocityY(-330);
                }
                const stars = this.physics.add.group({
                    key: 'star',
                    repeat: 11,
                    setXY: { x: 12, y: 0, stepX: 70 }
                });

                stars.children.iterate(function (child) {

                    child.setBounceY(Phaser.Math.FloatBetween(0.4, 0.8));

                });
                this.physics.add.collider(stars, platforms);
                this.physics.add.overlap(player, stars, function  (p, star) {
                    star.disableBody(true, true);
                }, null, this);
            },
            update: this.update
        }
    };

    /**
     * Game ready event handler.
     *
     * @param game Game instance.
     */
    public onGameReady(game: Phaser.Game): void {
        this.game = game;
    }

    preload() {

    }

    create() {
    }

    update() {
    }
}
