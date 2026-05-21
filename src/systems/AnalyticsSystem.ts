/**
 * AnalyticsSystem — lightweight local analytics backed by localStorage.
 * Drop-in ready to be replaced with Firebase Analytics (see TODO below).
 *
 * Usage (fire-and-forget, never await):
 *   AnalyticsSystem.track({ event: 'run_start', levelId: 'l1', troops: 5 });
 */

type AnalyticsEvent =
  | { event: 'run_start'; levelId: string; troops: number }
  | { event: 'run_end'; levelId: string; result: 'victory' | 'defeat'; kills: number; distance: number; gold: number; durationMs: number }
  | { event: 'gate_choice'; op: string; value: number; positive: boolean; troopsBefore: number; troopsAfter: number }
  | { event: 'boss_appear'; levelId: string; distanceM: number }
  | { event: 'level_complete'; levelId: string; kills: number; durationMs: number }
  | { event: 'upgrade_buy'; upgradeType: string; newLevel: number; goldSpent: number }
  | { event: 'daily_claim'; streak: number; goldEarned: number }
  | { event: 'mission_claim'; missionType: string; goldEarned: number };

type StoredEvent = AnalyticsEvent & { ts: number };

const STORAGE_KEY = 'defensores_analytics_v1';
const MAX_EVENTS = 200;

export class AnalyticsSystem {
  private constructor() {
    // Static-only class — do not instantiate.
  }

  /**
   * Record a game analytics event.
   * Fire-and-forget: never throws, never returns a value.
   */
  static track(event: AnalyticsEvent): void {
    // TODO: swap out for Firebase Analytics
    const entry: StoredEvent = { ...event, ts: Date.now() };
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      const events: StoredEvent[] = raw !== null ? (JSON.parse(raw) as StoredEvent[]) : [];

      events.push(entry);

      // FIFO: drop oldest entries when the buffer is full.
      if (events.length > MAX_EVENTS) {
        events.splice(0, events.length - MAX_EVENTS);
      }

      localStorage.setItem(STORAGE_KEY, JSON.stringify(events));
    } catch {
      // localStorage may be unavailable (private/incognito mode, quota exceeded).
      // Silently ignore — analytics must never break gameplay.
    }
  }

  /** Return all stored events (useful for debugging / dev tools). */
  static getEvents(): StoredEvent[] {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw === null) return [];
      return JSON.parse(raw) as StoredEvent[];
    } catch {
      return [];
    }
  }

  /** Wipe all stored analytics events. */
  static clear(): void {
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // Ignore — same private/incognito safety.
    }
  }
}
