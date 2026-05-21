import Phaser from 'phaser';
import { Enemy, type EnemyConfig } from '../Enemy';

export const BOSS_MORGAN_CFG: EnemyConfig = {
  texture: 'boss-mendez', // placeholder
  hp: 3500,
  speed: 60,
  isBoss: true,
  bossType: 'morgan',
  goldValue: 120,
  damage: 0,
  displayW: 320,
  displayH: 320,
};

const SETTLE_Y = 420;

export class BossMorgan extends Enemy {
  private settled = false;
  private busy = false;
  private chargeTimer = 0;
  private cannonTimer = 0;
  private readonly CHARGE_CD = 5000;
  private readonly CANNON_CD = 8000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BOSS_MORGAN_CFG);
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
    this.chargeTimer += delta;
    this.cannonTimer += delta;
    if (this.chargeTimer >= this.CHARGE_CD) {
      this.chargeTimer = 0;
      this.doCharge();
    } else if (this.cannonTimer >= this.CANNON_CD) {
      this.cannonTimer = 0;
      this.doCannon();
    }
  }

  private doCharge(): void {
    this.busy = true;
    this.setTint(0xff3030);
    this.scene.time.delayedCall(500, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      this.setVelocityY(680);
      this.scene.time.delayedCall(600, () => {
        if (!this.alive) { this.busy = false; return; }
        this.setVelocityY(-680);
        this.scene.time.delayedCall(600, () => {
          if (!this.alive) { this.busy = false; return; }
          this.setVelocityY(0);
          this.y = SETTLE_Y;
          this.busy = false;
        });
      });
    });
  }

  private doCannon(): void {
    this.busy = true;
    this.setTint(0xff8800);
    this.scene.time.delayedCall(900, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      this.busy = false;
    });
  }
}
