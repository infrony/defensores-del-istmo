import Phaser from 'phaser';
import { createGameConfig } from './config';
import { BootScene } from './scenes/BootScene';
import { PreloadScene } from './scenes/PreloadScene';
import { MainMenuScene } from './scenes/MainMenuScene';
import { GameScene } from './scenes/GameScene';

const config = createGameConfig([BootScene, PreloadScene, MainMenuScene, GameScene]);

new Phaser.Game(config);
