# GUI Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Redesign all GUI elements in NEON BLASTER with a full cyberpunk/neon aesthetic — animated HUD, weapon bar with fill bars and cooldown arcs, glitch title screen, and dramatic in-game overlays.

**Architecture:** All changes are in the single file `shooter.html`. CSS additions go in the `<style>` block. HTML changes replace existing elements. JS changes extend `updateHUD`, `updateWeaponBar`, and the game loop. No external dependencies.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D API

---

## File Map

- Modify: `C:\Users\voonk\OneDrive\Desktop\Shooting Games\shooter.html` (all tasks)

---

## Task 1: CSS Foundations — All New Keyframes and Styles

Add every new CSS rule and animation needed by later tasks. Do this first so later tasks just add HTML/JS without touching CSS again.

**Files:**
- Modify: `shooter.html` — `<style>` block

- [ ] **Step 1: Add keyframes and new CSS rules**

Find the closing `</style>` tag and insert the following block immediately before it:

```css
  /* ── GUI Overhaul Additions ─────────────────────────── */
  @keyframes wave-flicker {
    0%,100%{opacity:1} 30%{opacity:0.7} 60%{opacity:0.85} 80%{opacity:1}
  }
  @keyframes hp-shimmer {
    0%,100%{filter:brightness(1)} 50%{filter:brightness(1.35)}
  }
  @keyframes hud-sweep {
    0%{background-position:200% 0} 100%{background-position:-200% 0}
  }
  @keyframes slot-pulse {
    0%,100%{box-shadow:0 0 8px currentColor} 50%{box-shadow:0 0 22px currentColor,0 0 40px currentColor}
  }
  @keyframes glitch {
    0%,89%,100%{text-shadow:0 0 20px var(--neon-cyan),0 0 60px rgba(0,245,255,0.5); transform:none}
    90%{text-shadow:-3px 0 #ff006e,3px 0 #00f5ff,0 0 20px var(--neon-cyan); transform:translateX(-2px)}
    92%{text-shadow:3px 0 #ff006e,-3px 0 #00f5ff,0 0 20px var(--neon-cyan); transform:translateX(2px)}
    94%{text-shadow:0 0 20px var(--neon-cyan); transform:translateX(0)}
  }
  @keyframes overlay-in {
    from{opacity:0;transform:translateY(10px)} to{opacity:1;transform:translateY(0)}
  }
  @keyframes gold-flash {
    0%,100%{color:var(--neon-yellow)} 50%{color:#fff}
  }
  @keyframes score-pop {
    from{transform:scale(1.2)} to{transform:scale(1)}
  }
  @keyframes float-up {
    to{opacity:0;transform:translateY(-40px)}
  }

  /* HP bar */
  #hp-bar { display:flex; gap:4px; align-items:center; }
  .hp-seg {
    width:24px; height:14px; border-radius:2px;
    background:rgba(255,0,110,0.1); border:1px solid rgba(255,0,110,0.3);
    transition:background 0.3s, box-shadow 0.3s;
  }
  .hp-seg.alive {
    background:var(--neon-pink);
    box-shadow:0 0 8px var(--neon-pink);
    animation:hp-shimmer 2s ease-in-out infinite;
  }

  /* HUD sweep border */
  #hud { position:relative; }
  #hud::after {
    content:''; position:absolute; bottom:0; left:0; width:100%; height:1px;
    background:linear-gradient(90deg,transparent,var(--neon-cyan),var(--neon-purple),transparent);
    background-size:200% 1px;
    animation:hud-sweep 3s linear infinite;
  }

  /* Wave flicker */
  #wave-display { animation:wave-flicker 1.8s ease-in-out infinite; }

  /* SFX button */
  #sfx-btn {
    background:transparent; border:1px solid var(--neon-cyan);
    color:var(--neon-cyan); font-family:'Share Tech Mono',monospace;
    font-size:10px; letter-spacing:2px; padding:3px 8px;
    cursor:pointer; pointer-events:all; border-radius:3px;
    transition:all 0.2s;
  }
  #sfx-btn.muted { border-color:rgba(0,245,255,0.25); color:rgba(0,245,255,0.25); }
  #sfx-btn:hover { background:rgba(0,245,255,0.1); }

  /* Enemy counter */
  #enemy-count { font-size:9px; color:rgba(0,245,255,0.5); letter-spacing:2px; margin-top:2px; }

  /* Weapon bar slots */
  .weapon-slot { min-height:72px; padding:6px 12px; position:relative; }
  .weapon-slot.active { animation:slot-pulse 1s ease-in-out infinite; }
  .weapon-slot.has-ammo { border-bottom:2px solid currentColor; opacity:0.65; }

  /* Ammo fill bar */
  .ammo-wrap { display:flex; flex-direction:column; align-items:center; gap:2px; }
  .ammo-bar {
    width:22px; height:30px; border:1px solid currentColor;
    border-radius:2px; overflow:hidden; opacity:0.7;
    display:flex; align-items:flex-end;
  }
  .ammo-fill {
    width:100%; background:currentColor;
    transition:height 0.15s ease-out;
  }
  .ammo-num { font-family:'Orbitron',monospace; font-size:9px; font-weight:700; }

  /* Key badge */
  .key-badge {
    position:absolute; top:3px; right:3px;
    font-size:7px; opacity:0.4; border:1px solid currentColor;
    padding:1px 3px; border-radius:2px; line-height:1;
  }

  /* Cooldown arc overlay on slot */
  .weapon-slot::before {
    content:''; position:absolute; inset:6px;
    border-radius:50%;
    background:conic-gradient(rgba(255,255,255,0.3) 0% var(--cd,0%), transparent var(--cd,0%) 100%);
    pointer-events:none; z-index:2;
  }

  /* Score digit rolling */
  #score-display { display:flex; gap:0; overflow:hidden; }
  .score-digit {
    font-family:'Orbitron',monospace; font-size:20px; font-weight:900;
    color:var(--neon-cyan); text-shadow:0 0 10px var(--neon-cyan),0 0 30px rgba(0,245,255,0.4);
    display:inline-block; width:0.62em; text-align:center;
    transition:transform 0.25s ease-out;
  }

  /* Overlay entry animation */
  #overlay:not(.hidden) { animation:overlay-in 0.3s ease-out; }

  /* Glitch title */
  .overlay-title { animation:glitch 4s ease-in-out infinite, pulse 2s ease-in-out infinite; }

  /* Neon separator */
  .neon-sep {
    width:340px; height:1px;
    background:linear-gradient(90deg,transparent,var(--neon-cyan),transparent);
    box-shadow:0 0 8px var(--neon-cyan);
  }

  /* Gold hi-score */
  #hi-score-display {
    font-family:'Orbitron',monospace; font-size:14px;
    color:var(--neon-yellow);
    text-shadow:0 0 15px var(--neon-yellow),0 0 40px rgba(255,190,11,0.3);
    letter-spacing:3px;
  }
  #hi-score-display.pop { animation:score-pop 0.4s ease-out; }

  /* Game over retry button — red */
  #overlay .retry-btn {
    margin-top:6px; padding:13px 40px;
    background:transparent; border:2px solid var(--neon-pink);
    color:var(--neon-pink); font-family:'Orbitron',monospace;
    font-size:14px; font-weight:700; letter-spacing:4px;
    cursor:pointer; pointer-events:all; text-transform:uppercase;
    transition:all 0.2s;
    box-shadow:0 0 20px rgba(255,0,110,0.2),inset 0 0 20px rgba(255,0,110,0.05);
  }
  #overlay .retry-btn:hover { background:var(--neon-pink); color:var(--bg); box-shadow:0 0 40px rgba(255,0,110,0.6); transform:scale(1.04); }

  /* Damage vignette */
  #damage-vignette {
    position:absolute; inset:0; pointer-events:none; opacity:0;
    background:radial-gradient(ellipse at center, transparent 40%, rgba(255,0,110,0.55) 100%);
    transition:opacity 0.3s ease-out;
  }

  /* Boss flash overlay */
  #boss-flash {
    position:absolute; inset:0; pointer-events:none; opacity:0;
    background:rgba(255,0,0,0.15);
    transition:opacity 1.5s ease-out;
  }

  /* Pickup announce — right-side slide */
  #pickup-announce {
    position:absolute; right:12px; top:50%; left:auto;
    transform:translateY(-50%) translateX(140px);
    font-family:'Orbitron',monospace; font-size:15px; font-weight:900;
    letter-spacing:3px; pointer-events:none; opacity:0; z-index:10; white-space:nowrap;
  }

  /* Wave banner scale entry */
  #level-announce { transition:transform 0.15s ease-out; }

  /* Canvas boss border */
  canvas.boss-warning {
    box-shadow:0 0 40px rgba(255,0,110,0.6),0 0 60px rgba(255,0,110,0.2) !important;
  }
```

