# 🎨 Guía de Generación de Assets con IA — Defensores del Istmo

> **Para:** Rodney (solo developer)
> **Última actualización:** 2026-05-20
> **Herramientas cubiertas:** Midjourney · DALL-E 3 (ChatGPT) · Gemini Imagen 3 · Scenario.gg · ElevenLabs · Suno · Udio

---

## 0. Resumen del pipeline

```
Generar con IA → Limpiar fondo (remove.bg / Photoshop) → 
Exportar PNG transparente → Colocar en public/assets/ → 
Registrar en PreloadScene.ts → Remover generatePlaceholderTextures()
```

**Prioridad de assets (orden de producción sugerido):**

1. Tanela (jugador) — identidad visual del juego
2. Marinero + Conquistador — enemigos que el jugador ve más
3. Lane tile + Side tile — ocupan el 80% de la pantalla
4. Puertas positiva / negativa / upgrade — mecánica central
5. Tropas (Arquero Guna, Guerrero Ngäbe)
6. Boss Diego Méndez
7. Barril obstáculo + proyectil
8. Audio SFX (6 efectos mínimo viable)
9. Música (1 tema gameplay + 1 boss)

---

## 1. Dirección artística y estilo visual

### 1.1 Perspectiva
- **Vista**: top-down con inclinación de ~30° hacia el frente (bird's eye ligeramente inclinado)
- Los personajes muestran la parte superior de la cabeza y una fracción del frente del cuerpo
- Referencia de vista: similar a *Archero* o *Soul Knight* (no completamente cenital)

### 1.2 Proporciones
- **Estilo chibi heroico**: cabeza = ~40% de la altura total, cuerpo compacto
- Brazos y piernas cortos y expresivos
- Armas ligeramente sobredimensionadas para legibilidad en móvil

### 1.3 Línea y sombreado
- **Contorno negro sólido** de 3–4 px (relativo al tamaño del sprite)
- **Cel-shading / flat shading**: 2–3 tonos por color, sin degradados suaves
- Sombras dibujadas a mano, no computadas
- Sin normal maps ni iluminación 3D

### 1.4 Paleta de colores oficial

| Rol | Hex | Uso |
|-----|-----|-----|
| Fondo lane | `#4a3320` | Camino de tierra |
| Fondo selva | `#274d3a` | Bordes laterales |
| Dorado primario | `#e8c170` | UI, líder, ornamentos |
| Turquesa tropa | `#4ec9b0` | Arquero Guna |
| Naranja tropa | `#d4873a` | Guerrero Ngäbe |
| Rojo enemigo | `#a83232` | Marinero |
| Gris enemigo | `#8a9bb0` | Conquistador |
| Azul boss | `#3a5a8a` | Boss Méndez |
| Fondo HUD | `#0b1d2a` | UI oscuro |
| Verde puerta+ | `#4ec950` | Puertas positivas |
| Rojo puerta− | `#c03030` | Puertas negativas |

### 1.5 Referencias culturales OBLIGATORIAS
Incluir en los prompts o aplicar en retoque manual:

- **Molas Guna**: geometría de capas, colores contrastantes, formas animales estilizadas, bordes en serrucho
- **Oro Coclé / Veragüense**: motivos de animales (rana, jaguar, águila) en dorado, espirales y volutas
- **Petroglifos del Caño**: líneas grabadas, figuras humanas simplificadas, espirales concéntricas
- **Vestimenta Emberá**: pintura corporal con jagua (azul-negro), patrones geométricos naturales

> ⚠️ Evitar: plumas genéricas tipo "jefe indio", tocados estilo norteamericano, tee-pees, arcos con sílex sin contexto panameño.

---

## 2. Sprites de personajes aliados

### 2.1 Tanela — Líder / Jugador

| Parámetro | Valor |
|-----------|-------|
| Texture key | `player` |
| Tamaño PNG | 96 × 96 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/player.png` |

**Descripción:** Guerrera Quibián joven, cabello negro largo recogido con cinta roja. Peto de oro precolombino grabado con motivo de rana (Coclé). Falda corta color terracota con flecos. Pintura facial roja con geometría de mola (líneas paralelas en mejillas). Arco de madera en mano derecha. Aura dorada sutil indica que es el líder.

**Prompt Midjourney:**
```
2D mobile game sprite, Panamanian indigenous woman warrior chichibi, top-down 30 degree angle, white background, thick black outline 3px, flat cel-shading, pre-Columbian gold chest armor with frog motif Cocle style, red cinnabar geometric face paint parallel lines, long black hair with red band, short terracotta fringed skirt, wooden bow right hand, golden glow aura, game asset sprite sheet style, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
Create a 2D mobile game character sprite for a lane-runner game. Character: Tanela, a young Panamanian indigenous Ngäbe-Buglé woman warrior in chibi style (large head, compact body, ~40% head ratio). View: top-down at 30-degree angle. Style: thick black outline, flat cel-shading with 2-3 tones per color, no gradients. Details: pre-Columbian gold chest piece with engraved frog motif (Coclé culture), red geometric face paint (parallel lines, Guna mola inspired), long black hair tied with red band, short terracotta cloth skirt with fringe, wooden bow in right hand, subtle golden glow around her. White/transparent background. Clean game asset ready for use.
```

**Prompt Gemini Imagen 3:**
```
2D game character sprite, chibi proportions, top-down 30° view. Panamanian indigenous warrior woman named Tanela. Thick black outline, cell shading. Pre-Columbian gold armor (Coclé frog motif), red geometric face paint, black hair with red band, terracotta fringed skirt, wooden bow. Golden aura. Transparent background. Mobile game asset style.
```

**Notas de estilo:** La figura debe caber cómodamente dentro del recuadro de 96×96 con al menos 4 px de margen. La mochila o cargamento de flechas en la espalda es opcional para la primera versión.

---

### 2.2 Arquero Guna — Tropa base

| Parámetro | Valor |
|-----------|-------|
| Texture key | `troop-archer` |
| Tamaño PNG | 64 × 64 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/troop-archer.png` |

**Descripción:** Guerrero Guna masculino pequeño chibi. Vestimenta con mola (patrones geométricos turquesa y negro en el torso). Pintura facial negra. Arco pequeño con flecha lista. Color dominante: **turquesa** (`#4ec9b0`). Ligeramente más pequeño que Tanela para distinguir jerarquía visual.

**Prompt Midjourney:**
```
2D game sprite tiny chibi male Guna Yala warrior, top-down 30 degree view, white background, thick black outline, flat cel-shading, turquoise mola textile geometric pattern shirt, black face paint stripes, small bow and arrow, Panamanian indigenous style, mobile game asset, compact chibi proportions, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game sprite of a tiny chibi male Guna Yala warrior from Panama. Top-down 30-degree view. Thick black outline, flat cel-shading. Turquoise shirt with Guna mola geometric patterns (contrasting colors, layered shapes). Black face paint stripes. Small wooden bow with arrow notched. Short dark pants. White/transparent background. The sprite should be small and compact, fitting in 64x64 pixels with 4px margin.
```

**Prompt Gemini Imagen 3:**
```
Tiny chibi 2D game sprite. Male Guna Yala indigenous warrior, Panama. Top-down 30° view. Thick black outline, flat colors. Turquoise mola-pattern shirt with geometric shapes, black face paint, small bow and arrow. Transparent background. 64x64 mobile game asset.
```

---

### 2.3 Guerrero Ngäbe — Tropa melé

| Parámetro | Valor |
|-----------|-------|
| Texture key | `troop-ngabe` |
| Tamaño PNG | 72 × 72 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/troop-ngabe.png` |

**Descripción:** Guerrero Ngäbe masculino, ligeramente más corpulento que el arquero (su rol es melé / tanque). Nagua o vestimenta marrón-naranja. Pintura corporal geométrica. Lanza de madera con punta de obsidiana negra. Color dominante: **naranja** (`#d4873a`). Aspecto más robusto y amenazante que el arquero.

**Prompt Midjourney:**
```
2D game sprite chibi male Ngabe-Bugle warrior Panama, top-down 30 degree view, white background, thick black outline, flat cel-shading, orange-brown nagua clothing, geometric body paint black and red, obsidian-tipped wooden spear, stocky muscular chibi proportions, mobile game asset, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game sprite of a stocky chibi male Ngäbe-Buglé warrior from Panama. Top-down 30-degree view. Thick black outline, flat cel-shading. Orange-brown traditional nagua (tunic), geometric black and red body paint on arms. Wooden spear with obsidian tip. More muscular build than archer, indicating melee role. White/transparent background. 72x72 pixel game asset.
```

**Prompt Gemini Imagen 3:**
```
Chibi 2D game sprite. Stocky male Ngäbe-Buglé warrior, Panama. Top-down 30° view. Thick black outline, flat shading. Orange-brown nagua tunic, black/red geometric body paint, obsidian-tipped spear. Robust proportions. Transparent background. Mobile game asset.
```

---

## 3. Sprites de enemigos

### 3.1 Marinero español — Enemigo básico

| Parámetro | Valor |
|-----------|-------|
| Texture key | `enemy-sailor` |
| Tamaño PNG | 72 × 72 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/enemy-sailor.png` |

**Descripción:** Marinero español siglo XVI chibi. Camisa blanca sucia de manga corta, pantalón oscuro, pañuelo rojo en la cabeza. Espada corta o cuchillo en mano. Expresión amenazante. Color dominante: **rojo oscuro** (`#a83232`). Oleada en masa, aspecto desgastado por el mar.

**Prompt Midjourney:**
```
2D game sprite chibi Spanish sailor 16th century, enemy character, top-down 30 degree view, white background, thick black outline, flat cel-shading, dirty white shirt, dark pants, red bandana head, short sword, scruffy beard, threatening expression, dark red color theme, mobile game enemy asset, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game enemy sprite. Spanish sailor from the 16th century, chibi style (big head, compact body). Top-down 30-degree view. Thick black outline, flat cel-shading. Dirty white short-sleeve shirt, dark baggy pants, red bandana on head, short cutlass or knife. Scruffy beard, angry threatening expression. Dark red as the main color accent. White/transparent background. 72x72 game asset.
```

**Prompt Gemini Imagen 3:**
```
Enemy 2D game sprite. 16th-century Spanish sailor, chibi style. Top-down 30° view. Thick black outline, flat colors. White dirty shirt, dark pants, red bandana, short sword. Angry expression, scruffy beard. Dark red theme. Transparent background. 72x72 mobile game asset.
```

---

### 3.2 Conquistador — Enemigo armado

| Parámetro | Valor |
|-----------|-------|
| Texture key | `enemy-conquistador` |
| Tamaño PNG | 80 × 80 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/enemy-conquistador.png` |

**Descripción:** Soldado conquistador español con armadura parcial chibi. Casco morion (yelmo con cresta). Cota de malla o peto metálico gris-azulado. Espada larga. Aspecto más intimidante y robusto que el marinero. Color dominante: **gris plateado** (`#8a9bb0`). Aparece después de los 30 segundos de juego.

**Prompt Midjourney:**
```
2D game sprite chibi Spanish Conquistador soldier 16th century, enemy character, top-down 30 degree view, white background, thick black outline, flat cel-shading, morion helmet silver, partial chain mail armor blue-gray, long sword, imposing stocky build, cross on breastplate, silver-blue color theme, mobile game enemy asset, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game enemy sprite. Spanish Conquistador soldier from the 16th century, chibi style. Top-down 30-degree view. Thick black outline, flat cel-shading. Morion helmet (crested helmet), partial chainmail or plate armor in silver-blue tones, longsword, small cross on breastplate. Imposing and stocky, more threatening than the sailor. Blue-gray as main color theme. White/transparent background. 80x80 game asset.
```

**Prompt Gemini Imagen 3:**
```
Enemy 2D game sprite. Spanish Conquistador, chibi style. Top-down 30° view. Thick black outline, flat shading. Morion helmet, silver-blue partial armor, longsword, cross on chest. Stocky imposing build. Blue-gray theme. Transparent background. 80x80 mobile game asset.
```

---

### 3.3 Boss Diego Méndez — Jefe del Capítulo 1

| Parámetro | Valor |
|-----------|-------|
| Texture key | `boss-mendez` |
| Tamaño PNG | 140 × 140 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/boss-mendez.png` |

**Descripción:** Capitán conquistador de élite, grande y amenazante. Armadura elaborada azul oscuro con detalles dorados. Casco yelmo con plumas. Cruz grande en el pecho. Espada ornamentada de lujo. Aura oscura roja amenazante. Debe verse **claramente más grande y poderoso** que los enemigos normales. Expresión de arrogancia/ira.

**Prompt Midjourney:**
```
2D game sprite large chibi boss character, Spanish Conquistador captain Diego Mendez, top-down 30 degree view, white background, thick black outline, flat cel-shading, ornate dark blue and gold armor, elaborate plumed helmet, golden cross on chest, jeweled longsword, dark red menacing aura glow, imposing boss enemy size, 16th century Spanish commander, mobile game boss asset, --ar 1:1 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game boss sprite. Diego Méndez, a powerful Spanish Conquistador captain from the 16th century. Chibi style but large and imposing. Top-down 30-degree view. Thick black outline, flat cel-shading. Ornate dark blue and gold armor with filigree, elaborate plumed helmet, large golden cross on chest, jeweled ornate longsword. Dark red menacing glow/aura. Arrogant and angry expression. Significantly larger and more detailed than regular enemies. White/transparent background. 140x140 game asset.
```

**Prompt Gemini Imagen 3:**
```
Large boss 2D game sprite. Spanish Conquistador captain, chibi style. Top-down 30° view. Thick black outline, flat shading. Dark blue gold-trimmed ornate armor, plumed helmet, golden cross chest, jeweled sword. Dark red aura. Imposing large size. Transparent background. 140x140 mobile game boss asset.
```

**Notas:** El boss usa `setScale(1.9)` en el código, pero se recomienda generar el sprite nativo a 140×140 para máxima calidad. Si la IA genera a mayor resolución, redimensionar a 140×140 con interpolación bicúbica.

---

## 4. Tiles y entornos

### 4.1 Lane tile — Camino central

| Parámetro | Valor |
|-----------|-------|
| Texture key | `lane-tile` |
| Tamaño PNG | 256 × 256 px |
| Fondo | No (es el fondo mismo) |
| Seamless | **SÍ** — los 4 bordes deben coincidir |
| Archivo destino | `public/assets/tiles/lane-tile.png` |

**Descripción:** Sendero de tierra compactada / camino precolombino panameño. Tonos tierra marrón-ocre (`#4a3320`). Puede incluir: piedras pequeñas, raíces expuestas, pequeñas huellas, manchas de humedad. Vista cenital. Aspecto selvático y tropical. **CRÍTICO: debe tile seamlessly en todas las direcciones.**

**Prompt Midjourney:**
```
seamless tileable texture, top-down view, tropical jungle dirt path, Panama, packed earth brown-ochre, scattered small stones, exposed roots, tropical leaf litter, overhead aerial view, 2D game tile texture, flat style, warm brown tones #4a3320, no borders, seamless pattern, game background tile, --ar 1:1 --tile
```

**Prompt DALL-E 3 / ChatGPT:**
```
Create a seamless tileable 2D game background texture. Top-down aerial view. Tropical jungle dirt path in Panama: packed brown-ochre earth (#4a3320), scattered small rocks, exposed tree roots, occasional leaf fragments. Flat/illustrated style (not photorealistic). The texture must tile seamlessly — edges must match perfectly. Warm earthy tones. 256x256 pixels. No borders or frames.
```

**Prompt Gemini Imagen 3:**
```
Seamless tileable top-down game texture. Tropical dirt path, Panama jungle. Brown-ochre packed earth, scattered stones, roots, leaf litter. Flat 2D illustrated style. Edges must tile seamlessly. 256x256. No border.
```

**Notas:** Verificar el seamless tile importando en Phaser con `add.tileSprite` y haciendo scroll. Si hay líneas visibles, aplicar un filtro de seamless en Photoshop (Filter > Other > Offset).

---

### 4.2 Side tile — Borde de selva

| Parámetro | Valor |
|-----------|-------|
| Texture key | `side-tile` |
| Tamaño PNG | 128 × 256 px |
| Fondo | No |
| Seamless | **SÍ** — solo eje Y (scroll vertical) |
| Archivo destino | `public/assets/tiles/side-tile.png` |

**Descripción:** Selva tropical densa de Panamá vista desde arriba. Verde muy oscuro (`#274d3a`), hojas superpuestas, helechos, palmeras tropicales, manchas de sombra. El tile se voltea horizontalmente en el lado derecho. **Seamless solo en eje Y.**

**Prompt Midjourney:**
```
seamless vertical tile texture, top-down view, dense Panama tropical rainforest, overhead canopy view, deep jungle green #274d3a, overlapping palm fronds, ferns, tropical leaves, shadows, lush vegetation, flat 2D game side border tile, no path, pure jungle, --ar 1:2 --tile
```

**Prompt DALL-E 3 / ChatGPT:**
```
Create a 2D game background tile texture (128x256 pixels, portrait). Top-down aerial view of dense tropical rainforest jungle (Panama). Deep dark green (#274d3a), densely overlapping palm leaves, ferns, tropical vegetation, natural shadows. Flat illustrated style. The texture must tile seamlessly on the vertical (Y) axis — top and bottom edges must match. Left and right edges do NOT need to match. No path or clearing.
```

**Prompt Gemini Imagen 3:**
```
Vertical seamless tile texture, 128x256. Top-down dense tropical rainforest. Dark green canopy, palm fronds, ferns, jungle floor. Flat 2D illustrated style. Seamless on Y-axis only. Panama jungle.
```

---

## 5. Puertas (Gates)

### 5.1 Puerta positiva (+N, ×N)

| Parámetro | Valor |
|-----------|-------|
| Texture key | `gate-positive` |
| Tamaño PNG | 370 × 160 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/ui/gate-positive.png` |

**Descripción:** Marco/portal de piedra tallada estilo precolombino. Color dominante: **verde** (`#1a3a20`, borde `#4ec950`). Ornamentos geométricos Coclé grabados en los bordes (espirales, volutas). La operación y número se renderizan encima por código (texto Phaser), por lo que el sprite solo necesita el marco/fondo. Aspecto invitante y positivo.

**Prompt Midjourney:**
```
2D game UI element, horizontal gate frame portal, pre-Columbian stone arch, Cocle Panama style geometric carvings, deep green #1a3a20 background, bright green border glow #4ec950, carved spiral animal motifs, tropical stone texture, transparent background, wide horizontal banner shape, mobile game gate asset, --ar 37:16 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game UI element. A wide horizontal gate/portal frame (370x160 pixels). Style: pre-Columbian carved stone arch from Panama (Coclé culture). Dark green fill (#1a3a20) with bright green glowing border (#4ec950). Carved geometric spiral motifs and stylized animal shapes on the sides. Slightly 3D-looking stone texture. Transparent background outside the frame. The center should be empty (for text overlay). Inviting, positive visual feeling.
```

**Prompt Gemini Imagen 3:**
```
2D game gate frame, wide horizontal 370x160. Pre-Columbian carved stone, Coclé Panama style. Dark green fill, bright green glowing border. Carved spiral and animal motifs. Empty center for text. Transparent background. Mobile game UI element.
```

---

### 5.2 Puerta negativa (−N, ÷N)

| Parámetro | Valor |
|-----------|-------|
| Texture key | `gate-negative` |
| Tamaño PNG | 370 × 160 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/ui/gate-negative.png` |

**Descripción:** Mismo marco pero con color dominante **rojo** (`#3a1010`, borde `#c03030`). Aspecto amenazante y peligroso. Puede incluir motivos de calavera estilizada o espinas en los bordes. Contraste claro con la puerta positiva.

**Prompt Midjourney:**
```
2D game UI element, horizontal gate frame portal, pre-Columbian stone arch menacing, dark red #3a1010 background, crimson red border glow #c03030, carved skull and thorn motifs Cocle style, ominous threatening, transparent background, wide horizontal banner shape, mobile game negative gate asset, --ar 37:16 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game UI element. A wide horizontal gate/portal frame (370x160 pixels). Style: pre-Columbian carved stone arch, threatening and dangerous. Dark red fill (#3a1010) with crimson red glowing border (#c03030). Carved geometric motifs with stylized skull or thorn elements on the sides. Stone texture. Transparent background outside the frame. Empty center for text. Visually distinct from the green positive gate. Dangerous, warning feeling.
```

**Prompt Gemini Imagen 3:**
```
2D game gate frame, wide horizontal 370x160. Pre-Columbian stone, dark and threatening. Dark red fill, crimson glowing border. Carved skull/thorn motifs. Empty center for text. Transparent background. Mobile game UI negative gate.
```

---

### 5.3 Puerta de upgrade (dorada)

| Parámetro | Valor |
|-----------|-------|
| Texture key | `gate-upgrade` |
| Tamaño PNG | 370 × 160 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/ui/gate-upgrade.png` |

**Descripción:** Marco dorado elaborado, aspecto de portal mágico/sagrado. Color dominante: **dorado** (`#3a2e00`, borde `#e8c170`). Ornamentos de oro Veragüense — figuras de animales (jaguar, águila, serpiente). Motivos de incrustaciones doradas en las esquinas. Aspecto especial y valioso, distinto a las otras dos puertas.

**Prompt Midjourney:**
```
2D game UI element, horizontal gate frame portal, pre-Columbian gold artifact style, Veraguas Panama golden treasure, dark gold #3a2e00 background, bright gold border glow #e8c170, carved jaguar eagle serpent animal motifs, inlaid gold ornaments in corners, magical sacred portal feeling, transparent background, wide horizontal banner shape, mobile game upgrade gate asset, --ar 37:16 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game UI element. A wide horizontal gate/portal frame (370x160 pixels). Style: pre-Columbian gold artifact from Veraguas, Panama. Dark gold fill (#3a2e00) with bright glowing gold border (#e8c170). Carved golden animal motifs (jaguar, eagle, serpent) on the sides. Gold inlay details in corners. Sacred, magical, precious feeling. Empty center for text. Transparent background. Significantly more ornate than the green and red gates.
```

**Prompt Gemini Imagen 3:**
```
2D game gate frame, wide horizontal 370x160. Pre-Columbian Veraguas gold style. Dark gold fill, bright gold glowing border. Jaguar eagle serpent carved motifs, gold corner inlays. Precious sacred feeling. Empty center. Transparent background. Mobile game upgrade gate.
```

---

## 6. Proyectiles y obstáculos

### 6.1 Proyectil — Flecha Guna

| Parámetro | Valor |
|-----------|-------|
| Texture key | `projectile` |
| Tamaño PNG | 16 × 32 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/projectile-arrow.png` |

**Descripción:** Flecha indígena de madera, orientada verticalmente (punta hacia arriba, plumas hacia abajo). Punta de obsidiana negra o sílex tallado. Shaft de madera clara. Plumas decorativas pequeñas en la cola (rojas y turquesas). Simple y legible a tamaño pequeño.

**Prompt Midjourney:**
```
2D game projectile sprite, indigenous arrow weapon, vertical orientation pointing up, obsidian flint tip, wooden shaft, small red and turquoise feather fletching, thick black outline, flat cel-shading, white background, tiny sprite 16x32 pixels, simple and readable, --ar 1:2 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D game sprite of a small indigenous arrow projectile. Orientation: vertical with tip pointing upward. Obsidian/flint dark tip, light wooden shaft, small red and turquoise feather fletching at the bottom. Thick black outline, flat shading. Very simple and readable at small size (16x32 pixels). White/transparent background.
```

---

### 6.2 Barril obstáculo

| Parámetro | Valor |
|-----------|-------|
| Texture key | `obstacle-barrel` |
| Tamaño PNG | 80 × 96 px |
| Fondo | Transparente |
| Archivo destino | `public/assets/sprites/obstacle-barrel.png` |

**Descripción:** Barril de madera estilo siglo XVI visto ligeramente desde arriba. Duelas de madera marrón oscuro, dos aros metálicos oxidados. Aspecto desgastado y pesado. Puede tener una calavera dibujada o símbolo de veneno/peligro. El HP se muestra encima por código.

**Prompt Midjourney:**
```
2D game obstacle sprite, wooden barrel 16th century Spanish, top-down 30 degree view, dark brown wood staves, rusty metal hoops, weathered and old, thick black outline, flat cel-shading, white background, poison danger markings optional, game asset obstacle, --ar 5:6 --niji 6 --style raw
```

**Prompt DALL-E 3 / ChatGPT:**
```
2D mobile game obstacle sprite. Wooden barrel from the 16th century (Spanish colonial). Slightly top-down view (30 degrees). Dark brown wood staves, two rusty metal bands/hoops. Weathered and heavy-looking. Optional: simple danger marking or skull symbol on the face. Thick black outline, flat cel-shading. White/transparent background. 80x96 pixels.
```

---

## 7. Audio — Efectos de sonido (SFX)

**Herramienta principal:** [ElevenLabs Sound Effects](https://elevenlabs.io/sound-effects)

**Formato de exportación:** WAV o MP3, 44.1 kHz, mono o stereo según el efecto.

**Carpeta destino:** `public/assets/audio/sfx/`

**Cómo cargar en Phaser** (PreloadScene.ts):
```typescript
this.load.audio('sfx-shoot', 'assets/audio/sfx/shoot.mp3');
// Usar en código:
this.sound.play('sfx-shoot', { volume: 0.6 });
```

---

### SFX-01: Disparo de flecha

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-shoot` |
| Archivo | `sfx-shoot.mp3` |
| Duración | 0.2–0.4 s |

**Prompt ElevenLabs:**
> *"Bow arrow release and whoosh through the air, sharp string twang, fast short sound"*

**Alternativa Freesound:** buscar "arrow whoosh release"

---

### SFX-02: Impacto en enemigo

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-hit` |
| Archivo | `sfx-hit.mp3` |
| Duración | 0.2–0.3 s |

**Prompt ElevenLabs:**
> *"Arrow hitting flesh, soft thud impact, short punchy sound"*

---

### SFX-03: Golpe crítico

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-crit` |
| Archivo | `sfx-crit.mp3` |
| Duración | 0.3–0.5 s |

**Prompt ElevenLabs:**
> *"Heavy critical hit impact, metallic crash combined with thud, powerful and satisfying"*

---

### SFX-04: Muerte de enemigo

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-kill` |
| Archivo | `sfx-kill.mp3` |
| Duración | 0.4–0.6 s |

**Prompt ElevenLabs:**
> *"Enemy dying, short pain groan, small golden coins jingling sparkle reward sound together"*

---

### SFX-05: Puerta positiva

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-gate-positive` |
| Archivo | `sfx-gate-positive.mp3` |
| Duración | 0.5–0.8 s |

**Prompt ElevenLabs:**
> *"Magical power-up chime, crystal bell ascending arpeggio, positive reinforcement sound, bright and cheerful"*

---

### SFX-06: Puerta negativa

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-gate-negative` |
| Archivo | `sfx-gate-negative.mp3` |
| Duración | 0.5–0.8 s |

**Prompt ElevenLabs:**
> *"Negative buzzer descending tone, whoosh of loss, disappointment sound, low pitched"*

---

### SFX-07: Puerta upgrade dorada

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-gate-upgrade` |
| Archivo | `sfx-gate-upgrade.mp3` |
| Duración | 0.8–1.2 s |

**Prompt ElevenLabs:**
> *"Epic upgrade power-up fanfare, short heroic brass sting, golden shimmer sparkle, triumphant"*

---

### SFX-08: Aparición del boss

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-boss-appear` |
| Archivo | `sfx-boss-appear.mp3` |
| Duración | 1.5–2.5 s |

**Prompt ElevenLabs:**
> *"Ominous boss enemy entrance, deep reverberant war drum hit, threatening low rumble, dramatic pause"*

---

### SFX-09: Jugador recibe daño

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-player-hit` |
| Archivo | `sfx-player-hit.mp3` |
| Duración | 0.3–0.5 s |

**Prompt ElevenLabs:**
> *"Female warrior pain grunt, short impact sound, taking damage in a game"*

**Alternativa ElevenLabs TTS (voz):** Generar un grito corto "¡Aaah!" con una voz femenina latinoamericana usando el generador de voz de ElevenLabs. Modelo: Eleven Multilingual v2.

---

### SFX-10: Victoria

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-victory` |
| Archivo | `sfx-victory.mp3` |
| Duración | 2.0–4.0 s |

**Prompt ElevenLabs:**
> *"Victory fanfare, short triumphant indigenous drums and flute melody, celebratory and uplifting, Panama tribal style"*

---

### SFX-11: Derrota / Game Over

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-defeat` |
| Archivo | `sfx-defeat.mp3` |
| Duración | 1.5–2.5 s |

**Prompt ElevenLabs:**
> *"Game over defeat sound, descending low horn, somber and sorrowful, short"*

---

### SFX-12: Click de UI

| Campo | Valor |
|-------|-------|
| Clave Phaser | `sfx-ui-click` |
| Archivo | `sfx-ui-click.mp3` |
| Duración | 0.05–0.15 s |

**Prompt ElevenLabs:**
> *"UI button click, small wooden tap, clean, short"*

---

## 8. Audio — Música

**Herramientas principales:** [Suno](https://suno.com) · [Udio](https://udio.com)

**Formato:** MP3 320 kbps o WAV. Loops deben comenzar y terminar en el mismo beat para que Phaser los repita sin glitch.

**Carpeta destino:** `public/assets/audio/music/`

**Cómo cargar y reproducir:**
```typescript
// PreloadScene.ts
this.load.audio('music-game', 'assets/audio/music/gameplay-cap1.mp3');

// GameScene.ts
this.sound.play('music-game', { loop: true, volume: 0.4 });
```

---

### MUSIC-01: Tema de gameplay — Capítulo 1 (Veraguas 1502)

| Campo | Valor |
|-------|-------|
| Clave Phaser | `music-game-cap1` |
| Archivo | `music-gameplay-veraguas.mp3` |
| Duración | 2–3 min (loop) |
| BPM | 130–145 |

**Prompt Suno:**
```
instrumental tribal battle music, Panama indigenous warrior, Congo drums from Colon Panama intense rhythm, Guna Yala bamboo flute melody, mejoranera guitar plucking, fast aggressive percussion, jungle atmosphere, no lyrics, 140 BPM, loop-friendly, action game soundtrack
```

**Prompt Udio:**
```
[Instrumental] [No Vocals] Panama indigenous tribal battle theme, Congo drumming, Guna flute, mejoranera guitar, 140 BPM, intense, action game soundtrack, jungle combat, loop seamlessly
```

**Instrumentación ideal:**
- Bajo rítmico de tambores Congo (afropanameño)
- Melodía de flauta Guna (bambú o caña)
- Mejoranera (guitarra de 5 cuerdas, Los Santos)
- Maracas / chischás (percusión menor)
- Optativo: cuerdas épicas de fondo

---

### MUSIC-02: Tema del Boss — Diego Méndez

| Campo | Valor |
|-------|-------|
| Clave Phaser | `music-boss` |
| Archivo | `music-boss-mendez.mp3` |
| Duración | 1.5–2.5 min (loop) |
| BPM | 150–170 |

**Prompt Suno:**
```
epic boss battle music, Spanish colonial conquistador theme, dramatic orchestra brass, dark choir, intense tribal drums conflict, 160 BPM, game boss fight, tension and urgency, no lyrics, loop-friendly, orchestral hybrid tribal
```

**Prompt Udio:**
```
[Instrumental] [No Vocals] Boss fight music, Spanish colonial vs indigenous warrior, dark orchestral brass, war drums, 160 BPM, intense epic, hybrid orchestral tribal, game battle theme, loop
```

---

### MUSIC-03: Tema del menú principal

| Campo | Valor |
|-------|-------|
| Clave Phaser | `music-menu` |
| Archivo | `music-main-menu.mp3` |
| Duración | 1.5–2 min (loop) |
| BPM | 90–110 |

**Prompt Suno:**
```
instrumental main menu theme, Panama indigenous mystical adventure, mejoranera guitar gentle melody, soft Congo drums, Guna flute, mysterious and adventurous, medium energy, 100 BPM, no lyrics, loop-friendly, mobile game menu music
```

**Prompt Udio:**
```
[Instrumental] [No Vocals] Panama indigenous adventure main menu, mejoranera guitar, soft tribal drums, Guna bamboo flute, mystical 100 BPM, relaxed but adventurous, mobile game loop
```

---

### MUSIC-04: Jingle de victoria (stinger corto)

| Campo | Valor |
|-------|-------|
| Clave Phaser | `music-victory-jingle` |
| Archivo | `music-victory-jingle.mp3` |
| Duración | 4–8 segundos |
| Tipo | Stinger (no loop) |

**Prompt Suno:**
```
short victory fanfare stinger 6 seconds, triumphant indigenous Panama flute and drums ascending, celebratory, uplifting ending, game win sound
```

---

## 9. Integración al proyecto

### 9.1 Estructura de carpetas

```
public/
└── assets/
    ├── sprites/
    │   ├── player.png          ← 96×96
    │   ├── troop-archer.png    ← 64×64
    │   ├── troop-ngabe.png     ← 72×72
    │   ├── enemy-sailor.png    ← 72×72
    │   ├── enemy-conquistador.png ← 80×80
    │   ├── boss-mendez.png     ← 140×140
    │   ├── projectile-arrow.png ← 16×32
    │   └── obstacle-barrel.png ← 80×96
    ├── tiles/
    │   ├── lane-tile.png       ← 256×256 seamless
    │   └── side-tile.png       ← 128×256 seamless Y
    ├── ui/
    │   ├── gate-positive.png   ← 370×160
    │   ├── gate-negative.png   ← 370×160
    │   └── gate-upgrade.png    ← 370×160
    └── audio/
        ├── sfx/
        │   ├── sfx-shoot.mp3
        │   ├── sfx-hit.mp3
        │   ├── sfx-crit.mp3
        │   ├── sfx-kill.mp3
        │   ├── sfx-gate-positive.mp3
        │   ├── sfx-gate-negative.mp3
        │   ├── sfx-gate-upgrade.mp3
        │   ├── sfx-boss-appear.mp3
        │   ├── sfx-player-hit.mp3
        │   ├── sfx-victory.mp3
        │   ├── sfx-defeat.mp3
        │   └── sfx-ui-click.mp3
        └── music/
            ├── music-gameplay-veraguas.mp3
            ├── music-boss-mendez.mp3
            ├── music-main-menu.mp3
            └── music-victory-jingle.mp3
```

### 9.2 Cambios en PreloadScene.ts

Cuando tengas los assets reales, **reemplaza** `generatePlaceholderTextures()` por carga real:

```typescript
// src/scenes/PreloadScene.ts

preload(): void {
  this.drawLoadingBar();

  // Sprites
  this.load.image('player',               'assets/sprites/player.png');
  this.load.image('troop-archer',         'assets/sprites/troop-archer.png');
  this.load.image('troop-ngabe',          'assets/sprites/troop-ngabe.png');
  this.load.image('enemy-sailor',         'assets/sprites/enemy-sailor.png');
  this.load.image('enemy-conquistador',   'assets/sprites/enemy-conquistador.png');
  this.load.image('boss-mendez',          'assets/sprites/boss-mendez.png');
  this.load.image('projectile',           'assets/sprites/projectile-arrow.png');
  this.load.image('obstacle-barrel',      'assets/sprites/obstacle-barrel.png');

  // Tiles
  this.load.image('lane-tile',  'assets/tiles/lane-tile.png');
  this.load.image('side-tile',  'assets/tiles/side-tile.png');

  // Gates / UI
  this.load.image('gate-positive', 'assets/ui/gate-positive.png');
  this.load.image('gate-negative', 'assets/ui/gate-negative.png');
  this.load.image('gate-upgrade',  'assets/ui/gate-upgrade.png');

  // SFX
  this.load.audio('sfx-shoot',         'assets/audio/sfx/sfx-shoot.mp3');
  this.load.audio('sfx-hit',           'assets/audio/sfx/sfx-hit.mp3');
  this.load.audio('sfx-crit',          'assets/audio/sfx/sfx-crit.mp3');
  this.load.audio('sfx-kill',          'assets/audio/sfx/sfx-kill.mp3');
  this.load.audio('sfx-gate-positive', 'assets/audio/sfx/sfx-gate-positive.mp3');
  this.load.audio('sfx-gate-negative', 'assets/audio/sfx/sfx-gate-negative.mp3');
  this.load.audio('sfx-gate-upgrade',  'assets/audio/sfx/sfx-gate-upgrade.mp3');
  this.load.audio('sfx-boss-appear',   'assets/audio/sfx/sfx-boss-appear.mp3');
  this.load.audio('sfx-player-hit',    'assets/audio/sfx/sfx-player-hit.mp3');
  this.load.audio('sfx-victory',       'assets/audio/sfx/sfx-victory.mp3');
  this.load.audio('sfx-defeat',        'assets/audio/sfx/sfx-defeat.mp3');
  this.load.audio('sfx-ui-click',      'assets/audio/sfx/sfx-ui-click.mp3');

  // Música
  this.load.audio('music-game-cap1',       'assets/audio/music/music-gameplay-veraguas.mp3');
  this.load.audio('music-boss',            'assets/audio/music/music-boss-mendez.mp3');
  this.load.audio('music-menu',            'assets/audio/music/music-main-menu.mp3');
  this.load.audio('music-victory-jingle',  'assets/audio/music/music-victory-jingle.mp3');
}
```

> **Migración progresiva:** Puedes mezclar assets reales y placeholders. Comenta el `this.load.image('player', ...)` del real y descomenta el `generatePlaceholderTextures()` si necesitas volver a los placeholders.

### 9.3 Optimización — Texture Atlas (Sprint 2.6)

Para el build final de móvil, empaqueta todos los sprites en un atlas con **TexturePacker**:

1. Arrastra todos los PNG de `public/assets/sprites/` y `public/assets/ui/`
2. Exportar formato: **Phaser 3 (JSON Hash)**
3. Destino: `public/assets/atlas/game-atlas.png` + `game-atlas.json`
4. En PreloadScene: `this.load.atlas('game', 'assets/atlas/game-atlas.png', 'assets/atlas/game-atlas.json')`

Esto reduce draw calls de ~15 a 1, crítico para 60fps en mobile.

---

## 10. Checklist de assets — Sprint 1.5

### Sprites (MVP)

| Asset | Status | Prioridad |
|-------|--------|-----------|
| `player` — Tanela | ⬜ Pendiente | 🔴 Alta |
| `troop-archer` — Arquero Guna | ⬜ Pendiente | 🔴 Alta |
| `troop-ngabe` — Guerrero Ngäbe | ⬜ Pendiente | 🟡 Media |
| `enemy-sailor` — Marinero | ⬜ Pendiente | 🔴 Alta |
| `enemy-conquistador` — Conquistador | ⬜ Pendiente | 🔴 Alta |
| `boss-mendez` — Diego Méndez | ⬜ Pendiente | 🟡 Media |
| `lane-tile` — Camino | ⬜ Pendiente | 🔴 Alta |
| `side-tile` — Selva | ⬜ Pendiente | 🔴 Alta |
| `gate-positive` — Puerta verde | ⬜ Pendiente | 🔴 Alta |
| `gate-negative` — Puerta roja | ⬜ Pendiente | 🔴 Alta |
| `gate-upgrade` — Puerta dorada | ⬜ Pendiente | 🟡 Media |
| `projectile` — Flecha | ⬜ Pendiente | 🟢 Baja |
| `obstacle-barrel` — Barril | ⬜ Pendiente | 🟢 Baja |

### SFX (MVP — mínimo 6)

| SFX | Status | Prioridad |
|-----|--------|-----------|
| `sfx-shoot` | ⬜ Pendiente | 🔴 Alta |
| `sfx-hit` | ⬜ Pendiente | 🔴 Alta |
| `sfx-gate-positive` | ⬜ Pendiente | 🔴 Alta |
| `sfx-gate-negative` | ⬜ Pendiente | 🔴 Alta |
| `sfx-kill` | ⬜ Pendiente | 🟡 Media |
| `sfx-victory` | ⬜ Pendiente | 🟡 Media |
| `sfx-defeat` | ⬜ Pendiente | 🟡 Media |
| `sfx-boss-appear` | ⬜ Pendiente | 🟡 Media |
| `sfx-player-hit` | ⬜ Pendiente | 🟢 Baja |
| `sfx-crit` | ⬜ Pendiente | 🟢 Baja |
| `sfx-gate-upgrade` | ⬜ Pendiente | 🟢 Baja |
| `sfx-ui-click` | ⬜ Pendiente | 🟢 Baja |

### Música (MVP — mínimo 1 track)

| Track | Status | Prioridad |
|-------|--------|-----------|
| `music-game-cap1` — Gameplay | ⬜ Pendiente | 🔴 Alta |
| `music-boss` — Boss fight | ⬜ Pendiente | 🟡 Media |
| `music-menu` — Menú | ⬜ Pendiente | 🟡 Media |
| `music-victory-jingle` — Victoria | ⬜ Pendiente | 🟢 Baja |

---

## 11. Tips de producción con IA

### Consistencia visual entre sprites (MUY IMPORTANTE)
El mayor desafío con sprites IA es que cada generación puede verse diferente. Para mantener coherencia:

1. **Scenario.gg** — Entrena un modelo custom con 5–10 imágenes de referencia de tu estilo. Una vez entrenado, genera todos los personajes con el mismo modelo. Es el método más efectivo para consistencia.
2. **Seed fijo en Midjourney** — Usa `--seed [número]` para reproducir resultados similares. Anota el seed cuando encuentres un resultado bueno.
3. **Image prompting** — En Midjourney, usa una imagen ya aprobada como referencia con `--sref [url]` para mantener estilo.
4. **Batch en el mismo prompt** — Genera todos los personajes aliados en una sola sesión sin cerrar el contexto.

### Limpieza de fondos
- **remove.bg** — Gratis hasta ciertos límites, excelente para personajes con fondo blanco.
- **Adobe Photoshop** — Selección de objeto automática (Select > Subject).
- **GIMP** — Fuzzy Select + Paths para contornos más precisos.
- Antes de usar en Phaser, verificar que el fondo sea `rgba(0,0,0,0)` y no `rgba(255,255,255,1)`.

### Música loop-friendly
- En Suno, especifica "loop-friendly" o "seamless loop" en el prompt.
- Editar el audio en **Audacity**: cortar para que inicie y termine en el mismo beat (zero-crossing en el waveform).
- En Phaser, usar `{ loop: true }` en `sound.play()`.

### Reducción de tamaño de archivos
- Sprites PNG: usar **TinyPNG** (tinypng.com) — reduce hasta 70% sin pérdida visual.
- Audio MP3: 128 kbps para SFX, 192 kbps para música. Suficiente para mobile.
- Objetivo: toda la carpeta `public/assets/` < 20 MB para web, < 50 MB para app.

---

*Documento vivo. Actualizar el checklist cuando cada asset sea aprobado e integrado.*
