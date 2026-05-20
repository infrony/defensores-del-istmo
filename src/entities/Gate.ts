import Phaser from 'phaser';

export type GateOp = '+' | '-' | '×' | '÷' | 'upgrade';

/** Ancho y alto de la textura — usados para AABB y posicionamiento. */
export const GATE_W = 370;
export const GATE_H = 160;

function texForOp(op: GateOp): string {
  if (op === '+' || op === '×') return 'gate-positive';
  if (op === 'upgrade') return 'gate-upgrade';
  return 'gate-negative';
}

function labelColor(op: GateOp): string {
  if (op === '+' || op === '×') return '#c8ffd0';
  if (op === 'upgrade') return '#fff0a0';
  return '#ffd0d0';
}

export class Gate extends Phaser.Physics.Arcade.Image {
  public readonly op: GateOp;
  public readonly value: number;
  /** Para 'upgrade': nombre de la clase que otorga (p. ej. 'ngabe'). */
  public readonly upgradeClass: string;
  public alive = true;

  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    op: GateOp,
    value: number,
    speed: number,
    upgradeClass = '',
  ) {
    super(scene, x, y, texForOp(op));
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.op = op;
    this.value = value;
    this.upgradeClass = upgradeClass;
    this.setDepth(7);
    this.setVelocityY(speed);

    const labelText = op === 'upgrade' ? `⚔ ${upgradeClass}` : `${op}${value}`;
    this.label = scene.add
      .text(x, y, labelText, {
        fontFamily: 'sans-serif',
        fontSize: op === 'upgrade' ? '52px' : '80px',
        fontStyle: 'bold',
        color: labelColor(op),
        stroke: '#1a1a1a',
        strokeThickness: 7,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(8);
  }

  syncLabel(): void {
    this.label.setPosition(this.x, this.y);
  }

  collect(): void {
    if (!this.alive) return;
    this.alive = false;
    this.setActive(false).setVisible(false);
    this.label.setVisible(false);
    if (this.body) {
      this.body.enable = false;
      this.setVelocity(0, 0);
    }
  }

  cull(): void {
    this.collect();
    this.label.destroy();
  }
}
