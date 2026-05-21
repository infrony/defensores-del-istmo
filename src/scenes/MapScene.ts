import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';
import { SaveSystem } from '../systems/SaveSystem';

interface ChapterDef {
  levelId: string;
  name: string;
  subtitle: string;
  unlocked: boolean;
  requiresCompletion: string | null;
  nodeY: number;
  color: number;
}

const CHAPTER_DEFS: ChapterDef[] = [
  {
    levelId: 'veraguas-1502-1',
    name: 'Cap. 1\nVeraguas 1502',
    subtitle: 'El Desembarco',
    unlocked: true,
    requiresCompletion: null,
    nodeY: GAME_HEIGHT * 0.72,
    color: 0x4ec9b0,
  },
  {
    levelId: 'darien-1513-1',
    name: 'Cap. 2\nDarién 1513',
    subtitle: 'Cruce del Darién',
    unlocked: false,
    requiresCompletion: 'veraguas-1502-1',
    nodeY: GAME_HEIGHT * 0.50,
    color: 0xd4873a,
  },
  {
    levelId: 'panama-viejo-1671-1',
    name: 'Cap. 3\nPanamá Viejo',
    subtitle: 'La Defensa Final',
    unlocked: false,
    requiresCompletion: 'darien-1513-1',
    nodeY: GAME_HEIGHT * 0.28,
    color: 0xe8c170,
  },
];

const NODE_RADIUS = 80;
const NODE_X = GAME_WIDTH / 2;

