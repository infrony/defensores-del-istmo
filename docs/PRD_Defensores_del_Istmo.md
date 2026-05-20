# 🏹 PRD — Defensores del Istmo
### *(Lane Runner Shooter Histórico-Mítico de Panamá)*

> **Versión:** 0.1 (Borrador inicial)
> **Autor:** Rodney
> **Fecha:** Mayo 2026
> **Engine:** Phaser 3 (TypeScript) + Capacitor (móvil)
> **Estado:** Concepto / Pre-producción

---

## 1. Resumen Ejecutivo

**Defensores del Istmo** es un *lane runner shooter* casual-mid-core para móviles, inspirado en juegos como *Last Z: Survival Shooter*, *Last War* y *Crowd Evolution*. El jugador controla a un guerrero indígena que avanza por un sendero/calzada disparando automáticamente, esquivando obstáculos y atravesando **puertas multiplicadoras** (`×3`, `+10`, `−5`, `÷2`) para acumular un escuadrón de guerreros que enfrenta hordas de **conquistadores españoles, piratas y criaturas míticas del folclore panameño**.

### Pilares de diseño
1. **Satisfacción inmediata** — Cada partida (run) dura 60–120 s, con feedback constante (números flotantes, explosiones, screen shake).
2. **Progresión metajuego** — Upgrades persistentes entre runs (daño, tropas iniciales, oro, ofrendas a espíritus).
3. **Identidad cultural fuerte** — Estética inspirada en arte precolombino panameño (molas Guna, oro precolombino veragüense, geometrías Coclé), no en estereotipos genéricos.
4. **Foco en spectacle** — Efectos VFX llamativos (rayos, fuego, partículas, "screen-fillers") como gancho viral para TikTok/Reels.

### Plataformas objetivo
- **Primario:** iOS y Android (vía Capacitor + WebView).
- **Secundario:** Web (itch.io, Poki, CrazyGames) para validación temprana.

---

## 2. Visión y Tema

### 2.1 Pitch corto
> *"1502. Las naves de hierro llegan al istmo. Tú eres Tanela, guerrera del cacique Quibián. Defiende tu tierra, recluta a tu pueblo, invoca a los espíritus de la selva y rechaza a los invasores antes de que el oro de tu tierra cruce el mar."*

### 2.2 Narrativa por capítulos
Cada capítulo cambia ambientación, enemigos y dificultad:

| Cap. | Era / Lugar | Enemigos | Jefe | Inspiración histórica |
|------|-------------|----------|------|----------------------|
| 1 | Veraguas, 1502 | Marineros, conquistadores | Cristóbal Colón / Diego Méndez | 4º viaje de Colón |
| 2 | Darién, 1513 | Ballesteros, perros de guerra | Vasco Núñez de Balboa | Descubrimiento del Pacífico |
| 3 | Panamá Viejo, 1671 | Piratas, bucaneros | Henry Morgan | Saqueo de Panamá |
| 4 | Portobelo, 1739 | Marines británicos | Almirante Vernon | Batalla de Portobelo |
| 5 | Selva mítica | Tulivieja, Chivato, La Silampa | El Dueño del Monte | Folclore panameño |
| 6+ | Endless / "Defensa eterna" | Mix de todos | Boss rotativo | — |

> **Nota:** El tono no es de "buenos vs malos" maniqueo. Los créditos finales incluirán notas históricas reales para dar contexto educativo.

### 2.3 Tono visual
- **Diurno y vibrante** en niveles de selva/costa (turquesas, verdes selva, rojos terracota).
- **Nocturno y tenebroso** en niveles míticos (azules profundos, naranjas de antorcha, neón espiritual cyan/magenta).
- **VFX exagerados estilo TikTok-ad**: números enormes saltando, flashes blancos, partículas doradas al matar enemigos.

---

## 3. Core Gameplay

### 3.1 Loop principal (un "run")
```
START → Aparece tropa inicial → Avanza por lane →
Pasa por puertas multiplicadoras → Dispara automáticamente →
Esquiva obstáculos (barril, fuego, jaula) → Encuentra mini-oleadas →
Llega al jefe → Lo derrota → Recompensa → Mapa de mundo
```

