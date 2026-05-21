import Phaser from 'phaser';

export interface EnemyConfig {
  texture: string;
  hp: number;
  speed: number; // px/s descendentes
  isBoss?: boolean;
  bossType?: 'mendez' | 'balboa' | 'morgan';
  goldValue?: number; // oro ganado al matar
  damage?: number;    // daño al jugador si llega a PLAYER_Y
  displayW?: number;  // tamaño visual fijo independiente de la resolución nativa del PNG
  displayH?: number;
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
    if (cfg.displayW && cfg.displayH) {
      this.setDisplaySize(cfg.displayW, cfg.displayH);
      (this.body as Phaser.Physics.Arcade.Body).setSize(cfg.displayW, cfg.displayH);
    }
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
    if (cfg.displayW && cfg.displayH) {
      this.setDisplaySize(cfg.displayW, cfg.displayH);
    }
    if (this.body) {
      this.body.enable = true;
      this.setVelocity(0, cfg.speed);
      if (cfg.displayW && cfg.displayH) {
        (this.body as Phaser.Physics.Arcade.Body).setSize(cfg.displayW, cfg.displayH);
      }
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
