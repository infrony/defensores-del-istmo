# 🗺️ Plan de Desarrollo — Defensores del Istmo

> **Versión:** 1.0
> **Fecha:** 2026-05-19
> **Basado en:** PRD v0.1
> **Modalidad:** Solo developer + assets generados con IA
> **Duración total estimada:** 7–10 meses (part-time intenso) / 5–6 meses (full-time)

---

## 0. Filosofía del plan

- **Scope estricto.** El feature creep es el riesgo #1 del PRD. Cada fase tiene un "definition of done" no negociable.
- **Vertical primero, horizontal después.** Antes de tener "6 clases de tropa", tener 1 clase que se sienta perfecta.
- **Build playable cada semana.** Nada se construye sin que se pueda jugar. Si una semana no produjo build jugable, recalibrar.
- **Mide antes de pulir.** No se pasa a la siguiente fase sin validar la anterior con métricas o playtests reales.
- **Mobile-first desde semana 1.** Probar en device real cada milestone, no al final.

---

## 1. Fases y cronograma

| Fase | Nombre | Duración objetivo | Definition of Done |
|------|--------|-------------------|--------------------|
| 0 | Pre-producción | 2–3 sem | Repo + prototipo movimiento + 3 concept arts validados |
| 1 | Vertical Slice / MVP | 6–8 sem | 1 nivel completo jugable en device con loop entero |
| 2 | Alpha | 8–10 sem | 3 capítulos, metajuego, 6 clases, 3 jefes, build móvil |
| 3 | Beta cerrada | 4–6 sem | Analytics + crash reporting + monetización en TestFlight |
| 4 | Soft launch | 4 sem | Live en 1–2 países, KPIs medidos vs objetivo |
| 5 | Global launch | 2–4 sem | ASO, trailer, store live mundialmente |
| **Total** | | **26–35 semanas** | |

---

## 2. Fase 0 — Pre-producción (semanas 1–3)

**Meta:** Reducir incertidumbre técnica y artística antes de comprometerse al MVP.

### Sprint 0.1 — Setup técnico (semana 1)
- [x] Crear `PRD_Defensores_del_Istmo.md` (ya existe)
- [x] Crear `PLAN.md` (este documento)
- [x] `git init`, `.gitignore`, primer commit
- [x] Scaffold: Vite + TypeScript + Phaser 3.80 + ESLint + Prettier
- [x] Estructura de carpetas según PRD §7.2
- [x] BootScene + PreloadScene + GameScene corriendo en localhost
- [x] **Prototipo mínimo:** sprite del jugador moviéndose con drag/swipe horizontal sobre fondo que hace scroll
- [x] Controles teclado (← →, A/D) para testeo en desktop
- [ ] Primer commit etiquetado `v0.0.1-scaffold` (commit existe, falta tag)
- [ ] Repo remoto (GitHub privado)

### Sprint 0.2 — Validación de concepto (semana 2)
- [ ] Jugar 10+ partidas de *Last War*, *Last Z*, *Crowd Evolution*. Cuaderno de notas: qué se siente bien, qué fricción tienen
- [x] Decisión técnica documentada: orientación portrait fija + resolución base 1080×1920 (`config.ts` + `CLAUDE.md`)
- [x] Prototipo de puerta multiplicadora (`+N`, `-N`, `×N`, `÷N`) — colisión AABB jugador↔puerta, efecto en formación, texto flotante, ripple tween
- [x] Puerta dorada de upgrade (⚔ Ngäbe) — cada 60 m convierte mitad de la formación al tipo melee
- [ ] Capacitor instalado, build iOS + Android genera y abre en device real

### Sprint 0.3 — Identidad visual (semana 3)
- [ ] 3 concept arts generados (Midjourney + retoque):
  - Tanela en pose de combate
  - Par de puertas multiplicadoras estilo "tallado precolombino"
  - Un enemigo conquistador
- [ ] Style guide: paleta hex, grosor de outline, ratio chibi, tipografías finales
- [ ] Si el estilo no convence: iterar antes de pasar a Fase 1