- [ ] **Step 2: Remove the old `.weapon-slot.active` static box-shadow rule**

Find in the existing CSS:
```css
  .weapon-slot.active {
    opacity:1; border-color:currentColor;
    box-shadow:0 0 10px currentColor;
    transform:scale(1.06);
  }
```
Replace with (keep opacity/border but remove box-shadow and scale — the new animation handles those):
```css
  .weapon-slot.active {
    opacity:1; border-color:currentColor;
  }
```

- [ ] **Step 3: Verify in browser**

Open `shooter.html`. The page should load without visual regressions. No new visible changes yet — CSS only.

---

## Task 2: HUD HTML Restructure

Replace hearts with HP bar, add enemy counter, swap mute indicator for SFX button.

**Files:**
- Modify: `shooter.html` — HUD HTML block

- [ ] **Step 1: Replace the Lives block**

Find:
```html
    <div class="hud-block" style="align-items:center">
      <div class="hud-label" style="text-align:center">Lives</div>
      <div id="lives-display">
        <span class="heart" id="h1">♥</span>
        <span class="heart" id="h2">♥</span>
        <span class="heart" id="h3">♥</span>
      </div>
    </div>
```

Replace with:
```html
    <div class="hud-block" style="align-items:center">
      <div class="hud-label" style="text-align:center">HP</div>
      <div id="hp-bar">
        <div class="hp-seg alive" id="hp0"></div>
        <div class="hp-seg alive" id="hp1"></div>
        <div class="hp-seg alive" id="hp2"></div>
      </div>
    </div>
```

