import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, LANE } from '../config';
import { FormationManager } from '../systems/FormationManager';
import { ProjectilePool } from '../systems/ProjectilePool';
import { EnemySpawner } from '../systems/EnemySpawner';
import { CombatSystem } from '../systems/CombatSystem';
import { GateSpawner, GATE_W, GATE_H } from '../systems/GateSpawner';
import { DamageText } from '../systems/DamageText';
import { ObstacleManager } from '../systems/ObstacleManager';
import { SpawnManager } from '../systems/SpawnManager';
import { SaveSystem } from '../systems/SaveSystem';
import type { Obstacle } from '../entities/Obstacle';
import { ArcherGuna } from '../entities/troops/ArcherGuna';
import { GuerreroNgabe } from '../entities/troops/GuerreroNgabe';
import type { Gate } from '../entities/Gate';
import type { Enemy } from '../entities/Enemy';
import type { Projectile } from '../entities/Projectile';

const SCROLL_SPEED = 480;
const PLAYER_LERP = 0.22;
const PLAYER_Y = GAME_HEIGHT - 380;
const INITIAL_TROOPS = 6;
const KEY_SPEED = 900;

const PLAYER_MAX_HP = 200;
// Enemies deal damage when they reach this Y (just above player)
const DAMAGE_THRESHOLD_Y = PLAYER_Y - 50;

const GATE_HIT_HW = GATE_W / 2 - 20;
const GATE_HIT_HH = GATE_H / 2 - 10;

// Boss HP bar
const BOSS_BAR_W = 700;
const BOSS_BAR_H = 36;
const BOSS_BAR_X = GAME_WIDTH / 2;
const BOSS_BAR_Y = 150;

// Player HP bar (small, near player sprite)
const PLAYER_BAR_W = 160;
const PLAYER_BAR_H = 14;

export class GameScene extends Phaser.Scene {
  private lane!: Phaser.GameObjects.TileSprite;
  private sideLeft!: Phaser.GameObjects.TileSprite;
  private sideRight!: Phaser.GameObjects.TileSprite;
  private player!: Phaser.GameObjects.Image;
  private targetX = LANE.centerX;
  private dragging = false;
  private dragOffset = 0;
  private distance = 0;

  private gameOverActive = false;
  private victoryActive = false;

  private playerHp = PLAYER_MAX_HP;
  private gold = 0;

  private formation!: FormationManager;
  private projectiles!: ProjectilePool;
  private enemies!: EnemySpawner;
  private combat!: CombatSystem;
  private gates!: GateSpawner;
  private obstacles!: ObstacleManager;
  private spawnMgr!: SpawnManager;
  private damageText!: DamageText;

  private keys!: { left: Phaser.Input.Keyboard.Key; right: Phaser.Input.Keyboard.Key };

  // HUD elements
  private hud!: Phaser.GameObjects.Text;
  private hudStats!: Phaser.GameObjects.Text;
  private fpsText!: Phaser.GameObjects.Text;
  private playerHpBarBg!: Phaser.GameObjects.Rectangle;
  private playerHpBarFill!: Phaser.GameObjects.Rectangle;
  private kills = 0;

  // Boss HP bar
  private bossBarBg!: Phaser.GameObjects.Rectangle;
  private bossBarFill!: Phaser.GameObjects.Rectangle;
  private bossBarLabel!: Phaser.GameObjects.Text;
  private bossBarName!: Phaser.GameObjects.Text;
  private bossBarShown = false;

  // Onboarding
  private tooltipOverlay!: Phaser.GameObjects.Container;
  private tooltipStep = 0;
  private readonly TOOLTIPS = [
    { text: 'Arrastra o usa ← → para moverte', triggerM: -1 },
    { text: 'Elige la puerta VERDE ➕ para ganar tropas', triggerM: 8 },
    { text: '¡El Jefe llega a los 75 m!\nEliminalo para ganar', triggerM: 60 },
  ];