### Salidas concretas de Fase 0
1. Repo funcional con CI básico (lint en PR)
2. Build móvil que abre en iPhone/Android del propio dev
3. PDF/imagen con style guide visual
4. Decisión validada: ¿seguimos con Phaser? (alternativa de respaldo: PixiJS, descartada si Phaser no muestra problemas)

### Riesgos específicos Fase 0
- Phaser + Capacitor + iOS: pérdidas de input táctil → testar swipe en device real **antes** de invertir en gameplay
- Estilo visual no traduce a sprite-sheets coherentes con IA → reservar 1 día completo a probar workflow Scenario.gg / Layer.ai

---

## 3. Fase 1 — Vertical Slice / MVP (semanas 4–11)

**Meta:** Un nivel jugable completo de Cap. 1 (Veraguas 1502), de inicio a fin, con el loop entero. Sin metajuego aún.

### Sprint 1.1 — Core movement & formation (sem 4–5)
- [x] `Player` entity con swipe-to-move suavizado (lerp, no teleport)
- [x] `FormationManager` con grid lógico 5×N relativo al líder
- [x] `Troop` clase base + 1 clase: **Arquero Guna**
- [x] Auto-aim: cada tropa apunta al enemigo más cercano cada 200 ms (`CombatSystem` + `SpatialHash`)
- [x] `Projectile` con pooling (`Phaser.Physics.Arcade.Group`)
- [x] 1 enemigo (Marinero) con HP que recibe daño y muere, flash VFX
- [ ] Tests manuales en device: 60fps con 30 tropas + 50 enemigos

### Sprint 1.2 — Puertas y obstáculos (sem 6)
- [x] `Gate` entity con operación (`+N`, `×N`, `−N`, `÷N`, `upgrade`)
- [x] `GateSpawner`: spawnea pares (positiva + negativa) cada 14 m; par de upgrade cada 60 m
- [x] Lógica de colisión AABB: jugador entra por una puerta, la otra sigue scrolleando
- [x] Feedback visual: número flotante animado + ripple de escala en formación
- [x] `Obstacle`: barril con HP visible, recibe daño de proyectiles, baja scrolleando

### Sprint 1.3 — Enemigos y oleadas (sem 7–8)
- [x] 2 tipos de enemigo: Marinero (rápido, low HP) + Conquistador (lento, medio HP — aparece tras 30 s)
- [x] `SpawnManager` con scripts de oleadas en JSON (`src/data/levels.json`) — nivel "Veraguas 1502" con 11 waves + trigger de boss
- [x] Sistema de daño con números flotantes (`DamageText` pool, 30 slots, críticos en amarillo)
- [x] Screen shake en kill (60ms/0.004) y hit crítico (40ms/0.002)
- [x] 2ª clase de tropa: **Guerrero Ngäbe** (melé, rango 200 px → ajustado a 500 px, daño alto)
- [x] Fix rango de tropas (1400 px ArcherGuna, 500 px GuerreroNgäbe) — combate arranca inmediatamente
- [x] Pre-spawn 18 enemigos en pantalla al inicio del juego — horda visible desde el frame 1
- [x] Tasa de spawn aumentada a 400 ms / 2–3 por batch para sensación de horda (ref: Last Z)

### Sprint 1.4 — Jefe y cierre del run (sem 9)
- [x] `Boss` Diego Méndez: HP barra grande, 2 patrones de ataque telegrafados (barrido + embestida)
- [x] Boss integrado como variante dentro de `GameScene` (no requirió escena aparte)
- [x] Pantalla de victoria con cofre animado, stats y "¡Nueva marca!" si aplica
- [x] Pantalla de derrota con mejor marca y botones "REINTENTAR" / "Menú principal"
- [x] Save/load local con `localStorage` (`SaveSystem`: `bestDistance`, `bestKills`, `totalRuns`)

### Sprint 1.5 — Pulido y arte final del slice (sem 10–11)
- [ ] Reemplazar placeholders con sprites finales generados con IA
- [ ] 1 tema musical + 6 SFX clave (disparo, hit, puerta+, puerta−, jefe, victoria)
- [ ] HUD: oro, HP, contador de tropas
- [ ] Onboarding suave (3 tooltips la primera vez)
- [ ] **Playtest externo** con 3–5 personas no técnicas. Grabar sesiones