### 3.2 Controles
| Input | Acción |
|-------|--------|
| Arrastrar (swipe horizontal) | Mover toda la formación izq/der dentro del lane |
| Tap sostenido | (Opcional) Habilidad especial: invocar espíritu |
| Doble tap | Boost temporal (consume "ofrenda") |

> **Sin botones de disparo.** El disparo es automático: el feel debe ser de "elegir bien tus puertas y posicionarte".

### 3.3 Sistema de puertas multiplicadoras
Las puertas son la mecánica clave que da rejugabilidad y decisiones. Cada par de puertas presenta una elección:

| Operación | Efecto | Color | Frecuencia |
|-----------|--------|-------|-----------|
| `+N` | Suma N tropas iguales | Verde | Alta |
| `×N` | Multiplica el total por N | Azul | Media |
| `−N` | Resta N tropas | Rojo | Media (puerta "trampa") |
| `÷N` | Divide el total entre N | Rojo oscuro | Baja |
| `Upgrade` (icono) | Cambia clase de tropa | Dorado | Baja |
| `Boss Damage` (calavera × N) | No afecta tropas; multiplica daño contra jefe | Púrpura | Solo antes del jefe |

**Regla de diseño:** Siempre se presentan **2 puertas en paralelo**, una mejor y una peor, forzando decisión rápida.

### 3.4 Clases de tropa
Cada clase tiene rol, alcance y arma temática:

| Clase | Arma | Daño | Cadencia | Especialidad |
|-------|------|------|----------|--------------|
| 🏹 **Arquero Guna** | Arco | Bajo | Alta | Tropa base, alcance medio |
| 🪓 **Guerrero Ngäbe** | Hacha de piedra | Alto | Baja (melé) | Daño cuerpo a cuerpo |
| 🦅 **Cazador Emberá** | Cerbatana | Medio | Muy alta | Veneno (DOT) |
| 🔥 **Chamán** | Bastón de fuego | Alto AOE | Lenta | Daño en área |
| ⚡ **Invocador** | Espíritu animal | Variable | — | Resucita 1 vez por run |
| 🛡️ **Jaguar guardián** | Garras | Muy alto | Media | Tanque, absorbe daño |

### 3.5 Enemigos
- **Marineros**: HP bajo, velocidad alta, oleadas masivas (estilo zombie).
- **Conquistadores con armadura**: HP medio, mitigan daño de flechas, débiles a fuego.
- **Perros de guerra**: Veloces, esquivan, hay que apuntar bien.
- **Ballesteros**: Devuelven daño a distancia.
- **Piratas**: Daño explosivo, sueltan barriles de pólvora.
- **Tulivieja, Chivato, La Silampa**: Jefes míticos con mecánicas únicas (teleport, invocar, oscurecer pantalla).

### 3.6 Obstáculos en el lane
- **Barriles de pólvora** con HP (`22`, `141`, `9` — números visibles, hay que romperlos antes de chocar).
- **Trampas de fuego** (esquivar moviendo el grupo).
- **Jaulas con prisioneros** (al destruir: +tropas bonus).
- **Tótems enemigos** (buff de HP a próxima oleada hasta destruirlos).

### 3.7 Jefes (Boss fights)
- Aparecen al final de cada capítulo.
- HP visible enorme (ej. `9,560`, `98,255,746` como en el ejemplo).
- Atacan en patrones telegrafiables (estela roja antes del ataque).
- Recompensas: cofre dorado garantizado + cinemática corta.

---

## 4. Sistemas y Progresión

### 4.1 Metajuego
Entre runs, el jugador vuelve a su **aldea/refugio** (estilo *Archero* o *Last War*):

- **Tótem de Sabiduría** — Sube nivel de jugador (XP por runs).
- **Casa del Cacique** — Mejora estadísticas base (daño, HP, tropas iniciales).
- **Choza del Chamán** — Compra/mejora habilidades especiales.
- **Mercado de Trueque** — Convierte recursos (oro ↔ jade ↔ plumas).
- **Altar de Espíritus** — Sistema "gacha" de espíritus animales (Jaguar, Águila, Serpiente, Caimán).

