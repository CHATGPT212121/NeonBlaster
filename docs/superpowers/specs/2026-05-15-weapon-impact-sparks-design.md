# Weapon Impact Sparks — Design Spec
**Date:** 2026-05-15
**File:** `shooter.html` (single-file)
**Scope:** Visual-only — weapon-specific particle effects on bullet impact

---

## Overview

Add a `spawnImpactSparks(x, y, weaponType, bulletAngle)` function that fires a small, weapon-specific particle burst whenever a player bullet hits an enemy. This is *additional* to the existing `spawnExplosion` (which fires on enemy death). Impact sparks also fire on the first hit of armored enemies (type 4, currently only a white flash).

---

## Per-Weapon Effect Specs

### Normal (`'normal'`)
- **Particles:** 6
- **Color:** `#00f5ff` (cyan)
- **Pattern:** tight forward-facing cone ±60° around `bulletAngle`
- **Speed:** 80–150 px/s
- **Size:** 2px radius
- **Lifetime:** 0.2s

### Spread (`'spread'`)
- **Particles:** 8
- **Color:** `#ffbe0b` (yellow)
- **Pattern:** fixed star — every 45° (0, 45, 90, 135, 180, 225, 270, 315°)
- **Speed:** 60–100 px/s (randomised per particle)
- **Size:** 2px radius
- **Lifetime:** 0.25s

### Laser (`'laser'`)
- **Particles:** 4 pink sparks + 1 small ring
- **Color:** `#ff006e` (pink)
- **Sparks:** 4 particles radiating outward at random angles, speed 60–120 px/s, size 2px, lifetime 0.15s
- **Ring:** expands 0→18px over 0.15s, lineWidth 1.5, fades with `life/maxLife` alpha

### Homing (`'homing'`)
- **Particles:** 6
- **Color:** `#ff8c00` (orange)
- **Pattern:** spiral — initial velocity is tangent to a circle (angle + 90°) plus a small outward component, so particles arc outward
- **Speed:** 80–130 px/s
- **Size:** 3px radius
- **Lifetime:** 0.3s

### Nova (`'bomb'`)
- **Particles:** 0 extra sparks (existing explosion handles per-enemy kill)
- **Ring:** tiny purple micro-ring per individual enemy kill: 0→12px over 0.12s, `#bf5fff`, lineWidth 1, alpha fades

---

## Architecture

### New function: `spawnImpactSparks(x, y, weaponType, bulletAngle)`

```
weaponType  → 'normal' | 'spread' | 'laser' | 'homing' | 'bomb'
bulletAngle → radians, direction bullet was travelling (used for normal cone)
              default: -Math.PI/2 (straight up) if not provided
```

Internally dispatches to the correct effect. Pushes into existing `particles` array (same structure: `{x, y, vx, vy, life, maxLife, r, color}`). For laser and nova micro-rings, pushes into existing `shockwaves` array with a smaller `maxR`.

### Call sites

| Location | Condition | weaponType passed |
|----------|-----------|------------------|
| `checkCollisions` — normal bullet hits enemy (hp-- path) | always | `'normal'` |
| `checkCollisions` — normal bullet kills armored (hp was 2→1) | already fires white flash; ALSO add sparks | `'normal'` |
| `shoot()` — laser column sweep, per enemy hit | each `e.alive=false` | `'laser'` |
| `checkCollisions` — homing bullet hits enemy | always | `'homing'` |
| `shoot()` — nova bomb, per enemy in `enemies.forEach` | each kill | `'bomb'` |
| Spread bullets — spread uses same `bullets` array; `checkCollisions` detects hits but doesn't know the weapon | add `weaponType` field to bullet objects for spread bullets | `'spread'` |

### Bullet `weaponType` tagging

Normal bullets: `bullets.push({ ..., weaponType:'normal' })`
Spread bullets: `bullets.push({ ..., weaponType:'spread' })`

In `checkCollisions`, read `b.weaponType` (default `'normal'` if missing) to pass correct type to `spawnImpactSparks`.

---

## What Is NOT Changed

- `spawnExplosion` — unchanged, still fires on enemy death
- Existing shockwave ring sizes for explosions — unchanged
- No changes to enemy behavior, weapon ammo, or damage
