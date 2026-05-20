const KEY = 'defensores_save_v1';

export interface RunStats {
  bestDistance: number;
  bestKills: number;
  totalRuns: number;
}

const DEFAULTS: RunStats = { bestDistance: 0, bestKills: 0, totalRuns: 0 };

export const SaveSystem = {
  load(): RunStats {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) return { ...DEFAULTS };
      return { ...DEFAULTS, ...JSON.parse(raw) };
    } catch {
      return { ...DEFAULTS };
    }
  },

  /** Persists run result, returns updated stats and whether a new distance record was set. */
  save(distance: number, kills: number): { stats: RunStats; newBest: boolean } {
    const prev = SaveSystem.load();
    const newBest = Math.floor(distance) > prev.bestDistance;
    const next: RunStats = {
      bestDistance: Math.max(prev.bestDistance, Math.floor(distance)),
      bestKills: Math.max(prev.bestKills, kills),
      totalRuns: prev.totalRuns + 1,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Private/incognito mode — ignore
    }
    return { stats: next, newBest };
  },
};
