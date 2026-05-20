import Phaser from 'phaser';
import { Projectile } from '../entities/Projectile';

export class ProjectilePool {
  public readonly group: Phaser.Physics.Arcade.Group;

  constructor(scene: Phaser.Scene, initialSize = 60) {
    this.group = scene.physics.add.group({
      classType: Projectile,
      maxSize: 500,
      runChildUpdate: false,
    });
    for (let i = 0; i < initialSize; i++) {
      this.group.add(new Projectile(scene), true);
    }
  }

  fire(x: number, y: number, vx: number, vy: number, damage: number): Projectile | null {
    const p = this.group.getFirstDead(true) as Projectile | null;
    if (!p) return null;
    p.fire(x, y, vx, vy, damage);
    return p;
  }

  /** Desactiva proyectiles que salieron de pantalla. */
  cull(minY: number, maxY: number, minX: number, maxX: number): void {
    const children = this.group.getChildren() as Projectile[];
    for (let i = 0; i < children.length; i++) {
      const p = children[i];
      if (!p.active) continue;
      if (p.y < minY || p.y > maxY || p.x < minX || p.x > maxX) {
        p.deactivate();
      }
    }
  }
}
