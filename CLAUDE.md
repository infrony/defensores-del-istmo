# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
pnpm dev          # Vite dev server → http://localhost:5173
pnpm build        # tsc --noEmit + vite build → dist/
pnpm typecheck    # tsc --noEmit (no emit, fast check)
pnpm lint         # ESLint over src/**/*.{ts,tsx}
pnpm format       # Prettier over src/
pnpm preview      # Serve production build locally
```

**pnpm supply-chain policy:** If `pnpm dev` fails with `ERR_PNPM_MINIMUM_RELEASE_AGE_VIOLATION`, delete `pnpm-lock.yaml` and run `pnpm install` — this regenerates the lockfile resolving to older package versions that pass the age policy. The project `.npmrc` has `verify-deps-before-run=false`.

**No test runner** is configured yet (Sprint 3 milestone). Type correctness is the primary correctness signal.

## Architecture

### Scene flow

```
BootScene → PreloadScene → MainMenuScene → GameScene
                                           ↑
                                     (back button restarts)
```

`PreloadScene.generatePlaceholderTextures()` generates all game textures procedurally using Phaser `Graphics` — no external asset files exist yet. Every sprite key (`'player'`, `'troop-archer'`, `'troop-ngabe'`, `'enemy-sailor'`, `'enemy-conquistador'`, `'lane-tile'`, `'side-tile'`, `'projectile'`, `'gate-positive'`, `'gate-negative'`, `'gate-upgrade'`) must be registered here before use.

### GameScene update loop (order matters)

1. Scroll background TileSprites
2. Apply keyboard input → `targetX`
3. Lerp `player.x` toward `targetX` + tilt angle
4. Increment `distance` (meters = `SCROLL_SPEED / 100 * dtSec`)
5. `CombatSystem.update()` — retargets troops every 200 ms via `SpatialHash`
6. `FormationManager.update()` — lerps troops to slots, fires projectiles
7. `EnemySpawner.update()` — spawns + culls enemies
8. `GateSpawner.update()` — spawns + culls gates, passes `distDelta` and current troop count
9. `ProjectilePool.cull()` — deactivates out-of-bounds projectiles
10. `checkGateOverlap()` — manual AABB between player and each alive gate
11. HUD text update

### Entity and system patterns

**Entities** (`src/entities/`) extend Phaser classes directly:
- `Troop` extends `Phaser.GameObjects.Image` — no physics body; position driven by `FormationManager` slot lerp each frame.
- `Enemy` extends `Phaser.Physics.Arcade.Image` — spawned at `y = -60`, moves down via `setVelocity(0, speed)`.
- `Projectile` extends `Phaser.Physics.Arcade.Image` — pooled, activated/deactivated via `fire()` / `deactivate()`.
- `Gate` extends `Phaser.Physics.Arcade.Image` — moves at `SCROLL_SPEED` (480 px/s) to appear world-anchored; player collision is manual AABB, not physics overlap.

**Adding a new troop class:** Create `src/entities/troops/MyTroop.ts` exporting a config object and class extending `Troop`. Register texture in `PreloadScene`. Spawn via `FormationManager.add()`. For gate-based upgrades, handle in `GameScene.applyUpgrade()`.

**Adding a new enemy type:** Create `src/entities/enemies/MyEnemy.ts` exporting an `EnemyConfig`. Add spawn logic to `EnemySpawner.pickCfg()`. Register texture in `PreloadScene`.

### Key constants (`src/config.ts`)

| Constant | Value | Purpose |
|----------|-------|---------|
| `GAME_WIDTH / GAME_HEIGHT` | 1080 × 1920 | Portrait base resolution |
| `LANE.leftBound / rightBound` | 120 / 960 | Playable lane X bounds |
| `LANE.centerX` | 540 | Player spawn X |
| `@/` path alias | `src/` | Vite + TS alias |

### Formation grid

`FormationManager.slotOffset(slot)` maps slot index → `{dx, dy}` relative to the player. Layout is 5 columns wide, expanding center-out (`COL_ORDER = [2,1,3,0,4]`), rows stacked below the player at 90 px intervals. The `slot` index is reassigned on every `remove()` call (`reindex()`).

### Combat targeting

`CombatSystem` rebuilds a `SpatialHash<Enemy>` every 200 ms and assigns the nearest enemy within range to each troop. Troops that `hasTarget()` (target still alive) keep their current target to avoid flap. The hash cell size is 160 px; adjust if range values change significantly.

### Gate system

`GateSpawner` emits gate pairs every 14 m. Every 60 m it emits an *upgrade pair* (golden `gate-upgrade` + penalty). Gate ops: `+`, `-`, `×`, `÷`, `upgrade`. Collision is AABB in `GameScene.checkGateOverlap()` using `GATE_HIT_HW = GATE_W/2 - 20` and `GATE_HIT_HH = GATE_H/2 - 10`. After a gate is collected, the partner continues scrolling off screen normally.

## Game design constraints

- **Mobile-first portrait** — 1080×1920 base, scaled via `Phaser.Scale.FIT`. Never redesign for landscape.
- **Performance target** — 60 fps on iPhone 12 / Pixel 5 with 30 troops + 50 enemies. Use object pooling for anything spawned repeatedly. `SpatialHash` exists precisely for this; don't replace with O(n²) nearest-neighbor.
- **Scope** — PRD and PLAN.md are the source of truth. Features not in those documents go to "backlog v1.1", not into the current sprint.
- **No backend** — everything is local (`localStorage` for save). Cloud sync is post-launch.
- **Cultural accuracy** — protagonist is Tanela (Quibián warrior). Art and narrative must reference Guna molas, Coclé/Veragüense gold, and petroglifos. No generic indigenous stereotypes.