- [ ] **Step 2: Replace mute display with SFX button**

Find:
```html
    <div class="hud-block">
      <div class="hud-label">Sound</div>
      <div class="hud-value" id="mute-display" style="font-size:16px">🔊</div>
    </div>
```

Replace with:
```html
    <div class="hud-block" style="align-items:flex-end">
      <div class="hud-label">Sound</div>
      <button id="sfx-btn" onclick="audioEnabled=!audioEnabled;updateHUD()">◉ SFX</button>
    </div>
```

- [ ] **Step 3: Add enemy counter below wave display**

Find:
```html
    <div class="hud-block" style="align-items:flex-end">
      <div class="hud-label">Wave</div>
      <div class="hud-value" id="wave-display">01</div>
    </div>
```

Replace with:
```html
    <div class="hud-block" style="align-items:flex-end">
      <div class="hud-label">Wave</div>
      <div class="hud-value" id="wave-display">01</div>
      <div id="enemy-count"></div>
    </div>
```

- [ ] **Step 4: Update `updateHUD` to use new elements**

Find the `updateHUD` function and replace it entirely:

```js
function updateHUD() {
  document.getElementById('wave-display').textContent = pad(wave,2);
  // HP segments
  ['hp0','hp1','hp2'].forEach((id,i)=>{
    const seg=document.getElementById(id);
    if(seg) seg.classList.toggle('alive', i<lives);
  });
  // SFX button
  const sfxBtn=document.getElementById('sfx-btn');
  if(sfxBtn){ sfxBtn.textContent=audioEnabled?'◉ SFX':'○ SFX'; sfxBtn.classList.toggle('muted',!audioEnabled); }
  // Best score
  const best=document.getElementById('best-display');
  if(best) best.textContent=pad(Math.max(score,getHiScore()));
  if(score>getHiScore()&&score>0) setHiScore(score);
  // Enemy counter
  const ec=document.getElementById('enemy-count');
  if(ec){
    const alive=enemies.filter(e=>e.alive).length;
    const isBoss=wave%5===0;
    ec.style.display=(boss||isBoss||alive===0)?'none':'block';
    ec.textContent=alive+' LEFT';
  }
  updateWeaponBar();
  updateScoreDisplay();
}
```

