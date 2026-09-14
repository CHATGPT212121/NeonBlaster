# NEON BLASTER — Raiden DX military conversion

A full Raiden DX (1994) style conversion of the game: gunmetal + hazard +
chrome UI, tracer fire, olive-drab hardware, military briefings and
designations — over all existing systems (4 jets, 3 areas, 12 foes,
7 weapons, medals progression, chains, 3 bosses, cinematic FX).

## Raiden DX conversion

- **HUD**: black ordnance bar — red italic `1P SCORE`, yellow `HI-SCORE`,
  `HULL` armor blocks, amber `WAVE`, steel `SFX` chip. Weapons renamed to
  arsenal codes: GUN / WIDE / LASER / BOMB / MSL / RAIL / SLAVE.
- **Tracer fire**: yellow GUN tracers, orange WIDE, blue LASER (incl.
  lightning + thunder ring), red-white BOMB blasts, green engine flames on
  every paint scheme. Enemies return hot pink-red fire.
- **Hardware, not aliens**: 12 foes repainted olive drab / gunmetal / rust /
  tan (steel hulls, red cores); pickups are ordinance chips (P/M/B/S).
- **Areas**: `AREA 01 — COASTAL DEFENSE` (steel sea + moon), `AREA 02 —
  ARMORED BASE` (desert storm), `AREA 03 — NIGHT FORTRESS` (dark blue +
  red fortress). Dreadnought flies steel blue now.
- **Briefing menu**: chrome NEON BLASTER title, hazard rules, riveted
  plates (BASE / SORTIE / LINK-offline / HANGAR / OPTIONS / QUIT),
  green-phosphor status readouts, `FLIGHT OPERATIONS` command.
- **Military records**: jets carry designations (F-01 VANGUARD, B-01 AEGIS,
  F-02 COMET, A-10 STRIKER); paints are STEEL / DESERT / MARINE / NIGHT;
  upgrades are ARMOR PLATING / TURBO ENGINE / RAPID TRIGGER; salvage is
  now **MEDALS**; combo meter reads `CHAIN ×n LVm`; game over is a
  red-stencil **GAME OVER** under an AFTER-ACTION REPORT.
- Mechanics, balance, and saves are untouched — storage keys and all
  systems work exactly as before.

## Visual breakthrough v13

- **Additive glow rendering**: bullets, lasers, lightning, particles, and
  shockwaves now composite with `lighter` blending — overlapping fire
  blooms white-hot like a real muzzle-lit battlefield.
- **Explosions 2.0**: white core flash, tumbling hull debris shards, and
  lingering smoke on top of the existing fire + rings + shake.
- **Cinematic boss intros**: letterbox bars slam in with the WARNING card
  plus a 0.6s slow-mo freeze, then retract for the fight. Bosses telegraph
  with a converging charge ring; Juggernaut turrets visibly track your ship.
- **Combat texture**: enemies flash white on every hit, bolts drag plasma
  trails, every shot fires a muzzle light, engines burn white-hot cores,
  warp streaks kick in at x3+ combo, and a film vignette frames it all.

## Bosses v12

- **3 distinct bosses**, one per boss wave: wave 5 **RAVAGER** (ember escort
  gunship — fast, bobs, fires aimed bursts, 5-fan + aimed pairs enraged),
  wave 10 **DREADNOUGHT** (the classic violet capital ship — spreads,
  sweeping lasers when enraged), wave 15+ **JUGGERNAUT** (huge red siege
  fortress — alternating bullet rings and fans, 12-ring + frequent lasers
  enraged, +250 bonus and +15 HP per cycle past wave 15).
- **Intro cards**: a WARNING card slams in on every boss spawn — name,
  ship class, and a 5-star threat rating (2 / 3 / 5).
- **Better boss HP bar**: 10 segmented armor blocks, a white damage ghost
  that drains after hits, a phase tick at 50%, and a live nameplate
  (`RAVAGER — ENRAGED`, etc.).

## Juice v11

- **Kill combo**: chained kills (2.5s window) raise a x1→x5 score multiplier
  (+1 tier per 5 kills, HUD meter under the score, red at x5). Taking a hit
  or pausing too long resets it. Multiplied scores bank more medals.
- **Damage numbers**: small white `1`s (railgun `2`s, violet on bosses) pop
  on every non-lethal hit; kill popups show the multiplied award.
