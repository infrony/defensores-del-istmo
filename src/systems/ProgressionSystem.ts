const KEY = 'defensores_progression_v1';

export type UpgradeType = 'initialTroops' | 'damageBoost' | 'hpBoost' | 'fireRateBonus';

export interface PlayerProgression {
  initialTroops: number;  // 0-3
  damageBoost: number;    // 0-3
  hpBoost: number;        // 0-3
  fireRateBonus: number;  // 0-3
  totalGold: number;      // oro acumulado total disponible para gastar
}

const DEFAULTS: PlayerProgression = {
  initialTroops: 0,
  damageBoost: 0,
  hpBoost: 0,
  fireRateBonus: 0,
  totalGold: 0,
};

const INITIAL_TROOPS_VALUES = [6, 8, 10, 12] as const;
const DAMAGE_MULTIPLIERS = [1.0, 1.1, 1.25, 1.4] as const;
const HP_MULTIPLIERS = [1.0, 1.2, 1.5, 1.8] as const;
const FIRE_RATE_MULTIPLIERS = [1.0, 0.92, 0.84, 0.75] as const;

const UPGRADE_COSTS: Record<UpgradeType, [number, number, number]> = {
  initialTroops: [30, 60, 100],
  damageBoost: [20, 50, 90],
  hpBoost: [25, 55, 95],
  fireRateBonus: [30, 60, 100],
};

export const ProgressionSystem = {
  load(): PlayerProgression {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULTS };
    }
  },

  save(p: PlayerProgression): void {
    try {
      localStorage.setItem(KEY, JSON.stringify(p));
    } catch {
      // Private/incognito mode — ignore
    }
  },

  getInitialTroops(): number {
    const p = ProgressionSystem.load();
    return INITIAL_TROOPS_VALUES[Math.min(p.initialTroops, 3)];
  },

  getDamageMultiplier(): number {
    const p = ProgressionSystem.load();
    return DAMAGE_MULTIPLIERS[Math.min(p.damageBoost, 3)];
  },

  getHpMultiplier(): number {
    const p = ProgressionSystem.load();
    return HP_MULTIPLIERS[Math.min(p.hpBoost, 3)];
  },

  getFireRateMultiplier(): number {
    const p = ProgressionSystem.load();
    return FIRE_RATE_MULTIPLIERS[Math.min(p.fireRateBonus, 3)];
  },

  getUpgradeCost(type: UpgradeType): number | null {
    const p = ProgressionSystem.load();
    const level = p[type];
    if (level >= 3) return null;
    return UPGRADE_COSTS[type][level];
  },

  canAfford(type: UpgradeType, gold: number): boolean {
    const cost = ProgressionSystem.getUpgradeCost(type);
    if (cost === null) return false;
    return gold >= cost;
  },

  applyUpgrade(type: UpgradeType): void {
    const p = ProgressionSystem.load();
    const cost = ProgressionSystem.getUpgradeCost(type);
    if (cost === null) return;
    if (p.totalGold < cost) return;
    p.totalGold -= cost;
    p[type] = Math.min(p[type] + 1, 3);
    ProgressionSystem.save(p);
  },

  addGold(amount: number): void {
    const p = ProgressionSystem.load();
    p.totalGold += amount;
    ProgressionSystem.save(p);
  },
};
