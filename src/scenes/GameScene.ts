import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, LANE } from '../config';

const SCROLL_SPEED = 480; // px / s — feel inicial; iterar
const PLAYER_LERP = 0.22; // suavizado del swipe
const PLAYER_Y = GAME_HEIGHT - 380;

export class GameScene extends Phaser.Scene {
  private lane!: Phaser.GameObjects.TileSprite;
  private sideLeft!: Phaser.GameObjects.TileSprite;
  private sideRight!: Phaser.GameObjects.TileSprite;
  private player!: Phaser.GameObjects.Image;
  private targetX = LANE.centerX;
  private dragging = false;
  private dragOffset = 0;
  private distance = 0;
  private hud!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x0b1d2a);

    const laneWidth = LANE.rightBound - LANE.leftBound;
    this.sideLeft = this.add
      .tileSprite(0, 0, LANE.leftBound, GAME_HEIGHT, 'side-tile')
      .setOrigin(0, 0);
    this.sideRight = this.add
      .tileSprite(LANE.rightBound, 0, GAME_WIDTH - LANE.rightBound, GAME_HEIGHT, 'side-tile')
      .setOrigin(0, 0)
      .setFlipX(true);

    this.lane = this.add
      .tileSprite(LANE.leftBound, 0, laneWidth, GAME_HEIGHT, 'lane-tile')
      .setOrigin(0, 0);

    this.player = this.add.image(LANE.centerX, PLAYER_Y, 'player').setDepth(10);
    this.targetX = LANE.centerX;

    this.setupInput();

    this.hud = this.add
      .text(GAME_WIDTH / 2, 60, 'Distancia: 0 m', {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 4,
      })
      .setOrigin(0.5, 0)
      .setDepth(100);

    this.fpsText = this.add
      .text(20, 20, '', {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: '#a8c5b8',
      })
      .setDepth(100);

    // Botón "volver al menú" minimal para iterar rápido
    const back = this.add
      .text(GAME_WIDTH - 30, 30, '✕', {
        fontFamily: 'sans-serif',
        fontSize: '48px',
        color: '#e8c170',
        backgroundColor: '#00000088',
        padding: { left: 18, right: 18, top: 6, bottom: 10 },
      })
      .setOrigin(1, 0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });
    back.on('pointerup', () => this.scene.start('MainMenuScene'));
  }

  private setupInput(): void {
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.dragOffset = this.player.x - p.x;
    });

    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.dragging) return;
      this.targetX = Phaser.Math.Clamp(
        p.x + this.dragOffset,
        LANE.leftBound + this.player.width / 2,
        LANE.rightBound - this.player.width / 2,
      );
    });

    const stop = () => {
      this.dragging = false;
    };
    this.input.on('pointerup', stop);
    this.input.on('pointerupoutside', stop);
  }

  update(_time: number, delta: number): void {
    const dtSec = delta / 1000;

    const scroll = SCROLL_SPEED * dtSec;
    this.lane.tilePositionY -= scroll;
    this.sideLeft.tilePositionY -= scroll;
    this.sideRight.tilePositionY -= scroll;

    this.player.x = Phaser.Math.Linear(this.player.x, this.targetX, PLAYER_LERP);

    const tiltTarget = Phaser.Math.Clamp((this.targetX - this.player.x) * 0.6, -12, 12);
    this.player.angle = Phaser.Math.Linear(this.player.angle, tiltTarget, 0.15);

    this.distance += (SCROLL_SPEED / 100) * dtSec;
    this.hud.setText(`Distancia: ${Math.floor(this.distance)} m`);

    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
  }
}