- [ ] **Step 5: Verify in browser**

Start the game. HUD should show 3 pink HP segments instead of hearts. Wave has a flicker. SFX button toggles on M key or click. Enemy count appears below wave during normal waves.

---

## Task 3: Animated Score Counter

Replace the plain score text with digit-by-digit rolling spans.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Replace score-display HTML**

Find:
```html
      <div class="hud-value" id="score-display">000000</div>
```

Replace with:
```html
      <div class="hud-value" id="score-display"><span class="score-digit">0</span><span class="score-digit">0</span><span class="score-digit">0</span><span class="score-digit">0</span><span class="score-digit">0</span><span class="score-digit">0</span></div>
```

- [ ] **Step 2: Add `updateScoreDisplay` function**

Add this function immediately after `updateHUD`:

```js
let _prevScore = 0;
function updateScoreDisplay() {
  const s = pad(score);
  const prev = pad(_prevScore);
  const spans = document.querySelectorAll('#score-display .score-digit');
  spans.forEach((sp, i) => {
    if (s[i] !== prev[i]) {
      sp.style.transform = 'translateY(-100%)';
      sp.style.transition = 'none';
      requestAnimationFrame(() => {
        sp.textContent = s[i];
        sp.style.transition = 'transform 0.25s ease-out';
        sp.style.transform = 'translateY(0)';
      });
    } else {
      sp.textContent = s[i];
    }
  });
  _prevScore = score;
}
```

- [ ] **Step 3: Call `updateScoreDisplay` in `startGame`**

In `startGame`, after `updateHUD()` add:
```js
_prevScore = 0; updateScoreDisplay();
```

- [ ] **Step 4: Verify in browser**

Kill enemies — score digits should roll upward individually as points are added.

---

## Task 4: Weapon Bar — Ammo Fill Bars, Key Badges

Restructure weapon slot HTML to show fill-bar ammo indicators and key number badges.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Replace weapon bar HTML**

Find the entire `<div id="weapon-bar">...</div>` block and replace it with:

