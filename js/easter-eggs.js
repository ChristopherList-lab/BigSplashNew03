/* ========================================
   BIG SPLASH - Easter Eggs
   ========================================
   Five delights for the curious.
     1. Konami code → splash ripple
     2. Console signature on every page load
     3. Logo rapid-click → water drip
     4. Live Production page → spacebar BPM tapper
     (5. Custom 404 page lives in /404.html)
   ======================================== */

(() => {
  // ========================================
  // Console signature (runs immediately)
  // ========================================
  const sig = [
    '',
    '        .    .    .    .    .',
    '      __~__~__~_ BIG SPLASH _~__~__~__',
    '     ~   ~    ~   Austin, TX   ~    ~   ~',
    '        .    .    .    .    .',
    '',
    '  You found us. We hire people who look here.',
    '  → hello@bigsplashvideo.com',
    '',
  ].join('\n');
  try {
    console.log('%c' + sig, 'color:#eff88b;font-family:ui-monospace,monospace;font-size:12px;line-height:1.5;');
  } catch (_) { /* no-op */ }

  // ========================================
  // Injected CSS for the visual eggs
  // ========================================
  const eggCSS = `
@keyframes bs-ripple {
  0%   { transform: translate(-50%, -50%) scale(0);   opacity: 0.55; }
  100% { transform: translate(-50%, -50%) scale(12);  opacity: 0;    }
}
.bs-ripple {
  position: fixed;
  top: 50%; left: 50%;
  width: 160px; height: 160px;
  border-radius: 50%;
  pointer-events: none;
  z-index: 9999;
  will-change: transform, opacity;
}
.bs-ripple.bs-lime {
  background: radial-gradient(circle, rgba(239,248,139,0.7) 0%, rgba(239,248,139,0.15) 50%, rgba(239,248,139,0) 72%);
  animation: bs-ripple 1.4s cubic-bezier(0.16, 1, 0.3, 1) forwards;
}
.bs-ripple.bs-sage {
  background: radial-gradient(circle, rgba(106,150,134,0.65) 0%, rgba(106,150,134,0.12) 50%, rgba(106,150,134,0) 72%);
  animation: bs-ripple 1.8s cubic-bezier(0.16, 1, 0.3, 1) 0.25s forwards;
}

@keyframes bs-drip-fall {
  0%   { transform: translateY(0)    scaleY(0.8); opacity: 0;   }
  15%  { transform: translateY(4px)  scaleY(1.1); opacity: 1;   }
  100% { transform: translateY(70px) scaleY(0.5); opacity: 0;   }
}
.bs-drip {
  position: fixed;
  width: 8px; height: 12px;
  background: #eff88b;
  border-radius: 50% 50% 50% 50% / 65% 65% 40% 40%;
  pointer-events: none;
  z-index: 9998;
  box-shadow: 0 0 10px rgba(239,248,139,0.6);
  animation: bs-drip-fall 0.95s cubic-bezier(0.55, 0, 0.75, 0) forwards;
}

@keyframes bs-wobble {
  0%, 100% { transform: rotate(0deg);  }
  18%      { transform: rotate(-4deg); }
  36%      { transform: rotate(3.5deg);}
  54%      { transform: rotate(-2.5deg);}
  72%      { transform: rotate(1.5deg);}
  90%      { transform: rotate(-0.5deg);}
}
.bs-wobble { animation: bs-wobble 0.55s ease-in-out; transform-origin: center; }

#bs-bpm-overlay {
  position: fixed;
  top: 1.25rem; right: 1.25rem;
  background: rgba(19,19,24,0.92);
  border: 1px solid rgba(106,150,134,0.6);
  color: #6a9686;
  font-family: 'JetBrains Mono', ui-monospace, monospace;
  font-size: 0.72rem;
  letter-spacing: 0.25em;
  padding: 0.55rem 1rem;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.25s ease;
  z-index: 9997;
  text-transform: uppercase;
  backdrop-filter: blur(6px);
}
#bs-bpm-overlay.bs-visible { opacity: 1; }
`;

  document.addEventListener('DOMContentLoaded', () => {
    const styleTag = document.createElement('style');
    styleTag.textContent = eggCSS;
    document.head.appendChild(styleTag);

    const path = window.location.pathname;
    const isHome = path === '/' || path.endsWith('/index.html') || path.endsWith('/');
    const isLiveProd = path.endsWith('/live-production.html');

    // ========================================
    // #1 Konami code → double splash ripple
    // ========================================
    const KONAMI = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a'];
    let buffer = [];
    document.addEventListener('keydown', (e) => {
      const key = e.key && e.key.length === 1 ? e.key.toLowerCase() : e.key;
      buffer.push(key);
      if (buffer.length > KONAMI.length) buffer.shift();
      if (buffer.length === KONAMI.length && buffer.every((k, i) => k === KONAMI[i])) {
        triggerSplash();
        buffer = [];
      }
    });

    function triggerSplash() {
      const lime = document.createElement('div');
      lime.className = 'bs-ripple bs-lime';
      const sage = document.createElement('div');
      sage.className = 'bs-ripple bs-sage';
      document.body.appendChild(lime);
      document.body.appendChild(sage);
      setTimeout(() => { lime.remove(); sage.remove(); }, 2300);
    }

    // ========================================
    // #3 Logo rapid-click → water drip
    //    On home: intercept all clicks, count, scroll to top.
    //    Elsewhere: count only; let nav happen normally.
    // ========================================
    const logo = document.querySelector('nav a[aria-label*="Home" i]')
             || document.querySelector('header a[aria-label*="Home" i]')
             || document.querySelector('nav a[href="index.html"]');
    if (logo) {
      let count = 0;
      let last = 0;
      const WINDOW_MS = 420;

      logo.addEventListener('click', (e) => {
        const now = Date.now();
        const rapid = now - last < WINDOW_MS;
        last = now;
        count = rapid ? count + 1 : 1;

        // On home, hijack all logo clicks (they'd reload anyway)
        if (isHome) {
          e.preventDefault();
          if (count >= 5) {
            playDrip(logo);
            count = 0;
          } else {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          }
          return;
        }

        // Off home: let the 1st click navigate; if they're fast enough
        // to reach count 5 before navigation starts, play drip on that page.
        if (count >= 5) {
          e.preventDefault();
          playDrip(logo);
          count = 0;
        }
      });
    }

    function playDrip(el) {
      const svg = el.querySelector('svg') || el;
      svg.classList.remove('bs-wobble');
      // force reflow to restart the animation cleanly
      void svg.offsetWidth;
      svg.classList.add('bs-wobble');

      const rect = svg.getBoundingClientRect();
      const drip = document.createElement('span');
      drip.className = 'bs-drip';
      // drip falls from below the "S" in the wordmark (~18% across, bottom edge)
      drip.style.left = Math.round(rect.left + rect.width * 0.18) + 'px';
      drip.style.top  = Math.round(rect.top  + rect.height * 0.85) + 'px';
      document.body.appendChild(drip);
      setTimeout(() => drip.remove(), 1000);
    }

    // ========================================
    // #4 Live Production: spacebar BPM tapper
    // ========================================
    if (isLiveProd) {
      const overlay = document.createElement('div');
      overlay.id = 'bs-bpm-overlay';
      document.body.appendChild(overlay);

      let taps = [];
      let hideTimer = null;

      document.addEventListener('keydown', (e) => {
        if (e.code !== 'Space') return;
        // Don't hijack space in form fields, buttons, or while the intake modal is open
        const t = e.target;
        if (t && t.matches && t.matches('input, textarea, select, [contenteditable="true"]')) return;
        if (document.body.classList.contains('intake-locked')) return;
        // Don't hijack space when focus is on a button (space activates it)
        if (t && t.tagName === 'BUTTON') return;

        const now = performance.now();
        // keep only taps from the last 2s to smooth tempo changes
        taps = taps.filter(ts => now - ts < 2000);
        taps.push(now);

        if (taps.length >= 4) {
          e.preventDefault();
          const diffs = [];
          for (let i = 1; i < taps.length; i++) diffs.push(taps[i] - taps[i - 1]);
          const avg = diffs.reduce((a, b) => a + b, 0) / diffs.length;
          const bpm = Math.round(60000 / avg);
          if (bpm >= 40 && bpm <= 240) {
            overlay.textContent = bpm + ' BPM';
            overlay.classList.add('bs-visible');
            clearTimeout(hideTimer);
            hideTimer = setTimeout(() => overlay.classList.remove('bs-visible'), 2600);
          }
        }
      });
    }
  });
})();
