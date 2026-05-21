import Phaser from 'phaser';
import { Troop } from '../Troop';

export const JAGUAR_WARRIOR_CFG = {
  texture: 'troop-ngabe',
  hp: 80,
  damage: 48,
  range: 320,
  fireRateMs: 950,
  projectileSpeed: 1600,
  displayW: 76,
  displayH: 76,
} as const;

export class JaguarWarrior extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, JAGUAR_WARRIOR_CFG);
  }
}
