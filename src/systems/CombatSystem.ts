import type { Enemy } from '../entities/Enemy';
import type { FormationManager } from './FormationManager';
import { SpatialHash } from './SpatialHash';

const RETARGET_INTERVAL_MS = 200;

/**
 * Recalcula targets de tropas usando un spatial hash de enemigos vivos.
 * Cada 200ms basta — el feel sigue siendo "instantáneo" en mobile.
 */
export class CombatSystem {
  private hash = new SpatialHash<Enemy>(160);
  private accum = 0;

  update(delta: number, formation: FormationManager, enemies: Enemy[]): void {
    this.accum += delta;
    if (this.accum < RETARGET_INTERVAL_MS) return;
    this.accum = 0;

    this.hash.clear();
    for (let i = 0; i < enemies.length; i++) {
      const e = enemies[i];
      if (e.alive) this.hash.insert(e);
    }

    const troops = formation.list();
    for (let i = 0; i < troops.length; i++) {
      const t = troops[i];
      if (!t.alive) continue;
      // Si ya tiene target válido y en rango, mantenerlo (evita target-flapping)
      if (t.hasTarget()) continue;
      const nearest = this.hash.queryNearest(t.x, t.y, t.range, (e) => e.alive);
      t.setTarget(nearest);
    }
  }
}