```html
  <div id="weapon-bar">
    <div class="weapon-slot active w-normal" id="ws-normal" onclick="selectWeapon('normal')">
      <span class="key-badge">1</span>
      <div class="weapon-icon">🔵</div>
      <div class="weapon-name">Normal</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-normal"><div class="ammo-fill" id="ammo-fill-normal" style="height:100%"></div></div>
        <div class="ammo-num">∞</div>
      </div>
    </div>
    <div class="weapon-divider"></div>
    <div class="weapon-slot w-spread" id="ws-spread" onclick="selectWeapon('spread')">
      <span class="key-badge">2</span>
      <div class="weapon-icon">🌟</div>
      <div class="weapon-name">Spread</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-spread"><div class="ammo-fill" id="ammo-fill-spread" style="height:0%"></div></div>
        <div class="ammo-num" id="ammo-spread">0</div>
      </div>
    </div>
    <div class="weapon-slot w-laser" id="ws-laser" onclick="selectWeapon('laser')">
      <span class="key-badge">3</span>
      <div class="weapon-icon">⚡</div>
      <div class="weapon-name">Laser</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-laser"><div class="ammo-fill" id="ammo-fill-laser" style="height:0%"></div></div>
        <div class="ammo-num" id="ammo-laser">0</div>
      </div>
    </div>
    <div class="weapon-slot w-bomb" id="ws-bomb" onclick="selectWeapon('bomb')">
      <span class="key-badge">4</span>
      <div class="weapon-icon">💜</div>
      <div class="weapon-name">Nova</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-bomb"><div class="ammo-fill" id="ammo-fill-bomb" style="height:0%"></div></div>
        <div class="ammo-num" id="ammo-bomb">0</div>
      </div>
    </div>
    <div class="weapon-divider"></div>
    <div class="weapon-slot w-shield" id="ws-shield" onclick="selectWeapon('shield')">
      <span class="key-badge">5</span>
      <div class="weapon-icon">🛡️</div>
      <div class="weapon-name">Shield</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-shield"><div class="ammo-fill" id="ammo-fill-shield" style="height:0%"></div></div>
        <div class="ammo-num" id="ammo-shield">0</div>
      </div>
    </div>
    <div class="weapon-slot w-homing" id="ws-homing" onclick="selectWeapon('homing')">
      <span class="key-badge">6</span>
      <div class="weapon-icon">🎯</div>
      <div class="weapon-name">Homing</div>
      <div class="ammo-wrap">
        <div class="ammo-bar w-homing"><div class="ammo-fill" id="ammo-fill-homing" style="height:0%"></div></div>
        <div class="ammo-num" id="ammo-homing">0</div>
      </div>
    </div>
  </div>
```

- [ ] **Step 2: Update `updateWeaponBar` to drive fill bars**

Replace the entire `updateWeaponBar` function:

```js
const WEAPON_MAX_AMMO = { normal:1, spread:8, laser:5, bomb:2, shield:1, homing:3 };
const WEAPON_MAX_CD   = { normal:0.22, spread:0.28, laser:0.55, bomb:1.0, shield:4.5, homing:0.4 };

function updateWeaponBar(){
  const ammos = { spread:WEAPONS.spread.ammo, laser:WEAPONS.laser.ammo, bomb:WEAPONS.bomb.ammo,
                  shield:WEAPONS.shield.ammo, homing:WEAPONS.homing.ammo };
  // text + fill bar
  ['spread','laser','bomb','shield','homing'].forEach(w=>{
    const n=ammos[w];
    document.getElementById('ammo-'+w).textContent = n;
    const fill=document.getElementById('ammo-fill-'+w);
    if(fill){
      const pct=Math.min(n/WEAPON_MAX_AMMO[w],1)*100;
      fill.style.height=pct+'%';
    }
  });
  // active / has-ammo classes
  ['normal','spread','laser','bomb','shield','homing'].forEach(w=>{
    const el=document.getElementById('ws-'+w);
    el.classList.toggle('active', w===currentWeapon);
    el.classList.toggle('has-ammo', w!=='normal'&&WEAPONS[w].ammo>0);
  });
}
```

- [ ] **Step 3: Verify in browser**

Collect weapon pickups — the fill bars should rise. Key number badges should appear in the corner of each slot. Active slot pulses with an animated glow.

---

## Task 5: Cooldown Arc

Show a conic-gradient arc overlay on the active weapon slot indicating remaining shoot cooldown.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add cooldown arc update to the game loop**

In the `loop` function, inside `if(state==='playing'){...}`, add after `if(shootCooldown>0) shootCooldown-=dt;`:

```js
    // Cooldown arc on active weapon slot
    const cdEl=document.getElementById('ws-'+currentWeapon);
    if(cdEl){
      const maxCd=WEAPON_MAX_CD[currentWeapon]||0.22;
      const pct=shootCooldown>0 ? Math.min(shootCooldown/maxCd,1)*100 : 0;
      cdEl.style.setProperty('--cd', pct.toFixed(1)+'%');
    }
```