### 4.2 Monedas y recursos
| Recurso | Obtención | Uso |
|---------|-----------|-----|
| 🪙 Oro precolombino | Cada run | Upgrades comunes |
| 💎 Jade | Cofres, logros | Premium / acelerar |
| 🪶 Plumas sagradas | Eventos, IAP | Espíritus, skins |
| ⚡ Energía / Ofrenda | Recargable con tiempo | Iniciar run (suave gating, opcional) |

### 4.3 Curva de dificultad
- **Niveles 1–5**: Tutorial encubierto, jugador siempre gana.
- **Niveles 6–20**: Curva suave, primera derrota intencional en ~nivel 12.
- **Niveles 21+**: Requiere upgrades de metajuego — esto fuerza el regreso a la aldea.
- **Modo Endless**: Desbloqueado al completar Cap. 3. Leaderboards globales.

### 4.4 Sistemas de retención
- **Daily login** (7 días → recompensa grande).
- **Misiones diarias** (3 por día).
- **Battle Pass estacional** (gratuito + premium).
- **Eventos temáticos**: "Carnaval de Las Tablas", "Festival de la Mejorana", "Día del Desfile Patrio".

---

## 5. Arte y Estética

### 5.1 Estilo visual
- **2D vista cenital ligeramente inclinada** (perspectiva 3/4, ~30°) — similar al ejemplo.
- **Sprites estilizados, no realistas** — proporción "chibi heroica" (cabeza grande, cuerpo compacto) para legibilidad en móvil.
- **Paleta cultural:**
  - Indígenas: tonos tierra, ocres, rojos cinabrio, turquesas Coclé.
  - Conquistadores: grises metálicos, rojos sangre, negros.
  - Espíritus: cyan neón, magenta, dorado luminoso.

### 5.2 Referencias artísticas obligatorias
- **Molas Guna** (geometría, contorno negro, capas de color).
- **Oro Veragüense / Coclé** (patrones animales estilizados).
- **Petroglifos del Caño** y **piedras de Barriles**.
- **Vestimenta tradicional Emberá/Wounaan** (pinturas corporales con jagua).

> ⚠️ **Cuidado de respeto cultural:** Antes del launch, consultar con representantes culturales (Congresos Guna, etc.) para validar uso respetuoso. Documentar fuentes históricas en créditos.

### 5.3 Lista preliminar de assets para generar con IA
**Personajes (sprites + animaciones idle/run/attack/death):**
- 6 clases de tropa aliada (4 frames × 4 estados c/u = ~96 frames)
- 8 tipos de enemigo
- 6 jefes únicos
- Protagonista "Tanela"

**Entornos (tiles + parallax backgrounds):**
- Selva tropical, costa caribeña, ruinas de Panamá Viejo, fortaleza Portobelo, manglar nocturno, mundo espiritual

**UI:**
- HUD (oro, gemas, energía, HP)
- Botones estilo "tallado en piedra"
- Iconos de habilidades estilo petroglifo
- Pantalla de aldea (vista isométrica)

**VFX (spritesheets):**
- Explosiones, fuego, rayos, partículas doradas, humo, splash de sangre estilizada (no realista)
- Aura de espíritus invocados

### 5.4 Tipografía
- **Títulos:** Display tallada/orgánica (ej. *Caveat Brush*, *Cinzel*, o fuente custom con motivo precolombino).
- **UI / cuerpo:** Sans-serif limpia (*Inter*, *Nunito*) para legibilidad móvil.

---

## 6. Audio

### 6.1 Música
- **Tema principal:** Mezcla de instrumentos tradicionales (mejoranera, tambores Congo, flautas Kuna) con percusión electrónica moderna (hybrid orchestral).
- **Por capítulo:**
  - Cap 1-2: Tribal-orgánico, percusión densa.
  - Cap 3-4: Tensión naval, cuerdas barrocas oscuras.
  - Cap 5: Ambient/ritual, drones, voces fantasmales.