- **Hit-stop**: kills freeze the frame for 35ms (boss: 250ms) for punch.
- **Bigger explosions**: ~75% more particles, faster debris, white-hot core
  sparks, stronger shake, and a second white shockwave ring on big kills.
- **Stage sweep**: a light beam + screen flash on every stage transition
  (and game start), synced with the stage announce card.

## Progression v10

- **Medals economy**: every sortie banks its score as medals (shown in the
  debrief and the operative card). Best score is never spent — it's your
  record; medals are the currency.
- **Hangar upgrades** (Customization view, 5 levels each, cost rises per
  level): HULL PLATING (+1 max hull/level), ION THRUSTERS (+8% speed/level),
  OVERCLOCK (−7% cooldowns/level). Levels apply live to the next sortie.
- **Unlockable jets**: Vanguard is free; Comet 500 / Striker 1500 / Aegis
  3000 medals. Locked frames show their price, unlock with one click.
  Existing pilots (any past sortie) keep all 4 frames.
- **6 missions** (Home view, claimable once each): FIRST BLOOD +50,
  WING SORTIES +150, HIGH ROLLER +300, DEEP RAID +400, BOSS SLAYER +600,
  EXTERMINATOR +800 — with progress bars and CLAIM buttons when ready.

## Polish v9

- **Living menu**: showcase ship bobs gently, engine flames flicker, orbit
  rings breathe (all pure CSS, all 4 frames).
- **Living backdrop**: planets drift, nebulae breathe, and a huge dim planet
  crosses the sky every ~75s (tinted per stage), behind the starfield.
- **Prettier HUD**: 3 stage pips under the wave counter (cleared/current),
  pulsing red HP bar at 1 hull, and a `DREADNOUGHT` nameplate under the boss
  bar (turns to `DREADNOUGHT — ENRAGED` in phase 2).

## Foes v7 + guns v8

- **12 enemy classes**: 6 new wave-2 foes — crimson **blade** (fast diver),
  jade **manta** (wide weaver), gold **carrier** (slow 3-HP tank), fuchsia
  **warden** (fast 2-HP spinner), rust **destroyer** (slow 4-HP bruiser),
  frost **lancer** (diving zig-zagger). Stage 2 fields the new classes,
  stage 3 mixes elites from all 12.
- **Railgun** (key 6): piercing white lance, 2 damage, up to 4 targets per
  shot, heavy muzzle flash + kick.
- **Orbital drone** (key 7): deploys a gold sidekick (max 2, 25s) that
  flanks your ship and auto-fires at the nearest target.
- Both drop from kills as new hex pickups (`RAILGUN LANCE!`,
  `ORBITAL DRONE!`), with new weapon-bar slots, ammo bars, and key badges.

## Stages v5 + weapon FX v6

- **3 stage backgrounds** switch automatically by wave with announce cards:
  waves 1–4 **ORBITAL DRIFT** (teal nebula + ringed planet), waves 5–8
  **NEBULA STORM** (amber storm clouds + energy streaks; stage 2 opens with
  the wave-5 boss: `⚠ STAGE 2 — NEBULA STORM ⚠`), waves 9+ **ENEMY
  TERRITORY** (purple nebula + red fortress planet + drifting asteroids).
- **Every weapon has effects**: muzzle-flash sparks in the weapon's color on
  every shot (twin-aware), a violet discharge ring around your ship on
  thunder, a second shockwave ring at your ship on nova, ember muzzle puffs
  on homing launches, and a white core flash on every bullet kill on top of
  the existing explosion + shockwave + float text.

## Jets v4 (selectable frames)

The hangar now offers 4 flyable frames with different stats and functions
(persisted as `nbJet`); skins remain pure recolors for any frame. (Progression
v10: Comet/Striker/Aegis unlock with medals; veteran pilots keep all four.)

- **VANGUARD** (balanced): 3 hull, 100% speed / fire rate.
- **AEGIS** (tank): 5 hull, 80% speed, twin-bolt volley.
- **COMET** (speedster): 2 hull, 135% speed, **Shift = phase dash**
  (3x burst + brief invulnerability, 3s cooldown).
- **STRIKER** (ordnance): 4 hull, starts with +3 homing ammo, 2x pickup
  magnet radius.
