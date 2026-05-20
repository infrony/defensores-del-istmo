import Phaser from 'phaser';
import { Gate, GateOp, GATE_W, GATE_H } from '../entities/Gate';
import { LANE } from '../config';

const GATE_SPEED = 480;
const SPAWN_EVERY_M = 14;

// Distancia horizontal entre el borde del lane y el borde exterior de cada puerta
const MARGIN = Math.floor((LANE.rightBound - LANE.leftBound - GATE_W * 2) / 3);
const LEFT_CX = LANE.leftBound + MARGIN + GATE_W / 2;
const RIGHT_CX = LEFT_CX + GATE_W + MARGIN;

export { GATE_W, GATE_H };

export class GateSpawner {
  private gates: Gate[] = [];
  private distAccum = 0;

  constructor(private scene: Phaser.Scene) {}

  /**
   * @param distDelta  metros avanzados este frame (mismo valor que GameScene.distance delta)
   * @param troopCount  tropas actuales — para escalar los valores de las puertas
   */
  update(distDelta: number, bottomY: number, troopCount: number): void {
    this.distAccum += distDelta;

    if (this.distAccum >= SPAWN_EVERY_M) {
      this.distAccum -= SPAWN_EVERY_M;
      this.spawnPair(troopCount);
    }

    for (let i = this.gates.length - 1; i >= 0; i--) {
      const g = this.gates[i];
      if (!g.alive) {
        this.gates.splice(i, 1);
        continue;
      }
      g.syncLabel();
      if (g.y > bottomY + 120) {
        g.cull();
        this.gates.splice(i, 1);
      }
    }
  }

  alive(): Gate[] {
    return this.gates.filter((g) => g.alive);
  }

  private spawnPair(troopCount: number): void {
    const posOnLeft = Math.random() < 0.5;
    const posX = posOnLeft ? LEFT_CX : RIGHT_CX;
    const negX = posOnLeft ? RIGHT_CX : LEFT_CX;
    const y = -GATE_H / 2 - 20;

    const [posOp, posVal] = this.pickPositive(troopCount);
    const [negOp, negVal] = this.pickNegative(troopCount);

    this.gates.push(
      new Gate(this.scene, posX, y, posOp, posVal, GATE_SPEED),
      new Gate(this.scene, negX, y, negOp, negVal, GATE_SPEED),
    );
  }

  private pickPositive(n: number): [GateOp, number] {
    if (Math.random() < 0.7 || n < 4) {
      const val = Phaser.Math.Between(2, Math.min(8, Math.max(2, Math.ceil(n * 0.6))));
      return ['+', val];
    }
    return ['×', 2];
  }

  private pickNegative(n: number): [GateOp, number] {
    if (Math.random() < 0.7 || n < 4) {
      const val = Phaser.Math.Between(1, Math.max(1, Math.floor(n * 0.3)));
      return ['-', val];
    }
    return ['÷', 2];
  }
}
