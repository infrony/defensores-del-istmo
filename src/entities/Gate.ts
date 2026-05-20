import Phaser from 'phaser';

export type GateOp = '+' | '-' | '×' | '÷';

/** Ancho y alto de la textura — usados para AABB y posicionamiento. */
export const GATE_W = 370;
export const GATE_H = 160;

export class Gate extends Phaser.Physics.Arcade.Image {
  public readonly op: GateOp;
  public readonly value: number;
  public alive = true;

  private label: Phaser.GameObjects.Text;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    op: GateOp,
    value: number,
    speed: number,
  ) {
    const tex = op === '+' || op === '×' ? 'gate-positive' : 'gate-negative';
    super(scene, x, y, tex);
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.op = op;
    this.value = value;
    this.setDepth(7);
    this.setVelocityY(speed);

    const isPos = op === '+' || op === '×';
    this.label = scene.add
      .text(x, y, `${op}${value}`, {
        fontFamily: 'sans-serif',
        fontSize: '80px',
        fontStyle: 'bold',
        color: isPos ? '#c8ffd0' : '#ffd0d0',
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
