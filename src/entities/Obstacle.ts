import Phaser from 'phaser';

export const OBSTACLE_HP = 60;
const OBSTACLE_SPEED = 340; // px/s descendentes (entre enemigos y scroll)

export class Obstacle extends Phaser.Physics.Arcade.Image {
  public hp = OBSTACLE_HP;
  public alive = true;

  private hpLabel!: Phaser.GameObjects.Text;

  constructor(scene: Phaser.Scene, x: number, y: number) {
    super(scene, x, y, 'obstacle-barrel');
    scene.add.existing(this);
    scene.physics.add.existing(this);
    this.setDepth(8);
    this.setDisplaySize(80, 96);
    this.setImmovable(true);
    this.setVelocityY(OBSTACLE_SPEED);
    (this.body as Phaser.Physics.Arcade.Body).setSize(80, 96);

    this.hpLabel = scene.add
      .text(x, y + 50, `${OBSTACLE_HP}`, {
        fontFamily: 'sans-serif',
        fontSize: '30px',
        fontStyle: 'bold',
        color: '#ffdd88',
        stroke: '#1a1a1a',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5, 0)
      .setDepth(9);
  }

  takeDamage(amount: number): boolean {
    if (!this.alive) return false;
    this.hp -= amount;
    this.hpLabel.setText(`${Math.max(0, this.hp)}`);
    this.scene.tweens.add({ targets: this, alpha: 0.4, duration: 40, yoyo: true });
    if (this.hp <= 0) {
      this.kill();
      return true;
    }
    return false;
  }

  syncLabel(): void {
    this.hpLabel.setPosition(this.x, this.y + 50);
  }

  kill(): void {
    if (!this.alive) return;
    this.alive = false;
    this.setActive(false).setVisible(false);
    this.hpLabel.setVisible(false);
    if (this.body) {
      this.body.enable = false;
      this.setVelocity(0, 0);
    }
  }

  destroy(fromScene?: boolean): void {
    if (this.hpLabel) this.hpLabel.destroy();
    super.destroy(fromScene);
  }
}
