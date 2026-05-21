import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { DailySystem } from '../systems/DailySystem';
import { MissionSystem, Mission } from '../systems/MissionSystem';
import { ProgressionSystem } from '../systems/ProgressionSystem';
import { AnalyticsSystem } from '../systems/AnalyticsSystem';

const COLOR_BG      = 0x0b1d2a;
const COLOR_CARD    = 0x122233;
const COLOR_GOLD    = '#e8c170';
const COLOR_GREEN   = '#a8c5b8';
const COLOR_GRAY    = '#666666';
const COLOR_WHITE   = '#c8e8d0';
const COLOR_DARK    = '#1a1a1a';
const HEX_GOLD      = 0xe8c170;
const HEX_CARD      = 0x122233;
const HEX_GRAY      = 0x444444;
const HEX_BTN_BG    = 0x1a3a4a;

export class DailyScene extends Phaser.Scene {
  private uiContainer!: Phaser.GameObjects.Container;
  private dailyResult!: { isNewDay: boolean; streak: number; reward: number; day: number };

  constructor() {
    super({ key: 'DailyScene' });
  }

  create(): void {
    this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, COLOR_BG);
    this.dailyResult = DailySystem.check();
    this.buildUI(this.dailyResult);
  }

  private buildUI(daily: { isNewDay: boolean; streak: number; reward: number; day: number }): void {
    if (this.uiContainer) {
      this.uiContainer.destroy(true);
    }
    this.uiContainer = this.add.container(0, 0);

    const prog = ProgressionSystem.load();
    let currentY = 100;

    // ─── SECTION 1: Login Reward ────────────────────────────────────────────

    const dailyTitle = this.add.text(GAME_WIDTH / 2, currentY, 'RECOMPENSA DIARIA', {
      fontFamily: 'sans-serif',
      fontSize: '64px',
      color: COLOR_GOLD,
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.uiContainer.add(dailyTitle);
    currentY += 90;

    // Streak line
    const streakLabel = this.add.text(GAME_WIDTH / 2, currentY, `Racha: ★ × ${daily.streak} días`, {
      fontFamily: 'sans-serif',
      fontSize: '44px',
      color: COLOR_WHITE,
    }).setOrigin(0.5, 0);
    this.uiContainer.add(streakLabel);
    currentY += 70;

    // 7 streak indicator squares
    const squareSize = 80;
    const squareGap = 20;
    const totalW = 7 * squareSize + 6 * squareGap;
    const startX = GAME_WIDTH / 2 - totalW / 2 + squareSize / 2;

    for (let i = 0; i < 7; i++) {
      const sx = startX + i * (squareSize + squareGap);
      const filled = i < daily.streak;
      const sq = this.add.rectangle(sx, currentY + squareSize / 2, squareSize, squareSize,
        filled ? HEX_GOLD : HEX_GRAY)
        .setStrokeStyle(2, filled ? HEX_GOLD : 0x888888);
      this.uiContainer.add(sq);

      const dayNum = this.add.text(sx, currentY + squareSize / 2, String(i + 1), {
        fontFamily: 'sans-serif',
        fontSize: '32px',
        color: filled ? COLOR_DARK : COLOR_GRAY,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.uiContainer.add(dayNum);
    }
    currentY += squareSize + 40;

    // Claim / already claimed
    if (DailySystem.hasPendingReward()) {
      const rewardAmount = daily.reward;

      const claimBtn = this.add.rectangle(GAME_WIDTH / 2, currentY + 55, 560, 110, HEX_GOLD)
        .setStrokeStyle(4, 0x1a1a1a)
        .setInteractive({ useHandCursor: true });
      this.uiContainer.add(claimBtn);

      const claimLabel = this.add.text(GAME_WIDTH / 2, currentY + 55, `Reclamar ✦ ${rewardAmount} oro`, {
        fontFamily: 'sans-serif',
        fontSize: '46px',
        color: COLOR_DARK,
        fontStyle: 'bold',
      }).setOrigin(0.5);
      this.uiContainer.add(claimLabel);

      claimBtn.on('pointerup', () => {
        DailySystem.claimReward();
        AnalyticsSystem.track({ event: 'daily_claim', streak: this.dailyResult.streak, goldEarned: this.dailyResult.reward });
        this.buildUI(this.dailyResult);
      });
      claimBtn.on('pointerover', () => claimBtn.setFillStyle(0xf5d98a));
      claimBtn.on('pointerout', () => claimBtn.setFillStyle(HEX_GOLD));
    } else {
      const claimedText = this.add.text(GAME_WIDTH / 2, currentY + 55, '¡Ya reclamaste hoy!', {
        fontFamily: 'sans-serif',
        fontSize: '44px',
        color: COLOR_GRAY,
      }).setOrigin(0.5);
      this.uiContainer.add(claimedText);
    }
    currentY += 160;

    // Gold balance
    const goldBalance = this.add.text(GAME_WIDTH / 2, currentY, `Oro disponible: ✦ ${prog.totalGold}`, {
      fontFamily: 'sans-serif',
      fontSize: '40px',
      color: COLOR_GOLD,
    }).setOrigin(0.5, 0);
    this.uiContainer.add(goldBalance);
    currentY += 80;

    // ─── SECTION 2: Daily Missions ──────────────────────────────────────────

    const divider = this.add.rectangle(GAME_WIDTH / 2, currentY + 10, GAME_WIDTH - 100, 3, 0x334455);
    this.uiContainer.add(divider);
    currentY += 50;

    const missionTitle = this.add.text(GAME_WIDTH / 2, currentY, 'MISIONES DEL DÍA', {
      fontFamily: 'sans-serif',
      fontSize: '60px',
      color: COLOR_GOLD,
      fontStyle: 'bold',
    }).setOrigin(0.5, 0);
    this.uiContainer.add(missionTitle);
    currentY += 90;

    const missions: Mission[] = MissionSystem.load();
    const cardW = 750;
    const cardH = 140;
    const cardGap = 30;

    missions.forEach((mission, index) => {
      const cardCx = GAME_WIDTH / 2;
      const cardCy = currentY + cardH / 2;

      // Card background
      const card = this.add.rectangle(cardCx, cardCy, cardW, cardH, HEX_CARD)
        .setStrokeStyle(2, 0x334455);
      this.uiContainer.add(card);

      // Description
      const desc = this.add.text(cardCx - cardW / 2 + 20, cardCy - 35,
        mission.description, {
          fontFamily: 'sans-serif',
          fontSize: '34px',
          color: COLOR_WHITE,
          fontStyle: 'bold',
        }).setOrigin(0, 0.5);
      this.uiContainer.add(desc);

      // Progress text
      const progressStr = `${Math.min(mission.progress, mission.goal)}/${mission.goal}`;
      const progressText = this.add.text(cardCx + cardW / 2 - 130, cardCy - 35,
        progressStr, {
          fontFamily: 'sans-serif',
          fontSize: '32px',
          color: mission.completed ? COLOR_GOLD : COLOR_GREEN,
        }).setOrigin(0.5, 0.5);
      this.uiContainer.add(progressText);

      // Progress bar background
      const barW = cardW - 40;
      const barH = 18;
      const barX = cardCx - barW / 2;
      const barY = cardCy + 25;

      const barBg = this.add.rectangle(barX + barW / 2, barY, barW, barH, HEX_GRAY)
        .setOrigin(0.5);
      this.uiContainer.add(barBg);

      // Progress bar fill
      const ratio = Math.min(mission.progress / mission.goal, 1);
      if (ratio > 0) {
        const fillW = Math.max(barW * ratio, 4);
        const barFill = this.add.rectangle(barX + fillW / 2, barY, fillW, barH, HEX_GOLD)
          .setOrigin(0.5);
        this.uiContainer.add(barFill);
      }

      // State: completed + unclaimed → claim button; claimed → checkmark; in progress → nothing extra
      if (mission.completed && !mission.claimed) {
        const btnW = 200;
        const btnH = 60;
        const btnX = cardCx + cardW / 2 - btnW / 2 - 10;
        const btnY = cardCy - 35;

        const claimBtn = this.add.rectangle(btnX, btnY, btnW, btnH, HEX_GOLD)
          .setStrokeStyle(2, 0x1a1a1a)
          .setInteractive({ useHandCursor: true });
        this.uiContainer.add(claimBtn);

        const claimLbl = this.add.text(btnX, btnY, `Reclamar ✦ ${mission.reward}`, {
          fontFamily: 'sans-serif',
          fontSize: '28px',
          color: COLOR_DARK,
          fontStyle: 'bold',
        }).setOrigin(0.5);
        this.uiContainer.add(claimLbl);

        claimBtn.on('pointerup', () => {
          const reward = MissionSystem.claimMission(index);
          AnalyticsSystem.track({ event: 'mission_claim', missionType: mission.type, goldEarned: reward });
          this.buildUI(this.dailyResult);
        });
        claimBtn.on('pointerover', () => claimBtn.setFillStyle(0xf5d98a));
        claimBtn.on('pointerout', () => claimBtn.setFillStyle(HEX_GOLD));

        // Reposition progress text to not overlap
        progressText.setVisible(false);
        desc.setX(cardCx - cardW / 2 + 20);

      } else if (mission.claimed) {
        const doneText = this.add.text(cardCx + cardW / 2 - 20, cardCy - 35,
          '✓ Completada', {
            fontFamily: 'sans-serif',
            fontSize: '32px',
            color: COLOR_GREEN,
            fontStyle: 'bold',
          }).setOrigin(1, 0.5);
        this.uiContainer.add(doneText);
        progressText.setVisible(false);
      }

      currentY += cardH + cardGap;
    });

    currentY += 20;

    // ─── "¡A JUGAR!" Button ─────────────────────────────────────────────────

    const playBtnY = Math.max(currentY + 65, GAME_HEIGHT - 220);

    const playBtn = this.add.rectangle(GAME_WIDTH / 2, playBtnY, 560, 130, HEX_GOLD)
      .setStrokeStyle(5, 0x1a1a1a)
      .setInteractive({ useHandCursor: true });
    this.uiContainer.add(playBtn);

    const playLabel = this.add.text(GAME_WIDTH / 2, playBtnY, '¡A JUGAR!', {
      fontFamily: 'sans-serif',
      fontSize: '58px',
      color: COLOR_DARK,
      fontStyle: 'bold',
    }).setOrigin(0.5);
    this.uiContainer.add(playLabel);

    playBtn.on('pointerup', () => {
      this.scene.start('MapScene');
    });
    playBtn.on('pointerover', () => playBtn.setFillStyle(0xf5d98a));
    playBtn.on('pointerout', () => playBtn.setFillStyle(HEX_GOLD));

    // ─── "Menú" back button ──────────────────────────────────────────────────

    const menuBtnY = playBtnY + 160;

    const menuBtn = this.add.rectangle(GAME_WIDTH / 2, menuBtnY, 320, 100, HEX_BTN_BG)
      .setStrokeStyle(3, 0xa8c5b8)
      .setInteractive({ useHandCursor: true });
    this.uiContainer.add(menuBtn);

    const menuLabel = this.add.text(GAME_WIDTH / 2, menuBtnY, 'Menú', {
      fontFamily: 'sans-serif',
      fontSize: '44px',
      color: COLOR_GREEN,
    }).setOrigin(0.5);
    this.uiContainer.add(menuLabel);

    menuBtn.on('pointerup', () => {
      this.scene.start('MainMenuScene');
    });
    menuBtn.on('pointerover', () => menuBtn.setFillStyle(0x24506a));
    menuBtn.on('pointerout', () => menuBtn.setFillStyle(HEX_BTN_BG));
  }
}
