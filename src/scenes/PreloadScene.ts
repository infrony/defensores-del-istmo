import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class PreloadScene extends Phaser.Scene {
  constructor() {
    super({ key: 'PreloadScene' });
  }

  preload(): void {
    this.drawLoadingBar();

    // Real assets — Sprint 1.5 (generated with PixelLab AI + ChatGPT)
    this.load.image('player',                'assets/sprites/player.png');
    this.load.image('troop-archer',          'assets/sprites/troop-archer.png');
    this.load.image('troop-ngabe',           'assets/sprites/troop-ngabe.png');
    this.load.image('enemy-sailor',          'assets/sprites/enemy-sailor.png');
    this.load.image('enemy-conquistador',    'assets/sprites/enemy-conquistador.png');
    this.load.image('boss-mendez',           'assets/sprites/boss-mendez.png');
    this.load.image('projectile',            'assets/sprites/projectile-arrow.png');
    this.load.image('obstacle-barrel',       'assets/sprites/obstacle-barrel.png');
    this.load.image('lane-tile',             'assets/tiles/lane-tile.png');
    this.load.image('side-tile',             'assets/tiles/side-tile.png');
    this.load.image('gate-positive',         'assets/ui/gate-positive.png');
    this.load.image('gate-negative',         'assets/ui/gate-negative.png');
    this.load.image('gate-upgrade',          'assets/ui/gate-upgrade.png');

    // SFX
    this.load.audio('sfx-shoot',        'assets/audio/sfx/sfx-shoot.mp3');
    this.load.audio('sfx-hit',          'assets/audio/sfx/sfx-hit.mp3');
    this.load.audio('sfx-crit',         'assets/audio/sfx/sfx-crit.mp3');
    this.load.audio('sfx-kill',         'assets/audio/sfx/sfx-kill.mp3');
    this.load.audio('sfx-gate-positive','assets/audio/sfx/sfx-gate-positive.mp3');
    this.load.audio('sfx-gate-negative','assets/audio/sfx/sfx-gate-negative.mp3');
    this.load.audio('sfx-gate-upgrade', 'assets/audio/sfx/sfx-gate-upgrade.mp3');
    this.load.audio('sfx-boss-appear',  'assets/audio/sfx/sfx-boss-appear.mp3');
    this.load.audio('sfx-player-hit',   'assets/audio/sfx/sfx-player-hit.mp3');
    this.load.audio('sfx-victory',      'assets/audio/sfx/sfx-victory.mp3');
    this.load.audio('sfx-defeat',       'assets/audio/sfx/sfx-defeat.mp3');
    this.load.audio('sfx-ui-click',     'assets/audio/sfx/sfx-ui-click.mp3');

    // Música
    this.load.audio('music-menu',           'assets/audio/music/music-menu.mp3');
    this.load.audio('music-game-cap1',      'assets/audio/music/music-game-cap1.mp3');
    this.load.audio('music-boss',           'assets/audio/music/music-boss.mp3');
    this.load.audio('music-victory-jingle', 'assets/audio/music/music-victory-jingle.mp3');
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

}
