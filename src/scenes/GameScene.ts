import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, LANE } from '../config';
import { FormationManager } from '../systems/FormationManager';
import { ProjectilePool } from '../systems/ProjectilePool';
import { EnemySpawner } from '../systems/EnemySpawner';
import { CombatSystem } from '../systems/CombatSystem';
import { GateSpawner, GATE_W, GATE_H } from '../systems/GateSpawner';
import { ArcherGuna } from '../entities/troops/ArcherGuna';
import type { Gate } from '../entities/Gate';
import type { Enemy } from '../entities/Enemy';
import type { Projectile } from '../entities/Projectile';

const SCROLL_SPEED = 480;
const PLAYER_LERP = 0.22;
const PLAYER_Y = GAME_HEIGHT - 380;
const INITIAL_TROOPS = 6;

// AABB de colisión jugador↔puerta (mitades)
const GATE_HIT_HW = GATE_W / 2 - 20;
const GATE_HIT_HH = GATE_H / 2 - 10;

export class GameScene extends Phaser.Scene {
  private lane!: Phaser.GameObjects.TileSprite;
  private sideLeft!: Phaser.GameObjects.TileSprite;
  private sideRight!: Phaser.GameObjects.TileSprite;
  private player!: Phaser.GameObjects.Image;
  private targetX = LANE.centerX;
  private dragging = false;
  private dragOffset = 0;
  private distance = 0;

  private formation!: FormationManager;
  private projectiles!: ProjectilePool;
  private enemies!: EnemySpawner;
  private combat!: CombatSystem;
  private gates!: GateSpawner;

  private hud!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;
  private kills = 0;

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.cameras.main.setBackgroundColor(0x0b1d2a);

    const laneWidth = LANE.rightBound - LANE.leftBound;
    this.sideLeft = this.add
      .tileSprite(0, 0, LANE.leftBound, GAME_HEIGHT, 'side-tile')
      .setOrigin(0, 0);
    this.sideRight = this.add
      .tileSprite(LANE.rightBound, 0, GAME_WIDTH - LANE.rightBound, GAME_HEIGHT, 'side-tile')
      .setOrigin(0, 0)
      .setFlipX(true);
    this.lane = this.add
      .tileSprite(LANE.leftBound, 0, laneWidth, GAME_HEIGHT, 'lane-tile')
      .setOrigin(0, 0);

    this.player = this.add.image(LANE.centerX, PLAYER_Y, 'player').setDepth(12);
    this.targetX = LANE.centerX;

    this.formation = new FormationManager(this);
    this.projectiles = new ProjectilePool(this);
    this.enemies = new EnemySpawner(this);
    this.combat = new CombatSystem();
    this.gates = new GateSpawner(this);
    this.kills = 0;
    this.distance = 0;

    for (let i = 0; i < INITIAL_TROOPS; i++) {
      this.spawnTroop();
    }

    this.physics.add.overlap(
      this.projectiles.group,
      this.enemies.group,
      this.onProjectileHit,
      undefined,
      this,
    );

