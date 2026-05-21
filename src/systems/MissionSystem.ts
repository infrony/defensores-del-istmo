import { ProgressionSystem } from './ProgressionSystem';
import { DailySystem } from './DailySystem';

const KEY = 'defensores_missions_v1';

export type MissionType = 'kills' | 'distance' | 'gates';

export interface Mission {
  type: MissionType;
  description: string;
  goal: number;
  progress: number;
  completed: boolean;
  reward: number; // oro al completar
  claimed: boolean;
}

interface MissionsState {
  date: string;      // fecha en que se generaron
  missions: Mission[];
}

const MISSION_TEMPLATES: Mission[] = [
  { type: 'kills',    description: 'Elimina 30 enemigos',       goal: 30, reward: 25, progress: 0, completed: false, claimed: false },
  { type: 'distance', description: 'Avanza 50 metros',          goal: 50, reward: 20, progress: 0, completed: false, claimed: false },
  { type: 'gates',    description: 'Pasa por 5 puertas verdes', goal: 5,  reward: 15, progress: 0, completed: false, claimed: false },
];

function freshMissions(): Mission[] {
  return MISSION_TEMPLATES.map(t => ({ ...t }));
}

export const MissionSystem = {
  load(): Mission[] {
    try {
      const raw = localStorage.getItem(KEY);
      if (!raw) {
        const missions = freshMissions();
        MissionSystem.save(missions);
        return missions;
      }
      const state: MissionsState = JSON.parse(raw);
      const today = DailySystem.getTodayDate();
      if (state.date !== today) {
        const missions = freshMissions();
        MissionSystem.save(missions);
        return missions;
      }
      return state.missions;
    } catch {
      const missions = freshMissions();
      MissionSystem.save(missions);
      return missions;
    }
  },

  report(type: MissionType, amount: number): void {
    const missions = MissionSystem.load();
    const mission = missions.find(m => m.type === type);
    if (!mission || mission.completed) return;
    mission.progress = Math.min(mission.progress + amount, mission.goal);
    if (mission.progress >= mission.goal) {
      mission.completed = true;
    }
    MissionSystem.save(missions);
  },

  claimMission(index: number): number {
    const missions = MissionSystem.load();
    const mission = missions[index];
    if (!mission || !mission.completed || mission.claimed) return 0;
    mission.claimed = true;
    MissionSystem.save(missions);
    ProgressionSystem.addGold(mission.reward);
    return mission.reward;
  },

  hasUnclaimedCompleted(): boolean {
    const missions = MissionSystem.load();
    return missions.some(m => m.completed && !m.claimed);
  },

  save(missions: Mission[]): void {
    const state: MissionsState = {
      date: DailySystem.getTodayDate(),
      missions,
    };
    try {
      localStorage.setItem(KEY, JSON.stringify(state));
    } catch {
      // Private/incognito mode — ignore
    }
  },
};
