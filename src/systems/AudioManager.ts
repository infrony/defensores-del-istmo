import Phaser from 'phaser';

export class AudioManager {
  static instance: AudioManager | null = null;

  private scene: Phaser.Scene;
  private lastPlay = new Map<string, number>();
  private currentMusic: Phaser.Sound.BaseSound | null = null;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
    AudioManager.instance = this;
  }

  sfx(key: string, volume = 1, cooldownMs = 0): void {
    if (!this.scene.cache.audio.has(key)) return;
    if (cooldownMs > 0) {
      const now = this.scene.time.now;
      if ((this.lastPlay.get(key) ?? 0) + cooldownMs > now) return;
      this.lastPlay.set(key, now);
    }
    this.scene.sound.play(key, { volume });
  }

  playMusic(key: string, volume = 0.35): void {
    if (!this.scene.cache.audio.has(key)) return;
    this.stopMusic();
    this.currentMusic = this.scene.sound.add(key, { loop: true, volume });
    this.currentMusic.play();
  }

  stopMusic(): void {
    this.currentMusic?.stop();
    this.currentMusic?.destroy();
    this.currentMusic = null;
  }

  destroy(): void {
    this.stopMusic();
    if (AudioManager.instance === this) AudioManager.instance = null;
  }
}