- [ ] **Step 2: Clear arc when weapon changes**

In `selectWeapon`, after `currentWeapon=w; updateWeaponBar();` add:

```js
  ['normal','spread','laser','bomb','shield','homing'].forEach(w2=>{
    const el=document.getElementById('ws-'+w2);
    if(el) el.style.setProperty('--cd','0%');
  });
```

- [ ] **Step 3: Verify in browser**

Fire any weapon — a white arc should sweep clockwise over the slot icon showing the cooldown, then disappear when ready to fire. Nova bomb has the longest arc (1s).

---

## Task 6: Start / Game Over Screen

Add glitch animation to title, neon separators, full 6-weapon showcase, gold hi-score, and red retry button.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Replace start overlay content**

Find the `<div id="overlay">` block and replace its inner content:

```html
    <div id="overlay">
      <div class="overlay-title">NEON BLASTER</div>
      <div class="overlay-sub">Destroy enemies · collect weapon drops</div>
      <div id="hi-score-display"></div>
      <div class="neon-sep"></div>
      <div class="overlay-weapons">
        <div class="ow-item"><span>🔵</span><span class="w-normal">NORMAL</span><span style="color:rgba(255,255,255,0.35)">Infinite ammo</span></div>
        <div class="ow-item"><span>🌟</span><span class="w-spread">SPREAD</span><span style="color:rgba(255,255,255,0.35)">5-way burst</span></div>
        <div class="ow-item"><span>⚡</span><span class="w-laser">LASER</span><span style="color:rgba(255,255,255,0.35)">Pierce column</span></div>
        <div class="ow-item"><span>💜</span><span class="w-bomb">NOVA</span><span style="color:rgba(255,255,255,0.35)">Clear screen</span></div>
        <div class="ow-item"><span>🛡️</span><span class="w-shield">SHIELD</span><span style="color:rgba(255,255,255,0.35)">Absorb hits</span></div>
        <div class="ow-item"><span>🎯</span><span class="w-homing">HOMING</span><span style="color:rgba(255,255,255,0.35)">Track targets</span></div>
      </div>
      <div class="neon-sep"></div>
      <button id="start-btn" onclick="startGame()">LAUNCH</button>
      <div style="font-size:10px;color:rgba(255,255,255,0.22);letter-spacing:2px;animation:blink 1.2s step-end infinite">← → MOVE · SPACE FIRE · 1–6 WEAPON</div>
    </div>
```

- [ ] **Step 2: Add pop animation to hi-score on load**

Find the bottom of the script, the section that shows the hi-score on page load:
```js
const hs=getHiScore();
if(hs>0) document.getElementById('hi-score-display').textContent=`BEST  ${pad(hs)}`;
```

Replace with:
```js
const hs=getHiScore();
const hsEl=document.getElementById('hi-score-display');
if(hs>0&&hsEl){ hsEl.textContent=`★ BEST  ${pad(hs)}`; hsEl.classList.add('pop'); }
```

- [ ] **Step 3: Update `gameOver` to use glitch title and red retry button**

Find the `gameOver` function and replace `ov.innerHTML=...`:

```js
  ov.innerHTML=`
    <div class="overlay-title" style="font-size:34px">GAME OVER</div>
    <div class="overlay-score">SCORE &nbsp; ${pad(score)}</div>
    ${isNewBest?'<div style="font-family:\'Orbitron\',monospace;font-size:16px;letter-spacing:4px;animation:gold-flash 0.4s ease-in-out infinite">★ NEW BEST! ★</div>':''}
    <div class="overlay-sub">Wave ${pad(wave,2)} reached</div>
    <button class="retry-btn" onclick="startGame()">RETRY</button>
  `;
```

- [ ] **Step 4: Verify in browser**

The title should glitch every ~4 seconds. Both separator lines appear. All 6 weapons shown. Gold hi-score with ★ prefix. Game over shows red RETRY button.

