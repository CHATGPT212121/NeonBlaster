# NEON BLASTER — Full Overhaul Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Transform the existing NEON BLASTER Space Invaders clone into a polished game with bosses, new enemy types, 2 new weapons, power-ups, parallax stars, screen shake, synthesized audio, and high score tracking — all in a single HTML file.

**Architecture:** All changes go into `C:\Users\voonk\OneDrive\Desktop\Shooting Games\shooter.html`. No build tools or external dependencies. Each task adds a self-contained feature, verified by opening the file in a browser. Tasks build on each other in order — do not skip.

**Tech Stack:** Vanilla HTML/CSS/JS, Canvas 2D API, Web Audio API, localStorage

---

## File Map

- Modify: `C:\Users\voonk\OneDrive\Desktop\Shooting Games\shooter.html` (all tasks)

---

## Task 1: Parallax Star Field

Replace the static scanline `drawStars()` with a 3-layer scrolling parallax star field that runs on the menu and during gameplay.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add `stars` state variable and `initStars()` function**

Find this block (around line 199):
```js
let state = 'menu';
let score=0, wave=1, lives=3;
```

Add `let stars = [];` on the line after `let state = 'menu';`.

Then find the `makePlayer` function and add `initStars` immediately before it:

```js
function initStars() {
  const layers = [
    { count:80, size:1,   speed:15, alpha:0.25 },
    { count:40, size:1.5, speed:30, alpha:0.45 },
    { count:15, size:2.5, speed:55, alpha:0.7  },
  ];
  const arr = [];
  layers.forEach(l => {
    for (let i=0; i<l.count; i++)
      arr.push({ x:Math.random()*W, y:Math.random()*H, size:l.size, speed:l.speed, alpha:l.alpha });
  });
  return arr;
}
```

- [ ] **Step 2: Replace `drawStars()` with the new version**

Find and replace the entire `drawStars` function:
```js
// OLD:
function drawStars(){
  ctx.fillStyle='rgba(0,245,255,0.017)';
  for(let y=0;y<H;y+=4) ctx.fillRect(0,y,W,1);
}
```

Replace with:
```js
function drawStars(dt){
  stars.forEach(s=>{
    s.y += s.speed * dt;
    if(s.y > H) s.y = -s.size;
    ctx.save();
    ctx.globalAlpha = s.alpha;
    ctx.fillStyle = '#00f5ff';
    ctx.beginPath(); ctx.arc(s.x, s.y, s.size, 0, Math.PI*2); ctx.fill();
    ctx.restore();
  });
}
```

- [ ] **Step 3: Pass `dt` to `drawStars` in the loop and initialize stars at startup**

In the `loop` function, find `drawStars();` and change it to `drawStars(dt);`.

Then add `stars = initStars();` as the very first line inside `window.startGame` (before `score=0`).

Also add `stars = initStars();` just before `animId = requestAnimationFrame(loop);` at the very bottom of the `<script>` block so stars appear on the menu screen. Then add one call at the end of the script that starts the animation loop for the menu:

```js
// At the very bottom of the script, after all function definitions:
stars = initStars();
lastTime = performance.now();
animId = requestAnimationFrame(ts => {
  const dt = Math.min((ts - lastTime)/1000, 0.05); lastTime = ts;
  ctx.clearRect(0,0,W,H); drawStars(dt);
  animId = requestAnimationFrame(arguments.callee);
});
```

Wait — the existing code doesn't run the loop on the menu. Simpler: just initialize stars once and call `drawStars(0)` once after the canvas is ready. Instead, just add `stars = initStars();` at the bottom of the script (after all function defs). The loop already calls `drawStars(dt)` while playing. Stars won't scroll on menu — that's fine.

Actually, do this: in the `loop` function the first two lines are:
```js
if(state!=='playing'&&state!=='dead') return;
const dt=...
```

Change to:
```js
const dt=Math.min((ts-lastTime)/1000,0.05); lastTime=ts;
ctx.clearRect(0,0,W,H); drawStars(dt);
if(state!=='playing'&&state!=='dead'){ animId=requestAnimationFrame(loop); return; }
```

And remove the `ctx.clearRect(0,0,W,H); drawStars();` that currently appears later in the loop body.

Also add `stars = initStars();` at the bottom of the script and call `lastTime=performance.now(); animId=requestAnimationFrame(loop);` at the bottom so the loop starts immediately (currently `startGame` starts the loop — we want stars on the menu too).

Full replacement for the top of `loop`:
```js
function loop(ts){
  const dt=Math.min((ts-lastTime)/1000,0.05); lastTime=ts;
  ctx.clearRect(0,0,W,H); drawStars(dt);
  if(state!=='playing'&&state!=='dead'){ animId=requestAnimationFrame(loop); return; }
  // ... rest of loop unchanged ...
}
```

And remove the old `ctx.clearRect(0,0,W,H); drawStars();` line from the loop body.

At the bottom of the script add:
```js
stars = initStars();
lastTime = performance.now();
animId = requestAnimationFrame(loop);
```

- [ ] **Step 4: Verify in browser**

Open `shooter.html` in a browser. Before pressing LAUNCH, you should see animated scrolling cyan stars on the canvas. During gameplay stars should continue scrolling. If stars are not visible, check that `initStars()` is called and `drawStars(dt)` is called with a non-zero `dt`.

- [ ] **Step 5: Commit**

```
git add "OneDrive/Desktop/Shooting Games/shooter.html"
git commit -m "feat: add 3-layer parallax scrolling star field"
```

(If not using git, save a backup copy of shooter.html before proceeding.)

---

## Task 2: Screen Shake System

Add a screen shake system used by later tasks (player hit, explosions, nova bomb, boss death).

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add shake state and `triggerShake` function**

After `let laserBeams=[], novaFlash=0;` add:
```js
let shake = { mag:0, dur:0 };
```

Add this function near the helper functions (after `updateWeaponBar`):
```js
function triggerShake(mag, dur){
  if(mag > shake.mag){ shake.mag=mag; shake.dur=dur; }
}
```

- [ ] **Step 2: Apply shake in the loop**

In the `loop` function, after `drawStars(dt)` and before the early-return guard, add the shake calculation:
```js
const sx = shake.mag>0 ? (Math.random()-0.5)*shake.mag*2 : 0;
const sy = shake.mag>0 ? (Math.random()-0.5)*shake.mag*2 : 0;
```

Then wrap ALL drawing calls (from `enemies.forEach(e=>e.alive&&drawEnemy(e))` down to `drawPlayer(player)` and the barrier line) inside a `ctx.save(); ctx.translate(sx,sy);` / `ctx.restore();` pair.

Find the drawing section of the loop:
```js
enemies.forEach(e=>e.alive&&drawEnemy(e));
drawDrops();
bullets.forEach(drawBullet);
enemyBullets.forEach(drawEnemyBullet);
particles.forEach(drawParticle);
drawLasers(); drawNovaFlash(); drawPlayer(player);

ctx.save();
ctx.strokeStyle='rgba(0,245,255,0.25)'; ctx.lineWidth=1;
ctx.shadowColor='#00f5ff'; ctx.shadowBlur=8;
ctx.beginPath(); ctx.moveTo(0,H-24); ctx.lineTo(W,H-24); ctx.stroke();
ctx.restore();
```

