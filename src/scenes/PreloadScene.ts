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

    // Tropa Arquero Guna (turquesa con outline)
    const troopSize = 64;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(0, 0, troopSize, troopSize, 12);
    g.fillStyle(0x4ec9b0, 1);
    g.fillRoundedRect(5, 5, troopSize - 10, troopSize - 10, 9);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(troopSize / 2, troopSize / 2 - 4, 6);
    g.fillRect(troopSize / 2 - 3, troopSize / 2, 6, 18);
    g.generateTexture('troop-archer', troopSize, troopSize);
    g.clear();

    // Enemigo marinero (rojo oscuro con outline)
    const enemySize = 72;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(0, 0, enemySize, enemySize, 12);
    g.fillStyle(0xa83232, 1);
    g.fillRoundedRect(5, 5, enemySize - 10, enemySize - 10, 9);
    g.fillStyle(0xf2e5c0, 1);
    g.fillCircle(enemySize / 2, enemySize / 2 - 6, 7);
    g.fillStyle(0x1a1a1a, 1);
    g.fillRect(enemySize / 2 - 4, enemySize / 2 + 2, 8, 22);
    g.generateTexture('enemy-sailor', enemySize, enemySize);
    g.clear();

    // Proyectil (flecha — elipse dorada)
    g.fillStyle(0x1a1a1a, 1);
    g.fillEllipse(8, 16, 16, 32);
    g.fillStyle(0xe8c170, 1);
    g.fillEllipse(8, 16, 10, 26);
    g.generateTexture('projectile', 16, 32);
    g.clear();

    // Barril obstáculo (marrón oscuro con aros)
    const bw = 80;
    const bh = 96;
    g.fillStyle(0x4a2e10, 1);
    g.fillRoundedRect(0, 0, bw, bh, 10);
    g.lineStyle(5, 0x2a1a08, 1);
    g.strokeRoundedRect(2, 2, bw - 4, bh - 4, 9);
    // aros metálicos
    g.lineStyle(5, 0x666655, 1);
    g.strokeRect(4, 18, bw - 8, 4);
    g.strokeRect(4, bh - 22, bw - 8, 4);
    // cruz de tablones
    g.lineStyle(3, 0x3a2208, 0.6);
    g.lineBetween(bw / 2, 4, bw / 2, bh - 4);
    g.generateTexture('obstacle-barrel', bw, bh);
    g.clear();

    // Tropa Guerrero Ngäbe (melé — naranja/marrón con outline)
    const ngabeSize = 72;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(0, 0, ngabeSize, ngabeSize, 12);
    g.fillStyle(0xd4873a, 1);
    g.fillRoundedRect(5, 5, ngabeSize - 10, ngabeSize - 10, 9);
    g.fillStyle(0x1a1a1a, 1);
    g.fillCircle(ngabeSize / 2, ngabeSize / 2 - 6, 7);
    // lanza (línea vertical)
    g.fillRect(ngabeSize / 2 - 3, 6, 6, 22);
    g.generateTexture('troop-ngabe', ngabeSize, ngabeSize);
    g.clear();

    // Enemigo Conquistador (gris armadura con outline)
    const conquSize = 80;
    g.fillStyle(0x1a1a1a, 1);
    g.fillRoundedRect(0, 0, conquSize, conquSize, 12);
    g.fillStyle(0x8a9bb0, 1);
    g.fillRoundedRect(5, 5, conquSize - 10, conquSize - 10, 9);
    // casco (yelmo redondeado)
    g.fillStyle(0x6a7a8f, 1);
    g.fillRect(16, 5, conquSize - 32, 22);
    g.fillStyle(0xf2e5c0, 1);
    g.fillCircle(conquSize / 2, conquSize / 2 - 4, 7);
    g.generateTexture('enemy-conquistador', conquSize, conquSize);
    g.clear();

    // Puerta positiva (+N, ×N) — verde con borde dorado
    const gw = 370;
    const gh = 160;
    g.fillStyle(0x1a3a20, 1);
    g.fillRoundedRect(0, 0, gw, gh, 18);
    g.lineStyle(7, 0x4ec950, 1);
    g.strokeRoundedRect(4, 4, gw - 8, gh - 8, 14);
    // Detalle: línea horizontal divisoria superior
    g.lineStyle(3, 0x4ec950, 0.4);
    g.lineBetween(30, 42, gw - 30, 42);
    g.generateTexture('gate-positive', gw, gh);
    g.clear();

    // Puerta negativa (-N, ÷N) — rojo oscuro con borde carmesí
    g.fillStyle(0x3a1010, 1);
    g.fillRoundedRect(0, 0, gw, gh, 18);
    g.lineStyle(7, 0xc03030, 1);
    g.strokeRoundedRect(4, 4, gw - 8, gh - 8, 14);
    g.lineStyle(3, 0xc03030, 0.4);
    g.lineBetween(30, 42, gw - 30, 42);
    g.generateTexture('gate-negative', gw, gh);
    g.clear();

    // Puerta de upgrade (dorada) — otorga clase especial
    g.fillStyle(0x3a2e00, 1);
    g.fillRoundedRect(0, 0, gw, gh, 18);
    g.lineStyle(8, 0xe8c170, 1);
    g.strokeRoundedRect(4, 4, gw - 8, gh - 8, 14);
    g.lineStyle(3, 0xe8c170, 0.5);
    g.lineBetween(30, 42, gw - 30, 42);
    g.fillStyle(0xe8c170, 0.8);
    g.fillRect(16, 16, 20, 20);
    g.fillRect(gw - 36, 16, 20, 20);
    g.fillRect(16, gh - 36, 20, 20);
    g.fillRect(gw - 36, gh - 36, 20, 20);
    g.generateTexture('gate-upgrade', gw, gh);
    g.clear();

    // Boss Diego Méndez (grande, armadura azul-plateada con detalles dorados)
    const bossW = 140;
    const bossH = 140;
    // cuerpo: armadura azul oscuro
    g.fillStyle(0x1a2a4a, 1);
    g.fillRoundedRect(0, 0, bossW, bossH, 16);
    g.fillStyle(0x3a5a8a, 1);
    g.fillRoundedRect(8, 8, bossW - 16, bossH - 16, 12);
    // hombros / pauldrons dorados
    g.fillStyle(0xe8c170, 1);
    g.fillRect(8, 28, 24, 18);
    g.fillRect(bossW - 32, 28, 24, 18);
    // casco yelmo
    g.fillStyle(0x2a4070, 1);
    g.fillRect(36, 8, bossW - 72, 30);
    g.fillStyle(0xe8c170, 1);
    g.fillRect(46, 12, bossW - 92, 6); // visera dorada
    // cara
    g.fillStyle(0xf2e5c0, 1);
    g.fillCircle(bossW / 2, 52, 12);
    // cruz de espada en el pecho
    g.fillStyle(0xe8c170, 1);
    g.fillRect(bossW / 2 - 3, 68, 6, 40);
    g.fillRect(bossW / 2 - 16, 78, 32, 6);
    // outline exterior
    g.lineStyle(5, 0xe8c170, 1);
    g.strokeRoundedRect(4, 4, bossW - 8, bossH - 8, 13);
    g.generateTexture('boss-mendez', bossW, bossH);
    g.clear();

    g.destroy();
  }
}
