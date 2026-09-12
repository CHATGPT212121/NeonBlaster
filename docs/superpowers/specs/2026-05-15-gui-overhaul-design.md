# GUI Overhaul — Design Spec
**Date:** 2026-05-15
**File:** `shooter.html` (single-file)
**Scope:** Full cyberpunk/neon GUI redesign — HUD, weapon bar, start/game-over screen, in-game overlays

---

## 1. HUD

### Animated Rolling Score Counter
- When `score` increases, the 6-digit display animates: each changed digit rolls upward to its new value over 0.3s
- Implemented via JS: compare old vs new score digit-by-digit, apply a CSS `translateY` transition on individual digit `<span>` elements
- Score display uses a `<div>` with 6 child `<span>`s, each showing one digit

### HP Bar (replaces hearts)
- Remove `#lives-display` and the three `<span class="heart">` elements
- Add `<div id="hp-bar">` containing 3 `<div class="hp-seg">` segments
- Full segment: background `var(--neon-pink)`, box-shadow `0 0 8px var(--neon-pink)`
- Lost segment: background `rgba(255,0,110,0.1)`, no glow
- Segments separated by 3px gaps, total bar width ~80px, height 14px
- CSS `@keyframes hp-shimmer`: subtle brightness pulse `filter: brightness(1) → brightness(1.3) → brightness(1)` over 2s, applied to full segments only
- JS: `updateHUD()` sets `.hp-seg` active/inactive class based on `lives`

### Enemy Counter
- Below the wave number: `<div id="enemy-count">` showing `${alive} LEFT`
- Updates on every enemy kill via `updateHUD()`
- Hidden (`display:none`) during boss waves (`wave%5===0`) and when `enemies.length===0`
- Font: Share Tech Mono, 9px, cyan at 50% opacity

### Wave Number Flicker
- Add `@keyframes wave-flicker`: `opacity: 1 → 0.7 → 1 → 0.85 → 1` over 1.8s infinite
- Applied to `#wave-display`

### SFX Toggle Button
- Replace `#mute-display` plain text with a styled `<button id="sfx-btn">`
- Active: `◉ SFX` — border `var(--neon-cyan)`, text `var(--neon-cyan)`
- Muted: `○ SFX` — border `rgba(0,245,255,0.3)`, text `rgba(0,245,255,0.3)`
- Clicking toggles `audioEnabled` and calls `updateHUD()`
- `pointer-events: all` so it's clickable

### HUD Bottom Border Sweep
- Add `::after` pseudo on `#hud`: 1px tall, full width, background: `linear-gradient(90deg, transparent, var(--neon-cyan), var(--neon-purple), transparent)`
- `@keyframes hud-sweep`: `background-position 3s linear infinite` shifting left→right
- `background-size: 200% 1px`

---

## 2. Weapon Bar

### Slot Height
- Increase `.weapon-slot` min-height from implicit ~44px to `72px`
- Adjust padding: `6px 12px`

### Ammo Fill Bar
- Replace `.weapon-ammo` text with a two-part element:
  ```html
  <div class="ammo-wrap">
    <div class="ammo-bar"><div class="ammo-fill" id="ammo-fill-spread"></div></div>
    <div class="ammo-num" id="ammo-spread">0</div>
  </div>
  ```
- `.ammo-bar`: width 28px, height 32px, border `1px solid currentColor` at 30% opacity, border-radius 2px
- `.ammo-fill`: width 100%, height computed as `(ammo/maxAmmo)*100%` from bottom, background `currentColor`, transition `height 0.15s`
- Normal weapon: fill bar always 100% solid
- `updateWeaponBar()` sets both the fill height and the number

### Max ammo reference per weapon (for fill bar %):
| Weapon | Max ammo (one pickup) |
|--------|----------------------|
| spread | 8 |
| laser  | 5 |
| bomb   | 2 |
| shield | 1 |
| homing | 3 |
| speed  | — (timed, no bar) |

- Ammo can exceed one pickup (multiple pickups stack). Cap display at 100% when above max.

### Cooldown Arc
- Each weapon slot gets a CSS `::before` pseudo-element overlay positioned absolute, sized to cover the icon area
- Background: `conic-gradient(rgba(255,255,255,0.35) 0% var(--cd), transparent var(--cd) 100%)`
- JS: in the game loop (every frame), for the active weapon slot only: `el.style.setProperty('--cd', pct+'%')` where `pct = (shootCooldown / maxCooldown) * 100`
- When `shootCooldown <= 0`: set `--cd` to `0%` (arc disappears)
- `maxCooldown` per weapon: normal=0.22, spread=0.28, laser=0.55, bomb=1.0, shield=4.5, homing=0.4
- Non-active slots: `--cd` always `0%`

### Active Weapon Pulse
- Replace static `box-shadow:0 0 10px currentColor` on `.weapon-slot.active` with:
  `@keyframes slot-pulse`: `box-shadow: 0 0 8px currentColor → 0 0 22px currentColor → 0 0 8px currentColor` over 1s infinite

### Has-Ammo Bottom Border
- `.weapon-slot.has-ammo`: add `border-bottom: 2px solid currentColor` at 60% opacity

### Key Hint Badges
- Remove `#weapon-keyhint` strip
- Each slot gets `<div class="key-badge">1</div>` (through 6)
- `.key-badge`: position absolute, top-right corner of slot, font 7px, opacity 0.4, border `1px solid currentColor`, padding `1px 3px`, border-radius 2px