Replace with:
```js
ctx.save(); ctx.translate(sx, sy);
enemies.forEach(e=>e.alive&&drawEnemy(e));
drawDrops();
bullets.forEach(drawBullet);
enemyBullets.forEach(drawEnemyBullet);
particles.forEach(drawParticle);
drawLasers(); drawNovaFlash(); drawPlayer(player);
ctx.strokeStyle='rgba(0,245,255,0.25)'; ctx.lineWidth=1;
ctx.shadowColor='#00f5ff'; ctx.shadowBlur=8;
ctx.beginPath(); ctx.moveTo(0,H-24); ctx.lineTo(W,H-24); ctx.stroke();
ctx.restore();
```

- [ ] **Step 3: Decay shake each frame**

In the update section of the loop (inside `if(state==='playing'){...}`), add at the end:
```js
if(shake.dur>0){ shake.dur-=dt; shake.mag*=0.88; } else shake.mag=0;
```

- [ ] **Step 4: Wire shake to game events**

In `hitPlayer()`, after `spawnExplosion(player.x,player.y,'#ff006e',16)` add:
```js
triggerShake(8, 0.4);
```

In the nova bomb branch of `shoot()`, after `enemyBullets=[];` add:
```js
triggerShake(14, 0.6);
```

In `spawnExplosion()`, add after the loop:
```js
triggerShake(2, 0.1);
```

- [ ] **Step 5: Verify in browser**

Launch the game. Kill an enemy — subtle shake. Get hit — strong shake. Fire nova bomb — heavy shake. If no shake, verify `triggerShake` is being called and `sx/sy` are applied via `ctx.translate`.

- [ ] **Step 6: Commit**

```
git commit -m "feat: add screen shake system (hit=8, death=2, nova=14)"
```

---

## Task 3: Shockwave Ring on Explosions

Add an expanding ring effect to all explosions.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add shockwaves array**

After `let shake = { mag:0, dur:0 };` add:
```js
let shockwaves = [];
```

- [ ] **Step 2: Add `spawnShockwave` and `drawShockwaves` functions**

Add after `spawnExplosion`:
```js
function spawnShockwave(x, y, color){
  shockwaves.push({ x, y, r:0, maxR:60, life:0.4, maxLife:0.4, color });
}
```

Add after `drawParticle`:
```js
function drawShockwaves(){
  shockwaves.forEach(s=>{
    const a = s.life/s.maxLife;
    ctx.save(); ctx.globalAlpha=a*0.7;
    ctx.strokeStyle=s.color; ctx.shadowColor=s.color; ctx.shadowBlur=10; ctx.lineWidth=2;
    ctx.beginPath(); ctx.arc(s.x, s.y, s.r, 0, Math.PI*2); ctx.stroke();
    ctx.restore();
  });
}
```

- [ ] **Step 3: Update and draw shockwaves in the loop**

In the update section of the loop, after `particles=particles.filter(p=>p.life>0);` add:
```js
shockwaves.forEach(s=>{ s.r+=(s.maxR/s.maxLife)*dt; s.life-=dt; });
shockwaves=shockwaves.filter(s=>s.life>0);
```

In the draw section, add `drawShockwaves();` right after `particles.forEach(drawParticle);`.

- [ ] **Step 4: Spawn shockwave on enemy death and nova bomb**

In `spawnExplosion`, add at the end:
```js
spawnShockwave(x, y, color);
```

In the nova bomb branch of `shoot()`, after `enemyBullets=[];` add:
```js
spawnShockwave(W/2, H/2, '#bf5fff');
```

- [ ] **Step 5: Reset shockwaves on game start**

In `startGame`, add `shockwaves=[];` alongside the other array resets.

- [ ] **Step 6: Verify in browser**

Kill an enemy — you should see an expanding ring flash outward from the explosion point. Nova bomb should show a large centered ring. If rings don't appear, check `drawShockwaves()` is called in the draw section.

- [ ] **Step 7: Commit**

```
git commit -m "feat: add shockwave ring on all explosions"
```

---

## Task 4: Player Thruster Animation & Warp-In Effect

Add animated thruster jets to the player ship and a warp-in scale-up effect on spawn.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add `speedBoost` and `warpIn` to `makePlayer`**

Find `makePlayer` and change the return value to add two new fields:
```js
function makePlayer(){
  return { x:W/2, y:H-44, w:36, h:24, speed:240, color:'#00f5ff', invincible:0,
           speedBoost:0, warpIn:0.4 };
}
```

- [ ] **Step 2: Update `updatePlayer` to handle warp-in and speed boost**

In `updatePlayer`, after `if(p.invincible>0) p.invincible-=dt;` add:
```js
if(p.warpIn>0) p.warpIn-=dt;
if(p.speedBoost>0){
  p.speedBoost-=dt;
  if(p.speedBoost<=0){ p.speedBoost=0; p.speed=240; }
}
```

- [ ] **Step 3: Add thruster jets and warp-in ring to `drawPlayer`**

Find `drawPlayer(p)` and add the following at the very end (after `ctx.restore()`):

```js
// Thruster jets
const jetH = (4+Math.random()*6) * (p.speedBoost>0 ? 2.2 : 1);
ctx.save();
if(p.speedBoost>0){ ctx.shadowColor='#00f5ff'; ctx.shadowBlur=20; }
[-5, 2].forEach(ox=>{
  const jx = p.x+ox, jy = p.y+p.h/4;
  const grad = ctx.createLinearGradient(jx, jy, jx, jy+jetH);
  grad.addColorStop(0, p.speedBoost>0 ? '#00f5ff' : '#ffbe0b');
  grad.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = grad;
  ctx.beginPath(); ctx.ellipse(jx+1.5, jy+jetH/2, 2, jetH/2, 0, 0, Math.PI*2); ctx.fill();
});
ctx.restore();

// Warp-in flash ring
if(p.warpIn>0){
  const progress = 1-(p.warpIn/0.4);
  const ringR = 10+progress*30;
  const alpha = p.warpIn/0.4;
  ctx.save(); ctx.globalAlpha=alpha*0.8;
  ctx.strokeStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=20;
  ctx.lineWidth=3;
  ctx.beginPath(); ctx.arc(p.x, p.y, ringR, 0, Math.PI*2); ctx.stroke();
  ctx.restore();
}
```

- [ ] **Step 4: Verify in browser**