---

## Task 7: Floating Kill Text

Render floating `+30` style text above killed enemies on the canvas.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add `floatTexts` array**

After `let homingBullets = [];` add:
```js
let floatTexts = [];
```

- [ ] **Step 2: Add `spawnFloatText` function**

After `spawnShockwave`:
```js
function spawnFloatText(x, y, text, color){
  floatTexts.push({ x, y, text, color, life:0.6, maxLife:0.6, vy:-55 });
}
```

- [ ] **Step 3: Wire `spawnFloatText` to kill events**

In `checkCollisions`, find where `e.alive=false; score+=e.points;` is set and add:
```js
spawnFloatText(e.x, e.y-14, '+'+e.points, e.color);
```

In `killBoss`, after `score+=500+wave*20;` add:
```js
spawnFloatText(b.x, b.y-30, '+'+(500+wave*20), '#bf5fff');
```

- [ ] **Step 4: Update and draw `floatTexts` in the loop**

In the update section (`if(state==='playing'){...}`), add after `particles=particles.filter(...)`:
```js
    floatTexts.forEach(f=>{ f.y+=f.vy*dt; f.life-=dt; });
    floatTexts=floatTexts.filter(f=>f.life>0);
```

Add a `drawFloatTexts()` function after `drawShockwaves`:
```js
function drawFloatTexts(){
  floatTexts.forEach(f=>{
    const a=f.life/f.maxLife;
    ctx.save();
    ctx.globalAlpha=a;
    ctx.fillStyle=f.color;
    ctx.shadowColor=f.color; ctx.shadowBlur=8;
    ctx.font='bold 13px Orbitron, monospace';
    ctx.textAlign='center'; ctx.textBaseline='middle';
    ctx.fillText(f.text, f.x, f.y);
    ctx.restore();
  });
}
```

In the draw section (inside the shake `ctx.save/translate` block), add `drawFloatTexts();` after `drawShockwaves();`.

- [ ] **Step 5: Reset `floatTexts` in `startGame`**

Add `floatTexts=[];` alongside other array resets.

- [ ] **Step 6: Verify in browser**

Kill enemies — colored `+30`, `+20`, etc. text should float upward from each kill and fade out.

---

## Task 8: Damage Vignette + Boss Flash + Boss Canvas Border

Add a red edge vignette on player hit, and a dramatic red overlay + border on boss warning.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add HTML overlay elements**

Find `<div id="pickup-announce"></div>` and add after it:
```html
    <div id="damage-vignette"></div>
    <div id="boss-flash"></div>
```

- [ ] **Step 2: Wire damage vignette to `hitPlayer`**

In `hitPlayer`, after `playSound('playerHit');` add:
```js
  const vign=document.getElementById('damage-vignette');
  if(vign){ vign.style.transition='none'; vign.style.opacity='1';
    requestAnimationFrame(()=>{ vign.style.transition='opacity 0.35s ease-out'; vign.style.opacity='0'; }); }
```

- [ ] **Step 3: Wire boss flash + canvas border to `nextWave`**

In `nextWave`, find the `isBossWave` branch inside the setTimeout:
```js
      if(isBossWave){
        playSound('bossWarning');
        enemies=[]; boss=makeBoss(); bossShootTimer=1.5;
```

Add before `enemies=[]`:
```js
        const bf=document.getElementById('boss-flash');
        if(bf){ bf.style.transition='none'; bf.style.opacity='1';
          requestAnimationFrame(()=>{ bf.style.transition='opacity 1.5s ease-out'; bf.style.opacity='0'; }); }
        const cv=document.getElementById('c');
        cv.classList.add('boss-warning');
        setTimeout(()=>cv.classList.remove('boss-warning'), 1800);
```

- [ ] **Step 4: Verify in browser**

Get hit — red vignette flashes from screen edges. Reach wave 5 — red screen flash and red canvas border glow during WARNING.

