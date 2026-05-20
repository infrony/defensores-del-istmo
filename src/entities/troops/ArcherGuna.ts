import Phaser from 'phaser';
import { Troop } from '../Troop';

export const ARCHER_GUNA_CFG = {
  texture: 'troop-archer',
  hp: 30,
  damage: 8,
  range: 520,
  fireRateMs: 420,
  projectileSpeed: 900,
} as const;

export class ArcherGuna extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, ARCHER_GUNA_CFG);
  }
}
