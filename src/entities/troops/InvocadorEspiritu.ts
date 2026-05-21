import Phaser from 'phaser';
import { Troop } from '../Troop';

export const INVOCADOR_ESPIRITU_CFG = {
  texture: 'troop-ngabe',
  hp: 40,
  damage: 10,
  range: 600,
  fireRateMs: 240,
  projectileSpeed: 1200,
  displayW: 70,
  displayH: 70,
} as const;

export class InvocadorEspiritu extends Troop {
  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, INVOCADOR_ESPIRITU_CFG);
  }
}
