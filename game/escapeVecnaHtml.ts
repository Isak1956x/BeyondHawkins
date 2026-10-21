// Beyond Hawkins - Escape de Vecna Arcade Game
// Full 5-Level Campaign, Bosses, Upgrades Shop, Checkpoints, Slide & Mobile Controls

const escapeVecnaHtml = `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover" />
  <title>Beyond Hawkins: Escape de Vecna</title>
  <style>
    * {
      box-sizing: border-box;
      user-select: none;
      -webkit-user-select: none;
      -webkit-touch-callout: none;
    }
    html, body {
      margin: 0;
      padding: 0;
      width: 100%;
      height: 100%;
      overflow: hidden;
      background: #030408;
      color: #fff;
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      touch-action: none;
    }
    #game {
      display: block;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  </style>
</head>
<body>
  <canvas id="game"></canvas>

  <script>
    (function () {
      const canvas = document.getElementById('game');
      const ctx = canvas.getContext('2d');

      let W = 360;
      let H = 740;
      let dpr = 1;
      let state = 'title'; // 'title', 'char_select', 'level_select', 'shop', 'help', 'play', 'mini_boss', 'boss', 'over', 'won', 'paused'
      let gameMode = 'campaign'; // 'campaign' or 'endless'
      let lastTime = 0;
      let gameTime = 0;
      let distance = 0;
      let levelStartDist = 0;
      let score = 0;
      let totalBankedCoins = 0;
      let sessionCoins = 0;
      let lives = 3;
      let maxLives = 3;
      let currentLevelIdx = 0;
      let unlockedLevels = 1;
      let lane = 1; // 0, 1, 2
      let targetLaneX = 1;
      let currentLaneX = 1;
      let jumpY = 0;
      let jumpVel = 0;
      let isGrounded = true;
      let isSliding = false;
      let slideTimer = 0;
      let invulnTimer = 0;
      let powerupTimer = 0;
      let powerupType = null;
      let combo = 0;
      let comboTimer = 0;
      let shakeTimer = 0;
      let shakeMagnitude = 0;
      let lightningTimer = 0;
      let damageTexts = [];
      let particles = [];
      let hazards = [];
      let ambientParticles = [];
      let bestScore = 0;
      let bestDist = 0;
      let selectedHero = 0;
      let soundEnabled = true;
      let audioCtx = null;
      let musicStep = 0;
      let nextNoteTime = 0;
      let buttons = [];

      // Boss encounter state
      let bossName = '';
      let bossHealth = 100;
      let bossMaxHealth = 100;
      let bossTimer = 0;
      let bossAttackTimer = 0;
      let bossPhase = 1;

      // Upgrades loaded from localStorage
      let upgrades = {
        maxHp: 0,       // +1 to +2 hearts
        walkmanDur: 0,  // +2s each lvl
        magnet: 0,      // auto attracts crystals
        scoreMult: 0    // +20% score
      };

      try {
        bestScore = +(localStorage.getItem('bh_best_score') || 0);
        bestDist = +(localStorage.getItem('bh_best_dist') || 0);
        totalBankedCoins = +(localStorage.getItem('bh_banked_coins') || 0);
        unlockedLevels = Math.max(1, +(localStorage.getItem('bh_unlocked_lvls') || 1));
        soundEnabled = localStorage.getItem('bh_sound') !== 'false';
        const savedUpgrades = localStorage.getItem('bh_upgrades');
        if (savedUpgrades) upgrades = Object.assign(upgrades, JSON.parse(savedUpgrades));
      } catch (e) {}

      // Levels Definition (5 Complete Atmospheric Stages)
      const LEVELS = [
        {
          id: 0,
          name: 'NIVEL 1: CALLES DE HAWKINS',
          sub: 'Medianoche en los suburbios de Hawkins',
          targetDist: 900,
          theme: 'hawkins',
          sky1: '#040711',
          sky2: '#0d1929',
          roadColor: '#0b0e17',
          borderColor: '#195b8a',
          markerColor: '#1a334d',
          miniBoss: 'Demoperro Alfa',
          bossHp: 80,
          hazards: ['demodog', 'car', 'tree', 'crystal', 'walkman', 'waffle']
        },
        {
          id: 1,
          name: 'NIVEL 2: EL LABORATORIO',
          sub: 'Instalaciones secretas y puertas blindadas',
          targetDist: 1900,
          theme: 'lab',
          sky1: '#0a0d18',
          sky2: '#162238',
          roadColor: '#121824',
          borderColor: '#00cec9',
          markerColor: '#1e384d',
          miniBoss: 'El Demogorgon',
          bossHp: 120,
          hazards: ['gate_laser', 'demogorgon', 'toxic_barrel', 'crystal', 'walkman', 'waffle']
        },
        {
          id: 2,
          name: 'NIVEL 3: CENTRO STARCOURT',
          sub: 'Neón ochentero y humanos poseídos',
          targetDist: 3000,
          theme: 'starcourt',
          sky1: '#110515',
          sky2: '#280d33',
          roadColor: '#1a0b22',
          borderColor: '#fd79a8',
          markerColor: '#451659',
          miniBoss: 'Monstruo del Desuellamentes',
          bossHp: 160,
          hazards: ['flayed', 'cart', 'neon_sign', 'crystal', 'walkman', 'waffle']
        },
        {
          id: 3,
          name: 'NIVEL 4: TÚNELES DEL REVÉS',
          sub: 'Zarcillos vivos y murciélagos asfixiantes',
          targetDist: 4200,
          theme: 'tunnels',
          sky1: '#120509',
          sky2: '#290c15',
          roadColor: '#1a080f',
          borderColor: '#ff4757',
          markerColor: '#4d1221',
          miniBoss: 'Enjambre de Demobats',
          bossHp: 200,
          hazards: ['demobat_high', 'tentacle', 'rift', 'crystal', 'walkman', 'waffle']
        },
        {
          id: 4,
          name: 'NIVEL 5: LA GUARIDA DE VECNA',
          sub: 'La Casa Creel y el enfrentamiento final',
          targetDist: 5600,
          theme: 'vecna_lair',
          sky1: '#140206',
          sky2: '#3d0714',
          roadColor: '#16040a',
          borderColor: '#ff1e42',
          markerColor: '#630e20',
          miniBoss: 'VECNA: EL SEÑOR DEL REVÉS',
          bossHp: 280,
          hazards: ['clock', 'red_lightning', 'demogorgon', 'demobat_high', 'crystal', 'walkman', 'waffle']
        }
      ];

      // 4 Playable Characters with Unique Visuals & Superpowers
      const HEROES = [
        {
          id: 'max',
          name: 'MAX MAYFIELD',
          sub: 'Modo Trance + Walkman Épico',
          desc: 'Su Walkman dura +4s y sus saltos tienen doble altura.',
          color: '#e86c9c',
          hair: '#b8441f',
          jacket: '#1a4e75',
          shirt: '#eed29b'
        },
        {
          id: 'eleven',
          name: 'ELEVEN',
          sub: 'Escudo Psíquico y Telequinesis',
          desc: 'Comienza cada nivel con un escudo que bloquea un impacto.',
          color: '#f8a5c2',
          hair: '#3a271d',
          jacket: '#59203c',
          shirt: '#eedcd0'
        },
        {
          id: 'eddie',
          name: 'EDDIE MUNSON',
          sub: 'Riff de Guitarra Demoledor',
          desc: 'Al recoger un Walkman desata ondas sónicas destructivas.',
          color: '#e056fd',
          hair: '#2c1e19',
          jacket: '#222f3e',
          shirt: '#f1f2f6'
        },
        {
          id: 'dustin',
          name: 'DUSTIN HENDERSON',
          sub: 'Imán de Cristales Avanzado',
          desc: 'Atrae automáticamente los cristales y gana +30% más puntos.',
          color: '#2ed573',
          hair: '#3e271a',
          jacket: '#1e3799',
          shirt: '#f6b93b'
        }
      ];

      // Procedural 80s Synthesizer Engine (Stranger Things Synth + SFX)
      function initAudio() {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
      }

      function playTone(freq, type, duration, gainLevel, slideToFreq) {
        if (!soundEnabled || !audioCtx) return;
        try {
          const osc = audioCtx.createOscillator();
          const gain = audioCtx.createGain();
          osc.type = type || 'sawtooth';
          osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
          if (slideToFreq) {
            osc.frequency.exponentialRampToValueAtTime(Math.max(10, slideToFreq), audioCtx.currentTime + duration);
          }
          gain.gain.setValueAtTime(gainLevel || 0.15, audioCtx.currentTime);
          gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);
          osc.connect(gain);
          gain.connect(audioCtx.destination);
          osc.start();
          osc.stop(audioCtx.currentTime + duration);
        } catch (e) {}
      }

      function sfxJump() {
        playTone(190, 'sine', 0.22, 0.22, 520);
      }

      function sfxSlide() {
        playTone(320, 'triangle', 0.2, 0.16, 120);
      }

      function sfxCoin() {
        playTone(900, 'triangle', 0.1, 0.16, 1350);
        setTimeout(function () {
          playTone(1350, 'triangle', 0.15, 0.16, 1800);
        }, 40);
      }

      function sfxHit() {
        playTone(140, 'sawtooth', 0.35, 0.35, 30);
        if (navigator.vibrate) {
          try { navigator.vibrate([60, 40, 80]); } catch (e) {}
        }
      }

      function sfxPowerup() {
        const notes = [261.6, 329.6, 392.0, 523.2, 659.2, 784.0];
        notes.forEach(function (f, i) {
          setTimeout(function () {
            playTone(f, 'square', 0.2, 0.18);
          }, i * 65);
        });
      }

      function sfxBossHit() {
        playTone(200, 'square', 0.15, 0.25, 75);
        if (navigator.vibrate) {
          try { navigator.vibrate(30); } catch (e) {}
        }
      }

      function sfxClockGong() {
        playTone(85, 'sawtooth', 2.0, 0.45, 60);
        setTimeout(function () {
          playTone(120, 'sine', 1.8, 0.25, 80);
        }, 90);
      }

      // Unique Dynamic Arpeggio Scales per Level
      const MUSIC_SCALES = [
        [65.41, 82.41, 98.00, 123.47, 130.81, 123.47, 98.00, 82.41], // Hawkins (C E G B C B G E)
        [73.42, 87.31, 110.0, 130.81, 146.83, 130.81, 110.0, 87.31], // Lab (D F A C D C A F)
        [82.41, 103.8, 123.4, 155.56, 164.81, 155.56, 123.4, 103.8], // Starcourt (Synthpop E)
        [55.00, 65.41, 77.78, 110.00, 116.54, 110.00, 77.78, 65.41], // Tunnels (Dark A minor)
        [43.65, 51.91, 65.41, 87.31, 92.50, 87.31, 65.41, 51.91]     // Vecna (Deep F Diminished)
      ];

      function updateMusic(dt) {
        if (!soundEnabled || !audioCtx || (state !== 'play' && state !== 'boss' && state !== 'mini_boss')) return;
        const now = audioCtx.currentTime;
        if (now >= nextNoteTime) {
          const isBossFight = state === 'boss' || state === 'mini_boss';
          const scale = MUSIC_SCALES[currentLevelIdx % MUSIC_SCALES.length];
          const tempo = isBossFight ? 0.105 : powerupTimer > 0 ? 0.085 : 0.13;
          const f = scale[musicStep % scale.length];

          try {
            const osc = audioCtx.createOscillator();
            const filter = audioCtx.createBiquadFilter();
            const gain = audioCtx.createGain();

            osc.type = powerupTimer > 0 ? 'sawtooth' : 'sawtooth';
            osc.frequency.setValueAtTime(f, now);

            filter.type = 'lowpass';
            const cutoff = powerupTimer > 0 ? 2000 : isBossFight ? 1500 : 900;
            filter.frequency.setValueAtTime(cutoff, now);
            filter.frequency.exponentialRampToValueAtTime(300, now + tempo * 0.9);

            gain.gain.setValueAtTime(0.14, now);
            gain.gain.exponentialRampToValueAtTime(0.005, now + tempo * 0.95);

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(audioCtx.destination);

            osc.start(now);
            osc.stop(now + tempo);

            // Sub bass kick on beat 0 and 4
            if (musicStep % 4 === 0) {
              const kick = audioCtx.createOscillator();
              const kickGain = audioCtx.createGain();
              kick.type = 'sine';
              kick.frequency.setValueAtTime(115, now);
              kick.frequency.exponentialRampToValueAtTime(32, now + 0.18);
              kickGain.gain.setValueAtTime(0.24, now);
              kickGain.gain.exponentialRampToValueAtTime(0.001, now + 0.18);
              kick.connect(kickGain);
              kickGain.connect(audioCtx.destination);
              kick.start(now);
              kick.stop(now + 0.2);
            }
          } catch (e) {}

          musicStep++;
          nextNoteTime = now + tempo;
        }
      }

      function resize() {
        dpr = Math.min(window.devicePixelRatio || 1, 2.5);
        W = window.innerWidth || 360;
        H = window.innerHeight || 740;
        canvas.width = Math.floor(W * dpr);
        canvas.height = Math.floor(H * dpr);
        ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

        // Generate level ambient particles
        ambientParticles = [];
        for (let i = 0; i < 75; i++) {
          ambientParticles.push({
            x: Math.random() * W,
            y: Math.random() * H,
            r: 1 + Math.random() * 2.5,
            speedY: 10 + Math.random() * 25,
            speedX: (Math.random() - 0.5) * 12,
            alpha: 0.2 + Math.random() * 0.6,
            pulse: Math.random() * Math.PI * 2
          });
        }
      }

      window.addEventListener('resize', resize);
      resize();

      function triggerShake(amt, duration) {
        shakeMagnitude = amt;
        shakeTimer = duration || 0.25;
      }

      function addParticle(x, y, color, count, speed) {
        for (let i = 0; i < count; i++) {
          const angle = Math.random() * Math.PI * 2;
          const spd = (0.5 + Math.random()) * (speed || 80);
          particles.push({
            x: x,
            y: y,
            vx: Math.cos(angle) * spd,
            vy: Math.sin(angle) * spd,
            color: color || '#f20d2f',
            size: 2 + Math.random() * 4,
            life: 0.4 + Math.random() * 0.4,
            maxLife: 0.8
          });
        }
      }

      function addDamageText(txt, x, y, color) {
        damageTexts.push({
          text: txt,
          x: x,
          y: y,
          vy: -60,
          color: color || '#ffcf57',
          life: 0.75
        });
      }

      function rect(x, y, w, h, c) {
        ctx.fillStyle = c;
        ctx.fillRect(Math.round(x), Math.round(y), Math.ceil(w), Math.ceil(h));
      }

      function roundRect(x, y, w, h, r, fillColor, strokeColor, strokeWidth) {
        ctx.beginPath();
        ctx.moveTo(x + r, y);
        ctx.arcTo(x + w, y, x + w, y + h, r);
        ctx.arcTo(x + w, y + h, x, y + h, r);
        ctx.arcTo(x, y + h, x, y, r);
        ctx.arcTo(x, y, x + w, y, r);
        ctx.closePath();
        if (fillColor) {
          ctx.fillStyle = fillColor;
          ctx.fill();
        }
        if (strokeColor) {
          ctx.strokeStyle = strokeColor;
          ctx.lineWidth = strokeWidth || 1;
          ctx.stroke();
        }
      }

      function drawText(t, x, y, size, color, align, weight) {
        ctx.fillStyle = color || '#fff';
        ctx.font = (weight || 800) + ' ' + (size || 14) + 'px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
        ctx.textAlign = align || 'center';
        ctx.fillText(t, x, y);
      }

      function button(label, x, y, w, h, action, style) {
        const bg = (style && style.bg) || '#c70b27';
        const border = (style && style.border) || '#ff3b56';
        const txtColor = (style && style.color) || '#ffffff';
        const fontSize = (style && style.size) || 14;

        roundRect(x, y + 3, w, h, 10, 'rgba(0,0,0,0.5)');
        roundRect(x, y, w, h, 10, bg, border, 2);

        const grad = ctx.createLinearGradient(x, y, x, y + h * 0.45);
        grad.addColorStop(0, 'rgba(255,255,255,0.22)');
        grad.addColorStop(1, 'rgba(255,255,255,0)');
        roundRect(x + 2, y + 2, w - 4, h * 0.45, 8, grad);

        drawText(label, x + w / 2, y + h / 2 + fontSize * 0.35, fontSize, txtColor, 'center', 800);
        buttons.push({ x: x, y: y, w: w, h: h, action: action });
      }

      // Pixel Art Hero Renderer with Slide & Superpower animations
      function drawHero(x, y, s, isJump, isSlide, isPowerup) {
        ctx.save();
        ctx.translate(x, y);

        // Powerup Walkman Neon Aura or Eddie Guitar Waves
        if (isPowerup) {
          const auraPulse = 0.5 + 0.5 * Math.sin(gameTime * 15);
          ctx.shadowColor = selectedHero === 2 ? '#e056fd' : '#00f0ff';
          ctx.shadowBlur = 20 * auraPulse;
          ctx.strokeStyle = selectedHero === 2 ? '#e056fd' : '#00f0ff';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, isSlide ? 45 * s : 30 * s, 44 * s, 0, Math.PI * 2);
          ctx.stroke();
          ctx.shadowBlur = 0;
        }

        // Eleven psychic shield
        if (selectedHero === 1 && invulnTimer > 0) {
          ctx.strokeStyle = 'rgba(255, 105, 180, ' + (0.45 + 0.35 * Math.sin(gameTime * 20)) + ')';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(0, 30 * s, 46 * s, 0, Math.PI * 2);
          ctx.stroke();
        }

        // Shadow
        const shadowScale = isJump ? 0.6 : isSlide ? 1.3 : 1;
        ctx.fillStyle = 'rgba(2, 4, 10, 0.55)';
        ctx.beginPath();
        ctx.ellipse(0, 68 * s, 22 * s * shadowScale, 6 * s * shadowScale, 0, 0, Math.PI * 2);
        ctx.fill();

        const hero = HEROES[selectedHero];

        // SLIDE POSE
        if (isSlide) {
          ctx.translate(0, 24 * s);
          // Dust particles when sliding
          if (Math.random() < 0.3) {
            addParticle(x + (Math.random() - 0.5) * 20, y + 60 * s, '#636e72', 2, 30);
          }
          // Horizontal Torso
          rect(-18 * s, 10 * s, 36 * s, 16 * s, hero.jacket);
          rect(-8 * s, 12 * s, 16 * s, 12 * s, hero.shirt);
          // Head low
          rect(-22 * s, 4 * s, 18 * s, 16 * s, hero.hair);
          rect(-18 * s, 8 * s, 12 * s, 12 * s, '#f5cd79');
          // Legs sliding forward
          rect(8 * s, 18 * s, 26 * s, 8 * s, '#34495e');
          rect(30 * s, 16 * s, 10 * s, 10 * s, '#ffffff'); // Sneaker
          ctx.restore();
          return;
        }

        // RUNNING / JUMPING POSE
        const runBob = isJump ? 0 : Math.sin(gameTime * 18) * 3;
        ctx.translate(0, runBob);

        // Hair & Hats
        rect(-14 * s, -8 * s, 28 * s, 18 * s, hero.hair);
        if (selectedHero === 0) { // Max long red hair & headphones
          rect(-18 * s, 4 * s, 8 * s, 26 * s, hero.hair);
          rect(10 * s, 4 * s, 8 * s, 26 * s, hero.hair);
          rect(-16 * s, 24 * s, 6 * s, 10 * s, '#ff793f');
          rect(10 * s, 24 * s, 6 * s, 10 * s, '#ff793f');
          rect(-14 * s, 32 * s, 28 * s, 3 * s, '#2c3e50');
        } else if (selectedHero === 2) { // Eddie long rocker hair & denim vest
          rect(-20 * s, -6 * s, 10 * s, 34 * s, hero.hair);
          rect(10 * s, -6 * s, 10 * s, 34 * s, hero.hair);
          rect(-18 * s, 18 * s, 36 * s, 6 * s, '#57606f'); // vest collar
        } else if (selectedHero === 3) { // Dustin thinking cap
          rect(-16 * s, -14 * s, 32 * s, 10 * s, '#2e86de');
          rect(-16 * s, -6 * s, 32 * s, 6 * s, '#ee5253');
          rect(6 * s, -4 * s, 14 * s, 4 * s, '#f1f2f6');
        }

        // Face
        rect(-11 * s, 2 * s, 22 * s, 18 * s, '#f5cd79');
        rect(-12 * s, 8 * s, 4 * s, 10 * s, '#e5b869');
        rect(8 * s, 8 * s, 4 * s, 10 * s, '#e5b869');

        // Eyes
        rect(-8 * s, 8 * s, 5 * s, 4 * s, '#1e272e');
        rect(3 * s, 8 * s, 5 * s, 4 * s, '#1e272e');
        rect(-7 * s, 9 * s, 2 * s, 2 * s, '#fff');
        rect(4 * s, 9 * s, 2 * s, 2 * s, '#fff');

        if (selectedHero === 1) { // Eleven nosebleed
          rect(0, 16 * s, 2 * s, 5 * s, '#c0392b');
        }

        // Torso / Jacket
        rect(-15 * s, 20 * s, 30 * s, 26 * s, hero.jacket);
        rect(-6 * s, 20 * s, 12 * s, 24 * s, hero.shirt);

        // Arms & Guitar if Eddie
        const armSway = isJump ? -6 : Math.sin(gameTime * 18) * 8;
        rect(-20 * s, 22 * s + armSway, 6 * s, 18 * s, hero.jacket);
        rect(14 * s, 22 * s - armSway, 6 * s, 18 * s, hero.jacket);

        if (selectedHero === 2 && isPowerup) { // Eddie W.C. Rich guitar!
          rect(-18 * s, 28 * s, 36 * s, 8 * s, '#ff3838');
          rect(12 * s, 14 * s, 6 * s, 30 * s, '#ffffff'); // neck
        }

        // Legs / Pants
        const legSway = isJump ? 0 : Math.sin(gameTime * 18) * 9;
        rect(-12 * s, 46 * s, 10 * s, 16 * s + legSway, '#34495e');
        rect(2 * s, 46 * s, 10 * s, 16 * s - legSway, '#34495e');

        // Sneakers
        rect(-13 * s, 60 * s + legSway, 12 * s, 6 * s, '#ffffff');
        rect(1 * s, 60 * s - legSway, 12 * s, 6 * s, '#ffffff');

        ctx.restore();
      }

      // Vecna Boss Renderer
      function drawVecna(x, y, s, enraged) {
        ctx.save();
        ctx.translate(x, y);

        const floatY = Math.sin(gameTime * 3) * 8;
        ctx.translate(0, floatY);

        const glow = ctx.createRadialGradient(0, 30 * s, 10 * s, 0, 30 * s, 70 * s);
        glow.addColorStop(0, enraged ? 'rgba(255, 0, 50, 0.45)' : 'rgba(180, 10, 40, 0.3)');
        glow.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(0, 30 * s, 70 * s, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = 'rgba(0, 0, 0, 0.6)';
        ctx.beginPath();
        ctx.ellipse(0, 95 * s - floatY, 32 * s, 8 * s, 0, 0, Math.PI * 2);
        ctx.fill();

        ctx.strokeStyle = enraged ? '#ff1e42' : '#571322';
        ctx.lineWidth = 4 * s;
        for (let i = -3; i <= 3; i++) {
          if (i === 0) continue;
          ctx.beginPath();
          ctx.moveTo(i * 8 * s, 40 * s);
          const cpX = i * 35 * s + Math.sin(gameTime * 4 + i) * 14 * s;
          const cpY = 80 * s;
          const endX = i * 45 * s + Math.cos(gameTime * 3 + i) * 10 * s;
          const endY = 120 * s;
          ctx.quadraticCurveTo(cpX, cpY, endX, endY);
          ctx.stroke();
        }

        rect(-15 * s, 0, 30 * s, 26 * s, '#501524');
        rect(-12 * s, -8 * s, 24 * s, 12 * s, '#38101a');
        rect(-18 * s, 6 * s, 36 * s, 18 * s, '#6b1c31');

        rect(-14 * s, 2 * s, 4 * s, 20 * s, '#2b0912');
        rect(10 * s, 2 * s, 4 * s, 20 * s, '#2b0912');
        rect(-4 * s, -4 * s, 8 * s, 16 * s, '#84203b');

        const eyeColor = enraged ? '#ffffff' : '#ff2647';
        rect(-10 * s, 8 * s, 7 * s, 5 * s, eyeColor);
        rect(3 * s, 8 * s, 7 * s, 5 * s, eyeColor);
        rect(-8 * s, 9 * s, 3 * s, 3 * s, '#fff');
        rect(5 * s, 9 * s, 3 * s, 3 * s, '#fff');

        rect(-18 * s, 26 * s, 36 * s, 38 * s, '#3b101c');
        rect(-14 * s, 30 * s, 28 * s, 6 * s, '#6e1d33');
        rect(-12 * s, 40 * s, 24 * s, 6 * s, '#6e1d33');
        rect(-10 * s, 50 * s, 20 * s, 6 * s, '#6e1d33');

        const clawWave = Math.sin(gameTime * 4) * 8 * s;
        rect(-32 * s, 28 * s + clawWave, 14 * s, 28 * s, '#5a1727');
        for (let f = 0; f < 4; f++) {
          rect((-34 + f * 4) * s, (54 + f * 4) * s + clawWave, 3 * s, 22 * s, '#7d1e37');
        }

        rect(18 * s, 28 * s - clawWave, 12 * s, 32 * s, '#5a1727');
        rect(-14 * s, 64 * s, 10 * s, 28 * s, '#2c0c16');
        rect(4 * s, 64 * s, 10 * s, 28 * s, '#2c0c16');

        ctx.restore();
      }

      // Demogorgon / Demodog Renderer
      function drawDemogorgon(x, y, s, isDemodog) {
        ctx.save();
        ctx.translate(x, y);

        if (isDemodog) {
          // Quadruped crawling demodog
          rect(-18 * s, 10 * s, 36 * s, 16 * s, '#421421');
          rect(-22 * s, 24 * s, 8 * s, 12 * s, '#2c0c16');
          rect(14 * s, 24 * s, 8 * s, 12 * s, '#2c0c16');
          // Head low
          rect(-10 * s, -2 * s, 20 * s, 16 * s, '#681c2b');
          rect(-6 * s, 2 * s, 12 * s, 8 * s, '#ffffff'); // teeth
          ctx.restore();
          return;
        }

        const open = 1 + 0.15 * Math.sin(gameTime * 12);
        ctx.fillStyle = '#681c2b';
        ctx.beginPath();
        ctx.arc(0, 0, 16 * s * open, 0, Math.PI * 2);
        ctx.fill();

        for (let i = 0; i < 5; i++) {
          const a = (i * Math.PI * 2) / 5 + gameTime * 2;
          const px = Math.cos(a) * 20 * s * open;
          const py = Math.sin(a) * 20 * s * open;
          rect(px - 4 * s, py - 4 * s, 8 * s, 8 * s, '#ff4757');
          rect(px - 2 * s, py - 2 * s, 4 * s, 4 * s, '#ffffff');
        }

        rect(-6 * s, -6 * s, 12 * s, 12 * s, '#1e050b');
        rect(-12 * s, 14 * s, 24 * s, 26 * s, '#3d141e');
        rect(-22 * s, 18 * s, 10 * s, 20 * s, '#4e1b27');
        rect(12 * s, 18 * s, 10 * s, 20 * s, '#4e1b27');

        ctx.restore();
      }

      // Demobat High Flying Enemy (Requires sliding to avoid!)
      function drawDemobat(x, y, s) {
        ctx.save();
        ctx.translate(x, y);
        const wingFlap = Math.sin(gameTime * 22) * 12 * s;

        ctx.fillStyle = '#3a0d18';
        // Wings
        ctx.beginPath();
        ctx.moveTo(0, 0);
        ctx.lineTo(-28 * s, wingFlap);
        ctx.lineTo(-12 * s, 10 * s);
        ctx.lineTo(0, 4 * s);
        ctx.lineTo(12 * s, 10 * s);
        ctx.lineTo(28 * s, wingFlap);
        ctx.closePath();
        ctx.fill();

        // Glowing red eyes
        rect(-4 * s, 0, 3 * s, 3 * s, '#ff1e42');
        rect(2 * s, 0, 3 * s, 3 * s, '#ff1e42');
        drawText('¡AGÁCHATE!', 0, -18 * s, 9 * s, '#ffcf57', 'center', 900);

        ctx.restore();
      }

      // Background with 3D road, upside down trees, Hawkins horizon & lightning
      function drawWorld(dt) {
        const lvl = LEVELS[currentLevelIdx];
        const skyGrad = ctx.createLinearGradient(0, 0, 0, H * 0.45);
        skyGrad.addColorStop(0, lvl.sky1);
        skyGrad.addColorStop(1, lvl.sky2);
        ctx.fillStyle = skyGrad;
        ctx.fillRect(0, 0, W, H * 0.45);

        // Lightning flash effect
        if (lightningTimer > 0) {
          ctx.fillStyle = 'rgba(255, 30, 60, ' + Math.min(0.35, lightningTimer * 2) + ')';
          ctx.fillRect(0, 0, W, H);
          lightningTimer -= dt;
        } else if (Math.random() < 0.008) {
          lightningTimer = 0.2;
        }

        // Blood Moon / Portal
        const moonX = W * 0.8;
        const moonY = H * 0.16;
        const moonR = Math.min(W, H) * 0.11;
        const moonGrad = ctx.createRadialGradient(moonX, moonY, moonR * 0.2, moonX, moonY, moonR * 1.3);
        moonGrad.addColorStop(0, lvl.borderColor);
        moonGrad.addColorStop(1, 'rgba(0,0,0,0)');
        ctx.fillStyle = moonGrad;
        ctx.beginPath();
        ctx.arc(moonX, moonY, moonR * 1.3, 0, Math.PI * 2);
        ctx.fill();

        // Grandfather Clock in Mist
        const clockX = W * 0.2;
        const clockY = H * 0.32;
        ctx.fillStyle = 'rgba(10, 12, 22, 0.75)';
        rect(clockX - 14, clockY - 60, 28, 80);
        rect(clockX - 18, clockY - 65, 36, 10);
        ctx.fillStyle = 'rgba(255, 200, 100, 0.4)';
        ctx.beginPath();
        ctx.arc(clockX, clockY - 45, 8, 0, Math.PI * 2);
        ctx.fill();

        // Parallax Scenery (Pines, Lab pipes, or Creel spires)
        for (let i = 0; i < 14; i++) {
          const scX = ((i * 64 - distance * 0.2) % (W + 80)) - 40;
          const scY = H * 0.38;
          ctx.fillStyle = '#0a1017';
          rect(scX, scY - 50, 5, 60);
          ctx.strokeStyle = '#0e1822';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.moveTo(scX + 2, scY - 25);
          ctx.lineTo(scX - 18, scY - 48);
          ctx.moveTo(scX + 2, scY - 15);
          ctx.lineTo(scX + 20, scY - 42);
          ctx.stroke();
        }

        // 3D Perspective Road (Mode-7 style runner effect)
        const horizonY = H * 0.38;
        const roadTopW = W * 0.38;
        const roadBottomW = W * 1.15;

        ctx.fillStyle = '#05070c';
        ctx.fillRect(0, horizonY, W, H - horizonY);

        ctx.beginPath();
        ctx.moveTo((W - roadTopW) / 2, horizonY);
        ctx.lineTo((W + roadTopW) / 2, horizonY);
        ctx.lineTo((W + roadBottomW) / 2, H);
        ctx.lineTo((W - roadBottomW) / 2, H);
        ctx.closePath();
        ctx.fillStyle = lvl.roadColor;
        ctx.fill();

        ctx.strokeStyle = lvl.borderColor;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo((W - roadTopW) / 2, horizonY);
        ctx.lineTo((W - roadBottomW) / 2, H);
        ctx.moveTo((W + roadTopW) / 2, horizonY);
        ctx.lineTo((W + roadBottomW) / 2, H);
        ctx.stroke();

        const numMarkers = 7;
        const speedOffset = (distance * 1.6) % 80;
        for (let i = 0; i < numMarkers; i++) {
          const progress = ((i * 80 + speedOffset) % (H - horizonY)) / (H - horizonY);
          const py = horizonY + progress * (H - horizonY);
          const currentRoadW = roadTopW + progress * (roadBottomW - roadTopW);
          const markerH = 6 + progress * 24;
          const markerW = 2 + progress * 6;

          const x1 = W / 2 - currentRoadW * 0.16;
          const x2 = W / 2 + currentRoadW * 0.16;

          rect(x1 - markerW / 2, py, markerW, markerH, lvl.markerColor);
          rect(x2 - markerW / 2, py, markerW, markerH, lvl.markerColor);
        }

        // Ambient particles
        ambientParticles.forEach(function (sp) {
          sp.y += sp.speedY * dt;
          sp.x += Math.sin(gameTime * 2 + sp.pulse) * sp.speedX * dt;
          if (sp.y > H) sp.y = 0;
          if (sp.x > W) sp.x = 0;
          if (sp.x < 0) sp.x = W;

          ctx.fillStyle = 'rgba(' + (currentLevelIdx >= 3 ? '255, 100, 120' : '180, 220, 255') + ', ' + sp.alpha + ')';
          ctx.beginPath();
          ctx.arc(sp.x, sp.y, sp.r, 0, Math.PI * 2);
          ctx.fill();
        });

        // Vignette
        const vig = ctx.createRadialGradient(W / 2, H / 2, H * 0.25, W / 2, H / 2, H * 0.82);
        vig.addColorStop(0, 'rgba(0,0,0,0)');
        vig.addColorStop(1, 'rgba(0,0,0,0.78)');
        ctx.fillStyle = vig;
        ctx.fillRect(0, 0, W, H);
      }

      function spawnHazard() {
        const lvl = LEVELS[currentLevelIdx];
        const r = Math.random();
        let type = 'gate';

        if (r < 0.28) {
          type = 'crystal';
        } else if (r < 0.40) {
          type = currentLevelIdx === 0 ? 'demodog' : currentLevelIdx >= 3 ? 'demobat_high' : 'demogorgon';
        } else if (r < 0.50 && powerupTimer <= 0) {
          type = 'walkman';
        } else if (r < 0.57 && lives < maxLives) {
          type = 'waffle';
        } else if (r < 0.78) {
          type = currentLevelIdx === 1 ? 'gate_laser' : 'gate';
        } else {
          type = 'tentacle';
        }

        hazards.push({
          lane: Math.floor(Math.random() * 3),
          z: 0,
          type: type,
          hit: false
        });
      }

      function drawHazard(o) {
        const horizonY = H * 0.38;
        const y = horizonY + o.z * (H * 0.52);
        const roadSpread = (W * 0.24) + o.z * (W * 0.26);
        const x = W / 2 + (o.lane - 1) * roadSpread;
        const s = 0.45 + o.z * 1.15;

        if (o.type === 'crystal') {
          ctx.save();
          ctx.translate(x, y);
          ctx.rotate(gameTime * 4);
          ctx.shadowColor = '#ffd32a';
          ctx.shadowBlur = 12 * s;
          rect(-8 * s, -11 * s, 16 * s, 22 * s, '#ffcf57');
          rect(-4 * s, -7 * s, 8 * s, 14 * s, '#ffffff');
          ctx.shadowBlur = 0;
          ctx.restore();
        } else if (o.type === 'walkman') {
          ctx.save();
          ctx.translate(x, y);
          ctx.shadowColor = '#00f0ff';
          ctx.shadowBlur = 15 * s;
          roundRect(-16 * s, -10 * s, 32 * s, 20 * s, 4 * s, '#0984e3', '#00cec9', 2);
          rect(-10 * s, -4 * s, 20 * s, 8 * s, '#dfe6e9');
          ctx.fillStyle = '#2d3436';
          ctx.beginPath();
          ctx.arc(-5 * s, 0, 3 * s, 0, Math.PI * 2);
          ctx.arc(5 * s, 0, 3 * s, 0, Math.PI * 2);
          ctx.fill();
          drawText('WALKMAN', 0, 16 * s, 9 * s, '#00f0ff', 'center', 900);
          ctx.shadowBlur = 0;
          ctx.restore();
        } else if (o.type === 'waffle') {
          ctx.save();
          ctx.translate(x, y);
          ctx.shadowColor = '#e1b12c';
          ctx.shadowBlur = 10 * s;
          ctx.fillStyle = '#f5cd79';
          ctx.beginPath();
          ctx.arc(0, 0, 12 * s, 0, Math.PI * 2);
          ctx.fill();
          rect(-7 * s, -7 * s, 14 * s, 14 * s, '#e58e26');
          rect(-5 * s, -5 * s, 10 * s, 10 * s, '#f5cd79');
          drawText('+1 VIDA', 0, 18 * s, 8 * s, '#ffcf57', 'center', 900);
          ctx.shadowBlur = 0;
          ctx.restore();
        } else if (o.type === 'demodog') {
          drawDemogorgon(x, y, 0.85 * s, true);
        } else if (o.type === 'demogorgon') {
          drawDemogorgon(x, y, 0.9 * s, false);
        } else if (o.type === 'demobat_high') {
          drawDemobat(x, y - 28 * s, 0.9 * s);
        } else if (o.type === 'gate_laser') {
          roundRect(x - 20 * s, y - 30 * s, 40 * s, 60 * s, 6 * s, '#0a2335', '#00cec9', 2);
          ctx.strokeStyle = '#00cec9';
          ctx.lineWidth = 3 * s;
          ctx.beginPath();
          ctx.moveTo(x - 16 * s, y - 10 * s);
          ctx.lineTo(x + 16 * s, y - 10 * s);
          ctx.stroke();
        } else if (o.type === 'gate') {
          roundRect(x - 18 * s, y - 28 * s, 36 * s, 56 * s, 6 * s, '#3b0d18', '#ff385c', 3);
          rect(x - 12 * s, y - 22 * s, 24 * s, 44 * s, '#160408');
          ctx.strokeStyle = '#ff7675';
          ctx.lineWidth = 2 * s;
          ctx.beginPath();
          ctx.moveTo(x, y - 18 * s);
          ctx.lineTo(x + (Math.sin(gameTime * 25) * 6 * s), y);
          ctx.lineTo(x, y + 18 * s);
          ctx.stroke();
        } else {
          ctx.fillStyle = '#4a0f1d';
          rect(x - 8 * s, y - 35 * s, 16 * s, 40 * s);
          rect(x - 14 * s, y - 42 * s, 28 * s, 10 * s, '#c70b27');
        }

        return { x: x, y: y };
      }

      // Top HUD Bar with Stranger Things Branding, Hearts, Crystals & Sound Button
      function drawHud() {
        const padX = 14;
        const padY = 14;
        const hudW = W - padX * 2;
        const hudH = 68;
        const lvl = LEVELS[currentLevelIdx];

        roundRect(padX, padY, hudW, hudH, 12, 'rgba(8, 10, 18, 0.88)', lvl.borderColor, 1.5);

        drawText('BEYOND HAWKINS', padX + 14, padY + 22, 11, '#ff3b56', 'left', 900);
        drawText(lvl.name, padX + 14, padY + 40, 13, '#ffffff', 'left', 800);
        drawText(HEROES[selectedHero].name, padX + 14, padY + 56, 10, '#8395a7', 'left', 700);

        let heartStr = '';
        for (let i = 0; i < maxLives; i++) {
          heartStr += (i < lives ? '♥ ' : '♡ ');
        }
        drawText(heartStr, W - padX - 58, padY + 24, 16, '#ff385c', 'right', 900);
        drawText('◆ ' + sessionCoins + '   ' + Math.floor(distance) + ' m', W - padX - 58, padY + 42, 12, '#ffcf57', 'right', 800);

        if (combo > 1) {
          drawText('COMBO x' + combo + '!', W - padX - 58, padY + 58, 11, '#00cec9', 'right', 900);
        }

        // Sound Toggle Button
        const soundBtnX = W - padX - 44;
        const soundBtnY = padY + 12;
        roundRect(soundBtnX, soundBtnY, 34, 34, 8, soundEnabled ? '#1e272e' : '#57606f', '#c70b27', 1);
        drawText(soundEnabled ? '🔊' : '🔇', soundBtnX + 17, soundBtnY + 23, 16, '#fff', 'center');
        buttons.push({
          x: soundBtnX,
          y: soundBtnY,
          w: 34,
          h: 34,
          action: function () {
            soundEnabled = !soundEnabled;
            try { localStorage.setItem('bh_sound', soundEnabled ? 'true' : 'false'); } catch (e) {}
            if (soundEnabled) initAudio();
          }
        });

        // Level Progress to Boss encounter
        const barY = padY + hudH + 4;
        roundRect(padX, barY, hudW, 5, 2, '#2c1018');
        const lvlDistCovered = distance - levelStartDist;
        const lvlDistTarget = lvl.targetDist - levelStartDist;
        const progress = Math.min(Math.max(0, lvlDistCovered / lvlDistTarget), 1);
        roundRect(padX, barY, hudW * progress, 5, 2, progress >= 1 ? '#ff385c' : lvl.borderColor);

        // Walkman Banner
        if (powerupTimer > 0) {
          const bannerY = barY + 12;
          roundRect(padX, bannerY, hudW, 26, 6, 'rgba(0, 206, 201, 0.85)', '#fff', 1);
          drawText('★ MODO TRANCE (INVULNERABLE) ★ ' + Math.ceil(powerupTimer) + 's', W / 2, bannerY + 18, 11, '#000', 'center', 900);
        }
      }

      // Mobile Touch Controls Overlay with 4 Arcade Buttons (LEFT, SLIDE, JUMP, RIGHT)
      function drawMobileControls() {
        const btnY = H * 0.83;
        const btnH = H * 0.13;
        const pad = W * 0.03;
        const btnW = (W - pad * 5) / 4;

        // 1. LEFT BUTTON
        const b1X = pad;
        roundRect(b1X, btnY, btnW, btnH, 12, 'rgba(18, 22, 36, 0.75)', '#c70b27', 2);
        drawText('◀', b1X + btnW / 2, btnY + btnH * 0.45, 22, '#ffffff', 'center', 900);
        drawText('IZQ', b1X + btnW / 2, btnY + btnH * 0.78, 10, '#dcdde1', 'center', 800);
        buttons.push({
          x: b1X, y: btnY, w: btnW, h: btnH,
          action: function () {
            lane = Math.max(0, lane - 1);
            if (navigator.vibrate) navigator.vibrate(15);
          }
        });

        // 2. SLIDE BUTTON (AGANCHARSE)
        const b2X = b1X + btnW + pad;
        roundRect(b2X, btnY, btnW, btnH, 12, 'rgba(18, 22, 36, 0.75)', '#0984e3', 2);
        drawText('▼', b2X + btnW / 2, btnY + btnH * 0.45, 22, '#00cec9', 'center', 900);
        drawText('ABAJO', b2X + btnW / 2, btnY + btnH * 0.78, 10, '#00cec9', 'center', 900);
        buttons.push({
          x: b2X, y: btnY, w: btnW, h: btnH,
          action: function () {
            if (isGrounded) {
              isSliding = true;
              slideTimer = 0.65;
              sfxSlide();
              if (navigator.vibrate) navigator.vibrate(15);
            } else {
              jumpVel = -600; // fast descent
            }
          }
        });

        // 3. JUMP BUTTON
        const b3X = b2X + btnW + pad;
        roundRect(b3X, btnY, btnW, btnH, 12, 'rgba(199, 11, 39, 0.82)', '#ff385c', 2);
        drawText('▲', b3X + btnW / 2, btnY + btnH * 0.45, 22, '#ffffff', 'center', 900);
        drawText('SALTO', b3X + btnW / 2, btnY + btnH * 0.78, 10, '#ffffff', 'center', 900);
        buttons.push({
          x: b3X, y: btnY, w: btnW, h: btnH,
          action: function () {
            if (isGrounded) {
              jumpVel = selectedHero === 0 ? 520 : 470;
              isGrounded = false;
              isSliding = false;
              sfxJump();
              if (navigator.vibrate) navigator.vibrate(20);
            }
          }
        });

        // 4. RIGHT BUTTON
        const b4X = b3X + btnW + pad;
        roundRect(b4X, btnY, btnW, btnH, 12, 'rgba(18, 22, 36, 0.75)', '#c70b27', 2);
        drawText('▶', b4X + btnW / 2, btnY + btnH * 0.45, 22, '#ffffff', 'center', 900);
        drawText('DER', b4X + btnW / 2, btnY + btnH * 0.78, 10, '#dcdde1', 'center', 800);
        buttons.push({
          x: b4X, y: btnY, w: btnW, h: btnH,
          action: function () {
            lane = Math.min(2, lane + 1);
            if (navigator.vibrate) navigator.vibrate(15);
          }
        });
      }

      function startLevel(lvlIndex) {
        initAudio();
        currentLevelIdx = lvlIndex;
        levelStartDist = lvlIndex === 0 ? 0 : LEVELS[lvlIndex - 1].targetDist;
        distance = levelStartDist;
        maxLives = 3 + upgrades.maxHp;
        lives = maxLives;
        sessionCoins = 0;
        lane = 1;
        targetLaneX = 1;
        currentLaneX = 1;
        jumpY = 0;
        jumpVel = 0;
        isGrounded = true;
        isSliding = false;
        slideTimer = 0;
        invulnTimer = selectedHero === 1 ? 5.0 : 0;
        powerupTimer = 0;
        combo = 0;
        hazards = [];
        particles = [];
        damageTexts = [];
        state = 'play';
        sfxPowerup();
      }

      function gameLoop(timestamp) {
        if (!lastTime) lastTime = timestamp;
        const dt = Math.min((timestamp - lastTime) / 1000, 0.05);
        lastTime = timestamp;
        gameTime += dt;
        buttons = [];

        ctx.save();
        if (shakeTimer > 0) {
          shakeTimer -= dt;
          const sx = (Math.random() - 0.5) * shakeMagnitude * 20;
          const sy = (Math.random() - 0.5) * shakeMagnitude * 20;
          ctx.translate(sx, sy);
        }

        drawWorld(dt);
        updateMusic(dt);

        if (state === 'title') {
          // TITLE SCREEN
          drawVecna(W * 0.76, H * 0.32, 0.9, false);
          drawHero(W * 0.28, H * 0.48, 0.95, false, false, false);

          drawText('BEYOND HAWKINS', W / 2, H * 0.13, 13, '#c70b27', 'center', 900);
          drawText('ESCAPE DE VECNA', W / 2, H * 0.19, Math.min(32, W * 0.088), '#ffffff', 'center', 900);
          drawText('CAMPAÑA ARCADE COMPLETA EN 5 NIVELES', W / 2, H * 0.23, 10, '#d1b9c3', 'center', 700);

          roundRect(W * 0.1, H * 0.55, W * 0.8, 52, 10, 'rgba(16, 20, 32, 0.85)', '#3d121f', 1);
          drawText('BANCO DE CRISTALES: ◆ ' + totalBankedCoins, W / 2, H * 0.585, 11, '#ffcf57', 'center', 800);
          drawText('RÉCORD: ' + bestDist + ' METROS  ·  ' + bestScore + ' PTS', W / 2, H * 0.615, 12, '#ffffff', 'center', 900);

          button('INICIAR CAMPAÑA', W * 0.1, H * 0.65, W * 0.8, 50, function () {
            startLevel(0);
          }, { bg: '#c70b27', size: 16 });

          button('SELECCIONAR NIVEL (' + unlockedLevels + '/5)', W * 0.1, H * 0.73, W * 0.8, 44, function () {
            state = 'level_select';
          }, { bg: '#1e272e', border: '#718093', size: 13 });

          button('TIENDA & MEJORAS (◆)', W * 0.1, H * 0.80, W * 0.38, 42, function () {
            state = 'shop';
          }, { bg: '#2f3542', border: '#ffd32a', color: '#ffd32a', size: 12 });

          button('PERSONAJES', W * 0.52, H * 0.80, W * 0.38, 42, function () {
            state = 'char_select';
          }, { bg: '#2f3542', border: '#718093', size: 12 });

          button('CÓMO JUGAR / AYUDA', W * 0.1, H * 0.87, W * 0.8, 38, function () {
            state = 'help';
          }, { bg: '#101019', border: '#333', color: '#ccc', size: 11 });

        } else if (state === 'level_select') {
          // LEVEL SELECT (CHECKPOINTS)
          drawText('SELECCIONAR NIVEL', W / 2, H * 0.13, 20, '#ff385c', 'center', 900);
          drawText('Continúa tu aventura desde cualquier nivel superado', W / 2, H * 0.17, 11, '#a4b0be');

          let lvlY = H * 0.22;
          LEVELS.forEach(function (lvl, idx) {
            const isUnlocked = idx < unlockedLevels;
            const bg = isUnlocked ? 'rgba(18, 22, 36, 0.9)' : 'rgba(10, 10, 15, 0.6)';
            const border = isUnlocked ? lvl.borderColor : '#333';

            roundRect(W * 0.08, lvlY, W * 0.84, 56, 10, bg, border, 1.5);
            drawText(lvl.name, W * 0.12, lvlY + 22, 12, isUnlocked ? '#fff' : '#666', 'left', 900);
            drawText(lvl.sub, W * 0.12, lvlY + 38, 9.5, isUnlocked ? '#a4b0be' : '#444', 'left', 600);

            if (isUnlocked) {
              button('JUGAR', W * 0.72, lvlY + 12, W * 0.18, 32, function () {
                startLevel(idx);
              }, { bg: lvl.borderColor, size: 11 });
            } else {
              drawText('🔒 BLOQUEADO', W * 0.81, lvlY + 32, 10, '#e74c3c', 'center', 800);
            }
            lvlY += 66;
          });

          button('VOLVER AL MENÚ', W * 0.1, H * 0.88, W * 0.8, 44, function () {
            state = 'title';
          }, { bg: '#101019', border: '#444', size: 13 });

        } else if (state === 'shop') {
          // UPGRADES SHOP (TIENDA DE DUSTIN)
          drawText('TALLER DE HAWKINS', W / 2, H * 0.12, 20, '#ffd32a', 'center', 900);
          drawText('Tus cristales guardados: ◆ ' + totalBankedCoins, W / 2, H * 0.16, 13, '#ffffff', 'center', 800);

          const shopItems = [
            { key: 'maxHp', name: 'Corazón Adicional', desc: '+1 Corazón de vida máxima permanente', cost: 150, lvl: upgrades.maxHp, max: 2 },
            { key: 'walkmanDur', name: 'Batería Walkman', desc: '+2 Segundos adicionales de Modo Trance', cost: 100, lvl: upgrades.walkmanDur, max: 3 },
            { key: 'magnet', name: 'Imán de Hawkins', desc: 'Atrae automáticamente los cristales cercanos', cost: 120, lvl: upgrades.magnet, max: 2 },
            { key: 'scoreMult', name: 'Multiplicador 80s', desc: '+25% de puntuación extra en cada nivel', cost: 200, lvl: upgrades.scoreMult, max: 2 }
          ];

          let itemY = H * 0.21;
          shopItems.forEach(function (it) {
            roundRect(W * 0.08, itemY, W * 0.84, 62, 10, 'rgba(16, 20, 32, 0.9)', '#ffd32a', 1);
            drawText(it.name + ' (Nv ' + it.lvl + '/' + it.max + ')', W * 0.12, itemY + 22, 12, '#ffffff', 'left', 900);
            drawText(it.desc, W * 0.12, itemY + 40, 9.5, '#a4b0be', 'left', 600);

            if (it.lvl < it.max) {
              const canAfford = totalBankedCoins >= it.cost;
              button('◆ ' + it.cost, W * 0.68, itemY + 14, W * 0.22, 34, function () {
                if (totalBankedCoins >= it.cost) {
                  totalBankedCoins -= it.cost;
                  upgrades[it.key]++;
                  try {
                    localStorage.setItem('bh_banked_coins', totalBankedCoins);
                    localStorage.setItem('bh_upgrades', JSON.stringify(upgrades));
                  } catch (e) {}
                  sfxCoin();
                  sfxPowerup();
                }
              }, { bg: canAfford ? '#ffd32a' : '#57606f', color: '#000', size: 12 });
            } else {
              drawText('¡MÁXIMO!', W * 0.79, itemY + 36, 11, '#2ed573', 'center', 900);
            }
            itemY += 74;
          });

          button('VOLVER AL MENÚ', W * 0.1, H * 0.86, W * 0.8, 44, function () {
            state = 'title';
          }, { bg: '#101019', border: '#444', size: 13 });

        } else if (state === 'char_select') {
          // CHARACTER SELECTION
          drawText('SELECCIÓN DE PERSONAJE', W / 2, H * 0.13, 20, '#ff385c', 'center', 900);
          drawText('Cada héroe posee una ventaja estratégica única', W / 2, H * 0.17, 11, '#a4b0be');

          const hero = HEROES[selectedHero];
          drawHero(W / 2, H * 0.34, 1.4, false, false, selectedHero === 0);

          roundRect(W * 0.1, H * 0.44, W * 0.8, 120, 12, 'rgba(16, 20, 34, 0.92)', hero.color, 2);
          drawText(hero.name, W / 2, H * 0.49, 18, '#ffffff', 'center', 900);
          drawText(hero.sub, W / 2, H * 0.53, 12, hero.color, 'center', 800);
          drawText(hero.desc, W / 2, H * 0.58, 11, '#dcdde1', 'center', 600);

          button('◀ ANTERIOR', W * 0.1, H * 0.64, W * 0.38, 44, function () {
            selectedHero = (selectedHero - 1 + HEROES.length) % HEROES.length;
            sfxJump();
          }, { bg: '#2f3542', border: '#57606f', size: 12 });

          button('SIGUIENTE ▶', W * 0.52, H * 0.64, W * 0.38, 44, function () {
            selectedHero = (selectedHero + 1) % HEROES.length;
            sfxJump();
          }, { bg: '#2f3542', border: '#57606f', size: 12 });

          button('SELECCIONAR Y JUGAR', W * 0.1, H * 0.73, W * 0.8, 52, function () {
            startLevel(0);
          }, { bg: '#c70b27', size: 15 });

          button('VOLVER AL MENÚ', W * 0.1, H * 0.82, W * 0.8, 42, function () {
            state = 'title';
          }, { bg: '#101019', border: '#444', size: 12 });

        } else if (state === 'help') {
          // HELP / INSTRUCTIONS
          drawText('CÓMO JUGAR', W / 2, H * 0.13, 20, '#ff385c', 'center', 900);

          const helpItems = [
            { icon: '◀ ▶', title: 'MOVERSE ENTRE CARRILES', desc: 'Toca las flechas o desliza horizontalmente.' },
            { icon: '▲', title: 'SALTO DE OBSTÁCULOS', desc: 'Salta por encima de zarcillos, grietas y coches.' },
            { icon: '▼', title: 'DESLIZARSE / AGACHARSE', desc: 'Pasa por debajo de murciélagos (Demobats) y rayos.' },
            { icon: '📻', title: 'WALKMAN CASSETTE', desc: '¡Modo Trance invulnerable! Arrasa con los monstruos.' },
            { icon: '👑', title: '5 NIVELES CON JEFES', desc: 'Supera cada nivel para desbloquearlo en el mapa.' }
          ];

          let itemY = H * 0.20;
          helpItems.forEach(function (item) {
            roundRect(W * 0.08, itemY, W * 0.84, 52, 10, 'rgba(16, 20, 32, 0.85)', '#3b1420', 1);
            drawText(item.icon, W * 0.16, itemY + 32, 16, '#ffcf57', 'center', 900);
            drawText(item.title, W * 0.26, itemY + 22, 11, '#ffffff', 'left', 900);
            drawText(item.desc, W * 0.26, itemY + 38, 9.5, '#a4b0be', 'left', 600);
            itemY += 58;
          });

          button('¡ENTENDIDO, A JUGAR!', W * 0.1, H * 0.84, W * 0.8, 50, function () {
            startLevel(0);
          }, { bg: '#c70b27', size: 15 });

        } else if (state === 'play') {
          // ACTIVE GAMEPLAY
          drawHud();

          const lvl = LEVELS[currentLevelIdx];
          distance += dt * (45 + currentLevelIdx * 9);
          const scoreBonus = 1 + (upgrades.scoreMult * 0.25) + (selectedHero === 3 ? 0.3 : 0);
          score += Math.floor(dt * 30 * (powerupTimer > 0 ? 2 : 1) * (combo > 1 ? combo : 1) * scoreBonus);

          // Check if Boss of current level is reached!
          if (distance >= lvl.targetDist) {
            state = currentLevelIdx === 4 ? 'boss' : 'mini_boss';
            bossName = lvl.miniBoss;
            bossHealth = lvl.bossHp;
            bossMaxHealth = lvl.bossHp;
            bossTimer = 0;
            bossAttackTimer = 0;
            sfxClockGong();
            triggerShake(0.6, 0.8);
          }

          // Spawning obstacles
          if (Math.random() < dt * (1.1 + currentLevelIdx * 0.25)) {
            spawnHazard();
          }

          // Update slide timer
          if (isSliding) {
            slideTimer -= dt;
            if (slideTimer <= 0) isSliding = false;
          }

          // Update jump physics
          if (!isGrounded) {
            jumpY += jumpVel * dt;
            jumpVel -= 1250 * dt;
            if (jumpY <= 0) {
              jumpY = 0;
              jumpVel = 0;
              isGrounded = true;
              addParticle(W / 2 + (currentLaneX - 1) * (W * 0.26), H * 0.76, '#57606f', 6, 40);
            }
          }

          currentLaneX += (lane - currentLaneX) * Math.min(1, dt * 14);

          if (invulnTimer > 0) invulnTimer -= dt;
          if (powerupTimer > 0) {
            powerupTimer -= dt;
            if (powerupTimer <= 0) powerupType = null;
          }
          if (comboTimer > 0) {
            comboTimer -= dt;
            if (comboTimer <= 0) combo = 0;
          }

          // Render & Update Hazards
          hazards.forEach(function (o) {
            o.z += dt * (0.34 + currentLevelIdx * 0.045 + (powerupTimer > 0 ? 0.1 : 0));

            // Magnet upgrade or Dustin
            if ((upgrades.magnet > 0 || selectedHero === 3) && o.type === 'crystal' && o.z > 0.35) {
              if (o.lane < lane) o.lane += dt * 2.2;
              if (o.lane > lane) o.lane -= dt * 2.2;
            }

            const pos = drawHazard(o);

            // Collision check
            if (!o.hit && o.z > 0.72 && o.z < 0.96 && Math.abs(o.lane - lane) < 0.45) {
              if (o.type === 'crystal') {
                o.hit = true;
                sessionCoins++;
                totalBankedCoins++;
                try { localStorage.setItem('bh_banked_coins', totalBankedCoins); } catch (e) {}
                score += 150 * (combo + 1);
                combo++;
                comboTimer = 2.5;
                sfxCoin();
                addParticle(pos.x, pos.y, '#ffd32a', 10, 80);
                addDamageText('+' + (150 * combo), pos.x, pos.y, '#ffd32a');
              } else if (o.type === 'walkman') {
                o.hit = true;
                powerupType = 'walkman';
                const baseDur = selectedHero === 0 ? 9.0 : 6.5;
                powerupTimer = baseDur + (upgrades.walkmanDur * 2.0);
                sfxPowerup();
                triggerShake(0.3, 0.4);
                addParticle(pos.x, pos.y, '#00cec9', 20, 120);
                addDamageText('¡MODO TRANCE!', pos.x, pos.y, '#00f0ff');
              } else if (o.type === 'waffle') {
                o.hit = true;
                lives = Math.min(maxLives, lives + 1);
                sfxCoin();
                addDamageText('+1 VIDA', pos.x, pos.y, '#ff385c');
              } else {
                // High flying demobat can be dodged by SLIDING!
                if (o.type === 'demobat_high' && isSliding) {
                  // Successfully ducked under Demobat!
                  score += 200;
                  addDamageText('¡ESQUIVADO!', pos.x, pos.y, '#00cec9');
                  return;
                }

                if (powerupTimer > 0) {
                  o.hit = true;
                  score += 350;
                  sfxBossHit();
                  triggerShake(0.2, 0.2);
                  addParticle(pos.x, pos.y, '#ff1e42', 15, 100);
                  addDamageText('¡DESTRUIDO!', pos.x, pos.y, '#00f0ff');
                } else if (isGrounded || (o.type === 'demogorgon' && jumpY < 35)) {
                  if (invulnTimer <= 0) {
                    lives--;
                    invulnTimer = 1.6;
                    combo = 0;
                    triggerShake(0.5, 0.4);
                    sfxHit();
                    addParticle(pos.x, pos.y, '#ff385c', 18, 120);
                    addDamageText('-1 VIDA', pos.x, pos.y, '#ff385c');

                    if (lives <= 0) {
                      state = 'over';
                      if (score > bestScore) {
                        bestScore = score;
                        try { localStorage.setItem('bh_best_score', bestScore); } catch (e) {}
                      }
                      if (distance > bestDist) {
                        bestDist = Math.floor(distance);
                        try { localStorage.setItem('bh_best_dist', bestDist); } catch (e) {}
                      }
                    }
                  }
                  o.hit = true;
                }
              }
            }
          });

          hazards = hazards.filter(function (o) { return o.z < 1.15 && !o.hit; });

          const playerX = W / 2 + (currentLaneX - 1) * (W * 0.24 + 0.85 * (W * 0.26));
          const playerY = H * 0.76 - jumpY;

          if (invulnTimer <= 0 || Math.floor(gameTime * 14) % 2 === 0) {
            drawHero(playerX, playerY, 0.88, !isGrounded, isSliding, powerupTimer > 0);
          }

          drawMobileControls();

        } else if (state === 'mini_boss' || state === 'boss') {
          // BOSS BATTLE
          drawHud();
          bossTimer += dt;
          bossAttackTimer += dt;

          const barW = W * 0.74;
          const barH = 16;
          const barX = W * 0.13;
          const barY = H * 0.16;

          roundRect(barX, barY, barW, barH, 8, 'rgba(20, 6, 12, 0.9)', '#c70b27', 2);
          const hpPercent = Math.max(0, bossHealth / bossMaxHealth);
          roundRect(barX + 2, barY + 2, (barW - 4) * hpPercent, barH - 4, 6, '#ff1e42');
          drawText(bossName + ': ' + Math.ceil(bossHealth) + ' HP', W / 2, barY + 12, 11, '#ffffff', 'center', 900);

          if (state === 'boss') {
            drawVecna(W / 2, H * 0.28, 1.35, bossHealth < 80);
          } else {
            drawDemogorgon(W / 2, H * 0.32, 1.8, currentLevelIdx === 0);
          }

          drawHero(W / 2, H * 0.64, 1.05, false, false, powerupTimer > 0);

          drawText('¡COMBATE EN HAWKINS!', W / 2, H * 0.51, 20, '#ff385c', 'center', 900);
          drawText('Toca rápido para contraatacar', W / 2, H * 0.55, 12, '#ffffff', 'center', 700);

          const btnW = W * 0.78;
          const btnH = 66;
          const btnX = W * 0.11;
          const btnY = H * 0.76;

          button('¡ATACAR! (TAP RÁPIDO)', btnX, btnY, btnW, btnH, function () {
            const dmg = 8 + Math.floor(Math.random() * 8);
            bossHealth -= dmg;
            sfxBossHit();
            triggerShake(0.3, 0.18);
            addParticle(W / 2, H * 0.32, '#ff1e42', 12, 90);
            addDamageText('-' + dmg + ' HP', W / 2 + (Math.random() - 0.5) * 80, H * 0.3, '#ffcf57');

            if (bossHealth <= 0) {
              if (currentLevelIdx < 4) {
                // Beat Mini-boss -> Progress to next level!
                unlockedLevels = Math.max(unlockedLevels, currentLevelIdx + 2);
                try { localStorage.setItem('bh_unlocked_lvls', unlockedLevels); } catch (e) {}
                score += 1500;
                sfxPowerup();
                startLevel(currentLevelIdx + 1);
              } else {
                // Final Boss Beat! WON THE GAME!
                state = 'won';
                score += 5000;
                sfxPowerup();
                triggerShake(0.8, 1.0);
                if (score > bestScore) {
                  bestScore = score;
                  try { localStorage.setItem('bh_best_score', bestScore); } catch (e) {}
                }
              }
            }
          }, { bg: '#c70b27', border: '#ff5e78', size: 18 });

          if (bossAttackTimer > 2.8) {
            bossAttackTimer = 0;
            lives--;
            triggerShake(0.5, 0.4);
            sfxHit();
            addDamageText('¡GOLPE DEL MONSTRUO! -1', W / 2, H * 0.64, '#ff385c');

            if (lives <= 0) {
              state = 'over';
              if (score > bestScore) {
                bestScore = score;
                try { localStorage.setItem('bh_best_score', bestScore); } catch (e) {}
              }
            }
          }

        } else if (state === 'over' || state === 'won') {
          // GAME OVER OR VICTORY SCREEN
          const isWon = state === 'won';
          roundRect(W * 0.08, H * 0.18, W * 0.84, H * 0.66, 16, 'rgba(8, 10, 18, 0.94)', isWon ? '#ffd32a' : '#c70b27', 2);

          drawText('BEYOND HAWKINS', W / 2, H * 0.23, 12, isWon ? '#ffd32a' : '#c70b27', 'center', 900);
          drawText(isWon ? '¡SALVASTE A HAWKINS!' : 'VECNA TE ATRAPÓ', W / 2, H * 0.29, Math.min(26, W * 0.075), '#ffffff', 'center', 900);
          drawText(isWon ? 'Vecna ha sido desterrado al abismo.' : 'El reloj ha marcado su cuarta campanada...', W / 2, H * 0.33, 11, '#a4b0be', 'center', 600);

          roundRect(W * 0.14, H * 0.38, W * 0.72, 110, 10, 'rgba(18, 22, 36, 0.85)', '#2c1018', 1);
          drawText('NIVEL ALCANZADO: ' + (currentLevelIdx + 1) + '/5', W / 2, H * 0.42, 12, '#ffffff', 'center', 800);
          drawText('DISTANCIA: ' + Math.floor(distance) + ' m', W / 2, H * 0.46, 13, '#ffffff', 'center', 800);
          drawText('CRISTALES DE SESIÓN: ◆ ' + sessionCoins, W / 2, H * 0.50, 13, '#ffd32a', 'center', 800);
          drawText('PUNTUACIÓN FINAL: ' + score + ' PTS', W / 2, H * 0.54, 14, '#00cec9', 'center', 900);

          button('VOLVER A INTENTAR', W * 0.14, H * 0.63, W * 0.72, 48, function () {
            startLevel(currentLevelIdx);
          }, { bg: '#c70b27', size: 15 });

          button('TIENDA & MEJORAS', W * 0.14, H * 0.71, W * 0.72, 40, function () {
            state = 'shop';
          }, { bg: '#2f3542', border: '#ffd32a', color: '#ffd32a', size: 12 });

          button('MENÚ PRINCIPAL', W * 0.14, H * 0.78, W * 0.72, 40, function () {
            state = 'title';
          }, { bg: '#1e272e', border: '#57606f', size: 12 });
        }

        // Render Particles
        particles.forEach(function (p) {
          p.x += p.vx * dt;
          p.y += p.vy * dt;
          p.life -= dt;
          ctx.fillStyle = p.color;
          ctx.beginPath();
          ctx.arc(p.x, p.y, Math.max(1, p.size * (p.life / p.maxLife)), 0, Math.PI * 2);
          ctx.fill();
        });
        particles = particles.filter(function (p) { return p.life > 0; });

        // Render Floating Damage Numbers
        damageTexts.forEach(function (d) {
          d.y += d.vy * dt;
          d.life -= dt;
          drawText(d.text, d.x, d.y, 14, d.color, 'center', 900);
        });
        damageTexts = damageTexts.filter(function (d) { return d.life > 0; });

        ctx.restore();
        requestAnimationFrame(gameLoop);
      }

      // Native Mobile Touch & Swipe Handling
      let touchStartX = 0;
      let touchStartY = 0;
      let touchStartTime = 0;

      function handleActionAt(x, y) {
        for (let i = buttons.length - 1; i >= 0; i--) {
          const b = buttons[i];
          if (x >= b.x && x <= b.x + b.w && y >= b.y && y <= b.y + b.h) {
            b.action();
            return true;
          }
        }
        return false;
      }

      canvas.addEventListener('touchstart', function (e) {
        e.preventDefault();
        initAudio();
        const touch = e.touches[0];
        const r = canvas.getBoundingClientRect();
        touchStartX = touch.clientX - r.left;
        touchStartY = touch.clientY - r.top;
        touchStartTime = Date.now();

        if (handleActionAt(touchStartX, touchStartY)) return;

        // If in gameplay and tapped upper screen:
        if (state === 'play' && touchStartY < H * 0.81) {
          if (touchStartX < W * 0.33) {
            lane = Math.max(0, lane - 1);
          } else if (touchStartX > W * 0.67) {
            lane = Math.min(2, lane + 1);
          } else {
            if (isGrounded) {
              jumpVel = selectedHero === 0 ? 520 : 470;
              isGrounded = false;
              sfxJump();
            }
          }
        }
      }, { passive: false });

      canvas.addEventListener('touchend', function (e) {
        e.preventDefault();
        const touch = e.changedTouches[0];
        const r = canvas.getBoundingClientRect();
        const endX = touch.clientX - r.left;
        const endY = touch.clientY - r.top;
        const deltaX = endX - touchStartX;
        const deltaY = endY - touchStartY;
        const timeDiff = Date.now() - touchStartTime;

        if (timeDiff < 450 && (Math.abs(deltaX) > 28 || Math.abs(deltaY) > 28)) {
          if (state === 'play') {
            if (Math.abs(deltaX) > Math.abs(deltaY)) {
              if (deltaX < -28) {
                lane = Math.max(0, lane - 1);
                if (navigator.vibrate) navigator.vibrate(15);
              } else if (deltaX > 28) {
                lane = Math.min(2, lane + 1);
                if (navigator.vibrate) navigator.vibrate(15);
              }
            } else {
              if (deltaY < -28 && isGrounded) {
                jumpVel = selectedHero === 0 ? 520 : 470;
                isGrounded = false;
                sfxJump();
                if (navigator.vibrate) navigator.vibrate(20);
              } else if (deltaY > 28) {
                // Swipe Down: Slide on ground or drop fast in air
                if (isGrounded) {
                  isSliding = true;
                  slideTimer = 0.65;
                  sfxSlide();
                } else {
                  jumpVel = -650;
                }
              }
            }
          }
        }
      }, { passive: false });

      canvas.addEventListener('mousedown', function (e) {
        initAudio();
        const r = canvas.getBoundingClientRect();
        const x = e.clientX - r.left;
        const y = e.clientY - r.top;
        if (handleActionAt(x, y)) return;

        if (state === 'play') {
          if (x < W * 0.33) {
            lane = Math.max(0, lane - 1);
          } else if (x > W * 0.67) {
            lane = Math.min(2, lane + 1);
          } else if (isGrounded) {
            jumpVel = 470;
            isGrounded = false;
            sfxJump();
          }
        }
      });

      window.addEventListener('keydown', function (e) {
        initAudio();
        if (e.key === 'ArrowLeft' || e.key === 'a' || e.key === 'A') {
          lane = Math.max(0, lane - 1);
        } else if (e.key === 'ArrowRight' || e.key === 'd' || e.key === 'D') {
          lane = Math.min(2, lane + 1);
        } else if ((e.key === 'ArrowUp' || e.key === 'w' || e.key === 'W' || e.key === ' ') && isGrounded) {
          jumpVel = 470;
          isGrounded = false;
          sfxJump();
        } else if (e.key === 'ArrowDown' || e.key === 's' || e.key === 'S') {
          if (isGrounded) {
            isSliding = true;
            slideTimer = 0.65;
            sfxSlide();
          } else {
            jumpVel = -650;
          }
        } else if (e.key === 'Escape') {
          if (state === 'play') state = 'paused';
          else if (state === 'paused') state = 'play';
        }
      });

      requestAnimationFrame(gameLoop);
    })();
  </script>
</body>
</html>
`;

export default escapeVecnaHtml;
