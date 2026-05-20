import Phaser from 'phaser';

export const GAME_WIDTH = 1080;
export const GAME_HEIGHT = 1920;

export const LANE = {
  leftBound: 120,
  rightBound: GAME_WIDTH - 120,
  centerX: GAME_WIDTH / 2,
};

export const COLORS = {
  bgDeep: 0x0b1d2a,
  bgPath: 0x4a3320,
  bgGrass: 0x274d3a,
  player: 0xe8c170,
  playerOutline: 0x1a1a1a,
  trailA: 0x7a5a35,
  trailB: 0x6b4d2c,
} as const;

type SceneCtor = new (...args: unknown[]) => Phaser.Scene;

export function createGameConfig(scenes: SceneCtor[]): Phaser.Types.Core.GameConfig {
  return {
    type: Phaser.AUTO,
    parent: 'game',
    backgroundColor: COLORS.bgDeep,
    scale: {
      mode: Phaser.Scale.FIT,
      autoCenter: Phaser.Scale.CENTER_BOTH,
      width: GAME_WIDTH,
      height: GAME_HEIGHT,
    },
    physics: {
      default: 'arcade',
      arcade: {
        gravity: { x: 0, y: 0 },
        debug: false,
      },
    },
    input: {
      activePointers: 2,
    },
    render: {
      antialias: true,
      pixelArt: false,
      roundPixels: false,
    },
    fps: {
      target: 60,
      forceSetTimeOut: false,
    },
    scene: scenes,
  };
}
