import Phaser from 'phaser';
import { Obstacle } from '../entities/Obstacle';
import { LANE } from '../config';

const SPAWN_EVERY_M = 20;

export class ObstacleManager {
  public readonly group: Phaser.Physics.Arcade.Group;

  constructor(private scene: Phaser.Scene) {
    this.group = scene.physics.add.group({
      classType: Obstacle,
      maxSize: 40,
      runChildUpdate: false,
    });
  }

  private distAccum = 0;

  update(distDelta: number, bottomY: number): void {
    this.distAccum += distDelta;

    if (this.distAccum >= SPAWN_EVERY_M) {
      this.distAccum -= SPAWN_EVERY_M;
      this.spawnOne();
    }

    const children = this.group.getChildren() as Obstacle[];
    for (let i = 0; i < children.length; i++) {
      const obs = children[i];
      if (!obs.alive) continue;
      obs.syncLabel();
      if (obs.y > bottomY + 120) obs.kill();
    }
  }

  alive(): Obstacle[] {
    const out: Obstacle[] = [];
    const children = this.group.getChildren() as Obstacle[];
    for (let i = 0; i < children.length; i++) {
      if (children[i].alive) out.push(children[i]);
    }
    return out;
  }

  private spawnOne(): void {
    const x = Phaser.Math.Between(LANE.leftBound + 60, LANE.rightBound - 60);
    const y = -80;
    const obs = new Obstacle(this.scene, x, y);
    this.group.add(obs);
  }
}
