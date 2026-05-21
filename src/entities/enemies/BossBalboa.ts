import Phaser from 'phaser';
import { Enemy, type EnemyConfig } from '../Enemy';
import { LANE } from '../../config';

export const BOSS_BALBOA_CFG: EnemyConfig = {
  texture: 'boss-mendez', // placeholder
  hp: 2500,
  speed: 70,
  isBoss: true,
  bossType: 'balboa',
  goldValue: 80,
  damage: 0,
  displayW: 300,
  displayH: 300,
};

const SETTLE_Y = 400;

export class BossBalboa extends Enemy {
  private settled = false;
  private busy = false;
  private sweepTimer = 0;
  private volleyTimer = 0;
  private readonly SWEEP_CD = 4500;
  private readonly VOLLEY_CD = 7000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BOSS_BALBOA_CFG);
    this.setDepth(12);
  }

  bossUpdate(delta: number): void {
    if (!this.alive) return;
    if (!this.settled) {
      if (this.y >= SETTLE_Y) {
        this.settled = true;
        this.setVelocityY(0);
        this.y = SETTLE_Y;
      }
      return;
    }
    if (this.busy) return;
    this.sweepTimer += delta;
    this.volleyTimer += delta;
    if (this.sweepTimer >= this.SWEEP_CD) {
      this.sweepTimer = 0;
      this.doSweep();
    } else if (this.volleyTimer >= this.VOLLEY_CD) {
      this.volleyTimer = 0;
      this.doVolley();
    }
  }

  private doSweep(): void {
    this.busy = true;
    this.setTint(0xffdd00);
    this.scene.time.delayedCall(500, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      const dir = this.x < LANE.centerX ? 1 : -1;
      this.setVelocityX(dir * 720);
      this.scene.time.delayedCall(620, () => {
        if (!this.alive) { this.busy = false; return; }
        this.setVelocityX(-dir * 720);
        this.scene.time.delayedCall(620, () => {
          if (!this.alive) { this.busy = false; return; }
          this.setVelocityX(0);
          this.x = Phaser.Math.Clamp(this.x, LANE.leftBound + 80, LANE.rightBound - 80);
          this.busy = false;
        });
      });
    });
  }

  private doVolley(): void {
    this.busy = true;
    this.setTint(0x4488ff);
    this.scene.time.delayedCall(1200, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      this.busy = false;
    });
  }
}