- Menu showcase swaps silhouette per frame; HUD HP pips render dynamically
  (2–5); all fire cooldowns scale per frame.

## Command Deck v3 (fullscreen concept menu + new canvas art)

The menu is now a fullscreen command deck matching the concept art, and all
canvas art was redrawn in the concept's visual language (engine behavior
unchanged — same hitboxes, speeds, timers, and scoring):

- **Left rail:** ORBITAL COMMAND kicker, giant NEON BLASTER title, amber
  rule, then HOME / CAMPAIGN / MULTIPLAYER (offline) / CUSTOMIZATION /
  SETTINGS / QUIT. Keyboard: ↑↓ navigate, Enter select, Esc home.
- **Center stage:** large vector interceptor showcase with orbit rings —
  repainted live by the selected skin.
- **Right column:** operative card (callsign, rank ROOKIE→LEGEND with XP bar,
  ship, best), switchable panels per view, patch + systems chips.
- **Customization:** 4 hangar paints (STEEL, DESERT, MARINE, NIGHT)
  persisted to localStorage, applied to menu ship + in-game jet.
- **Campaign:** 3 difficulties (Cadet / Veteran / Ace scale enemy fire rate
  and speed) + LAUNCH button.
- **Settings:** SFX on/off, screen shake on/off (persisted).
- **Records:** games, kills, best wave, and last 4 sorties in the flight log
  (localStorage `nbRec`).
- **Quit:** returns to OS shell in Electron (`window.close()`), shows
  "press Alt+F4" hint in a plain browser.
- **New canvas art:** sleeker skin-driven interceptor (STEEL/DESERT/MARINE/NIGHT schemes), 6 redrawn enemy classes (dart, saucer, hex
  drone, shuriken spinner, cruiser, bomber), rebuilt capital-ship boss with
  bridge/cannon/engines, tapered bolt rounds, ember homing missiles with
  flame trails, haloed enemy orbs, and orbit rings in the starfield.

## What's in this folder

| File | Action |
|------|--------|
| `shooter.html` | **Copy over** your project's `shooter.html` (back up the old one first) |
| `main.js` | **Copy over** your project's `main.js` (1-line change: window bg color) |

## Lobby v2 (concept layout rebuild)

The lobby now follows the concept art's structure — left command rail, open
center stage, right-hand info column — using only real, working features:

- **Rail:** NEON BLASTER title + amber rule, then PLAY (deploy), LOADOUT
  (weapon guide), BRIEFING (mission + tips), SOUND (on/off toggle).
- **Stage:** open viewport showing your interceptor + orbit rings.
- **Side:** pilot record card (callsign, rank from best score, best, ship),
  switchable loadout/briefing panel, threat + control chips.
- **Footer:** key-hint bar.
- **Game-over screen** gained a ◀ MENU button that returns to the lobby
  (previously only REDEPLOY existed — the lobby was unreachable).

## The new look

**Palette** — deep bridge navy `#060B18`, ice-white text `#D7E6F5`, structural
teal `#57C7D4`, and ONE accent: command amber `#F5A623` (PLAY buttons, wave
number, best score, active highlights). Alert red `#E5484D` is reserved for
danger: HP, boss warnings, damage.

- **Menu / lobby** — frosted-glass panels, hairline frames with amber corner
  ticks, thin Exo 2 display type, teal ghost buttons, amber PLAY.
- **HUD** — calm hairline bar, ice score, amber best + wave, red hull segments.
- **Weapon bar** — Normal (teal) · Spread (amber) · Thunder (ice) · Nova
  (violet) · Homing (ember). Same slots, keys, and ammo bars.
- **Combat** — teal bolts, amber explosions/score popups, ice lightning,
  ember homing trails, violet nova flash, alert-red boss phase 2 + lasers.
- **Pause / debrief** — minimal centered cards, blurred battlefield behind.

**Fonts:** Exo 2 (display) + Rajdhani (UI) + Share Tech Mono (micro-labels),
loaded from Google Fonts. Needs internet on first run; falls back to system
fonts offline.

## Bonus fix included: PLAY button now works

