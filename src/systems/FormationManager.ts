import Phaser from 'phaser';
import type { Troop } from '../entities/Troop';
import type { ProjectilePool } from './ProjectilePool';

const COLS = 5;
const COL_ORDER = [2, 1, 3, 0, 4]; // expandir desde el centro hacia los bordes
const CELL_W = 80;
const CELL_H = 90;

export class FormationManager {
  private troops: Troop[] = [];

  constructor(private scene: Phaser.Scene) {}

  add(troop: Troop): void {
    troop.slot = this.troops.length;
    this.troops.push(troop);
  }

  remove(troop: Troop): void {
    const idx = this.troops.indexOf(troop);
    if (idx === -1) return;
    this.troops.splice(idx, 1);
    troop.destroy();
    this.reindex();
  }

  count(): number {
    return this.troops.length;
  }

  list(): readonly Troop[] {
    return this.troops;
  }

  /** Compute slot offset relative to leader (player). */
  static slotOffset(slot: number): { dx: number; dy: number } {
    const row = Math.floor(slot / COLS);
    const col = COL_ORDER[slot % COLS];
    const dx = (col - 2) * CELL_W;
    const dy = (row + 1) * CELL_H; // below player in screen space
    return { dx, dy };
  }

  /** Update all troops: position + combat tick. */
  update(time: number, delta: number, leaderX: number, leaderY: number, pool: ProjectilePool): void {
    for (let i = 0; i < this.troops.length; i++) {
      const t = this.troops[i];
      if (!t.alive) continue;
      const { dx, dy } = FormationManager.slotOffset(t.slot);
      t.targetX = leaderX + dx;
      t.targetY = leaderY + dy;
      t.update(time, delta, pool);
    }
  }

  private reindex(): void {
    for (let i = 0; i < this.troops.length; i++) {
      this.troops[i].slot = i;
    }
  }
}