  constructor() {
    super({ key: 'GameScene' });
  }

  create(): void {
    this.gameOverActive = false;
    this.victoryActive = false;
    this.playerHp = PLAYER_MAX_HP;
    this.gold = 0;
    this.bossBarShown = false;
    this.tooltipStep = 0;

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

    this.formation = new FormationManager();
    this.projectiles = new ProjectilePool(this);
    this.enemies = new EnemySpawner(this);
    this.combat = new CombatSystem();
    this.gates = new GateSpawner(this);
    this.obstacles = new ObstacleManager(this);
    this.spawnMgr = new SpawnManager('veraguas-1502-1', this.enemies);
    this.damageText = new DamageText(this);
    this.kills = 0;
    this.distance = 0;

    for (let i = 0; i < INITIAL_TROOPS; i++) {
      this.spawnTroop();
    }
    this.spawnInitialEnemies();

    this.physics.add.overlap(
      this.projectiles.group,
      this.enemies.group,
      this.onProjectileHit,
      undefined,
      this,
    );
    this.physics.add.overlap(
      this.projectiles.group,
      this.obstacles.group,
      this.onProjectileHitObstacle,
      undefined,
      this,
    );

    this.setupInput();
    this.setupHud();
    this.setupPlayerHpBar();
    this.setupBossBar();
    this.setupKeys();

    if (!SaveSystem.hasSeenOnboarding()) {
      this.showTooltip(0);
    } else {
      this.tooltipStep = this.TOOLTIPS.length; // skip all
    }
  }

  // ── Input ──────────────────────────────────────────────────────────────────

