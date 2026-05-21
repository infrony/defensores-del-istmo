import Phaser from 'phaser';
import { Enemy, type EnemyConfig } from '../Enemy';
import { LANE } from '../../config';

export const BOSS_MENDEZ_CFG: EnemyConfig = {
  texture: 'boss-mendez',
  hp: 1500,
  speed: 80,
  isBoss: true,
  bossType: 'mendez',
  goldValue: 50,
  damage: 0, // el boss no llega al jugador, sus patrones son horizontales
  displayW: 266,
  displayH: 266,
};

const SETTLE_Y = 480;

export class BossMendez extends Enemy {
  private settled = false;
  private busy = false;
  private sweepTimer = 0;
  private chargeTimer = 0;

  // Patterns fire at these intervals (ms) after the boss settles
  private readonly SWEEP_CD = 5500;
  private readonly CHARGE_CD = 9000;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, BOSS_MENDEZ_CFG);
    // displaySize ya aplicado por Enemy base via cfg.displayW/displayH
    this.setDepth(12);
  }

  bossUpdate(delta: number): void {
    if (!this.alive) return;

    // Descend until settled
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
    this.chargeTimer += delta;

    if (this.sweepTimer >= this.SWEEP_CD) {
      this.sweepTimer = 0;
      this.doSweep();
    } else if (this.chargeTimer >= this.CHARGE_CD) {
      this.chargeTimer = 0;
      this.doCharge();
    }
  }

  /** Patrón 1 — Barrido horizontal: telegraph amarillo → cruzar el carril → regresar */
  private doSweep(): void {
    this.busy = true;
    this.setTint(0xffdd00);

    this.scene.time.delayedCall(550, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      const dir = this.x < LANE.centerX ? 1 : -1;

      this.setVelocityX(dir * 680);
      this.scene.time.delayedCall(680, () => {
        if (!this.alive) { this.busy = false; return; }
        this.setVelocityX(-dir * 680);
        this.scene.time.delayedCall(680, () => {
          if (!this.alive) { this.busy = false; return; }
          this.setVelocityX(0);
          this.x = Phaser.Math.Clamp(this.x, LANE.leftBound + 80, LANE.rightBound - 80);
          this.busy = false;
        });
      });
    });
  }

  /** Patrón 2 — Embestida: telegraph rojo → avanza hacia el jugador → regresa a posición */
  private doCharge(): void {
    this.busy = true;
    this.setTint(0xff3030);

    this.scene.time.delayedCall(500, () => {
      if (!this.alive) { this.busy = false; return; }
      this.clearTint();
      this.setVelocityY(620);

      this.scene.time.delayedCall(620, () => {
        if (!this.alive) { this.busy = false; return; }
        this.setVelocityY(-620);

        this.scene.time.delayedCall(620, () => {
          if (!this.alive) { this.busy = false; return; }
          this.setVelocityY(0);
          this.y = SETTLE_Y;
          this.busy = false;
        });
      });
    });
  }
}
