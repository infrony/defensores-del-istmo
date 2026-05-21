import Phaser from 'phaser';
import { Enemy, type EnemyConfig } from '../entities/Enemy';
import { BossMendez } from '../entities/enemies/BossMendez';
import { BossBalboa } from '../entities/enemies/BossBalboa';
import { BossMorgan } from '../entities/enemies/BossMorgan';
import { SAILOR_CFG } from '../entities/enemies/Sailor';
import { CONQUISTADOR_CFG } from '../entities/enemies/Conquistador';
import { BALLESTERO_CFG } from '../entities/enemies/Ballestero';
import { PERRO_CFG } from '../entities/enemies/PerroDeCaza';
import { PIRATA_CFG } from '../entities/enemies/Pirata';
import { LANE } from '../config';

export class EnemySpawner {
  public readonly group: Phaser.Physics.Arcade.Group;
  public boss: BossMendez | null = null;
  public boss2: BossBalboa | null = null;
  public boss3: BossMorgan | null = null;

  private accumulator = 0;
  private spawnEveryMs = 400;
  private elapsedMs = 0;

  constructor(private scene: Phaser.Scene) {
    this.group = scene.physics.add.group({
      classType: Enemy,
      maxSize: 200,
      runChildUpdate: false,
    });
  }

  alive(): Enemy[] {
    const out: Enemy[] = [];
    const children = this.group.getChildren() as Enemy[];
    for (let i = 0; i < children.length; i++) {
      if (children[i].alive) out.push(children[i]);
    }
    return out;
  }

  update(_time: number, delta: number, topY: number, bottomY: number): void {
    // During boss fight: update boss patterns, suppress normal spawning
    if (this.boss?.alive) {
      this.boss.bossUpdate(delta);
      this.cullNormal(bottomY, topY);
      return;
    }
    if (this.boss2?.alive) {
      this.boss2.bossUpdate(delta);
      this.cullNormal(bottomY, topY);
      return;
    }
    if (this.boss3?.alive) {
      this.boss3.bossUpdate(delta);
      this.cullNormal(bottomY, topY);
      return;
    }

    this.accumulator += delta;
    this.elapsedMs += delta;

    // Cada 15s el intervalo baja hasta mínimo 200ms (horda creciente)
    const target = Math.max(200, 400 - Math.floor(this.elapsedMs / 15000) * 50);
    this.spawnEveryMs = target;

    while (this.accumulator >= this.spawnEveryMs) {
      this.accumulator -= this.spawnEveryMs;
      const batch = this.elapsedMs < 10_000 ? 2 : Phaser.Math.Between(2, 3);
      for (let b = 0; b < batch; b++) this.spawnOne();
    }

    this.cullNormal(bottomY, topY);
  }

  /** Llamado desde SpawnManager para inyectar un enemigo con config explícita. */
  spawnWithCfg(cfg: EnemyConfig): void {
    if (cfg.isBoss) {
      if (cfg.bossType === 'balboa') { this.spawnBalboa(); return; }
      if (cfg.bossType === 'morgan') { this.spawnMorgan(); return; }
      this.spawnBoss(); // default: mendez
      return;
    }
    this.spawnOne(cfg);
  }

  /** Pre-populate enemies already on screen at a given y coordinate. */
  spawnAt(y: number): void {
    this.spawnOne(SAILOR_CFG, y);
  }

  private spawnBoss(): void {
    if (this.boss?.alive) return;
    const x = LANE.centerX;
    this.boss = new BossMendez(this.scene, x, -160);
    this.boss.setVelocityY(600); // fast entrance: ~1s to reach SETTLE_Y
    this.group.add(this.boss);
  }

  private spawnBalboa(): void {
    if (this.boss2?.alive) return;
    this.boss2 = new BossBalboa(this.scene, LANE.centerX, -160);
    this.boss2.setVelocityY(600);
    this.group.add(this.boss2);
  }

  private spawnMorgan(): void {
    if (this.boss3?.alive) return;
    this.boss3 = new BossMorgan(this.scene, LANE.centerX, -160);
    this.boss3.setVelocityY(600);
    this.group.add(this.boss3);
  }

  private pickCfg(): EnemyConfig {
    if (this.elapsedMs > 50_000 && Math.random() < 0.15) return PIRATA_CFG;
    if (this.elapsedMs > 40_000 && Math.random() < 0.2) return PERRO_CFG;
    if (this.elapsedMs > 30_000 && Math.random() < 0.25) return CONQUISTADOR_CFG;
    if (this.elapsedMs > 20_000 && Math.random() < 0.2) return BALLESTERO_CFG;
    return SAILOR_CFG;
  }

  private spawnOne(cfg: EnemyConfig = this.pickCfg(), y = -60): void {
    const x = Phaser.Math.Between(LANE.leftBound + 60, LANE.rightBound - 60);

    let enemy = this.group.getFirstDead(false) as Enemy | null;
    if (enemy) {
      enemy.reset(x, y, cfg);
    } else {
      enemy = new Enemy(this.scene, x, y, cfg);
      this.group.add(enemy);
    }
  }

  private cullNormal(bottomY: number, topY: number): void {
    const children = this.group.getChildren() as Enemy[];
    for (let i = 0; i < children.length; i++) {
      const e = children[i];
      if (!e.alive || e === this.boss || e === this.boss2 || e === this.boss3) continue;
      if (e.y > bottomY + 100 || e.y < topY - 200) e.kill();
    }
  }
}
