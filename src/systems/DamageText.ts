import Phaser from 'phaser';

const POOL_SIZE = 30;

interface PooledText {
  text: Phaser.GameObjects.Text;
  active: boolean;
}

/**
 * Pool de textos flotantes de daño. Reutiliza objetos Text para no crear GC.
 * Uso: DamageText.show(scene, x, y, amount, isCrit)
 */
export class DamageText {
  private pool: PooledText[] = [];

  constructor(private scene: Phaser.Scene) {
    for (let i = 0; i < POOL_SIZE; i++) {
      const text = scene.add
        .text(0, 0, '', {
          fontFamily: 'sans-serif',
          fontSize: '44px',
          fontStyle: 'bold',
          color: '#ffffff',
          stroke: '#1a1a1a',
          strokeThickness: 5,
        })
        .setOrigin(0.5)
        .setDepth(30)
        .setVisible(false);
      this.pool.push({ text, active: false });
    }
  }

  show(x: number, y: number, amount: number, isCrit = false): void {
    const slot = this.pool.find((p) => !p.active);
    if (!slot) return;

    slot.active = true;
    slot.text
      .setText(isCrit ? `${amount}!` : `${amount}`)
      .setFontSize(isCrit ? 64 : 44)
      .setColor(isCrit ? '#ffe066' : '#ffffff')
      .setPosition(x + Phaser.Math.Between(-20, 20), y - 10)
      .setAlpha(1)
      .setScale(isCrit ? 1.3 : 1)
      .setVisible(true);

    this.scene.tweens.add({
      targets: slot.text,
      y: slot.text.y - (isCrit ? 110 : 80),
      alpha: 0,
      scaleX: isCrit ? 0.6 : 0.8,
      scaleY: isCrit ? 0.6 : 0.8,
      duration: isCrit ? 750 : 550,
      ease: 'Cubic.Out',
      onComplete: () => {
        slot.text.setVisible(false);
        slot.active = false;
      },
    });
  }
}
