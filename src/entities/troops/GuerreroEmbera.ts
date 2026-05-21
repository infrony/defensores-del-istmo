import Phaser from 'phaser';
import { Troop } from '../Troop';

export const GUERRERO_EMBERA_CFG = {
  texture: 'troop-archer',
  hp: 45,
  damage: 14,
  range: 800,
  fireRateMs: 500,
  projectileSpeed: 1000,
  displayW: 68,
  displayH: 68,
} as const;

export class GuerreroEmbera extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GUERRERO_EMBERA_CFG);
  }
}
