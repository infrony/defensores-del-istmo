import Phaser from 'phaser';

export interface EnemyConfig {
  texture: string;
  hp: number;
  speed: number; // px/s descendentes
  isBoss?: boolean;
  goldValue?: number; // oro ganado al matar
  damage?: number;    // daño al jugador si llega a PLAYER_Y
}

export class Enemy extends Phaser.Physics.Arcade.Image {
  public hp: number;
  public maxHp: number;
  public speed: number;
  public alive = true;
  public goldValue: number;
  public damage: number;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: EnemyConfig) {
    super(scene, x, y, cfg.texture);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.speed = cfg.speed;
    this.goldValue = cfg.goldValue ?? 1;
    this.damage = cfg.damage ?? 15;
    this.setDepth(8);
    this.setVelocity(0, cfg.speed);
  }

  reset(x: number, y: number, cfg: EnemyConfig): void {
    this.setTexture(cfg.texture);
    this.setPosition(x, y);
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.speed = cfg.speed;
    this.goldValue = cfg.goldValue ?? 1;
    this.damage = cfg.damage ?? 15;
    this.alive = true;
    this.setActive(true).setVisible(true);
    if (this.body) {
      this.body.enable = true;
      this.setVelocity(0, cfg.speed);
    }
  }

  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    this.hp -= amount;
    this.scene.tweens.add({
      targets: this,
      alpha: 0.5,
      duration: 50,
      yoyo: true,
    });
    if (this.hp <= 0) {
      this.kill();
      return true;
    }
    return false;
  }

  kill(): void {
    if (!this.alive) return;
    this.alive = false;
    this.setActive(false).setVisible(false);
    if (this.body) this.body.enable = false;
    this.setVelocity(0, 0);
  }
}