### Definition of Done Fase 1
- [ ] Un jugador externo puede completar el nivel sin instrucciones del dev
- [ ] 60fps estables en iPhone 12 / Pixel 5 (gama media)
- [ ] Tiempo medio de run: 60–120 s (medir con 10 sesiones)
- [ ] No crashea en 30 min de juego continuo

### Riesgos específicos Fase 1
- Auto-aim con muchas tropas se vuelve O(n²) → spatial hashing desde el día 1
- Sprites generados con IA inconsistentes entre frames → pipeline definido en Sprint 0.3, no improvisar

---

## 4. Fase 2 — Alpha (semanas 12–21)

**Meta:** Juego "completo" en contenido para los primeros 3 capítulos + metajuego de aldea funcional.

### Sprint 2.1 — Metajuego y aldea (sem 12–13)
- [ ] `VillageScene` con vista isométrica simple
- [ ] 5 edificios PRD §4.1: Tótem, Casa del Cacique, Choza del Chamán, Mercado, Altar
- [ ] `ProgressionSystem` con upgrades persistentes
- [ ] Flujo: village → mapa de niveles → run → reward → village

### Sprint 2.2 — Todas las clases de tropa (sem 14–15)
- [ ] 4 clases adicionales: Emberá, Chamán, Invocador, Jaguar
- [ ] Sistema de "clase por puerta upgrade" (dorada)
- [ ] Balanceo inicial vía `data/troops.json`

### Sprint 2.3 — Capítulos 2 y 3 (sem 16–18)
- [ ] Cap 2 Darién (1513): ballesteros, perros, jefe Balboa
- [ ] Cap 3 Panamá Viejo (1671): piratas, barriles explosivos, jefe Morgan
- [ ] 15–20 niveles totales con curva de dificultad
- [ ] Mapa de mundo con progresión visible

### Sprint 2.4 — Audio + VFX (sem 19)
- [ ] Música por capítulo (3 temas)
- [ ] SFX completo (~30 archivos)
- [ ] VFX: partículas doradas, explosiones, aura de espíritus
- [ ] Música dinámica (capa de boss)

### Sprint 2.5 — Tienda y economía (sem 20)
- [ ] Tienda básica con jade/oro/plumas
- [ ] Sistema de cofres (común, raro, dorado de jefe)
- [ ] Balance económico v1

### Sprint 2.6 — Build móvil estable (sem 21)
- [ ] Capacitor: AdMob, Preferences, Haptics, ScreenOrientation integrados
- [ ] Performance: pooling auditado, atlas de texturas, downgrade auto a 30fps
- [ ] Test en 5 devices distintos (low/mid/high-end iOS + Android)

### Definition of Done Fase 2
- [ ] Juego completable de inicio a Cap 3 final
- [ ] Loop village ↔ run estable
- [ ] APK + IPA generados y funcionando

---

## 5. Fase 3 — Beta cerrada (semanas 22–27)

**Meta:** Producto medible con datos reales de testers.

### Sprint 3.1 — Telemetría (sem 22)
- [ ] Firebase Analytics o PostHog integrado
- [ ] Eventos clave: run_start, run_end, gate_choice, death, purchase, ad_view
- [ ] Sentry para crash reporting
- [ ] Dashboard con D1/D7, session length, ARPU

### Sprint 3.2 — Retención (sem 23–24)
- [ ] Daily login (7 días)
- [ ] 3 misiones diarias
- [ ] Battle Pass estructura (sin contenido temporal aún)
- [ ] Push notifications (energía full, evento)

### Sprint 3.3 — Monetización (sem 25)
- [ ] AdMob: rewarded (revivir, doble loot), interstitial cada 3 runs
- [ ] RevenueCat: Remove Ads, packs de gemas, Battle Pass
- [ ] Sandbox testing iOS + Android

