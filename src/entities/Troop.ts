import Phaser from 'phaser';
import type { Enemy } from './Enemy';
import type { ProjectilePool } from '../systems/ProjectilePool';

export interface TroopConfig {
  texture: string;
  hp: number;
  damage: number;
  range: number;
  fireRateMs: number;
  projectileSpeed: number;
}

export class Troop extends Phaser.GameObjects.Image {
  public hp: number;
  public maxHp: number;
  public damage: number;
  public range: number;
  public fireRateMs: number;
  public projectileSpeed: number;
  public alive = true;

  /** Slot index assigned by FormationManager. */
  public slot = -1;
  /** Resolved world target (relative to player position). Updated by FormationManager each frame. */
  public targetX = 0;
  public targetY = 0;
  /**
   * Multiplicador de daño inyectado por FormationManager cada tick.
   * Escala con el tamaño de la formación: más tropas = más poder individual.
   */
  public damageMultiplier = 1;

  private cooldown = 0;
  private currentTarget: Enemy | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, cfg: TroopConfig) {
    super(scene, x, y, cfg.texture);
    scene.add.existing(this);
    this.maxHp = cfg.hp;
    this.hp = cfg.hp;
    this.damage = cfg.damage;
    this.range = cfg.range;
    this.fireRateMs = cfg.fireRateMs;
    this.projectileSpeed = cfg.projectileSpeed;
    this.setDepth(11);
  }

  setTarget(enemy: Enemy | null): void {
    this.currentTarget = enemy && enemy.alive ? enemy : null;
  }

  hasTarget(): boolean {
    return this.currentTarget !== null && this.currentTarget.alive;
  }

  update(_time: number, delta: number, pool: ProjectilePool): void {
    if (!this.alive) return;

    // Movimiento suave hacia el slot asignado por la formación
    const lerp = 0.25;
    this.x = Phaser.Math.Linear(this.x, this.targetX, lerp);
    this.y = Phaser.Math.Linear(this.y, this.targetY, lerp);

    this.cooldown -= delta;

    if (this.cooldown > 0) return;
    if (!this.currentTarget || !this.currentTarget.alive) return;

    const dx = this.currentTarget.x - this.x;
    const dy = this.currentTarget.y - this.y;
    const distSq = dx * dx + dy * dy;
    if (distSq > this.range * this.range) return;

    const dist = Math.sqrt(distSq) || 1;
    const vx = (dx / dist) * this.projectileSpeed;
    const vy = (dy / dist) * this.projectileSpeed;
    const finalDamage = Math.round(this.damage * this.damageMultiplier);
    pool.fire(this.x, this.y - 20, vx, vy, finalDamage);
    this.cooldown = this.fireRateMs;
  }
}
