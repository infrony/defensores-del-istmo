# Defensores del Istmo

Lane runner shooter histórico-mítico de Panamá. Phaser 3 + TypeScript + Capacitor.

Ver [PRD_Defensores_del_Istmo.md](PRD_Defensores_del_Istmo.md) y [PLAN.md](PLAN.md).

## Setup

```bash
# Primera instalación (bypass de minimumReleaseAge mientras postcss esté reciente)
pnpm install --config.minimum-release-age=0

# Si pnpm sigue bloqueando los scripts por política global, usar env var:
PNPM_CONFIG_VERIFY_DEPS_BEFORE_RUN=false pnpm run dev

# Alternativa más rápida: invocar binarios directo
node_modules/.bin/vite          # dev server → http://localhost:5173
node_modules/.bin/tsc --noEmit  # typecheck
node_modules/.bin/vite build    # producción
```

> Si el equipo tiene política global pnpm de `minimumReleaseAge`, considerá agregar
> `minimum-release-age-exclude[]=postcss` al `~/.npmrc` global, o esperar 24-48h
> a que la versión actual de postcss pase el cutoff.

## Scripts

| Script | Acción |
|--------|--------|
| `npm run dev` | Servidor Vite con HMR |
| `npm run build` | Typecheck + build a `dist/` |
| `npm run preview` | Sirve la build de producción |
| `npm run typecheck` | Solo `tsc --noEmit` |
| `npm run lint` | ESLint sobre `src/` |
| `npm run format` | Prettier sobre `src/` |

## Estado actual

**v0.1.0 — Sprint 1.1 completo**

- ✅ Scaffold Vite + Phaser 3 + TS funcionando (typecheck + build limpios)
- ✅ Escenas Boot → Preload → MainMenu → Game
- ✅ Player con swipe horizontal + lerp + inclinación visual
- ✅ Scroll vertical de lane + parallax simple de bordes
- ✅ **FormationManager** con grid 5×N relativo al jugador (zig-zag desde centro)
- ✅ **Troop base + ArqueroGuna** (HP, daño, rango, cadencia)
- ✅ **Projectile + ProjectilePool** (pooling vía Arcade.Group)
- ✅ **Enemy + EnemySpawner** (oleadas con dificultad creciente)
- ✅ **CombatSystem + SpatialHash** (auto-aim cada 200ms, O(n) con grid uniforme)
- ✅ Colisiones proyectil↔enemigo, daño, kill, flash VFX
- ✅ HUD: distancia, tropas, kills, FPS
- ⏳ Sin puertas multiplicadoras (Sprint 1.2)
- ⏳ Sin obstáculos, sin segunda clase de tropa, sin jefe
- ⏳ Sin assets finales (placeholders generados con Graphics)

Próximo: **Sprint 1.2** — Sistema de puertas (`+N`, `×N`, `−N`, `÷N`) y obstáculos.

## Estructura

```
src/
├── main.ts                      # entry
├── config.ts                    # constantes + GameConfig
├── scenes/
│   ├── BootScene.ts
│   ├── PreloadScene.ts          # genera texturas placeholder con Graphics
│   ├── MainMenuScene.ts
│   └── GameScene.ts             # loop principal del run
├── entities/
│   ├── Troop.ts                 # base con cooldown + fire
│   ├── troops/ArcherGuna.ts
│   ├── Enemy.ts                 # Arcade.Image con HP
│   ├── enemies/Sailor.ts
│   └── Projectile.ts            # Arcade.Image con velocity
└── systems/
    ├── FormationManager.ts      # grid 5×N alrededor del player
    ├── ProjectilePool.ts        # pooling Arcade.Group
    ├── EnemySpawner.ts          # oleadas + curva de dificultad
    ├── SpatialHash<T>           # grid uniforme genérico
    └── CombatSystem.ts          # auto-aim @ 200ms tick
```

Estructura completa propuesta en [PRD §7.2](PRD_Defensores_del_Istmo.md).
