const KEY = 'defensores_save_v1';

export interface RunStats {
  bestDistance: number;
  bestKills: number;
  bestGold: number;
  totalRuns: number;
  completedChapters: string[];
}

const DEFAULTS: RunStats = { bestDistance: 0, bestKills: 0, bestGold: 0, totalRuns: 0, completedChapters: [] };

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
  save(distance: number, kills: number, gold: number): { stats: RunStats; newBest: boolean } {
    const prev = SaveSystem.load();
    const newBest = Math.floor(distance) > prev.bestDistance;
    const next: RunStats = {
      bestDistance: Math.max(prev.bestDistance, Math.floor(distance)),
      bestKills: Math.max(prev.bestKills, kills),
      bestGold: Math.max(prev.bestGold, gold),
      totalRuns: prev.totalRuns + 1,
      completedChapters: prev.completedChapters,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(next));
    } catch {
      // Private/incognito mode — ignore
    }
    return { stats: next, newBest };
  },

  hasSeenOnboarding(): boolean {
    return !!localStorage.getItem('defensores_tutorial_v1');
  },

  markOnboardingSeen(): void {
    try {
      localStorage.setItem('defensores_tutorial_v1', '1');
    } catch {}
  },

  markChapterComplete(levelId: string): void {
    const s = SaveSystem.load();
    if (!s.completedChapters.includes(levelId)) {
      s.completedChapters.push(levelId);
      try { localStorage.setItem(KEY, JSON.stringify(s)); } catch {}
    }
  },

  isChapterComplete(levelId: string): boolean {
    return SaveSystem.load().completedChapters.includes(levelId);
  },
};
