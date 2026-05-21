import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { ProgressionSystem, UpgradeType } from '../systems/ProgressionSystem';
import { SaveSystem } from '../systems/SaveSystem';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';

const UPGRADE_LABELS: Record<UpgradeType, string> = {
  initialTroops: 'Tropas Iniciales',
  damageBoost: 'Daño de Ataque',
  hpBoost: 'Puntos de Vida',
  fireRateBonus: 'Velocidad de Disparo',
};

const UPGRADE_ORDER: UpgradeType[] = ['initialTroops', 'damageBoost', 'hpBoost', 'fireRateBonus'];

export class UpgradeScene extends Phaser.Scene {
  private uiContainer!: Phaser.GameObjects.Container;

  constructor() {
    super({ key: 'UpgradeScene' });
  }

  create(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1d2a);
    this.buildUI();
  }

  private buildUI(): void {
    if (this.uiContainer) {
      this.uiContainer.destroy(true);
    }

    this.uiContainer = this.add.container(0, 0);

    const prog = ProgressionSystem.load();
    const stats = SaveSystem.load();

    // --- Title ---
    const title = this.add.text(GAME_WIDTH / 2, 120, 'CAMPAMENTO BASE', {
      fontFamily: 'sans-serif',
      fontSize: '72px',
      color: '#e8c170',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.uiContainer.add(title);

    // --- Subtitle / run stats ---
    const statsText = [
      `Mejor distancia: ${stats.bestDistance} m`,
      `Runs totales: ${stats.totalRuns}`,
      `Mejor oro: ${stats.bestGold}`,
    ].join('   |   ');

    const subtitle = this.add.text(GAME_WIDTH / 2, 220, statsText, {
      fontFamily: 'sans-serif',
      fontSize: '34px',
      color: '#a8c5b8',
    }).setOrigin(0.5);
    this.uiContainer.add(subtitle);

    // --- Gold balance ---
    const goldText = this.add.text(GAME_WIDTH / 2, 310, `Oro disponible: ✦ ${prog.totalGold}`, {
      fontFamily: 'sans-serif',
      fontSize: '48px',
      color: '#e8c170',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.uiContainer.add(goldText);

    // --- Upgrade cards ---
    const cardW = 900;
    const cardH = 180;
    const cardStartY = 450;
    const cardGap = 210;

    UPGRADE_ORDER.forEach((type, i) => {
      const cardY = cardStartY + i * cardGap;
      const cardCx = GAME_WIDTH / 2;

      const level = prog[type] as number;
      const cost = ProgressionSystem.getUpgradeCost(type);
      const affordable = cost !== null && ProgressionSystem.canAfford(type, prog.totalGold);
      const isMax = cost === null;

      // Card background
      const cardBg = this.add
        .rectangle(cardCx, cardY, cardW, cardH, 0x122233)
        .setStrokeStyle(3, 0xe8c170);
      this.uiContainer.add(cardBg);

      // Upgrade name
      const nameLabel = this.add.text(cardCx - 380, cardY - 45, UPGRADE_LABELS[type], {
        fontFamily: 'sans-serif',
        fontSize: '38px',
        color: '#c8e8d0',
        fontStyle: 'bold',
      }).setOrigin(0, 0.5);
      this.uiContainer.add(nameLabel);

      // Stars
      const stars = this.buildStars(level);
      const starsLabel = this.add.text(cardCx - 380, cardY + 20, stars, {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: '#e8c170',
      }).setOrigin(0, 0.5);
      this.uiContainer.add(starsLabel);

      // Cost / MAX label
      const costStr = isMax ? 'MAX' : `✦ ${cost}`;
      const costColor = isMax ? '#a8c5b8' : (affordable ? '#e8c170' : '#666666');
      const costLabel = this.add.text(cardCx + 160, cardY, costStr, {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: costColor,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.uiContainer.add(costLabel);

      // Upgrade button
      const btnColor = affordable ? 0xe8c170 : 0x444444;
      const btnW = 200;
      const btnH = 100;
      const btnX = cardCx + 360;

      const btn = this.add
        .rectangle(btnX, cardY, btnW, btnH, btnColor)
        .setStrokeStyle(2, 0x1a1a1a);
      this.uiContainer.add(btn);

      const btnLabel = this.add.text(btnX, cardY, isMax ? '—' : 'UP', {
        fontFamily: 'sans-serif',
        fontSize: '38px',
        color: '#1a1a1a',
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.uiContainer.add(btnLabel);

      if (affordable) {
        btn.setInteractive({ useHandCursor: true });
        btn.on('pointerup', () => {
          const cost = ProgressionSystem.getUpgradeCost(type) ?? 0;
          ProgressionSystem.applyUpgrade(type);
          const newProg = ProgressionSystem.load();
          AnalyticsSystem.track({ event: 'upgrade_buy', upgradeType: type, newLevel: newProg[type], goldSpent: cost });
          this.buildUI();
        });
        btn.on('pointerover', () => btn.setFillStyle(0xf5d98a));
        btn.on('pointerout', () => btn.setFillStyle(0xe8c170));
      }
    });

    // --- "¡A COMBATIR!" button ---
    const playBtnY = GAME_HEIGHT - 320;
    const playBtn = this.add
      .rectangle(GAME_WIDTH / 2, playBtnY, 560, 130, 0xe8c170)
      .setStrokeStyle(5, 0x1a1a1a)
      .setInteractive({ useHandCursor: true });
    this.uiContainer.add(playBtn);

    const playLabel = this.add.text(GAME_WIDTH / 2, playBtnY, '¡A COMBATIR!', {
      fontFamily: 'sans-serif',
      fontSize: '58px',
      color: '#1a1a1a',
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.uiContainer.add(playLabel);

    playBtn.on('pointerup', () => {
      this.scene.start('GameScene');
    });
    playBtn.on('pointerover', () => playBtn.setFillStyle(0xf5d98a));
    playBtn.on('pointerout', () => playBtn.setFillStyle(0xe8c170));

    // --- "Menú" button ---
    const menuBtnY = GAME_HEIGHT - 170;
    const menuBtn = this.add
      .rectangle(GAME_WIDTH / 2, menuBtnY, 320, 100, 0x1a3a4a)
      .setStrokeStyle(3, 0xa8c5b8)
      .setInteractive({ useHandCursor: true });
    this.uiContainer.add(menuBtn);

    const menuLabel = this.add.text(GAME_WIDTH / 2, menuBtnY, 'Menú', {
      fontFamily: 'sans-serif',
      fontSize: '44px',
      color: '#c8e8d0',
    }).setOrigin(0.5);
    this.uiContainer.add(menuLabel);

    menuBtn.on('pointerup', () => {
      this.scene.start('MainMenuScene');
    });
    menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x24506a));
    menuBtn.on('pointerout', () => menuBtn.setFillStyle(0x1a3a4a));
  }

  private buildStars(level: number): string {
    const filled = '★'.repeat(level);
    const empty = '☆'.repeat(3 - level);
    return filled + empty;
  }
}