### Sprint 3.4 — Beta release (sem 26–27)
- [ ] TestFlight con 20–50 testers reclutados (Discord, redes propias)
- [ ] Internal Track Google Play
- [ ] Feedback survey integrado
- [ ] Iterar balance con datos (puertas más elegidas, curva de muerte)

### Definition of Done Fase 3
- [ ] Crash-free users >99% en 1 semana de beta
- [ ] D1 >25% (proyección a >35% en soft launch con pulido)
- [ ] Onboarding funnel: >70% completa nivel 1

---

## 6. Fase 4 — Soft launch (semanas 28–31)

**Meta:** Validar economía y retención con UA real antes de invertir en global.

- [ ] Launch en 1–2 países pequeños (Filipinas + Perú recomendados: idioma EN/ES, ARPU bajo pero comportamiento similar a mercados grandes)
- [ ] Presupuesto UA inicial: $500–1500 (Meta + TikTok ads)
- [ ] 3 creatividades A/B testeadas
- [ ] Mediciones a 7, 14, 28 días vs objetivos KPI del PRD §9
- [ ] Decisión gate-to-global: ¿KPIs cumplen mínimos? Si no, iterar 4 semanas más

### Métricas de go/no-go a global
| Métrica | Mínimo aceptable | Ideal |
|---------|------------------|-------|
| D1 retention | 30% | 40%+ |
| D7 retention | 10% | 15%+ |
| ARPDAU | $0.08 | $0.15+ |
| Crash-free | 99% | 99.5%+ |

---

## 7. Fase 5 — Global launch (semanas 32–35)

- [ ] ASO completo: keywords investigadas, screenshots A/B, video preview
- [ ] Trailer 30s para stores
- [ ] 5 creatividades para UA global ($5k–20k presupuesto inicial)
- [ ] Press kit (itch.io, Indie DB, prensa indie panameña)
- [ ] PR cultural: contactar medios panameños sobre el ángulo histórico
- [ ] Roadmap de contenido post-launch documentado (Cap 4, 5, eventos)

---

## 8. Workstreams paralelos

Estos no son fases secuenciales; corren en paralelo a las fases anteriores.

### Arte (continuo desde Fase 0)
- Pipeline de IA → sprite-sheet definido en Fase 0
- Batch de assets por sprint, no asset-por-asset
- Backlog priorizado: protagonista → enemigos básicos → puertas → entornos → jefes → cosméticos

### Audio (desde Fase 1.5)
- 1 tema principal en Fase 1 (placeholder OK)
- Resto en Fase 2.4
- Asesor: si presupuesto, contratar 1 músico panameño para validar autenticidad

### Validación cultural (desde Fase 0)
- Lista de contactos: Congreso General Guna, asesor histórico (UP / SENACYT)
- Reviews antes de cada release significativa
- Documentar fuentes en `docs/historical-references.md`

### QA (desde Fase 1)
- Tests manuales en cada sprint
- Pool de devices físicos: 2 iOS (low + high), 2 Android (low + high) mínimo
- Tests automatizados solo de sistemas críticos (economía, save/load)

---

## 9. Decisiones técnicas pendientes (resolver en Fase 0)

1. **Backend:** ¿Hay backend? Para v1: NO (todo local). Cloud save → Fase post-launch
2. **Localización:** Lanzar en ES + EN. PT-BR y FR en Fase 4
3. **Anti-cheat leaderboards:** Validación server-side requiere backend → posponer leaderboards a v1.1
4. **Tema oscuro/claro UI:** Solo oscuro v1 (consistente con ambientación)
5. **Tablets:** Soporte sí, pero diseño portrait. Layout escalable, no rediseño

---

## 10. Riesgos transversales y mitigaciones

| Riesgo | Probabilidad | Impacto | Mitigación |
|--------|--------------|---------|------------|
| Burnout solo dev | Alta | Crítico | Sprints de 1 semana con día libre; revisar scope mensualmente |
| Phaser performance en low-end | Media | Alto | Testar en device de gama baja desde Sprint 1.1 |
| IA assets inconsistentes | Alta | Medio | Workflow definido en Fase 0, no improvisar |
| Apple/Google rechazan store listing | Baja | Alto | Cumplir rating 12+, no contenido sangriento realista |
| Costo de UA > revenue | Alta | Alto | Soft launch para validar antes de inversión |
| Crítica por tema cultural | Media | Alto | Consultoría temprana, no opcional |
| Falta de tiempo (proyecto solo) | Alta | Crítico | Scope MVP estricto; cortar antes que estirar |

