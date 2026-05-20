import Phaser from 'phaser';
import { Enemy, type EnemyConfig } from '../entities/Enemy';
import { SAILOR_CFG } from '../entities/enemies/Sailor';
import { LANE } from '../config';

export class EnemySpawner {
  public readonly group: Phaser.Physics.Arcade.Group;
  private accumulator = 0;
  private spawnEveryMs = 700;
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
    this.accumulator += delta;
    this.elapsedMs += delta;

    // Curva muy básica: cada 15s, baja el intervalo
    const target = Math.max(220, 700 - Math.floor(this.elapsedMs / 15000) * 80);
    this.spawnEveryMs = target;

    while (this.accumulator >= this.spawnEveryMs) {
      this.accumulator -= this.spawnEveryMs;
      this.spawnOne();
    }

    // Cull enemigos que pasaron la pantalla
    const children = this.group.getChildren() as Enemy[];
    for (let i = 0; i < children.length; i++) {
      const e = children[i];
      if (e.alive && (e.y > bottomY + 100 || e.y < topY - 200)) {
        e.kill();
      }
    }
  }

  private spawnOne(cfg: EnemyConfig = SAILOR_CFG): void {
    const x = Phaser.Math.Between(LANE.leftBound + 60, LANE.rightBound - 60);
    const y = -60;

    let enemy = this.group.getFirstDead(false) as Enemy | null;
    if (enemy) {
      enemy.reset(x, y, cfg);
    } else {
      enemy = new Enemy(this.scene, x, y, cfg);
      this.group.add(enemy);
    }
  }
}