---

## 3. Start / Game Over Screen

### Title Glitch Animation
- `@keyframes glitch`:
  - 0%, 90%, 100%: normal
  - 92%: `text-shadow: -3px 0 #ff006e, 3px 0 #00f5ff; transform: translateX(-2px)`
  - 94%: `text-shadow: 3px 0 #ff006e, -3px 0 #00f5ff; transform: translateX(2px)`
  - 96%: `text-shadow: none; transform: translateX(0)`
- Applied to `.overlay-title`, runs every 4s

### Neon Separator Lines
- Add `<div class="neon-sep">` before and after `.overlay-weapons`
- `.neon-sep`: height 1px, width 340px, background `linear-gradient(90deg, transparent, var(--neon-cyan), transparent)`, box-shadow `0 0 8px var(--neon-cyan)`

### Weapon Showcase Grid
- Expand `.overlay-weapons` to show all 6 weapons in 2 rows × 3 cols (or 1 row × 6 if space allows)
- Each `.ow-item` shows: icon (20px), weapon name, one-line description
- Add shield and homing items: `🛡️ SHIELD — absorb hits` and `🎯 HOMING — track targets`

### Top Score Display
- `#hi-score-display` gets class `gold-glow`: color `var(--neon-yellow)`, text-shadow `0 0 15px var(--neon-yellow), 0 0 40px rgba(255,190,11,0.3)`
- Prefix: `★ BEST`
- On screen load, briefly animate: `@keyframes score-pop` scale 1.2→1 over 0.4s

### Game Over Screen
- "GAME OVER" title uses glitch animation (same keyframes)
- RETRY button: border `var(--neon-pink)`, color `var(--neon-pink)`, hover background `var(--neon-pink)` — red urgency instead of cyan
- "★ NEW BEST! ★" banner: `@keyframes gold-flash` alternates between `var(--neon-yellow)` and `#fff` color over 0.4s

### Overlay Entry Animation
- `@keyframes overlay-in`: `opacity: 0, translateY(10px) → opacity: 1, translateY(0)` over 0.3s
- Applied to `#overlay` when `.hidden` class is removed (use JS `classList` toggle approach or CSS `animation` triggered by display change)

---

## 4. In-Game Overlays

### Floating Kill Score Text
- New array `floatTexts = []` — objects: `{x, y, text, color, life, maxLife, vy}`
- `spawnFloatText(x, y, points, color)`: pushes `{ x, y: y-10, text: '+'+points, color, life: 0.6, maxLife: 0.6, vy: -55 }`
- Called in `checkCollisions` when `e.alive=false && score+=e.points`
- Also called in `killBoss` with `'+' + (500+wave*20)`
- Draw in `drawFloatTexts()`: `ctx.font='bold 13px Orbitron'`, `ctx.fillStyle=color`, alpha = `life/maxLife`, position `(x, y)` moving up by `vy*dt`
- Updated in the `if(state==='playing')` block; drawn in the draw section

### Pickup Popup Redesign
- Replace centered fade with slide-in from right:
  - `el.style.transform = 'translateX(120px)'; el.style.opacity = '0'` initially
  - Animate: `el.style.transition = 'transform 0.2s, opacity 0.2s'; el.style.transform = 'translateX(0)'; el.style.opacity = '1'`
  - After 800ms: slide back out `translateX(120px)` + fade
- `#pickup-announce` repositioned: `right: 16px; top: 50%; left: auto; transform: translateY(-50%)` (right side of canvas)
- Add `text-shadow: 0 0 20px currentColor` using inline style matching pickup color

### Boss Warning Overlay
- Add `<div id="boss-flash">` sibling to canvas, `position:absolute; inset:0; pointer-events:none; opacity:0`
- When boss wave triggers: `bossFlash.style.background = 'rgba(255,0,0,0.15)'; bossFlash.style.opacity = '1'`
- Fade out over 1.5s via CSS transition
- Canvas border: add/remove class `boss-border` that sets `box-shadow: 0 0 40px rgba(255,0,110,0.6)` on the canvas for the warning duration

### Wave Banner Upgrade
- Scale-in entry: set `el.style.transform = 'scale(1.4)'` before showing, then transition to `scale(1)` over 0.15s
- Add `<div id="wave-scanline">` child inside `#level-announce`: a 2px horizontal line that sweeps left→right via `@keyframes wave-scan` over 0.4s when banner appears

### Damage Vignette
- Add `<div id="damage-vignette">` sibling to canvas: `position:absolute; inset:0; pointer-events:none; opacity:0`
- Background: `radial-gradient(ellipse at center, transparent 40%, rgba(255,0,110,0.5) 100%)`
- On `hitPlayer()`: set `opacity=1`, then CSS transition `opacity 0s → 0.3s ease-out` back to 0
- Implemented via `vignette.style.opacity='1'; requestAnimationFrame(()=>{ vignette.style.transition='opacity 0.3s'; vignette.style.opacity='0'; })`

---

## Architecture Notes

- All new HTML elements added to `#wrapper` or as children of existing elements
- `floatTexts` array: declared alongside other game arrays, reset in `startGame`
- Cooldown arc: drawn via a small `<canvas>` per slot OR via a single `drawCooldownArcs()` call on the main canvas overlay — prefer DOM canvas per slot for simplicity
- `updateHUD()` extended to handle: HP segments, enemy count, SFX button state, score digit animation
- No new external dependencies
