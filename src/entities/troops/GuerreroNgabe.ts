import Phaser from 'phaser';
import { Troop } from '../Troop';

export const GUERRERO_NGABE_CFG = {
  texture: 'troop-ngabe',
  hp: 60,
  damage: 22,
  range: 500,
  fireRateMs: 700,
  projectileSpeed: 1400,
  displayW: 72,
  displayH: 72,
} as const;

export class GuerreroNgabe extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GUERRERO_NGABE_CFG);
  }
}