export class MapScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MapScene' });
  }

  create(): void {
    // Calculate unlock state from save data
    const chapters: ChapterDef[] = CHAPTER_DEFS.map((ch) => ({
      ...ch,
      unlocked:
        ch.requiresCompletion === null
          ? true
          : SaveSystem.isChapterComplete(ch.requiresCompletion),
    }));

    // Background
    this.add.rectangle(NODE_X, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1d2a);

    // Title
    this.add
      .text(NODE_X, 100, 'ELIGE CAPÍTULO', {
        fontFamily: 'serif',
        fontSize: '64px',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 6,
      })
      .setOrigin(0.5, 0.5);

    // Dashed vertical line connecting nodes (bottom to top)
    this.drawDashedPath(chapters);

    // Draw chapter nodes
    for (const ch of chapters) {
      this.drawNode(ch);
    }

    // Back button
    const backBtn = this.add
      .text(60, 60, '← Menú', {
        fontFamily: 'sans-serif',
        fontSize: '40px',
        color: '#a8c5b8',
        stroke: '#1a1a1a',
        strokeThickness: 4,
      })
      .setOrigin(0, 0.5)
      .setInteractive({ useHandCursor: true });

    backBtn.on('pointerup', () => {
      this.scene.start('MainMenuScene');
    });

    backBtn.on('pointerover', () => {
      backBtn.setColor('#ffffff');
    });

    backBtn.on('pointerout', () => {
      backBtn.setColor('#a8c5b8');
    });
  }

  private drawDashedPath(chapters: ChapterDef[]): void {
    const gfx = this.add.graphics();
    gfx.lineStyle(4, 0x556677, 0.8);

    // Sort by Y ascending (top to bottom) to draw from bottom node to top node
    const sorted = [...chapters].sort((a, b) => b.nodeY - a.nodeY);

    for (let i = 0; i < sorted.length - 1; i++) {
      const startY = sorted[i].nodeY - NODE_RADIUS;
      const endY = sorted[i + 1].nodeY + NODE_RADIUS;
      this.drawDashedLine(gfx, NODE_X, startY, NODE_X, endY, 20, 15);
    }
  }

  private drawDashedLine(
    gfx: Phaser.GameObjects.Graphics,
    x1: number,
    y1: number,
    x2: number,
    y2: number,
    dashLen: number,
    gapLen: number,
  ): void {
    const dx = x2 - x1;
    const dy = y2 - y1;
    const total = Math.sqrt(dx * dx + dy * dy);
    const nx = dx / total;
    const ny = dy / total;

    let traveled = 0;
    let drawing = true;

    while (traveled < total) {
      const segLen = Math.min(drawing ? dashLen : gapLen, total - traveled);
      if (drawing) {
        gfx.beginPath();
        gfx.moveTo(x1 + nx * traveled, y1 + ny * traveled);
        gfx.lineTo(x1 + nx * (traveled + segLen), y1 + ny * (traveled + segLen));
        gfx.strokePath();
      }
      traveled += segLen;
      drawing = !drawing;
    }
  }

  private drawNode(ch: ChapterDef): void {
    const isComplete = SaveSystem.isChapterComplete(ch.levelId);
    const gfx = this.add.graphics();

    if (ch.unlocked) {
      // Filled circle with border
      gfx.fillStyle(ch.color, 1);
      gfx.fillCircle(NODE_X, ch.nodeY, NODE_RADIUS);
      gfx.lineStyle(4, ch.color, 1);
      gfx.strokeCircle(NODE_X, ch.nodeY, NODE_RADIUS + 4);

      // Chapter name
      this.add
        .text(NODE_X, ch.nodeY - 18, ch.name, {
          fontFamily: 'sans-serif',
          fontSize: '34px',
          color: '#ffffff',
          align: 'center',
          fontStyle: 'bold',
          stroke: '#1a1a1a',
          strokeThickness: 3,
        })
        .setOrigin(0.5, 0.5);

      // Subtitle
      this.add
        .text(NODE_X, ch.nodeY + NODE_RADIUS + 24, ch.subtitle, {
          fontFamily: 'sans-serif',
          fontSize: '30px',
          color: '#cccccc',
          align: 'center',
        })
        .setOrigin(0.5, 0);

      // Completed star
      if (isComplete) {
        this.add
          .text(NODE_X + NODE_RADIUS - 10, ch.nodeY - NODE_RADIUS + 10, '⭐', {
            fontSize: '40px',
          })
          .setOrigin(0.5, 0.5);
      }

      // Interactive hit area
      const hitZone = this.add
        .circle(NODE_X, ch.nodeY, NODE_RADIUS, 0xffffff, 0)
        .setInteractive({ useHandCursor: true });

      hitZone.on('pointerup', () => {
        this.scene.start('GameScene', { levelId: ch.levelId });
      });

      hitZone.on('pointerover', () => {
        gfx.clear();
        gfx.fillStyle(ch.color, 1);
        gfx.fillCircle(NODE_X, ch.nodeY, NODE_RADIUS);
        gfx.lineStyle(8, 0xffffff, 0.9);
        gfx.strokeCircle(NODE_X, ch.nodeY, NODE_RADIUS + 4);
      });

      hitZone.on('pointerout', () => {
        gfx.clear();
        gfx.fillStyle(ch.color, 1);
        gfx.fillCircle(NODE_X, ch.nodeY, NODE_RADIUS);
        gfx.lineStyle(4, ch.color, 1);
        gfx.strokeCircle(NODE_X, ch.nodeY, NODE_RADIUS + 4);
      });
    } else {
      // Locked node — dark circle
      gfx.fillStyle(0x333344, 1);
      gfx.fillCircle(NODE_X, ch.nodeY, NODE_RADIUS);
      gfx.lineStyle(3, 0x444455, 1);
      gfx.strokeCircle(NODE_X, ch.nodeY, NODE_RADIUS);

      // Lock icon
      this.add
        .text(NODE_X, ch.nodeY - 10, '🔒', {
          fontSize: '52px',
        })
        .setOrigin(0.5, 0.5);

      // ??? text below lock
      this.add
        .text(NODE_X, ch.nodeY + NODE_RADIUS + 24, '???', {
          fontFamily: 'sans-serif',
          fontSize: '30px',
          color: '#666677',
          align: 'center',
        })
        .setOrigin(0.5, 0);
    }
  }
}
