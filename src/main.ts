import Phaser from 'phaser';
import { createGameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';
import { UpgradeScene } from './scenes/UpgradeScene';
import { MapScene } from './scenes/MapScene';
import { DailyScene } from './scenes/DailyScene';

const config = createGameConfig([BootScene, PreloadScene, MainMenuScene, GameScene, UpgradeScene, MapScene, DailyScene]);

new Phaser.Game(config);
