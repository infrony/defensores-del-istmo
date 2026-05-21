import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class MainMenuScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainMenuScene' });
  }

  create(): void {
    if (this.cache.audio.has('music-menu')) {
      this.sound.stopAll();
      this.sound.play('music-menu', { loop: true, volume: 0.35 });
    }

    this.events.once(Phaser.Scenes.Events.SHUTDOWN, () => this.sound.stopAll());

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.3, 'Defensores\ndel Istmo', {
        fontFamily: 'serif',
        fontSize: '120px',
        color: '#e8c170',
        align: 'center',
        stroke: '#1a1a1a',
        strokeThickness: 8,
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.45, 'v0.0.1 — prototipo', {
        fontFamily: 'sans-serif',
        fontSize: '36px',
        color: '#a8c5b8',
      })
      .setOrigin(0.5);

    const btn = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, 520, 140, 0xe8c170)
      .setStrokeStyle(6, 0x1a1a1a)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.65, 'JUGAR', {
        fontFamily: 'sans-serif',
        fontSize: '64px',
        color: '#1a1a1a',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT * 0.85, 'Arrastrá ⇄ para moverte', {
        fontFamily: 'sans-serif',
        fontSize: '32px',
        color: '#a8c5b8',
      })
      .setOrigin(0.5);

    btn.on('pointerup', () => {
      this.sound.play('sfx-ui-click', { volume: 0.7 });
      this.scene.start('DailyScene');
    });
  }
}
