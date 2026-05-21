import { EnemySpawner } from './EnemySpawner';
import { SAILOR_CFG } from '../entities/enemies/Sailor';
import { CONQUISTADOR_CFG } from '../entities/enemies/Conquistador';
import { BOSS_MENDEZ_CFG } from '../entities/enemies/BossMendez';
import { BOSS_BALBOA_CFG } from '../entities/enemies/BossBalboa';
import { BOSS_MORGAN_CFG } from '../entities/enemies/BossMorgan';
import { BALLESTERO_CFG } from '../entities/enemies/Ballestero';
import { PERRO_CFG } from '../entities/enemies/PerroDeCaza';
import { PIRATA_CFG } from '../entities/enemies/Pirata';
import type { EnemyConfig } from '../entities/Enemy';
import levelsData from '../data/levels.json';

interface Wave {
  atM: number;
  enemy: string;
  count: number;
  intervalMs: number;
}

interface LevelDef {
  id: string;
  chapter: number;
  name: string;
  durationM: number;
  waves: Wave[];
}

const ENEMY_MAP: Record<string, EnemyConfig> = {
  sailor: SAILOR_CFG,
  conquistador: CONQUISTADOR_CFG,
  ballestero: BALLESTERO_CFG,
  'perro-caza': PERRO_CFG,
  pirata: PIRATA_CFG,
  'boss-mendez': BOSS_MENDEZ_CFG,
  'boss-balboa': BOSS_BALBOA_CFG,
  'boss-morgan': BOSS_MORGAN_CFG,
};

/** Drives EnemySpawner using a level JSON definition instead of procedural rules. */
export class SpawnManager {
  private level: LevelDef;
  private pendingWaves: Wave[];
  private activeWave: Wave | null = null;
  private waveCount = 0;
  private waveAccum = 0;

  constructor(
    levelId: string,
    private spawner: EnemySpawner,
  ) {
    const found = (levelsData.levels as LevelDef[]).find((l) => l.id === levelId);
    this.level = found ?? (levelsData.levels[0] as LevelDef);
    this.pendingWaves = [...this.level.waves];
  }

  get levelName(): string {
    return this.level.name;
  }

  /** @param distanceM current run distance in meters */
  update(delta: number, distanceM: number): void {
    // Activate any waves whose trigger distance has been reached
    while (
      this.pendingWaves.length > 0 &&
      distanceM >= this.pendingWaves[0].atM
    ) {
      this.activeWave = this.pendingWaves.shift()!;
      this.waveCount = 0;
      this.waveAccum = 0;
    }

    if (!this.activeWave) return;
    if (this.activeWave.count === 0) return;

    this.waveAccum += delta;
    const interval = Math.max(this.activeWave.intervalMs, 1);

    while (this.waveAccum >= interval && this.waveCount < this.activeWave.count) {
      this.waveAccum -= interval;
      const cfg = ENEMY_MAP[this.activeWave.enemy] ?? SAILOR_CFG;
      this.spawner.spawnWithCfg(cfg);
      this.waveCount++;
    }

    if (this.waveCount >= this.activeWave.count) {
      this.activeWave = null;
    }
  }
}
