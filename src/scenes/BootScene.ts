import Phaser from 'phaser';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: 'BootScene' });
  }

  preload(): void {
    // Reservado para assets ultra-mínimos (logo, fuente del loader).
    // En v0 vamos directo a Preload.
  }

  create(): void {
    this.scene.start('PreloadScene');
  }
}
