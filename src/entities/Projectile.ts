import Phaser from 'phaser';

export class Projectile extends Phaser.Physics.Arcade.Image {
  public damage = 0;

  constructor(scene: Phaser.Scene) {
    super(scene, 0, 0, 'projectile');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(9);
    this.setDisplaySize(16, 32);
    this.setActive(false).setVisible(false);
    if (this.body) this.body.enable = false;
  }

  fire(x: number, y: number, vx: number, vy: number, damage: number): void {
    this.setPosition(x, y);
    this.setActive(true).setVisible(true);
    this.damage = damage;
    if (this.body) {
      this.body.enable = true;
      this.setVelocity(vx, vy);
    }
    this.rotation = Math.atan2(vy, vx) + Math.PI / 2;
  }

  deactivate(): void {
    this.setActive(false).setVisible(false);
    if (this.body) {
      this.body.enable = false;
      this.setVelocity(0, 0);
    }
  }
}