Testing found a **shipped bug in v1.0**: the lobby PLAY button had
`pointer-events: none` (inherited from `#overlay`), so clicks fell through to
the canvas and **the game could not be started by clicking PLAY**. This theme
includes the one-rule CSS fix — PLAY, JOIN SQUAD, CREATE, ARMORY/SQUAD/MAP and
ABILITIES are clickable again. (REDEPLOY on the game-over screen already
worked and still does.)

## How to install

1. In your project folder (`NeonBlaster`), rename the current files as backup:
   `shooter.html` → `shooter-backup.html`, `main.js` → `main-backup.js`
2. Copy the two new files from this folder into your project folder.
3. Test: `npm start` → lobby → PLAY → shoot a wave → ESC pause → die once to
   see the debrief card.
4. Rebuild the portable exe: `npm run build` → new file appears in `dist/`.
5. Commit in GitHub Desktop with summary `Star Command UI theme` and push.

## How it was built & verified

- Theme applied as an **appended CSS override block** (legacy `--neon-*`
  variables remapped + explicit Star Command rules) plus a **1:1 color remap**
  of canvas constants in JS. No HTML structure, IDs, or logic touched.
- Verified headless in Chromium: menu → PLAY → shooting/scoring → pause →
  resume → boss wave 5 → game over, with **zero console errors**.
- If anything looks off on your machine, screenshot it and tell me — every
  color lives in the `:root` block at the end of `<style>`, so tweaks are
  one-line changes.

## Rollback

Delete the new files, rename `shooter-backup.html` → `shooter.html` and
`main-backup.js` → `main.js`. Done.

## SPRITES-RDX — embedded pixel art (Sep 2026)
- 13-asset pack in `raiden-assets/` (jet, tank, turret, heli, battleship, plasma, laser, orbs,
  desert, ocean, clouds, hud-kit, keyart). AI "magenta" key is actually flat mauve (~187,45,133):
  PIL flood-fills corner-connected bg with a marker, then keys the marker exactly (asserts
  20–98% transparent). Plasma bolts arrived horizontal → rotated PIL-side; orb = single cell crop.
