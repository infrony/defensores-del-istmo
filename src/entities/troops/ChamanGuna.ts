import Phaser from 'phaser';
import { Troop } from '../Troop';

export const CHAMAN_GUNA_CFG = {
  texture: 'troop-archer',
  hp: 25,
  damage: 38,
  range: 1600,
  fireRateMs: 1300,
  projectileSpeed: 1100,
  displayW: 64,
  displayH: 64,
} as const;

export class ChamanGuna extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, CHAMAN_GUNA_CFG);
  }
}