- **Loop dinámico:** Música sube de intensidad al acercarse al jefe.

### 6.2 SFX (mínimo viable)
- Disparo (4 variantes por arma)
- Impacto en enemigo / impacto crítico
- Paso por puerta (sonido distinto positivo/negativo)
- UI clicks
- Voces cortas ("¡Hai!", gritos de guerra) — grabar o generar con IA
- Música de jefe distintiva

### 6.3 Generación con IA
- Música: **Suno**, **Udio**, **Soundraw** con prompts culturalmente específicos.
- SFX: **ElevenLabs Sound Effects**, **myinstants** custom, o grabación foley propia.

---

## 7. Tecnología

### 7.1 Stack
| Capa | Tecnología | Por qué |
|------|-----------|---------|
| Engine | **Phaser 3.80+** | Maduro, gratis, gran comunidad, ideal 2D |
| Lenguaje | **TypeScript** | Tipado, escalable, mejor DX |
| Bundler | **Vite** | Hot reload rápido, build optimizado |
| Móvil | **Capacitor 6** | Web → iOS/Android nativo, plugins maduros |
| Estado | **Phaser Registry** + clase singleton `GameState` | Suficiente, sin overhead |
| Persistencia | `localStorage` (web) / `Preferences` plugin (Capacitor) | |
| Analytics | **Firebase Analytics** o **PostHog** | Gratis hasta cierto tier |
| Anuncios | **AdMob** vía Capacitor plugin | Industry standard |
| IAP | **RevenueCat** | Abstrae App Store / Play Store |
| Crash reporting | **Sentry** | |

### 7.2 Estructura de carpetas propuesta
```
defensores-del-istmo/
├── public/
│   └── assets/
│       ├── sprites/
│       ├── audio/
│       ├── tilemaps/
│       └── ui/
├── src/
│   ├── main.ts                 # Entry point
│   ├── config.ts               # Config Phaser
│   ├── scenes/
│   │   ├── BootScene.ts        # Carga inicial
│   │   ├── PreloadScene.ts     # Carga de assets con barra
│   │   ├── MainMenuScene.ts
│   │   ├── VillageScene.ts     # Aldea / metajuego
│   │   ├── GameScene.ts        # El run principal
│   │   ├── HUDScene.ts         # UI superpuesta
│   │   ├── GateScene.ts        # (opcional) modal upgrades
│   │   └── BossScene.ts        # Variante de GameScene
│   ├── entities/
│   │   ├── Player.ts
│   │   ├── Troop.ts            # Clase base
│   │   ├── troops/             # Arquero, Guerrero, etc.
│   │   ├── Enemy.ts
│   │   ├── enemies/
│   │   ├── Boss.ts
│   │   ├── Gate.ts
│   │   ├── Obstacle.ts
│   │   └── Projectile.ts
│   ├── systems/
│   │   ├── FormationManager.ts # Coloca tropas en grid
│   │   ├── SpawnManager.ts     # Genera enemigos
│   │   ├── GateSpawner.ts      # Genera puertas
│   │   ├── EconomySystem.ts
│   │   ├── ProgressionSystem.ts
│   │   ├── SaveSystem.ts
│   │   └── AdsManager.ts
│   ├── data/
│   │   ├── troops.json         # Stats por clase
│   │   ├── enemies.json
│   │   ├── levels.json         # Diseño de niveles
│   │   └── upgrades.json
│   ├── ui/
│   │   ├── components/         # Botones, modales custom
│   │   └── theme.ts
│   └── utils/
├── capacitor.config.ts
├── ios/                        # Generado por Capacitor
├── android/                    # Generado por Capacitor
└── package.json
```

### 7.3 Diseño técnico clave en Phaser

**Lane infinito (scroll vertical):**
- Cámara fija, tiles del fondo se mueven hacia abajo (parallax con TileSprite).
- "Distancia recorrida" es solo un contador interno.