---

## 11. Métricas de seguimiento del propio plan

Cada lunes, revisar:
- ¿Qué se completó la semana pasada vs lo planeado?
- ¿Velocity real vs estimada? (en story points o tasks)
- ¿Algún riesgo de la matriz se activó? Acción
- ¿Hay feature creep solicitándose? Pasar a "backlog v1.1"

Cada fin de fase, retrospectiva escrita:
- Qué funcionó / qué no / qué cambiar en la siguiente

---

## 12. Estado actual y próximos pasos

**Completado:**
1. ✅ Scaffold Vite + Phaser 3 + TS + ESLint + Prettier
2. ✅ Primer commit jugable (player, scroll, formación, combate, HUD)
3. ✅ Sistema de puertas completo (Sprint 0.2 / 1.2): `+`, `-`, `×`, `÷`, upgrade dorada
4. ✅ Guerrero Ngäbe (melé) + Conquistador (enemigo medio HP)
5. ✅ `CLAUDE.md` con arquitectura y comandos

**También completado (bugfix + mecánica):**

- [x] Damage scaling: `daño = baseDamage × (1 + 0.12 × √(n−1))` — más tropas = más daño por proyectil
- [x] HUD muestra multiplicador `⚡×N.NN` cuando la formación es ≥ 10% más fuerte
- [x] Fix: `ObstacleManager` usaba `StaticGroup` incompatible con el body dinámico de `Obstacle`

**También completado (bugfix + Sprint 1.4 completo):**

- [x] Fix: puertas negativas (`-`, `÷`) ahora pueden reducir tropas a 0 — el clamp `Math.max(1, …)` fue eliminado
- [x] Pantalla de derrota: overlay con título "DERROTA", distancia recorrida, kills, mejor marca, botones "REINTENTAR" y "Menú principal"
- [x] Update loop se pausa al activarse game over o victoria (flags `gameOverActive`, `victoryActive`)
- [x] `BossMendez` entity: 1500 HP, escala 1.9×, settle en y=480; 2 patrones telegrafados — Barrido horizontal (telegraph amarillo → velocidad X) + Embestida (telegraph rojo → velocidad Y + retorno)
- [x] Boss spawneado por `SpawnManager` al alcanzar 75 m (wave `boss-mendez` en `levels.json`)
- [x] `EnemySpawner` suprime spawn normal durante boss fight; llama `bossUpdate(delta)` cada frame
- [x] Barra de HP del boss (700×36 px, centrada en y=150): nombre "DIEGO MÉNDEZ", fill rojo → naranja → rojo brillante según %, porcentaje y HP numérico
- [x] Al spawn del boss se eliminan todos los enemigos normales vivos
- [x] `SaveSystem` (`localStorage`): `bestDistance`, `bestKills`, `totalRuns`; guarda al fin de cada run (victoria o derrota)
- [x] Pantalla de victoria: overlay azul oscuro + "¡VICTORIA!" dorado + cofre placeholder animado + stats + "¡Nueva marca!" si aplica + botones "JUGAR DE NUEVO" / "Menú principal"

**Pendiente (Sprint 1.5 — Pulido y arte):**

- Reemplazar placeholders con sprites finales generados con IA
- 1 tema musical + 6 SFX clave (disparo, hit, puerta+, puerta−, jefe, victoria)
- HUD: oro (preparar campo), HP del líder
- Onboarding suave (3 tooltips la primera vez)
- Playtest externo con 3–5 personas no técnicas

**Pendiente Sprint 0.2:**

- Capacitor setup + build en device real
- Repo remoto GitHub privado + tag `v0.0.1-scaffold`

---

*Documento vivo. Actualizar al final de cada sprint con lo aprendido.*