  private setupKeys(): void {
    const kb = this.input.keyboard!;
    this.keys = {
      left: kb.addKey(Phaser.Input.Keyboard.KeyCodes.LEFT),
      right: kb.addKey(Phaser.Input.Keyboard.KeyCodes.RIGHT),
    };
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.A).on('down', () => {
      this.keys.left.isDown = true;
    });
    kb.addKey(Phaser.Input.Keyboard.KeyCodes.D).on('down', () => {
      this.keys.right.isDown = true;
    });
  }

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
    const stop = () => { this.dragging = false; };
    this.input.on('pointerup', stop);
    this.input.on('pointerupoutside', stop);
  }

  // ── HUD ───────────────────────────────────────────────────────────────────

  private setupHud(): void {
    this.hud = this.add
      .text(GAME_WIDTH / 2, 46, '', {
        fontFamily: 'sans-serif',
        fontSize: '34px',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 4,
        align: 'center',
      })
      .setOrigin(0.5, 0)
      .setDepth(100);

    this.hudStats = this.add
      .text(GAME_WIDTH / 2, 94, '', {
        fontFamily: 'sans-serif',
        fontSize: '30px',
        color: '#c8e8d0',
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

  // ── Player HP bar ─────────────────────────────────────────────────────────

  private setupPlayerHpBar(): void {
    const barY = PLAYER_Y - 70;
    this.playerHpBarBg = this.add
      .rectangle(LANE.centerX, barY, PLAYER_BAR_W, PLAYER_BAR_H, 0x330000)
      .setDepth(13);
    this.playerHpBarFill = this.add
      .rectangle(
        LANE.centerX - PLAYER_BAR_W / 2,
        barY,
        PLAYER_BAR_W,
        PLAYER_BAR_H,
        0xdd2222,
      )
      .setOrigin(0, 0.5)
      .setDepth(14);
  }

  private updatePlayerHpBar(): void {
    const ratio = this.playerHp / PLAYER_MAX_HP;
    this.playerHpBarFill.width = PLAYER_BAR_W * ratio;
    this.playerHpBarBg.x = this.player.x;
    this.playerHpBarFill.x = this.player.x - PLAYER_BAR_W / 2;
    const color = ratio > 0.5 ? 0x44dd44 : ratio > 0.25 ? 0xddaa00 : 0xdd2222;
    this.playerHpBarFill.setFillStyle(color);
  }

  // ── Boss HP Bar ───────────────────────────────────────────────────────────

  private setupBossBar(): void {
    const depth = 100;
    this.bossBarName = this.add
      .text(BOSS_BAR_X, BOSS_BAR_Y - 44, 'DIEGO MÉNDEZ', {
        fontFamily: 'sans-serif',
        fontSize: '32px',
        fontStyle: 'bold',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 5,
        align: 'center',
      })
      .setOrigin(0.5, 1)
      .setDepth(depth)
      .setVisible(false);

    this.bossBarBg = this.add
      .rectangle(BOSS_BAR_X, BOSS_BAR_Y, BOSS_BAR_W, BOSS_BAR_H, 0x220000)
      .setDepth(depth)
      .setVisible(false);

    this.bossBarFill = this.add
      .rectangle(BOSS_BAR_X - BOSS_BAR_W / 2, BOSS_BAR_Y, BOSS_BAR_W, BOSS_BAR_H, 0xcc2222)
      .setOrigin(0, 0.5)
      .setDepth(depth)
      .setVisible(false);

    this.bossBarLabel = this.add
      .text(BOSS_BAR_X, BOSS_BAR_Y, '', {
        fontFamily: 'sans-serif',
        fontSize: '26px',
        fontStyle: 'bold',
        color: '#ffffff',
        stroke: '#1a1a1a',
        strokeThickness: 4,
      })
      .setOrigin(0.5)
      .setDepth(depth + 1)
      .setVisible(false);
  }

  private showBossBar(): void {
    [this.bossBarBg, this.bossBarFill, this.bossBarLabel, this.bossBarName].forEach((o) =>
      o.setVisible(true),
    );
  }

  private hideBossBar(): void {
    [this.bossBarBg, this.bossBarFill, this.bossBarLabel, this.bossBarName].forEach((o) =>
      o.setVisible(false),
    );
  }

  private updateBossBar(hpRatio: number, hp: number, maxHp: number): void {
    this.bossBarFill.width = BOSS_BAR_W * hpRatio;
    this.bossBarLabel.setText(`${hp} / ${maxHp}  (${Math.ceil(hpRatio * 100)}%)`);
    const color = hpRatio > 0.5 ? 0xcc2222 : hpRatio > 0.25 ? 0xdd8800 : 0xff3030;
    this.bossBarFill.setFillStyle(color);
  }

  // ── Onboarding tooltips ───────────────────────────────────────────────────

  private showTooltip(step: number): void {
    if (step >= this.TOOLTIPS.length) {
      SaveSystem.markOnboardingSeen();
      return;
    }
    const tip = this.TOOLTIPS[step];

    if (this.tooltipOverlay) this.tooltipOverlay.destroy();

    const bg = this.add.rectangle(0, 0, GAME_WIDTH - 100, 180, 0x000000, 0.82).setOrigin(0, 0);
    const border = this.add
      .rectangle(0, 0, GAME_WIDTH - 100, 180, 0x000000, 0)
      .setOrigin(0, 0)
      .setStrokeStyle(4, 0xe8c170);
    const label = this.add
      .text((GAME_WIDTH - 100) / 2, 70, tip.text, {
        fontFamily: 'sans-serif',
        fontSize: '38px',
        color: '#e8c170',
        stroke: '#1a1a1a',
        strokeThickness: 5,
        align: 'center',
        wordWrap: { width: GAME_WIDTH - 160 },
      })
      .setOrigin(0.5);
    const tap = this.add
      .text((GAME_WIDTH - 100) / 2, 148, 'Toca para continuar', {
        fontFamily: 'sans-serif',
        fontSize: '26px',
        color: '#a8c5b8',
      })
      .setOrigin(0.5);

    this.tooltipOverlay = this.add.container(50, GAME_HEIGHT / 2 - 90, [bg, border, label, tap]);
    this.tooltipOverlay.setDepth(300).setAlpha(0);

    this.tweens.add({ targets: this.tooltipOverlay, alpha: 1, duration: 300, ease: 'Cubic.Out' });

    // Auto-dismiss first tooltip after 3s; others require tap
    const dismiss = () => {
      this.tooltipStep = step + 1;
      this.tweens.add({
        targets: this.tooltipOverlay,
        alpha: 0,
        duration: 250,
        onComplete: () => {
          if (this.tooltipOverlay) this.tooltipOverlay.destroy();
          if (step === 0) SaveSystem.markOnboardingSeen(); // mark after first tip shown
        },
      });
    };

    if (step === 0) {
      this.time.delayedCall(3000, dismiss);
    } else {
      this.input.once('pointerdown', dismiss);
    }
  }

  private updateOnboarding(): void {
    if (this.tooltipStep >= this.TOOLTIPS.length) return;
    const tip = this.TOOLTIPS[this.tooltipStep];
    if (tip.triggerM > 0 && this.distance >= tip.triggerM) {
      this.showTooltip(this.tooltipStep);
    }
  }

  // ── Initial enemy population ──────────────────────────────────────────────

  private spawnInitialEnemies(): void {
    const yPositions = [120, 280, 420, 580, 720, 880, 1020, 1160, 1300];
    for (const y of yPositions) {
      this.enemies.spawnAt(y);
      this.enemies.spawnAt(y);
    }
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

  // ── Enemy damage to player ────────────────────────────────────────────────

  private checkEnemyReachesPlayer(): void {
    for (const e of this.enemies.alive()) {
      if (e === this.enemies.boss) continue;
      if (e.y >= DAMAGE_THRESHOLD_Y) {
        this.playerHp = Math.max(0, this.playerHp - e.damage);
        e.kill();
        this.cameras.main.shake(100, 0.01);
        // Flash player red
        this.tweens.add({
          targets: this.player,
          tint: 0xff4444,
          duration: 80,
          yoyo: true,
          onComplete: () => this.player.clearTint(),
        });
        if (this.playerHp <= 0) {
          this.triggerGameOver();
          return;
        }
      }
    }
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

    if (gate.op === 'upgrade') {
      this.applyUpgrade(gate);
      return;
    }

    const before = this.formation.count();
    let delta = 0;

    switch (gate.op) {
      case '+':
        delta = gate.value;
        break;
      case '-':
        delta = -Math.min(gate.value, before);
        break;
      case '×':
        delta = before * (gate.value - 1);
        break;
      case '÷':
        delta = -(before - Math.floor(before / gate.value));
        break;
    }

    if (delta > 0) {
      for (let i = 0; i < delta; i++) this.spawnTroop();
    } else if (delta < 0) {
      for (let i = 0; i < -delta; i++) this.removeTroop();
    }

    this.showGateEffect(gate.x, gate.y, `${gate.op}${gate.value}`, delta >= 0);
    this.tweenFormationRipple(delta >= 0);

    if (this.formation.count() === 0) {
      this.triggerGameOver();
    }
  }

  private applyUpgrade(gate: Gate): void {
    const troops = this.formation.list();
    const half = Math.max(1, Math.floor(troops.length / 2));
    for (let i = 0; i < half; i++) this.removeTroop();
    for (let i = 0; i < half; i++) {
      const slot = this.formation.count();
      const { dx, dy } = FormationManager.slotOffset(slot);
      const t =
        gate.upgradeClass === 'Ngäbe'
          ? new GuerreroNgabe(this, this.player.x + dx, this.player.y + dy)
          : new ArcherGuna(this, this.player.x + dx, this.player.y + dy);
      this.formation.add(t);
    }
    this.showGateEffect(gate.x, gate.y, `⚔ ${gate.upgradeClass}`, true);
    this.tweenFormationRipple(true);
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
    const scaleTarget = positive ? 1.35 : 0.72;
    for (const t of this.formation.list()) {
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

  // ── End screens ───────────────────────────────────────────────────────────

  private triggerGameOver(): void {
    if (this.gameOverActive || this.victoryActive) return;
    this.gameOverActive = true;

    const { stats } = SaveSystem.save(this.distance, this.kills, this.gold);
    this.cameras.main.shake(300, 0.014);

    const overlay = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0)
      .setDepth(200);
    this.tweens.add({ targets: overlay, alpha: 0.72, duration: 600, ease: 'Cubic.Out' });

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 200, 'DERROTA', {
        fontFamily: 'sans-serif',
        fontSize: '96px',
        fontStyle: 'bold',
        color: '#ff6060',
        stroke: '#1a0000',
        strokeThickness: 10,
        align: 'center',
      })
      .setOrigin(0.5)
      .setDepth(201)
      .setAlpha(0);

    const subtitle = this.add
      .text(
        GAME_WIDTH / 2,
        GAME_HEIGHT / 2 - 60,
        [
          `${Math.floor(this.distance)} m recorridos`,
          `☠ ${this.kills} bajas   💰 ${this.gold} oro`,
          `Mejor marca: ${stats.bestDistance} m`,
        ].join('\n'),
        {
          fontFamily: 'sans-serif',
          fontSize: '44px',
          color: '#e8c170',
          stroke: '#1a1a1a',
          strokeThickness: 6,
          align: 'center',
          lineSpacing: 8,
        },
      )
      .setOrigin(0.5)
      .setDepth(201)
      .setAlpha(0);

    const btnBg = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 200, 420, 110, 0xe8c170)
      .setDepth(201).setAlpha(0).setInteractive({ useHandCursor: true });
    const btnText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 200, 'REINTENTAR', {
        fontFamily: 'sans-serif', fontSize: '52px', fontStyle: 'bold', color: '#1a1a1a',
      })
      .setOrigin(0.5).setDepth(202).setAlpha(0);
    const menuBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 340, 'Menú principal', {
        fontFamily: 'sans-serif', fontSize: '40px', color: '#a8c5b8',
        stroke: '#1a1a1a', strokeThickness: 4,
      })
      .setOrigin(0.5).setDepth(201).setAlpha(0).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [title, subtitle, btnBg, btnText, menuBtn],
      alpha: 1, delay: 400, duration: 500, ease: 'Cubic.Out',
    });

    btnBg.on('pointerup', () => this.scene.restart());
    btnBg.on('pointerover', () => btnBg.setFillStyle(0xffd080));
    btnBg.on('pointerout', () => btnBg.setFillStyle(0xe8c170));
    menuBtn.on('pointerup', () => this.scene.start('MainMenuScene'));
  }

  private triggerVictory(): void {
    if (this.gameOverActive || this.victoryActive) return;
    this.victoryActive = true;

    this.hideBossBar();
    const { stats, newBest } = SaveSystem.save(this.distance, this.kills, this.gold);

    this.cameras.main.flash(300, 255, 220, 120);
    this.cameras.main.shake(200, 0.008);

    const overlay = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x0b1d2a, 0)
      .setDepth(200);
    this.tweens.add({ targets: overlay, alpha: 0.85, duration: 700, ease: 'Cubic.Out' });

    const title = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 440, '¡VICTORIA!', {
        fontFamily: 'sans-serif', fontSize: '108px', fontStyle: 'bold',
        color: '#e8c170', stroke: '#1a1a1a', strokeThickness: 12, align: 'center',
      })
      .setOrigin(0.5).setDepth(201).setAlpha(0);

    // Cofre placeholder
    const chestBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 220, 180, 140, 0x6b4000).setDepth(201).setAlpha(0);
    const chestLid = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 280, 190, 60, 0x8b5500).setDepth(201).setAlpha(0);
    const chestLatch = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 - 220, 40, 40, 0xe8c170).setDepth(202).setAlpha(0);

    const newBestLine = newBest ? `\n🏆 ¡Nueva marca! ${stats.bestDistance} m` : `\nMejor: ${stats.bestDistance} m`;
    const statsText = this.add
      .text(
        GAME_WIDTH / 2, GAME_HEIGHT / 2 + 0,
        [
          `${Math.floor(this.distance)} m recorridos`,
          `☠ ${this.kills} bajas   💰 ${this.gold} oro`,
          `Mejor oro: ${stats.bestGold}${newBestLine}`,
          `Runs totales: ${stats.totalRuns}`,
        ].join('\n'),
        {
          fontFamily: 'sans-serif', fontSize: '40px', color: '#e8c170',
          stroke: '#1a1a1a', strokeThickness: 6, align: 'center', lineSpacing: 10,
        },
      )
      .setOrigin(0.5).setDepth(201).setAlpha(0);

    const btnBg = this.add
      .rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 340, 440, 110, 0xe8c170)
      .setDepth(201).setAlpha(0).setInteractive({ useHandCursor: true });
    const btnText = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 340, 'JUGAR DE NUEVO', {
        fontFamily: 'sans-serif', fontSize: '48px', fontStyle: 'bold', color: '#1a1a1a',
      })
      .setOrigin(0.5).setDepth(202).setAlpha(0);
    const menuBtn = this.add
      .text(GAME_WIDTH / 2, GAME_HEIGHT / 2 + 480, 'Menú principal', {
        fontFamily: 'sans-serif', fontSize: '40px', color: '#a8c5b8',
        stroke: '#1a1a1a', strokeThickness: 4,
      })
      .setOrigin(0.5).setDepth(201).setAlpha(0).setInteractive({ useHandCursor: true });

    this.tweens.add({
      targets: [title, chestBg, chestLid, chestLatch, statsText, btnBg, btnText, menuBtn],
      alpha: 1, delay: 500, duration: 600, ease: 'Cubic.Out',
    });
    this.tweens.add({
      targets: [chestBg, chestLid, chestLatch],
      scaleX: 1.06, scaleY: 1.06, duration: 800, yoyo: true, repeat: -1,
      ease: 'Sine.InOut', delay: 1100,
    });

    btnBg.on('pointerup', () => this.scene.restart());
    btnBg.on('pointerover', () => btnBg.setFillStyle(0xffd080));
    btnBg.on('pointerout', () => btnBg.setFillStyle(0xe8c170));
    menuBtn.on('pointerup', () => this.scene.start('MainMenuScene'));
  }

  // ── Combat callbacks ──────────────────────────────────────────────────────

  private onProjectileHit: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    projectileObj,
    enemyObj,
  ) => {
    const projectile = projectileObj as unknown as Projectile;
    const enemy = enemyObj as unknown as Enemy;
    if (!projectile.active || !enemy.alive) return;

    const isCrit = Math.random() < 0.15;
    const dmg = isCrit ? Math.round(projectile.damage * 1.8) : projectile.damage;
    const killed = enemy.takeDamage(dmg);
    projectile.deactivate();

    this.damageText.show(enemy.x, enemy.y, dmg, isCrit);

    if (killed) {
      this.kills++;
      this.gold += enemy.goldValue;
      this.flashHit(enemy.x, enemy.y);
      this.cameras.main.shake(60, 0.004);
    } else if (isCrit) {
      this.cameras.main.shake(40, 0.002);
    }
  };

  private onProjectileHitObstacle: Phaser.Types.Physics.Arcade.ArcadePhysicsCallback = (
    projectileObj,
    obstacleObj,
  ) => {
    const projectile = projectileObj as unknown as Projectile;
    const obstacle = obstacleObj as unknown as Obstacle;
    if (!projectile.active || !obstacle.alive) return;
    const destroyed = obstacle.takeDamage(projectile.damage);
    projectile.deactivate();
    this.damageText.show(obstacle.x, obstacle.y, projectile.damage, false);
    if (destroyed) this.cameras.main.shake(50, 0.003);
  };

  private flashHit(x: number, y: number): void {
    const burst = this.add.circle(x, y, 18, 0xe8c170, 0.9).setDepth(15);
    this.tweens.add({
      targets: burst, alpha: 0, scale: 2.5, duration: 220,
      onComplete: () => burst.destroy(),
    });
  }

  // ── Boss state ────────────────────────────────────────────────────────────

  private checkBossState(): void {
    const boss = this.enemies.boss;
    if (!boss) return;

    if (boss.alive) {
      if (!this.bossBarShown) {
        this.bossBarShown = true;
        this.showBossBar();
        for (const e of this.enemies.alive()) {
          if (e !== boss) e.kill();
        }
      }
      this.updateBossBar(boss.hp / boss.maxHp, boss.hp, boss.maxHp);
    } else {
      this.enemies.boss = null;
      this.bossBarShown = false;
      this.triggerVictory();
    }
  }

  // ── Update ────────────────────────────────────────────────────────────────

  update(time: number, delta: number): void {
    if (this.gameOverActive || this.victoryActive) return;

    const dtSec = delta / 1000;

    const scroll = SCROLL_SPEED * dtSec;
    this.lane.tilePositionY -= scroll;
    this.sideLeft.tilePositionY -= scroll;
    this.sideRight.tilePositionY -= scroll;

    if (this.keys.left.isDown) {
      this.targetX = Phaser.Math.Clamp(
        this.targetX - KEY_SPEED * dtSec,
        LANE.leftBound + this.player.width / 2,
        LANE.rightBound - this.player.width / 2,
      );
    } else if (this.keys.right.isDown) {
      this.targetX = Phaser.Math.Clamp(
        this.targetX + KEY_SPEED * dtSec,
        LANE.leftBound + this.player.width / 2,
        LANE.rightBound - this.player.width / 2,
      );
    }

    this.player.x = Phaser.Math.Linear(this.player.x, this.targetX, PLAYER_LERP);
    const tiltTarget = Phaser.Math.Clamp((this.targetX - this.player.x) * 0.6, -12, 12);
    this.player.angle = Phaser.Math.Linear(this.player.angle, tiltTarget, 0.15);

    const distDelta = (SCROLL_SPEED / 100) * dtSec;
    this.distance += distDelta;

    const aliveEnemies = this.enemies.alive();
    this.combat.update(delta, this.formation, aliveEnemies);
    this.formation.update(time, delta, this.player.x, this.player.y, this.projectiles);
    this.spawnMgr.update(delta, this.distance);
    this.enemies.update(time, delta, 0, GAME_HEIGHT);
    this.gates.update(distDelta, GAME_HEIGHT, this.formation.count());
    this.obstacles.update(distDelta, GAME_HEIGHT);
    this.projectiles.cull(-100, GAME_HEIGHT + 100, -100, GAME_WIDTH + 100);

    this.checkGateOverlap();
    this.checkEnemyReachesPlayer();
    this.checkBossState();
    this.updateOnboarding();
    this.updatePlayerHpBar();

    const mult = this.formation.powerMultiplier();
    const multStr = mult >= 1.1 ? `  ⚡×${mult.toFixed(2)}` : '';
    this.hud.setText(
      `${Math.floor(this.distance)} m   👥${this.formation.count()}${multStr}   ☠ ${this.kills}`,
    );
    this.hudStats.setText(`❤ ${this.playerHp}/${PLAYER_MAX_HP}   💰 ${this.gold} oro`);
    this.fpsText.setText(`FPS: ${Math.round(this.game.loop.actualFps)}`);
  }
}
