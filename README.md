# Defensores del Istmo

Lane runner shooter histórico-mítico de Panamá. Phaser 3 + TypeScript + Capacitor.

Ver [PRD_Defensores_del_Istmo.md](PRD_Defensores_del_Istmo.md) y [PLAN.md](PLAN.md).

## Setup

```bash
npm install
npm run dev      # → http://localhost:5173
```

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

**v0.0.1 — prototipo**

- ✅ Scaffold Vite + Phaser 3 + TS funcionando
- ✅ Escenas Boot → Preload → MainMenu → Game
- ✅ Player que se mueve con swipe horizontal dentro del lane
- ✅ Scroll vertical del lane + parallax simple de bordes
- ✅ HUD de distancia y FPS
- ⏳ Sin tropas, sin enemigos, sin puertas, sin assets finales

Próximo: Sprint 1.1 del [PLAN.md](PLAN.md) — formación + auto-aim + 1 enemigo.

## Estructura

```
src/
├── main.ts              # entry
├── config.ts            # constantes globales + GameConfig
└── scenes/
    ├── BootScene.ts
    ├── PreloadScene.ts  # genera texturas placeholder
    ├── MainMenuScene.ts
    └── GameScene.ts     # prototipo jugable
```

Estructura completa propuesta en [PRD §7.2](PRD_Defensores_del_Istmo.md).
