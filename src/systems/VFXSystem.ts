import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT } from '../config';

export class VFXSystem {
  constructor(private scene: Phaser.Scene) {}

  /** Partículas de oro en kill: 5-7 círculos dorados pequeños que salen en abanico y se desvanecen */
  goldBurst(x: number, y: number): void {
    const count = 6;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 40 + Math.random() * 40; // 40-80px
      const radius = 6 + Math.random() * 2; // 6-8
      const circle = this.scene.add.circle(x, y, radius, 0xe8c170, 1);
      circle.setDepth(20);

      this.scene.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 350,
        ease: 'Power2',
        onComplete: () => {
          circle.destroy();
        },
      });
    }
  }

  /** Explosión de muerte regular: círculo que se expande y desvanece, flash blanco */
  deathExplosion(x: number, y: number): void {
    // Flash blanco
    const flash = this.scene.add.circle(x, y, 20, 0xffffff, 0.8);
    flash.setDepth(18);
    this.scene.tweens.add({
      targets: flash,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 200,
      ease: 'Power2',
      onComplete: () => {
        flash.destroy();
      },
    });

    // Círculo naranja
    const orange = this.scene.add.circle(x, y, 12, 0xff8800, 0.7);
    orange.setDepth(18);
    this.scene.tweens.add({
      targets: orange,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        orange.destroy();
      },
    });
  }

  /** Explosión épica de muerte de boss: 3 ondas concéntricas + lluvia de dorado */
  bossDeathExplosion(x: number, y: number): void {
    // 3 ondas concéntricas
    const waveColors = [0xe8c170, 0xff8800, 0xff4444];
    const waveRadii = [30, 50, 70];
    const waveDelays = [0, 150, 300];

    waveColors.forEach((color, i) => {
      const wave = this.scene.add.circle(x, y, waveRadii[i], color, 0.6);
      wave.setDepth(18);
      this.scene.tweens.add({
        targets: wave,
        scaleX: 5,
        scaleY: 5,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        delay: waveDelays[i],
        onComplete: () => {
          wave.destroy();
        },
      });
    });

    // 12 partículas de oro con mayor distancia
    const count = 12;
    for (let i = 0; i < count; i++) {
      const angle = Math.random() * Math.PI * 2;
      const distance = 80 + Math.random() * 80; // 80-160px
      const radius = 6 + Math.random() * 2; // 6-8
      const circle = this.scene.add.circle(x, y, radius, 0xe8c170, 1);
      circle.setDepth(20);

      this.scene.tweens.add({
        targets: circle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 500,
        ease: 'Power2',
        onComplete: () => {
          circle.destroy();
        },
      });
    }

    // Screen flash
    this.scene.cameras.main.flash(400, 255, 200, 80);
  }

  /** Efecto al pasar por una puerta positiva: anillo verde que se expande */
  gatePositiveFX(x: number, y: number): void {
    // Anillo verde (simulado con círculo transparente al centro + stroke via Graphics)
    const ring = this.scene.add.graphics();
    ring.lineStyle(4, 0x4ec950, 1);
    ring.strokeCircle(0, 0, 60);
    ring.setPosition(x, y);
    ring.setDepth(18);

    this.scene.tweens.add({
      targets: ring,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 400,
      ease: 'Power2',
      onComplete: () => {
        ring.destroy();
      },
    });

    // Texto "✦" que sube
    const text = this.scene.add.text(x, y, '✦', {
      fontSize: '80px',
      color: '#4ec950',
    });
    text.setOrigin(0.5, 0.5);
    text.setDepth(20);

    this.scene.tweens.add({
      targets: text,
      y: y - 100,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => {
        text.destroy();
      },
    });
  }

  /** Efecto al pasar por una puerta negativa: flash rojo + contracción */
  gateNegativeFX(_x: number, _y: number): void {
    const flash = this.scene.add.rectangle(
      GAME_WIDTH / 2,
      GAME_HEIGHT / 2,
      GAME_WIDTH,
      GAME_HEIGHT,
      0xff0000,
      0.18,
    );
    flash.setDepth(30);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      ease: 'Power2',
      onComplete: () => {
        flash.destroy();
      },
    });
  }

  /** Efecto al pasar por puerta de upgrade dorada: múltiples destellos dorados ascendentes */
  gateUpgradeFX(x: number, y: number): void {
    const count = 8;
    for (let i = 0; i < count; i++) {
      const angle = (i / count) * Math.PI * 2;
      const radius = 60;
      const starX = x + Math.cos(angle) * radius;
      const starY = y + Math.sin(angle) * radius;

      const star = this.scene.add.text(starX, starY, '★', {
        fontSize: '48px',
        color: '#e8c170',
      });
      star.setOrigin(0.5, 0.5);
      star.setDepth(20);
      star.setAlpha(0);

      this.scene.tweens.add({
        targets: star,
        y: starY - 120,
        alpha: 1,
        duration: 200,
        ease: 'Power1',
        delay: i * 100,
        onComplete: () => {
          this.scene.tweens.add({
            targets: star,
            alpha: 0,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
              star.destroy();
            },
          });
        },
      });
    }
  }
}