Launch the game. You should see two small flickering flame jets beneath the player ship. They should glow brighter/larger during speed boost (we'll wire speed boost in Task 8). On spawn, a white ring should flash and expand from the player. If jets don't appear, verify the `[-5,2].forEach` block is outside the `if(p.invincible>0 && ...)` early return.

- [ ] **Step 5: Commit**

```
git commit -m "feat: add player thruster animation and warp-in ring effect"
```

---

## Task 5: New Enemy Types (Zigzagger, Armored, Dive-Bomber)

Add three new enemy types that appear from wave 4 onward.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Replace `makeEnemies` with a version that uses a `makeEnemy` helper**

Replace the entire `makeEnemies` function:

```js
function makeEnemy(r, c, type){
  const symbols = ['▲','◆','●','◈','■','▼'];
  const colors  = ['#ff006e','#ffbe0b','#06d6a0','#00f5ff','#ff8c00','#ff2244'];
  const pts     = [30,20,10,40,50,35];
  const hps     = [1,1,1,1,2,1];
  return { x:50+c*50, y:56+r*44, w:28, h:22, alive:true, type,
    points:pts[type], color:colors[type], symbol:symbols[type],
    tick:Math.random()*Math.PI*2, hp:hps[type], maxHp:hps[type],
    diving:false, zigPhase:Math.random()*Math.PI*2 };
}

function makeEnemies(){
  const rows=Math.min(3+Math.floor(wave/2),5), arr=[];
  for(let r=0;r<rows;r++) for(let c=0;c<10;c++){
    let type;
    if(wave<4){
      type = r<1?0 : r<3?1 : 2;
    } else {
      const roll=Math.random();
      if(r===0)          type = roll<0.45 ? 3 : 0;
      else if(r===1)     type = roll<0.30 ? 4 : 1;
      else if(r===rows-1)type = roll<0.35 ? 5 : 2;
      else               type = r<3 ? 1 : 2;
    }
    arr.push(makeEnemy(r, c, type));
  }
  return arr;
}
```

- [ ] **Step 2: Update `updateEnemies` to handle zigzagger and dive-bomber**

Find `enemies.forEach(e=>{ if(!e.alive) return; e.x+=enemyDir*speed; e.tick+=dt*2; if(enemyDropPending) e.y+=14; });` and replace with:

```js
enemies.forEach(e=>{
  if(!e.alive) return;
  e.tick+=dt*2;

  if(e.type===5 && !e.diving){
    // Dive-bomber: random chance to start dive each frame
    const diveChance = Math.min(0.40, 0.15+wave*0.01);
    if(Math.random() < diveChance*dt) e.diving=true;
  }
  if(e.diving){
    e.y += 200*dt;
    if(e.y > H+20) e.alive=false; // missed
    return; // don't do formation movement
  }

  e.x += enemyDir*speed;
  if(e.type===3) e.x += Math.sin(e.zigPhase + e.tick*1.5)*0.8; // zigzag
  if(enemyDropPending) e.y+=14;
});
```

- [ ] **Step 3: Update `checkCollisions` to handle 2-hit armored enemies**

Find the inner `enemies.forEach` inside `checkCollisions`:
```js
enemies.forEach(e=>{
  if(!e.alive) return;
  if(Math.abs(b.x-e.x)<18&&Math.abs(b.y-e.y)<16){
    e.alive=false; b.y=-999; score+=e.points;
    spawnExplosion(e.x,e.y,e.color); trySpawnDrop(e.x,e.y); updateHUD();
  }
});
```

Replace with:
```js
enemies.forEach(e=>{
  if(!e.alive) return;
  if(Math.abs(b.x-e.x)<18&&Math.abs(b.y-e.y)<16){
    b.y=-999;
    e.hp--;
    if(e.hp<=0){
      e.alive=false; score+=e.points;
      spawnExplosion(e.x,e.y,e.color); trySpawnDrop(e.x,e.y);
    } else {
      // Hit but not dead (armored) — small flash
      spawnExplosion(e.x,e.y,'#ffffff',4);
    }
    updateHUD();
  }
});
```

Also update the laser weapon to handle hp:
```js
// In shoot(), laser branch, change:
// e.alive=false; score+=e.points*2;
// To:
e.hp=0; e.alive=false; score+=e.points*2;
```

- [ ] **Step 4: Draw crack overlay for damaged armored enemies**

In `drawEnemy(e)`, add after `ctx.fillText(e.symbol,e.x,e.y)`:
```js
if(e.type===4 && e.hp < e.maxHp){
  ctx.save();
  ctx.strokeStyle='#ffffff'; ctx.lineWidth=1.5; ctx.globalAlpha=0.7;
  ctx.beginPath();
  ctx.moveTo(e.x-4,e.y-5); ctx.lineTo(e.x,e.y-1);
  ctx.lineTo(e.x+5,e.y-4); ctx.moveTo(e.x,e.y-1);
  ctx.lineTo(e.x-2,e.y+5);
  ctx.stroke();
  ctx.restore();
}
```

- [ ] **Step 5: Verify in browser**

Play to wave 4+. You should see:
- Cyan `◈` enemies that wobble horizontally (zigzagger)
- Orange `■` enemies that take 2 hits — first hit shows a crack, second hit kills them
- Red `▼` enemies that occasionally break out and dive straight down

If zigzaggers don't wobble, check the `e.type===3` branch. If armored enemies die in one hit, check `e.hp` is initialized to 2 in `makeEnemy`.

- [ ] **Step 6: Commit**

```
git commit -m "feat: add zigzagger, armored, and dive-bomber enemy types"
```

---

## Task 6: Boss System

Add a boss fight every 5 waves with HP bar, two phases, and an entrance animation.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add boss state variables**

After `let laserBeams=[], novaFlash=0;` add:
```js
let boss=null, bossShootTimer=0;
```

- [ ] **Step 2: Add `makeBoss` function**

Add after `makeEnemies`:
```js
function makeBoss(){
  const hp = 20 + Math.floor(wave/5)*10;
  return { x:W/2, y:-60, targetY:65, w:80, h:50, hp, maxHp:hp,
           phase:1, vx:70, alive:true, tick:0 };
}
```

- [ ] **Step 3: Add `drawBoss` function**

Add after `drawEnemy`:
```js
function drawBoss(){
  if(!boss||!boss.alive) return;
  const b=boss;
  const glowColor = b.phase===2 ? '#ff2244' : '#bf5fff';
  ctx.save();
  ctx.shadowColor=glowColor; ctx.shadowBlur=30+Math.sin(b.tick*3)*10;
  ctx.strokeStyle=glowColor; ctx.lineWidth=3;
  ctx.fillStyle=b.phase===2 ? 'rgba(255,34,68,0.12)' : 'rgba(191,95,255,0.12)';
  ctx.beginPath();
  ctx.moveTo(b.x,       b.y-b.h/2);
  ctx.lineTo(b.x+b.w/2, b.y-b.h/4);
  ctx.lineTo(b.x+b.w/2, b.y+b.h/4);
  ctx.lineTo(b.x,       b.y+b.h/2);
  ctx.lineTo(b.x-b.w/2, b.y+b.h/4);
  ctx.lineTo(b.x-b.w/2, b.y-b.h/4);
  ctx.closePath(); ctx.fill(); ctx.stroke();
  ctx.fillStyle=glowColor; ctx.font='24px monospace';
  ctx.textAlign='center'; ctx.textBaseline='middle';
  ctx.fillText('👾', b.x, b.y);
  // HP bar
  const bw=200, bh=8, bx=W/2-100, by=4;
  ctx.fillStyle='rgba(0,0,0,0.6)'; ctx.shadowBlur=0;
  ctx.fillRect(bx,by,bw,bh);
  ctx.fillStyle=glowColor; ctx.shadowColor=glowColor; ctx.shadowBlur=8;
  ctx.fillRect(bx,by,bw*(b.hp/b.maxHp),bh);
  ctx.strokeStyle='rgba(255,255,255,0.25)'; ctx.lineWidth=1; ctx.shadowBlur=0;
  ctx.strokeRect(bx,by,bw,bh);
  ctx.restore();
}
```

- [ ] **Step 4: Add `updateBoss` and `fireBossShot` functions**

Add after `enemyShoot`:
```js
function updateBoss(dt){
  if(!boss||!boss.alive) return;
  boss.tick+=dt;
  if(boss.y < boss.targetY){ boss.y+=200*dt; return; }
  if(boss.phase===1 && boss.hp<=boss.maxHp*0.5){
    boss.phase=2; triggerShake(6, 0.3);
  }
  boss.x+=boss.vx*dt;
  if(boss.x>W-boss.w/2){ boss.x=W-boss.w/2; boss.vx=-Math.abs(boss.vx); }
  if(boss.x<boss.w/2)  { boss.x=boss.w/2;   boss.vx= Math.abs(boss.vx); }
  bossShootTimer-=dt;
  if(bossShootTimer<=0){ bossShootTimer=boss.phase===1?1.2:0.85; fireBossShot(); }
}

function fireBossShot(){
  if(!boss) return;
  const angles = boss.phase===1 ? [-0.3,0,0.3] : [-0.4,-0.2,0,0.2,0.4];
  const spd=220;
  angles.forEach(a=>{
    enemyBullets.push({ x:boss.x, y:boss.y+boss.h/2,
      vx:Math.sin(a)*spd, vy:Math.cos(a)*spd, color:'#ff2244' });
  });
}
```

- [ ] **Step 5: Add `killBoss` function**

Add after `fireBossShot`:
```js
function killBoss(){
  const b=boss; boss=null;
  score+=500+wave*20; updateHUD();
  triggerShake(14, 0.6);
  spawnExplosion(b.x,b.y,b.phase===2?'#ff2244':'#bf5fff',30);
  spawnShockwave(b.x,b.y,'#bf5fff');
  // Guaranteed health + random weapon drop
  drops.push({ x:b.x-22, y:b.y, type:'health', vy:55, tick:0, collected:false });
  const wt=DROP_TYPES[Math.floor(Math.random()*DROP_TYPES.length)];
  drops.push({ x:b.x+22, y:b.y, type:wt, vy:55, tick:Math.PI, collected:false });
  setTimeout(()=>nextWave(), 800);
}
```

- [ ] **Step 6: Update `nextWave` to spawn boss on wave % 5 === 0**

Replace the entire `nextWave` function:
```js
function nextWave(){
  wave++; updateHUD();
  state='wave_transition';
  const el=document.getElementById('level-announce');
  const isBossWave = wave%5===0;
  el.textContent = isBossWave ? '⚠ WARNING ⚠' : `WAVE ${pad(wave,2)}`;
  el.style.color  = isBossWave ? '#ff006e' : '#ffbe0b';
  el.style.textShadow = `0 0 20px ${isBossWave?'#ff006e':'#ffbe0b'}`;
  el.style.opacity=1; el.style.transition='';
  setTimeout(()=>{
    el.style.transition='opacity 0.5s'; el.style.opacity=0;
    setTimeout(()=>{
      el.style.transition='';
      if(isBossWave){
        enemies=[]; boss=makeBoss(); bossShootTimer=1.5;
      } else {
        enemies=makeEnemies(); enemyDir=1;
      }
      state='playing';
    },500);
  },1500);
}
```

- [ ] **Step 7: Update `updateEnemies` to skip when boss is active**

At the very top of `updateEnemies`, add:
```js
if(boss) return;
```

- [ ] **Step 8: Update `enemyShoot` to skip when boss is active**

At the very top of `enemyShoot`, add:
```js
if(boss) return;
```

- [ ] **Step 9: Update bullet movement to support `vx` (boss uses angled bullets)**

Find in `updateBullets`:
```js
enemyBullets=enemyBullets.filter(b=>b.y<H+10);
enemyBullets.forEach(b=>b.y+=300*dt);
```

Replace with:
```js
enemyBullets=enemyBullets.filter(b=>b.y<H+10&&b.x>-20&&b.x<W+20);
enemyBullets.forEach(b=>{ b.x+=(b.vx||0)*dt; b.y+=(b.vy||300)*dt; });
```

- [ ] **Step 10: Add boss collision in `checkCollisions`**

After the `bullets.forEach` block inside `checkCollisions`, add:
```js
if(boss&&boss.alive&&boss.y>=boss.targetY){
  bullets.forEach(b=>{
    if(Math.abs(b.x-boss.x)<boss.w/2&&Math.abs(b.y-boss.y)<boss.h/2){
      b.y=-999; boss.hp--;
      spawnExplosion(b.x,b.y,'#bf5fff',5);
      if(boss.hp<=0) killBoss();
    }
  });
  if(player.invincible<=0){
    if(Math.abs(player.x-boss.x)<boss.w/2+12&&Math.abs(player.y-boss.y)<boss.h/2+12)
      hitPlayer();
  }
}
```

- [ ] **Step 11: Add `updateBoss` to the game loop and `drawBoss` to the draw section**

In the `loop` update section, add `updateBoss(dt);` alongside the other update calls.

In the draw section, add `drawBoss();` right after `enemies.forEach(e=>e.alive&&drawEnemy(e));`.

- [ ] **Step 12: Reset boss in `startGame`**

Add `boss=null; bossShootTimer=0;` inside `startGame`.

- [ ] **Step 13: Handle `wave_transition` state in loop**

The loop currently returns early if state is not `'playing'` or `'dead'`. Change the guard to also allow rendering during `'wave_transition'`:

The guard should now be:
```js
if(state==='menu') { animId=requestAnimationFrame(loop); return; }
```

And ensure that during `'wave_transition'` and `'dead'` the update block is gated. The existing `if(state==='playing'){...}` update block already handles this — only drawing runs when not playing.

- [ ] **Step 14: Verify in browser**

Play to wave 5. After clearing wave 4, you should see a 1.5s "⚠ WARNING ⚠" pause then a large hexagonal boss slide in from the top with a purple HP bar. It should fire 3-way spread shots. At 50% HP it should switch to 5-way shots. On death: heavy shake, big explosion, two drops appear. Wave 6 should then start normally. If the boss doesn't appear, check `nextWave` and that `boss=makeBoss()` is reached.

- [ ] **Step 15: Commit**

```
git commit -m "feat: add boss fight every 5 waves with 2 phases and HP bar"
```

---

## Task 7: New Weapons — Shield Bubble & Homing Missile

Add Shield (key 5) and Homing Missile (key 6) to the weapon system.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Expand the WEAPONS object**

Find:
```js
const WEAPONS = {
  normal: { ammo:Infinity, color:'#00f5ff' },
  spread: { ammo:0,        color:'#ffbe0b' },
  laser:  { ammo:0,        color:'#ff006e' },
  bomb:   { ammo:0,        color:'#bf5fff' },
};
```

Replace with:
```js
const WEAPONS = {
  normal: { ammo:Infinity, color:'#00f5ff' },
  spread: { ammo:0,        color:'#ffbe0b' },
  laser:  { ammo:0,        color:'#ff006e' },
  bomb:   { ammo:0,        color:'#bf5fff' },
  shield: { ammo:0,        color:'#ffffff' },
  homing: { ammo:0,        color:'#ff8c00' },
};
```

- [ ] **Step 2: Add two new weapon slots to the HTML weapon bar**

Find the `<div id="weapon-keyhint">PRESS 1·2·3·4</div>` line and replace the entire `#weapon-bar` div contents with:

```html
<div id="weapon-bar">
  <div class="weapon-slot active w-normal" id="ws-normal" onclick="selectWeapon('normal')">
    <div class="weapon-icon">🔵</div>
    <div class="weapon-name">Normal</div>
    <div class="weapon-ammo">∞</div>
  </div>
  <div class="weapon-divider"></div>
  <div class="weapon-slot w-spread" id="ws-spread" onclick="selectWeapon('spread')">
    <div class="weapon-icon">🌟</div>
    <div class="weapon-name">Spread</div>
    <div class="weapon-ammo" id="ammo-spread">0</div>
  </div>
  <div class="weapon-slot w-laser" id="ws-laser" onclick="selectWeapon('laser')">
    <div class="weapon-icon">⚡</div>
    <div class="weapon-name">Laser</div>
    <div class="weapon-ammo" id="ammo-laser">0</div>
  </div>
  <div class="weapon-slot w-bomb" id="ws-bomb" onclick="selectWeapon('bomb')">
    <div class="weapon-icon">💜</div>
    <div class="weapon-name">Nova</div>
    <div class="weapon-ammo" id="ammo-bomb">0</div>
  </div>
  <div class="weapon-divider"></div>
  <div class="weapon-slot w-shield" id="ws-shield" onclick="selectWeapon('shield')">
    <div class="weapon-icon">🛡️</div>
    <div class="weapon-name">Shield</div>
    <div class="weapon-ammo" id="ammo-shield">0</div>
  </div>
  <div class="weapon-slot w-homing" id="ws-homing" onclick="selectWeapon('homing')">
    <div class="weapon-icon">🎯</div>
    <div class="weapon-name">Homing</div>
    <div class="weapon-ammo" id="ammo-homing">0</div>
  </div>
  <div id="weapon-keyhint">PRESS 1·2·3·4·5·6</div>
</div>
```

- [ ] **Step 3: Add CSS for new weapon slot colors**

In the `<style>` block, after `.w-bomb { color:var(--neon-purple); }` add:
```css
.w-shield { color:#ffffff; }
.w-homing { color:#ff8c00; }
```

- [ ] **Step 4: Update `updateWeaponBar` to include new weapons**

Replace `updateWeaponBar`:
```js
function updateWeaponBar(){
  document.getElementById('ammo-spread').textContent = WEAPONS.spread.ammo;
  document.getElementById('ammo-laser').textContent  = WEAPONS.laser.ammo;
  document.getElementById('ammo-bomb').textContent   = WEAPONS.bomb.ammo;
  document.getElementById('ammo-shield').textContent = WEAPONS.shield.ammo;
  document.getElementById('ammo-homing').textContent = WEAPONS.homing.ammo;
  ['normal','spread','laser','bomb','shield','homing'].forEach(w=>{
    const el=document.getElementById('ws-'+w);
    el.classList.toggle('active', w===currentWeapon);
    el.classList.toggle('has-ammo', w!=='normal'&&WEAPONS[w].ammo>0);
  });
}
```

- [ ] **Step 5: Add `homingBullets` state and reset in `startGame`**

After `let shockwaves = [];` add:
```js
let homingBullets = [];
```

In `startGame`, add `homingBullets=[];` alongside other resets. Also add `WEAPONS.shield.ammo=0; WEAPONS.homing.ammo=0;`.

- [ ] **Step 6: Add shield and homing to the `shoot` function**

Add `shieldTimer` and `shieldActive` initialization: already handled by `makePlayer` in Task 4.

In the `shoot` function, after the `bomb` branch and before `updateWeaponBar()`, add:

```js
else if(w==='shield'){
  player.shieldActive=true; player.shieldTimer=4.0; player.invincible=4.0;
  WEAPONS.shield.ammo--; shootCooldown=4.5;
}
else if(w==='homing'){
  const alive=enemies.filter(e=>e.alive);
  const target = boss||alive.sort((a,b)=>
    Math.hypot(a.x-player.x,a.y-player.y)-Math.hypot(b.x-player.x,b.y-player.y))[0];
  if(target){
    const ang=Math.atan2(target.y-player.y,target.x-player.x);
    homingBullets.push({ x:player.x, y:player.y-14, vx:Math.cos(ang)*300, vy:Math.sin(ang)*300,
      target, color:'#ff8c00' });
    WEAPONS.homing.ammo--; shootCooldown=0.4;
  }
}
```

- [ ] **Step 7: Add `updateHomingBullets` function**

Add after `updateDrops`:
```js
function updateHomingBullets(dt){
  homingBullets=homingBullets.filter(b=>b.y>-10&&b.y<H+10&&b.x>-10&&b.x<W+10);
  homingBullets.forEach(b=>{
    const tgt = b.target&&(b.target.alive||b.target===boss) ? b.target : null;
    if(tgt){
      const ang=Math.atan2(tgt.y-b.y,tgt.x-b.x);
      const cur=Math.atan2(b.vy,b.vx);
      let diff=ang-cur;
      while(diff>Math.PI) diff-=Math.PI*2;
      while(diff<-Math.PI) diff+=Math.PI*2;
      const newAng=cur+Math.sign(diff)*Math.min(Math.abs(diff),3*dt);
      b.vx=Math.cos(newAng)*300; b.vy=Math.sin(newAng)*300;
    }
    b.x+=b.vx*dt; b.y+=b.vy*dt;
  });
}
```

- [ ] **Step 8: Add homing bullet drawing**

Add after `drawBullet`:
```js
function drawHomingBullet(b){
  ctx.save();
  ctx.shadowColor=b.color; ctx.shadowBlur=18; ctx.fillStyle=b.color;
  ctx.beginPath(); ctx.arc(b.x,b.y,4,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
```

- [ ] **Step 9: Add homing bullet collision in `checkCollisions`**

After the regular bullet collision block, add:
```js
homingBullets.forEach(b=>{
  enemies.forEach(e=>{
    if(!e.alive) return;
    if(Math.hypot(b.x-e.x,b.y-e.y)<20){
      b.x=-999; e.hp--; if(e.hp<=0){ e.alive=false; score+=e.points;
        spawnExplosion(e.x,e.y,e.color); trySpawnDrop(e.x,e.y); }
      updateHUD();
    }
  });
  if(boss&&boss.alive&&Math.hypot(b.x-boss.x,b.y-boss.y)<boss.w/2){
    b.x=-999; boss.hp-=2; spawnExplosion(b.x,b.y,'#bf5fff',6);
    if(boss.hp<=0) killBoss(); updateHUD();
  }
});
homingBullets=homingBullets.filter(b=>b.x!==-999);
```

- [ ] **Step 10: Add shield visual in `drawPlayer` and manage `shieldTimer`**

The `shieldActive` and `shieldTimer` fields were added to `makePlayer` in Task 4. Add the visual right after the `if(p.invincible>0 && ...)` early-return check inside `drawPlayer`:

```js
if(p.shieldActive){
  ctx.save();
  const pulse=0.5+Math.sin(p.shieldTimer*10)*0.25;
  ctx.globalAlpha=pulse;
  ctx.strokeStyle='#ffffff'; ctx.shadowColor='#ffffff'; ctx.shadowBlur=25; ctx.lineWidth=2.5;
  ctx.beginPath(); ctx.arc(p.x,p.y,30,0,Math.PI*2); ctx.stroke();
  ctx.fillStyle='rgba(255,255,255,0.05)';
  ctx.beginPath(); ctx.arc(p.x,p.y,30,0,Math.PI*2); ctx.fill();
  ctx.restore();
}
```

In `updatePlayer`, add after the `if(p.warpIn>0)` block:
```js
if(p.shieldActive){
  p.shieldTimer-=dt;
  if(p.shieldTimer<=0){
    p.shieldActive=false; p.invincible=0;
    if(currentWeapon==='shield'){ currentWeapon='normal'; updateWeaponBar(); }
  }
}
```

- [ ] **Step 11: Wire key 5 and 6 in the keydown handler**

In the `keydown` handler, after `if(e.key==='4') selectWeapon('bomb');` add:
```js
if(e.key==='5') selectWeapon('shield');
if(e.key==='6') selectWeapon('homing');
```

- [ ] **Step 12: Call `updateHomingBullets` and `homingBullets.forEach(drawHomingBullet)` in the loop**

In the update section: add `updateHomingBullets(dt);`
In the draw section: add `homingBullets.forEach(drawHomingBullet);`

- [ ] **Step 13: Verify in browser**

Pick up a shield drop (temporarily set `WEAPONS.shield.ammo=2` in `startGame` for testing). Press 5 — a white bubble should appear around the ship, enemy bullets should pass through without damage, and it should expire after 4 seconds auto-switching to normal.

For homing: set `WEAPONS.homing.ammo=5` in `startGame`. Press 6 and fire — orange missiles should arc toward the nearest enemy. Remove the test ammo after verification.

- [ ] **Step 14: Commit**

```
git commit -m "feat: add shield bubble (key 5) and homing missile (key 6) weapons"
```

---

## Task 8: New Power-up Drops (Health, Speed Boost, Shield, Homing)

Expand the drop system to include all new pickups.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Update drop constants**

Find and replace the entire block of DROP constants:
```js
const DROP_CHANCE = 0.30;
const DROP_TYPES  = ['spread','laser','bomb'];
const DROP_AMMO   = { spread:8, laser:5, bomb:2 };
const DROP_COLORS = { spread:'#ffbe0b', laser:'#ff006e', bomb:'#bf5fff' };
const DROP_ICONS  = { spread:'🌟', laser:'⚡', bomb:'💜' };
const DROP_NAMES  = { spread:'SPREAD SHOT!', laser:'LASER BEAM!', bomb:'NOVA BOMB!' };
```

Replace with:
```js
const DROP_CHANCE = 0.30;
const DROP_TYPES  = ['spread','laser','bomb','shield','homing','speed'];
const DROP_AMMO   = { spread:8, laser:5, bomb:2, shield:1, homing:3, speed:0 };
const DROP_COLORS = { spread:'#ffbe0b', laser:'#ff006e', bomb:'#bf5fff',
                      shield:'#ffffff', homing:'#ff8c00', speed:'#06d6a0', health:'#ff006e' };
const DROP_ICONS  = { spread:'🌟', laser:'⚡', bomb:'💜',
                      shield:'🛡️', homing:'🎯', speed:'💨', health:'❤️' };
const DROP_NAMES  = { spread:'SPREAD SHOT!', laser:'LASER BEAM!', bomb:'NOVA BOMB!',
                      shield:'SHIELD UP!', homing:'HOMING LOCK!', speed:'SPEED BOOST!', health:'HEALTH +1!' };
```

- [ ] **Step 2: Update `trySpawnDrop` to include health as a separate roll**

Replace `trySpawnDrop`:
```js
function trySpawnDrop(x, y){
  // Independent 8% health drop
  if(Math.random()<0.08)
    drops.push({ x, y, type:'health', vy:55, tick:Math.random()*Math.PI*2, collected:false });
  // Weapon/speed drop
  if(Math.random()>DROP_CHANCE) return;
  const type=DROP_TYPES[Math.floor(Math.random()*DROP_TYPES.length)];
  drops.push({ x, y, type, vy:55, tick:Math.random()*Math.PI*2, collected:false });
}
```

- [ ] **Step 3: Update `updateDrops` to handle new drop types**

Find inside `updateDrops` the block:
```js
d.collected=true;
WEAPONS[d.type].ammo+=DROP_AMMO[d.type];
showPickup(d.type); spawnExplosion(d.x,d.y,DROP_COLORS[d.type],16);
updateWeaponBar();
```

Replace with:
```js
d.collected=true;
if(d.type==='health'){
  if(lives<3){ lives++; updateHUD(); }
} else if(d.type==='speed'){
  player.speedBoost=8.0; player.speed=240*1.4;
} else {
  WEAPONS[d.type].ammo+=DROP_AMMO[d.type];
  updateWeaponBar();
}
showPickup(d.type); spawnExplosion(d.x,d.y,DROP_COLORS[d.type],16);
```

- [ ] **Step 4: Verify in browser**

Play for a few waves. You should occasionally see:
- `❤️` pickups that restore a heart
- `💨` pickups that make the ship faster temporarily (thruster jets get bigger from Task 4)
- `🛡️` and `🎯` pickups that add ammo to the new weapon slots

- [ ] **Step 5: Commit**

```
git commit -m "feat: add health, speed boost, shield, and homing drops"
```

---

## Task 9: Web Audio — Synthesized Sound Effects

Add synthesized sound effects using Web Audio API with M key mute toggle.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add audio state and HUD mute indicator**

After `let shake = { mag:0, dur:0 };` add:
```js
let audioCtx=null, audioEnabled=true;
```

In the `#hud` HTML, find the wave block and add a mute indicator after it:
```html
<div class="hud-block" style="align-items:flex-end">
  <div class="hud-label">Sound</div>
  <div class="hud-value" id="mute-display" style="font-size:16px">🔊</div>
</div>
```

- [ ] **Step 2: Add `playSound` function**

Add this function after `triggerShake`:
```js
function getAudioCtx(){
  if(!audioCtx) audioCtx=new(window.AudioContext||window.webkitAudioContext)();
  return audioCtx;
}

function playSound(type){
  if(!audioEnabled) return;
  const ac=getAudioCtx(), now=ac.currentTime;
  const tone=(freq,type,dur,vol=0.15,freqEnd=null)=>{
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=type; o.connect(g); g.connect(ac.destination);
    o.frequency.setValueAtTime(freq,now);
    if(freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd,now+dur);
    g.gain.setValueAtTime(vol,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+dur);
    o.start(now); o.stop(now+dur);
  };
  switch(type){
    case 'shoot':      tone(880,'sine',0.08,0.12); break;
    case 'shootSpread':[-60,-30,0,30,60].forEach((d,i)=>{ const o2=getAudioCtx().createOscillator(),g2=getAudioCtx().createGain(); }); tone(740+Math.random()*200,'sine',0.06,0.08); break;
    case 'enemyDeath': tone(400,'square',0.15,0.10,100); break;
    case 'playerHit':  tone(80,'sawtooth',0.3,0.25); break;
    case 'pickup':     tone(440,'sine',0.2,0.18,880); break;
    case 'bossWarning':tone(60,'sine',1.0,0.2,300); break;
    case 'bossDeath':
      [0,0.15,0.3].forEach((t,i)=>{
        const freq=[440,554,659][i];
        const o=ac.createOscillator(),g=ac.createGain();
        o.connect(g); g.connect(ac.destination);
        o.frequency.setValueAtTime(freq,now+t);
        g.gain.setValueAtTime(0.2,now+t);
        g.gain.exponentialRampToValueAtTime(0.001,now+t+0.18);
        o.start(now+t); o.stop(now+t+0.18);
      }); break;
    case 'shield':     tone(1200,'sine',0.2,0.15,600); break;
    case 'nova':       tone(100,'sawtooth',0.4,0.3,40); break;
  }
}
```

The `shootSpread` case above is simplified — replace it with just `tone(740,'sine',0.06,0.08)` to keep it clean:

```js
function playSound(type){
  if(!audioEnabled) return;
  const ac=getAudioCtx(), now=ac.currentTime;
  const tone=(freq,waveType,dur,vol=0.15,freqEnd=null)=>{
    const o=ac.createOscillator(), g=ac.createGain();
    o.type=waveType; o.connect(g); g.connect(ac.destination);
    o.frequency.setValueAtTime(freq,now);
    if(freqEnd) o.frequency.exponentialRampToValueAtTime(freqEnd,now+dur);
    g.gain.setValueAtTime(vol,now);
    g.gain.exponentialRampToValueAtTime(0.001,now+dur);
    o.start(now); o.stop(now+dur);
  };
  switch(type){
    case 'shoot':      tone(880,'sine',0.08,0.12); break;
    case 'enemyDeath': tone(400,'square',0.15,0.10,100); break;
    case 'playerHit':  tone(80,'sawtooth',0.3,0.25); break;
    case 'pickup':     tone(440,'sine',0.2,0.18,880); break;
    case 'bossWarning':tone(60,'sine',1.0,0.2,300); break;
    case 'shield':     tone(1200,'sine',0.2,0.15,600); break;
    case 'nova':       tone(100,'sawtooth',0.4,0.3,40); break;
    case 'bossDeath':
      [0,0.15,0.3].forEach((t,i)=>{
        const ac2=getAudioCtx(), o=ac2.createOscillator(), g=ac2.createGain();
        o.connect(g); g.connect(ac2.destination);
        o.frequency.setValueAtTime([440,554,659][i], ac2.currentTime+t);
        g.gain.setValueAtTime(0.2, ac2.currentTime+t);
        g.gain.exponentialRampToValueAtTime(0.001, ac2.currentTime+t+0.18);
        o.start(ac2.currentTime+t); o.stop(ac2.currentTime+t+0.18);
      }); break;
  }
}
```

- [ ] **Step 3: Add mute toggle to `updateHUD`**

In `updateHUD`, add:
```js
const muteEl=document.getElementById('mute-display');
if(muteEl) muteEl.textContent = audioEnabled ? '🔊' : '🔇';
```

- [ ] **Step 4: Add M key toggle**

In the `keydown` handler, after `if(e.key==='6') selectWeapon('homing');` add:
```js
if(e.key==='m'||e.key==='M'){ audioEnabled=!audioEnabled; updateHUD(); }
```

- [ ] **Step 5: Wire `playSound` calls to game events**

- In `shoot()`, normal branch: add `playSound('shoot');`
- In `shoot()`, spread branch: add `playSound('shoot');`
- In `shoot()`, laser branch: add `playSound('shoot');`
- In `shoot()`, bomb/nova branch: add `playSound('nova');`
- In `shoot()`, shield branch: add `playSound('shield');`
- In `checkCollisions`, after `e.alive=false; score+=e.points;`: add `playSound('enemyDeath');`
- In `hitPlayer`, after `spawnExplosion`: add `playSound('playerHit');`
- In `showPickup`: add `playSound('pickup');` at the start
- In `nextWave`, boss wave branch: add `playSound('bossWarning');`
- In `killBoss`: add `playSound('bossDeath');`

- [ ] **Step 6: Verify in browser**

Launch game, shoot some enemies — hear blip sounds. Get hit — hear low buzz. Pick up a weapon — hear ascending chime. Press M — mute icon changes to 🔇 and sounds stop. Press M again — 🔊 returns.

- [ ] **Step 7: Commit**

```
git commit -m "feat: add Web Audio synthesized sound effects with M key mute toggle"
```

---

## Task 10: High Score (localStorage)

Persist and display the all-time high score.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add best score display to HTML HUD**

In `#hud`, find the score block:
```html
<div class="hud-block">
  <div class="hud-label">Score</div>
  <div class="hud-value" id="score-display">000000</div>
</div>
```

Add a best score block immediately after it:
```html
<div class="hud-block">
  <div class="hud-label">Best</div>
  <div class="hud-value" id="best-display" style="color:var(--neon-yellow);text-shadow:0 0 10px var(--neon-yellow)">000000</div>
</div>
```

- [ ] **Step 2: Add high score helpers and update `updateHUD`**

After the `pad` function add:
```js
function getHiScore(){ return parseInt(localStorage.getItem('neonBlasterHiScore')||'0'); }
function setHiScore(s){ localStorage.setItem('neonBlasterHiScore',String(s)); }
```

In `updateHUD`, add:
```js
const best=document.getElementById('best-display');
if(best) best.textContent=pad(Math.max(score,getHiScore()));
if(score>getHiScore()&&score>0) setHiScore(score);
```

- [ ] **Step 3: Show "NEW BEST!" on game over when score beats record**

In `gameOver`, find the `ov.innerHTML=...` template and add a conditional line:
```js
const isNewBest = score > getHiScore();
if(isNewBest) setHiScore(score);
ov.innerHTML=`
  <div class="overlay-title" style="font-size:34px">GAME OVER</div>
  <div class="overlay-score">SCORE &nbsp; ${pad(score)}</div>
  ${isNewBest ? '<div style="font-family:\'Orbitron\',monospace;font-size:16px;color:var(--neon-yellow);text-shadow:0 0 15px var(--neon-yellow);letter-spacing:4px;animation:pulse 0.8s ease-in-out infinite">★ NEW BEST! ★</div>' : ''}
  <div class="overlay-sub">Wave ${pad(wave,2)} reached</div>
  <button id="start-btn" onclick="startGame()">RETRY</button>
`;
```

- [ ] **Step 4: Show hi score on the start overlay**

In the start overlay HTML, after `<div class="overlay-sub">Kill enemies · collect weapon drops</div>` add:
```html
<div id="hi-score-display" style="font-family:'Orbitron',monospace;font-size:14px;color:var(--neon-yellow);text-shadow:0 0 10px var(--neon-yellow);letter-spacing:3px"></div>
```

Then add at the bottom of the script:
```js
const hs=getHiScore();
if(hs>0) document.getElementById('hi-score-display').textContent=`BEST  ${pad(hs)}`;
```

- [ ] **Step 5: Verify in browser**

Play a game and get some score. Game over — see SCORE. Reload page — BEST in HUD shows previous score. Beat the best — "★ NEW BEST! ★" appears on game over screen.

- [ ] **Step 6: Commit**

```
git commit -m "feat: add localStorage high score with NEW BEST display"
```

---

## Task 11: Wave Transition Polish

The `nextWave` function was already updated in Task 6 to include a 1.5s pause and boss/normal banners. This task adds the `level-announce` CSS to support color changes.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Update `#level-announce` CSS to support dynamic color via `color` property**

Find:
```css
#level-announce {
  ...
  color:var(--neon-yellow); text-shadow:0 0 20px var(--neon-yellow);
  ...
}
```

Remove the hardcoded `color` and `text-shadow` from the CSS (we set them dynamically in `nextWave`):
```css
#level-announce {
  position:absolute; top:50%; left:50%; transform:translate(-50%,-50%);
  font-family:'Orbitron',monospace; font-size:34px; font-weight:900;
  letter-spacing:4px; pointer-events:none; opacity:0; z-index:10;
}
```

- [ ] **Step 2: Verify transitions in browser**

Play to wave 2. After clearing all enemies, a 1.5s "WAVE 02" banner in yellow should appear with a brief pause before new enemies spawn. Play to wave 5: "⚠ WARNING ⚠" in pink appears instead. If the pause isn't happening, check `state='wave_transition'` is set in `nextWave` and the loop allows rendering during that state.

- [ ] **Step 3: Commit**

```
git commit -m "feat: polish wave transition banners with color and pause"
```

---

## Task 12: Difficulty Scaling Revision

Smooth out the difficulty curve so the game stays playable past wave 8.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Update enemy speed formula in `updateEnemies`**

Find:
```js
const speed=(50+wave*14)*dt;
```

Replace with:
```js
const speed=(50 + wave*14*(1/(1+wave*0.04)))*dt;
```

- [ ] **Step 2: Update enemy shoot timer in `enemyShoot`**

Find:
```js
enemyShootTimer=Math.max(0.5,2.2-wave*0.12);
```

Replace with:
```js
enemyShootTimer=Math.max(0.35,2.2-wave*0.10);
```

- [ ] **Step 3: Verify scaling**

On wave 1: `speed = (50+14*1.0) ≈ 64`. On wave 8: `speed = (50+112*(1/1.32)) ≈ 135`. On wave 15: `speed = (50+210*(1/1.6)) ≈ 181`. Previously wave 15 would be `50+210=260` — much faster. The new curve is gentler past wave 8.

Open the browser, reach wave 10+ — enemies should still be challenging but not impossibly fast.

- [ ] **Step 4: Commit**

```
git commit -m "fix: smooth difficulty scaling curve past wave 8"
```

---

## Task 13: Mobile Fire Button

Add an on-screen FIRE button for mobile users who can't use spacebar.

**Files:**
- Modify: `shooter.html`

- [ ] **Step 1: Add mobile controls HTML**

After `<div id="controls-hint">...</div>` add:
```html
<div id="mobile-controls" style="display:none;width:600px;margin-top:8px;text-align:center">
  <button id="mobile-fire-btn"
    style="padding:14px 60px;background:transparent;border:2px solid var(--neon-cyan);
           color:var(--neon-cyan);font-family:'Orbitron',monospace;font-size:14px;
           font-weight:700;letter-spacing:4px;cursor:pointer;
           box-shadow:0 0 20px rgba(0,245,255,0.2),inset 0 0 20px rgba(0,245,255,0.05);
           text-transform:uppercase">
    FIRE
  </button>
</div>
```

- [ ] **Step 2: Show mobile controls on touch devices and wire the button**

At the bottom of the script (before the final `stars = initStars();` line), add:
```js
if('ontouchstart' in window){
  document.getElementById('mobile-controls').style.display='block';
}
document.getElementById('mobile-fire-btn').addEventListener('touchstart', e=>{
  e.preventDefault();
  if(state==='playing') shoot();
});
```

- [ ] **Step 3: Verify on mobile or browser devtools mobile emulation**

Open Chrome DevTools → Toggle device toolbar → select a phone. The FIRE button should appear below the canvas. Tapping it should fire bullets.

- [ ] **Step 4: Commit**

```
git commit -m "feat: add mobile FIRE button for touch devices"
```

---

## Self-Review

### Spec Coverage Check

| Spec requirement | Task |
|-----------------|------|
| Zigzagger enemy | Task 5 |
| Armored enemy (2-hit + crack) | Task 5 |
| Dive-bomber enemy | Task 5 |
| Boss every 5 waves | Task 6 |
| Boss HP bar | Task 6 (drawBoss) |
| Boss Phase 1 (3-way spread) | Task 6 (fireBossShot) |
| Boss Phase 2 (5-way + laser) | Task 6 (fireBossShot, boss.phase===2) |
| Boss entrance animation + WARNING | Task 6 (nextWave) |
| Boss guaranteed drops | Task 6 (killBoss) |
| Shield weapon (key 5) | Task 7 |
| Homing missile (key 6) | Task 7 |
| Health pickup | Task 8 |
| Speed boost pickup | Task 8 |
| Parallax 3-layer star field | Task 1 |
| Screen shake (hit/death/nova) | Task 2 |
| Shockwave ring on explosions | Task 3 |
| Player thruster animation | Task 4 |
| Warp-in effect | Task 4 |
| Web Audio synthesized sounds | Task 9 |
| M key mute toggle | Task 9 |
| localStorage high score | Task 10 |
| NEW BEST display | Task 10 |
| Wave transition 1.5s pause | Task 6 (nextWave) |
| Difficulty scaling curve | Task 12 |
| Mobile fire button | Task 13 |
| Boss phase 2 sweeping laser | **Missing — see below** |

### Gap: Boss Phase 2 Sweeping Laser

The spec says phase 2 adds "a sweeping laser attack." The `fireBossShot` in Task 6 only adds angled bullets in phase 2 — no sweeping laser. Add this to Task 6 Step 4, inside `fireBossShot` after the `angles.forEach` block:

```js
// Phase 2: occasionally fire a sweeping laser beam
if(boss.phase===2 && Math.random()<0.25){
  laserBeams.push({ x:boss.x, y0:boss.y+boss.h/2, life:0.5, maxLife:0.5 });
}
```

The existing `drawLasers` function will render this correctly since it draws from `y0` to `y=0`. The laser will appear to shoot downward from the boss — good enough for a sweeping attack. ✓

### Placeholder Scan

No TBDs, TODOs, or vague steps found. All code blocks are complete. ✓

### Type Consistency Check

- `triggerShake(mag, dur)` — called with positional numbers throughout ✓
- `spawnShockwave(x, y, color)` — consistent across Tasks 3 and 6 ✓
- `playSound(type)` — string key, consistent across Tasks 9 and call sites ✓
- `boss.phase` — `1` or `2`, checked consistently ✓
- `player.shieldActive`, `player.shieldTimer`, `player.speedBoost` — added in Task 4 `makePlayer`, used in Tasks 7 and 8 ✓
- `homingBullets` — added Task 7, cleared in `startGame` Task 7 ✓
- `DROP_TYPES` — updated Task 8, used in `trySpawnDrop` (Task 8) and `killBoss` (Task 6, references `DROP_TYPES`) ✓ — Note: `killBoss` is written before Task 8 updates `DROP_TYPES`. Both will be in the final file simultaneously, so `DROP_TYPES` at runtime will include all 6 types. ✓