**Formación de tropas:**
- Grid lógico relativo al líder (jugador). Ej. 5 columnas × N filas.
- Cuando llegan a 50+ tropas, reducir tamaño visual del sprite y "stackearlas" para no saturar pantalla.

**Performance:**
- **Pooling agresivo** de proyectiles y enemigos (`Phaser.GameObjects.Group`).
- Limitar partículas activas a ~200 simultáneas.
- Texturas en atlas (TexturePacker) para reducir draw calls.
- En mobile: cap a 60fps, downgrade a 30fps si dispositivo lento (detectar con `game.loop.actualFps`).

**Auto-aim:**
- Cada tropa hace target del enemigo más cercano en su rango cada X ms.
- Spatial hashing para no hacer O(n²) en cada frame.

### 7.4 Build móvil con Capacitor
```bash
# Setup inicial (una vez)
npm i @capacitor/core @capacitor/cli
npx cap init "Defensores del Istmo" com.rodney.defensoresdelistmo
npx cap add ios
npx cap add android

# Build flow
npm run build              # Vite build → /dist
npx cap sync               # Copia dist a iOS/Android
npx cap open ios           # Abre Xcode
npx cap open android       # Abre Android Studio
```

**Plugins Capacitor necesarios:**
- `@capacitor/preferences` (save persistente)
- `@capacitor/haptics` (vibración en hits)
- `@capacitor/screen-orientation` (forzar portrait)
- `@capacitor-community/admob` (ads)
- `@revenuecat/purchases-capacitor` (IAP)

---

## 8. Monetización

> **Filosofía:** Free-to-play justo. Sin paywalls duros. Pagar acelera, no desbloquea contenido único.

### 8.1 Fuentes de ingreso
| Fuente | Implementación | Estimado |
|--------|----------------|----------|
| **Anuncios rewarded** | Doble recompensa, revivir, cofre extra | 60–70% revenue F2P típico |
| **Anuncios interstitial** | Cada 3-4 runs (NO entre niveles activos) | 10–15% |
| **IAP — Remove Ads** | $4.99 single | Pago único alto-LTV |
| **IAP — Packs de gemas** | $0.99 – $99.99 | |
| **IAP — Battle Pass** | $9.99/mes | |
| **IAP — Skins / Espíritus únicos** | Cosmético | |

### 8.2 Reglas éticas de monetización
- ❌ No loot boxes con dinero real (espíritus solo con jade ganado in-game).
- ❌ No timers >24h (frustración).
- ✅ Mostrar siempre "lo que da" antes de comprar.
- ✅ Cumplir con regulaciones COPPA / GDPR-K (juego target 12+, no 17+ pese al género).

---

## 9. KPIs y Métricas

### Métricas a trackear desde el día 1
| Métrica | Objetivo soft launch |
|---------|---------------------|
| D1 retention | >35% |
| D7 retention | >12% |
| D30 retention | >5% |
| Avg session length | 6–10 min |
| Sessions/day | 3–5 |
| ARPDAU | $0.10–$0.30 |
| Crash-free users | >99% |

---

## 10. Roadmap

### 🟢 Fase 0 — Pre-producción (2–3 semanas)
- [ ] Validar PRD con feedback externo
- [ ] Concept art (3–5 piezas clave hechas con IA + retoque manual)
- [ ] Prototype paper-design del loop
- [ ] Setup repo, Vite + Phaser + TypeScript funcionando

### 🟡 Fase 1 — Vertical Slice / MVP (6–8 semanas)
**Meta:** Un nivel jugable de principio a fin con todo el loop.
- [ ] Movimiento del jugador en lane
- [ ] Tropas básicas (2 clases) con auto-aim y disparo
- [ ] Sistema de puertas (+, ×, −, ÷)
- [ ] 2 tipos de enemigo
- [ ] 1 jefe completo
- [ ] HUD básico
- [ ] Cofre de recompensa + pantalla de victoria
- [ ] Save/load local

