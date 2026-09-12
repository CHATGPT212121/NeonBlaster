# NEON BLASTER — Full Overhaul Design Spec
**Date:** 2026-05-13  
**File:** `shooter.html` (single-file HTML/CSS/JS)  
**Scope:** Enemies & bosses, weapons & power-ups, visuals & effects, game feel & polish

---

## 1. New Enemies

Three new enemy types are added to the formation grid alongside the existing three (▲ ◆ ●).

| Type | Symbol | Color | HP | Points | Behavior |
|------|--------|-------|----|--------|----------|
| Zigzagger | ◈ | cyan `#00f5ff` | 1 | 40 | Moves in sine wave pattern on top of formation drift |
| Armored | ■ | orange `#ff8c00` | 2 | 50 | Shows cracked overlay after 1st hit; normal death on 2nd |
| Dive-Bomber | ▼ | red `#ff2244` | 1 | 35 | 15% chance per wave to break formation and dive at player; re-enters formation if it misses |

Formation rows assign types based on wave number. Waves 1–3 use original types only; wave 4+ starts mixing in new types.

---

## 2. Boss Fights

A boss spawns at the start of every 5th wave (wave 5, 10, 15, …) replacing the normal formation.

### Boss Stats
- HP scales with wave: `20 + (waveNumber / 5) * 10`
- Size: 80×50px, centered at top of canvas
- HP bar rendered at top of canvas (outside the boss sprite)

### Attack Patterns
| Phase | Trigger | Attacks |
|-------|---------|---------|
| Phase 1 | HP > 50% | 3-way spread shots, side-to-side movement |
| Phase 2 | HP ≤ 50% | 5-way spread shots + sweeping laser from left to right |

### Boss Lifecycle
1. Entrance: slide in from top over 0.8s, screen flash white, "⚠ WARNING ⚠" text displayed for 1.5s, game paused during entrance
2. Death: heavy screen shake (14px, 0.6s), multi-particle explosion, guaranteed weapon drop + health drop
3. Wave does not advance until boss is killed

---

## 3. New Weapons

Two new weapons added to the weapon bar (slots 5 and 6). Keys `5` and `6` to select.

### Shield Bubble (🛡️, white `#ffffff`)
- Activates a circular bubble around the player for **4 seconds**
- Absorbs all enemy bullet hits and contact damage while active
- Player cannot shoot while shield is active
- Auto-switches back to `normal` when shield expires
- Ammo = number of uses (each pickup grants 1 use)

### Homing Missile (🎯, orange `#ff8c00`)
- Fires a missile that tracks the nearest alive enemy
- Slightly slower than normal bullets (speed 300px/s vs 500px/s) but guaranteed to hit
- Deals 1 damage (2× against bosses)
- 3 missiles per pickup

---

## 4. New Power-up Drops

All drops fall from killed enemies. Drop logic:
- Weapon drop: 30% chance (existing, unchanged)
- Health drop: independent 8% chance roll (both can drop from the same enemy)

| Pickup | Icon | Effect | Drop Chance |
|--------|------|--------|-------------|
| Health | ❤️ | +1 life (max 3) | 8% independent |
| Speed Boost | 💨 | +40% speed for 8s, thruster glow intensifies | included in weapon drop pool |
| Shield | 🛡️ | +1 shield use | included in weapon drop pool |
| Homing | 🎯 | +3 missiles | included in weapon drop pool |

Weapon drop pool now has 6 items: spread, laser, bomb, shield, homing, speed — each equally weighted.

---

## 5. Visuals & Effects

### Parallax Star Field (3 layers, replaces static `drawStars`)
| Layer | Count | Size | Speed | Opacity |
|-------|-------|------|-------|---------|
| Far | 80 | 1px | 15px/s | 0.25 |
| Mid | 40 | 1.5px | 30px/s | 0.45 |
| Near | 15 | 2.5px | 55px/s | 0.7 |

Stars are initialized at random positions; they wrap from bottom back to top.

### Screen Shake
- Implemented via canvas `translate` offset applied each frame and decayed exponentially
- Player hit: magnitude 8, duration 0.4s
- Enemy death: magnitude 2, duration 0.1s
- Nova bomb / boss death: magnitude 14, duration 0.6s

### Explosion Upgrade
- Existing particle burst is kept
- Adds a **shockwave ring**: circle that expands from `r=0` to `r=60` over 0.4s, fades out

### Armored Enemy Crack Overlay
- After 1st hit, draw a jagged crack symbol over the enemy using canvas path

### Player Ship Thruster
- Two small animated flame jets at rear of ship (`p.y + h/4`)
- Flicker by randomizing height each frame: `4 + Math.random()*6` px
- Color: inner `#ffbe0b`, outer `rgba(255,190,11,0)`
- Speed boost active: jet height doubles, adds cyan outer glow

### Warp-In Animation
- On game start and after respawn: player ship scales from 0 to 1 over 0.4s with a white flash ring
- Implemented via a `warpIn` timer on the player object

---

## 6. Game Feel & Polish

### Web Audio (synthesized, no external files)
All sounds created via `AudioContext` oscillators/noise. A global `audioEnabled` flag toggled by `M` key.

| Event | Sound description |
|-------|------------------|
| Shoot (normal) | Short 880Hz sine blip, 0.08s |
| Shoot (spread) | 5 quick blips in rapid succession |
| Enemy death | Descending 400→100Hz square, 0.15s |
| Player hit | Low 80Hz sawtooth buzz, 0.3s |
| Pickup | Ascending 440→880Hz sine chime, 0.2s |
| Boss warning | Rising 60→300Hz sine, 1.0s |
| Boss death | Three-note fanfare: 440, 554, 659 Hz, 0.15s each |
| Shield activate | Soft 1200Hz sine fade-in, 0.2s |

Mute indicator shown in HUD: `🔊` or `🔇` in top-right corner.

### High Score
- Stored in `localStorage` under key `neonBlasterHiScore`
- HUD shows: `BEST 000000` next to score
- Game over overlay shows "NEW BEST!" in neon yellow when current score exceeds stored best
- High score updated immediately when beaten mid-game

### Wave Transition Polish
- 1.5s freeze between waves (game paused, no input accepted)
- Centered banner: "WAVE XX" in neon yellow
- Boss waves show "⚠ WARNING ⚠" in neon pink instead
- Existing `level-announce` element reused

### Difficulty Scaling (revised curve)
Current: `enemySpeed = 50 + wave * 14` (linear, gets too fast)  
New: `enemySpeed = 50 + wave * 14 * (1 / (1 + wave * 0.04))` — slows growth after wave 8  
Enemy shoot timer: `max(0.35, 2.2 - wave * 0.10)` (was `0.12`, slightly slower ramp)  
Dive-bomber dive chance: `0.15 + wave * 0.01` (capped at 0.40)

### Mobile Fire Button
- On-screen `FIRE` button rendered below canvas on touch devices (`'ontouchstart' in window`)
- Styled to match the neon aesthetic, triggers `shoot()` on `touchstart`

---

## 7. Architecture Notes

All changes remain in the single `shooter.html` file. Key structural additions:

- `stars` array (initialized once, updated in `loop`)
- `boss` object (null when no boss active)
- `shockwaves` array (alongside `particles`)
- `shake` object `{ magnitude, duration }` — applied in `loop` via `ctx.save/translate/restore`
- `audioCtx` — lazily created on first user interaction
- `speedBoostTimer` on player object
- `warpInTimer` on player object
- Weapon slots expanded: `WEAPONS` object gains `shield` and `homing` entries
- `DROP_TYPES` array updated to include new drops