    this.setupInput();
    this.setupHud();
  }

  // ── Input ──────────────────────────────────────────────────────────────────

  private setupInput(): void {
    this.input.on('pointerdown', (p: Phaser.Input.Pointer) => {
      this.dragging = true;
      this.dragOffset = this.player.x - p.x;
    });
    this.input.on('pointermove', (p: Phaser.Input.Pointer) => {
      if (!this.dragging) return;
      this.targetX = Phaser.Math.Clamp(
        p.x + this.dragOffset,
        LANE.leftBound + this.player.width / 2,
        LANE.rightBound - this.player.width / 2,
      );
    });
    const stop = () => {
      this.dragging = false;
    };
    this.input.on('pointerup', stop);
    this.input.on('pointerupoutside', stop);
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  private setupHud(): void {
    this.hud = this.add
      .text(GAME_WIDTH / 2, 60, '', {
        fontFamily: 'sans-serif',
        fontSize: '36px',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5, 0)
      .setDepth(100);

    this.fpsText = this.add
      .text(20, 20, '', {
        fontFamily: 'sans-serif',
        fontSize: '24px',
        color: '#a8c5b8',
      })
      .setDepth(100);

    const back = this.add
      .text(GAME_WIDTH - 30, 30, '✕', {
        fontFamily: 'sans-serif',
        fontSize: '48px',
        color: '#e8c170',
        backgroundColor: '#00000088',
        padding: { left: 18, right: 18, top: 6, bottom: 10 },
      })
      .setOrigin(1, 0)
      .setDepth(100)
      .setInteractive({ useHandCursor: true });
    back.on('pointerup', () => this.scene.start('MainMenuScene'));
  }

  // ── Troop helpers ─────────────────────────────────────────────────────────

  private spawnTroop(): void {
    const slot = this.formation.count();
    const { dx, dy } = FormationManager.slotOffset(slot);
    const t = new ArcherGuna(this, this.player.x + dx, this.player.y + dy);
    this.formation.add(t);
  }

  private removeTroop(): void {
    const troops = this.formation.list();
    if (troops.length === 0) return;
    this.formation.remove(troops[troops.length - 1]);
  }

  // ── Gate logic ────────────────────────────────────────────────────────────

  private checkGateOverlap(): void {
    for (const gate of this.gates.alive()) {
      const dx = Math.abs(this.player.x - gate.x);
      const dy = Math.abs(this.player.y - gate.y);
      if (dx < GATE_HIT_HW && dy < GATE_HIT_HH) {
        this.applyGate(gate);
      }
    }
  }

  private applyGate(gate: Gate): void {
    gate.collect();

    const before = this.formation.count();
    let delta = 0;

    switch (gate.op) {
      case '+':
        delta = gate.value;
        break;
      case '-':
        delta = -Math.min(gate.value, Math.max(0, before - 1));
        break;
      case '×':
        delta = before * (gate.value - 1);
        break;
      case '÷':
        delta = -(before - Math.max(1, Math.floor(before / gate.value)));
        break;
    }

    if (delta > 0) {
      for (let i = 0; i < delta; i++) this.spawnTroop();
    } else if (delta < 0) {
      for (let i = 0; i < -delta; i++) this.removeTroop();
    }

    this.showGateEffect(gate.x, gate.y, `${gate.op}${gate.value}`, delta >= 0);
    this.tweenFormationRipple(delta >= 0);
  }

  private showGateEffect(x: number, y: number, text: string, positive: boolean): void {
    const color = positive ? '#7fff90' : '#ff8080';
    const t = this.add
      .text(x, y - 30, text, {
        fontFamily: 'sans-serif',
        fontSize: '96px',
        fontStyle: 'bold',
        color,
        stroke: '#1a1a1a',
        strokeThickness: 8,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(50);

    this.tweens.add({
      targets: t,
      y: y - 200,
      alpha: 0,
      scaleX: 1.4,
      scaleY: 1.4,
      duration: 700,
      ease: 'Cubic.Out',
      onComplete: () => t.destroy(),
    });
  }

  private tweenFormationRipple(positive: boolean): void {
    const troops = this.formation.list();
    const scaleTarget = positive ? 1.35 : 0.72;
    for (const t of troops) {
      this.tweens.add({
        targets: t,
        scaleX: scaleTarget,
        scaleY: scaleTarget,
        duration: 120,
        yoyo: true,
        ease: 'Quad.Out',
      });
    }
  }

  // ── Combat callbacks ──────────────────────────────────────────────────────

  private onProjectileHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    projectileObj,
    enemyObj,
  ) => {
    const projectile = projectileObj as unknown as Projectile;
    const enemy = enemyObj as unknown as Enemy;
    if (!projectile.active || !enemy.alive) return;
    const killed = enemy.takeDamage(projectile.damage);
    projectile.deactivate();
    if (killed) {
      this.kills++;
      this.flashHit(enemy.x, enemy.y);
    }
  };

  private flashHit(x: number, y: number): void {
    const burst = this.add.circle(x, y, 18, 0xe8c170, 0.9).setDepth(15);
    this.tweens.add({
      targets: burst,
      alpha: 0,
      scale: 2.5,
      duration: 220,
      onComplete: () => burst.destroy(),
    });
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(time: number, delta: number): void {
    const dtSec = delta / 1000;

    const scroll = SCROLL_SPEED * dtSec;
    this.lane.tilePositionY -= scroll;
    this.sideLeft.tilePositionY -= scroll;
    this.sideRight.tilePositionY -= scroll;

    this.player.x = Phaser.Math.Linear(this.player.x, this.targetX, PLAYER_LERP);
    const tiltTarget = Phaser.Math.Clamp((this.targetX - this.player.x) * 0.6, -12, 12);
    this.player.angle = Phaser.Math.Linear(this.player.angle, tiltTarget, 0.15);

    const distDelta = (SCROLL_SPEED / 100) * dtSec;
    this.distance += distDelta;

    const aliveEnemies = this.enemies.alive();
    this.combat.update(delta, this.formation, aliveEnemies);
    this.formation.update(time, delta, this.player.x, this.player.y, this.projectiles);
    this.enemies.update(time, delta, 0, GAME_HEIGHT);
    this.gates.update(distDelta, GAME_HEIGHT, this.formation.count());
    this.projectiles.cull(-100, GAME_HEIGHT + 100, -100, GAME_WIDTH + 100);

    this.checkGateOverlap();

    this.hud.setText(
      `${Math.floor(this.distance)} m   ×${this.formation.count()}   ☠ ${this.kills}`,
    );
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
  }
}