### 🟠 Fase 2 — Alpha (8–10 semanas)
- [ ] Aldea/metajuego funcional
- [ ] 3 capítulos completos (15–20 niveles)
- [ ] Las 6 clases de tropa
- [ ] Todos los tipos de enemigo + 3 jefes
- [ ] Tienda básica
- [ ] Audio integrado
- [ ] Build móvil con Capacitor probado en device real

### 🔴 Fase 3 — Beta cerrada (4–6 semanas)
- [ ] TestFlight (iOS) + Internal Track (Android)
- [ ] Analytics integrado
- [ ] Crash reporting
- [ ] Balance basado en datos
- [ ] Sistemas de retención (diarias, login)
- [ ] Monetización integrada (Ads + IAP test)

### 🟣 Fase 4 — Soft launch (4 semanas)
- [ ] Launch en 1–2 países pequeños (ej. Filipinas, Perú)
- [ ] Medir KPIs vs objetivos
- [ ] Iterar onboarding y curva
- [ ] Optimizar UA / creatividades

### ⚫ Fase 5 — Global launch
- [ ] ASO completo
- [ ] Trailer y creatividades (3-5 variantes para A/B testing)
- [ ] Roadmap de contenido post-launch (capítulos 4-6, eventos)

---

## 11. Riesgos y Mitigaciones

| Riesgo | Impacto | Mitigación |
|--------|---------|------------|
| Phaser limita en performance con muchos sprites | Alto | Pooling agresivo, atlas, perfiles por device |
| Tema cultural mal manejado puede ofender | Alto | Consultoría con representantes indígenas, asesor histórico |
| Saturación del género lane-shooter | Medio | Identidad visual única + narrativa fuerte como diferenciador |
| Costos de marketing > revenue | Alto | Soft launch para validar antes de inversión grande |
| Apple/Google rechazan por contenido violento | Bajo | Estética estilizada, no realista. Rating 12+ apuntable |
| Tiempo de desarrollo solo (sin equipo) | Alto | Scope MVP estricto. No feature creep. |

---

## 12. Apéndices

### A. Inspiraciones y benchmarks
- **Last Z: Survival Shooter** (Omnilojo) — Referencia directa del loop
- **Last War: Survival Game** (FunGame Plus) — Sistema de puertas
- **Crowd Evolution** — Acumulación de personajes
- **Archero / Survivor.io** — Metajuego y progresión
- **Hades** — Identidad visual y storytelling integrado
- **Tunic** — Cómo construir identidad cultural fuerte

### B. Recursos para generación con IA
| Tipo | Herramienta sugerida |
|------|---------------------|
| Sprites 2D | Midjourney + Aseprite/Photoshop para limpieza, **Scenario.gg** (game-focused) |
| Spritesheets / animación | **Layer.ai**, **Cascadeur** (3D→2D), **PixelLab** |
| Tiles / fondos | Midjourney con prompts de tiles seamless |
| Música | **Suno**, **Udio** |
| SFX | **ElevenLabs Sound Effects** |
| Voces (gritos, locución) | **ElevenLabs**, **PlayHT** |
| Concept art | Midjourney, Stable Diffusion + ControlNet |

### C. Glosario rápido
- **Lane runner**: Subgénero donde el jugador avanza por carriles fijos.
- **Gate / puerta**: Pickup que modifica numéricamente la unidad.
- **Run**: Una sesión de juego de inicio a fin (victoria o derrota).
- **Metajuego**: Sistemas de progresión persistente entre runs.
- **ARPDAU**: Average Revenue Per Daily Active User.
- **Soft launch**: Lanzamiento limitado para validar antes de global.

### D. Próximos pasos inmediatos sugeridos
1. **Validar concepto**: jugar 5–10 runs del juego de referencia tomando notas de qué se siente bien.
2. **Concept art**: generar 3 piezas (Tanela, una puerta multiplicadora, un jefe) para anclar el estilo visual.
3. **Prototipo técnico** (1 semana): movimiento + 1 puerta + 1 enemigo en Phaser, sin arte final.
4. **Decidir scope MVP** con base en lo que aprendiste del prototipo.

---

*Documento vivo. Actualizar según evolucione el proyecto.*
