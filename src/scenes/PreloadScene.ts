import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLORS } from '../config';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.drawLoadingBar();
    this.generatePlaceholderTextures();
  }

  create(): void {
    this.scene.start('MainMenuScene');
  }

  private drawLoadingBar(): void {
    const w = 600;
    const h = 30;
    const x = (GAME_WIDTH - w) / 2;
    const y = GAME_HEIGHT / 2;

    const bg = this.add.rectangle(x, y, w, h, 0x222222).setOrigin(0, 0);
    const fill = this.add.rectangle(x, y, 0, h, 0xe8c170).setOrigin(0, 0);
    const label = this.add
      .text(GAME_WIDTH / 2, y - 60, 'Cargando...', {
        fontFamily: 'sans-serif',
        fontSize: '36px',
        color: '#e8c170',
      })
      .setOrigin(0.5);

    this.load.on('progress', (p: number) => {
      fill.width = w * p;
    });
    this.load.on('complete', () => {
      bg.destroy();
      fill.destroy();
      label.destroy();
    });
  }

  /**
   * Genera texturas placeholder con Graphics para correr sin assets externos.
   * Sustituir por sprites IA en Sprint 1.5 (ver PLAN.md).
   */
  private generatePlaceholderTextures(): void {
    const g = this.add.graphics();

    // Tile de camino para el TileSprite del lane
    g.fillStyle(COLORS.bgPath, 1);
    g.fillRect(0, 0, 256, 256);
    g.fillStyle(COLORS.trailA, 1);
    g.fillRect(0, 0, 256, 8);
    g.fillRect(0, 248, 256, 8);
    g.fillStyle(COLORS.trailB, 0.6);
    g.fillRect(20, 30, 30, 12);
    g.fillRect(180, 130, 40, 14);
    g.fillRect(80, 200, 25, 10);
    g.generateTexture('lane-tile', 256, 256);
    g.clear();

    // Borde lateral (selva)
    g.fillStyle(COLORS.bgGrass, 1);
    g.fillRect(0, 0, 128, 256);
    g.fillStyle(0x1c3a2a, 1);
    g.fillCircle(40, 40, 22);
    g.fillCircle(95, 100, 30);
    g.fillCircle(20, 180, 28);
    g.fillCircle(75, 220, 18);
    g.generateTexture('side-tile', 128, 256);
    g.clear();

    // Sprite del jugador placeholder (rombo dorado con outline)
    const playerSize = 96;
    g.fillStyle(COLORS.playerOutline, 1);
    g.fillRoundedRect(0, 0, playerSize, playerSize, 16);
    g.fillStyle(COLORS.player, 1);
    g.fillRoundedRect(6, 6, playerSize - 12, playerSize - 12, 12);
    g.fillStyle(COLORS.playerOutline, 1);
    g.fillCircle(playerSize / 2, playerSize / 2 - 8, 8);
    g.fillRect(playerSize / 2 - 4, playerSize / 2, 8, 28);
    g.generateTexture('player', playerSize, playerSize);
    g.clear();

    g.destroy();
  }
}
