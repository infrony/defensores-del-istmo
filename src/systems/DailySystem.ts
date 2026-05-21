import { ProgressionSystem } from './ProgressionSystem';

const KEY = 'defensores_daily_v1';

interface DailyState {
  lastLoginDate: string; // ISO date string 'YYYY-MM-DD'
  streak: number;        // días consecutivos (max 7)
  pendingReward: number; // oro pendiente de reclamar (0 si ya reclamado hoy)
}

// Recompensas por día de racha (índice 0=día1, 6=día7)
const STREAK_REWARDS = [10, 15, 20, 30, 40, 50, 100];

const DEFAULTS: DailyState = {
  lastLoginDate: '',
  streak: 0,
  pendingReward: 0,
};

function loadState(): DailyState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULTS };
    return { ...DEFAULTS, ...JSON.parse(raw) };
  } catch {
    return { ...DEFAULTS };
  }
}

function saveState(state: DailyState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Private/incognito mode — ignore
  }
}

export const DailySystem = {
  getTodayDate(): string {
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, '0');
    const dd = String(now.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  },

  check(): { isNewDay: boolean; streak: number; reward: number; day: number } {
    const state = loadState();
    const today = DailySystem.getTodayDate();

    // Already checked in today — no new day
    if (state.lastLoginDate === today) {
      return { isNewDay: false, streak: state.streak, reward: 0, day: state.streak };
    }

    let newStreak: number;

    if (state.lastLoginDate === '') {
      // First ever login
      newStreak = 1;
    } else {
      // Compute difference in days between lastLoginDate and today
      const last = new Date(state.lastLoginDate);
      const todayDate = new Date(today);
      const diffMs = todayDate.getTime() - last.getTime();
      const diffDays = Math.round(diffMs / (1000 * 60 * 60 * 24));

      if (diffDays === 1) {
        // Consecutive day — increment streak (max 7)
        newStreak = Math.min(state.streak + 1, 7);
      } else {
        // Missed one or more days — reset streak
        newStreak = 1;
      }
    }

    const reward = STREAK_REWARDS[Math.min(newStreak - 1, 6)];

    const newState: DailyState = {
      lastLoginDate: today,
      streak: newStreak,
      pendingReward: reward,
    };
    saveState(newState);

    return { isNewDay: true, streak: newStreak, reward, day: newStreak };
  },

  claimReward(): number {
    const state = loadState();
    const amount = state.pendingReward;
    if (amount > 0) {
      ProgressionSystem.addGold(amount);
      state.pendingReward = 0;
      saveState(state);
    }
    return amount;
  },

  hasPendingReward(): boolean {
    return loadState().pendingReward > 0;
  },
};