---

## Task 9: Pickup Slide-In + Wave Banner Scale

Polish the pickup popup and wave banner entrance animation.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Update `showPickup` for slide-in from right**

Find the `showPickup` function and replace it entirely:

```js
function showPickup(type){
  playSound('pickup');
  const el=document.getElementById('pickup-announce');
  el.textContent=DROP_NAMES[type];
  el.style.color=DROP_COLORS[type];
  el.style.textShadow=`0 0 20px ${DROP_COLORS[type]}`;
  // reset then slide in
  el.style.transition='none';
  el.style.opacity='0';
  el.style.transform='translateY(-50%) translateX(140px)';
  requestAnimationFrame(()=>{
    el.style.transition='transform 0.2s ease-out, opacity 0.2s ease-out';
    el.style.opacity='1';
    el.style.transform='translateY(-50%) translateX(0)';
    setTimeout(()=>{
      el.style.transition='transform 0.2s ease-in, opacity 0.2s ease-in';
      el.style.opacity='0';
      el.style.transform='translateY(-50%) translateX(140px)';
    }, 900);
  });
}
```

- [ ] **Step 2: Add scale-in to wave banner in `nextWave`**

In `nextWave`, find:
```js
  el.style.opacity=1; el.style.transition='';
```

Add after it:
```js
  el.style.transform='scale(1.4)';
  requestAnimationFrame(()=>{ el.style.transition='opacity 0s, transform 0.15s ease-out'; el.style.transform='scale(1)'; });
```

And find the fade-out timeout where `el.style.opacity=0`:
```js
    el.style.transition='opacity 0.5s'; el.style.opacity=0;
```
Change to:
```js
    el.style.transition='opacity 0.5s, transform 0.5s'; el.style.opacity=0; el.style.transform='scale(0.9)';
```

- [ ] **Step 3: Verify in browser**

Collect a pickup — it slides in from the right edge of the canvas with a glow, holds, then slides back out. Clear a wave — the banner scales down from 1.4× to 1× on entry, then fades and shrinks on exit.

---

## Self-Review

### Spec Coverage

| Spec requirement | Task |
|-----------------|------|
| Animated rolling score | Task 3 |
| HP bar replaces hearts | Task 2 |
| Enemy counter | Task 2 |
| Wave flicker | Task 1 (CSS) |
| SFX toggle button | Task 2 |
| HUD bottom border sweep | Task 1 (CSS) |
| Slot height 72px | Task 1 (CSS) |
| Ammo fill bars | Task 4 |
| Active weapon pulse | Task 1 (CSS) |
| Has-ammo bottom border | Task 1 (CSS) |
| Key badge numbers | Task 4 |
| Cooldown arc | Task 5 |
| Glitch title animation | Task 1 (CSS) + Task 6 |
| Neon separators | Task 6 |
| 6-weapon showcase | Task 6 |
| Gold hi-score display | Task 6 |
| Game over glitch + red retry | Task 6 |
| Overlay entry animation | Task 1 (CSS) |
| Floating kill text | Task 7 |
| Pickup slide-in | Task 9 |
| Boss warning flash | Task 8 |
| Wave banner scale-in | Task 9 |
| Damage vignette | Task 8 |

All 23 spec requirements covered. ✓

### Placeholder Scan

No TBDs, TODOs, or vague steps. All code blocks complete. ✓

### Type Consistency

- `floatTexts` array declared Task 7, reset in `startGame` Task 7, used in loop Task 7 ✓
- `WEAPON_MAX_AMMO` and `WEAPON_MAX_CD` defined in Task 4, used in Task 5 ✓
- `updateScoreDisplay()` defined Task 3, called from `updateHUD` Task 2 ✓
- HP segment IDs `hp0/hp1/hp2` set in Task 2 HTML, read in `updateHUD` Task 2 ✓
- `ammo-fill-*` element IDs set in Task 4 HTML, written in `updateWeaponBar` Task 4 ✓