- `SPR_DATA` base64 data-URIs (avoids file:// canvas taint); `SPR_init` decodes async, builds
  27 tint variants (jet/foes 4 each, boss 3, plasma+gold, laser, orb, 3 terrain + night), sets
  `SPR.on`. Every draw fn has a sprite branch FIRST with the vector body intact as fallback.
- Terrain: 60px/s wrap-scroll per AREA + `screen`-blend clouds at 150px/s. STAGE-3 night =
  hue-shifted ocean (reads as crimson night strait — looks intentional, keep).
- File grew 188KB → 1.7MB (embedded PNG). Mechanics untouched.
- E2E `test_sprites.py` green (decode, key alpha, 27 variants, all sprite paths, 3 terrains,
  3 bosses, zero errors) + regression green: raiden, prog, menu3, juice, boss, vb, foes_guns,
  polish, stagefx.
- STALE suites (fail identically pre/post sprites, reference pre-menu3/pre-Raiden UI — out of
  scope): test_jets (old jet stats/captions), test_lobby2, test_theme (`.lobby-play` gone).

## RAIDEN2 — true Raiden behavior (Sep 2026)
User: scroll was inverted; entrances felt Galaga; guns must be pickup-driven, not loadout.
- SCROLL: terrain + clouds now move DOWN (fly north). `SCROLL_SPD=60/CLOUD_SPD=150` consts;
  ground foes ride at exactly SCROLL_SPD so they sit glued to the terrain.
- FORMATIONS: the march/drop block is gone. Waves are timed scripts (10 patterns, ~18s):
  ground rows terrain-locked, V/line/pincer/weave/column air entries, 2 armed carriers per wave.
  Types pooled per AREA (waves 1-3 gentle: 0/1/2 only). Escapees despawn quietly past the
  edge; wave clears when script + field are empty. HUD `LEFT` counts queued + alive.
- AIMED FIRE: shooters fire AT the jet (1-3 shooters by wave); carriers never shoot.
- CARRIER: new foe type 12 (pale `helid` sprite, side-crossing + escort). Drops alternate
  weapon-switch (never your current gun) and P-caps. All 5 kill sites pass the carrier flag.
- GUNS: keys 1-7 + slot clicks removed; bar is display-only (active slot shows `LVn`).
  Pickups SWITCH guns immediately (+ammo, GUN fallback at zero). `gunLvl` 1-5 via P-caps:
  GUN 1-5 streams (+dmg at 4), WIDE 5-7-9, LASER longer chains + boss dmg, MSL 1-3 missiles,
  RAIL dmg + pierce, SLAVE life + drone dmg. Any hit resets LV1. `selectWeapon` kept as
  internal/test hook only.
- E2E `test_raiden2.py`: pixel-voted scroll direction, formation/carrier sightings, aimed
  vx, full pickup economy, escape hush, wave clear — zero errors. Full regression 11/11.

## TILES2 — seamless terrain visual pass (Sep 2026)
User: "loads but looks wrong" (no detail). Found + fixed from screenshots:
- Ocean tile repeated visibly (identical island+carrier stacked 2x/screen). All tiles now
  mirror-wrapped PIL-side: seamless at both joints, 2x loop (ocean 450x490, desert 450x1200
  squashed, clouds 450x502). Top-down view reads mirrors as fresh coastline.
- Clouds 0.85 -> 0.45 alpha (ocean readable, jets/foes never fully hidden).
- File 1.7MB -> 2.5MB (desert tile dominates at 1.3MB b64). Mechanics untouched.
- Regression 11/11 green, zero errors.

## LANDLOCK — tanks on land, wispy clouds (Sep 2026)
User: "still same" (with screenshot of new build). Diagnosed: tanks floating on open water +
dense gray cloud blobs.
- Clouds: NEW sparse asset (bg-clouds.png, old kept as bg-clouds-dense.png). Tile 310KB ->
  72KB b64, alpha 0.6. Wisps instead of blanket.
- Landlock: PIL-mapped island land runs per 10px band (LAND_OCEAN, 18/49 bands, x133-223).
  Ground patterns defer until an island reaches the top (landNearTop scan, 0.7s row spacing),
  then spawn AT joint (x,sy) land points (landSpawnPt). Foes ride islands down-screen at
  terrain speed. Desert = all-land (river invisible at game scale). Night reuses ocean map.
- Took 3 iterations: exact-row spawn missed (63% water) -> deferral gated but rows missed ->
  joint-point spawn. Verified: turrets on island beach/grass, nothing floating.
- Regression 11/11 green, zero errors. File 2.27MB.

## LANDLOCK4-6 — island garrison spread (Sep 2026)
User: "try again" (no detail). Auto-playthrough audit (80s, waves 1-3, pacing ~30s/wave,
economy + carriers live, zero errors) found the defect: landlocked tanks piled onto the
same island points, overlapping in stacks.
- landSpawnPt now scans the FULL island body above-screen (sy -260..-2, was tip-only),
  builds spread cells, stride-picks, and enforces 48px min separation per pattern
  (10 rejection tries + max-min fallback). Verified: 5 foes across the island, all >48px
  apart, all on land, none overlapping.
- Regression 11/11 green, zero errors.

## AREA4 — Volcanic Foundry + INFERNO (Sep 2026)
New content batch: AREA 04 VOLCANIC FOUNDRY (waves 14+, endless), 3 foes, 4th boss.
- 5 new assets (bg-volcano, boss-fortress, enemy-artillery/bomber/interceptor): keyed,
  trimmed, embedded (file 2.27MB -> 3.03MB). Volcano tile mirror-wrapped 450x1004.
- Foes 13 artillery (ground, hp3), 14 bomber (air heavy, hp5), 15 interceptor (air fast,
  diver). Stage-4 pool [9,10,11,13,14,15] + harder 11-pattern script. AIR lists + dive
  list extended; drawFoe branches to arty/bomber/ceptor bases.
- INFERNO (VOLCANO FORTRESS, wave 20+, def3): hp85, wide sway, rotating-fan + aimed
  phase 1, double ring + 5-aimed + beams phase 2. makeBoss cap 2->3. Card/HP bar/score
  all table-driven (no changes needed).
- Stage 4 all-land: landlock gate shortcut (like desert). Footer hint fixed: manual
  "1-7 WEAPON" -> "PICKUPS ARM GUNS" (stale since RAIDEN2).
- E2E test_area4.py: AREA 04 announce, volc tile, types 13-15 sighted, INFERNO card +
  both phases, wave 21 continues stage 4. Regression 12/12 green, zero errors.
