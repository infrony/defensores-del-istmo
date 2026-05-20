import Phaser from 'phaser';
import { Troop } from '../Troop';

export const GUERRERO_NGABE_CFG = {
  texture: 'troop-ngabe',
  hp: 60,
  damage: 22,
  range: 500,        // melé — rango medio
  fireRateMs: 700,
  projectileSpeed: 1400, // "proyectil" rápido y corto = golpe de melé
} as const;

export class GuerreroNgabe extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, GUERRERO_NGABE_CFG);
  }
}
