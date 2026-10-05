'use strict';

const $ = s => document.querySelector(s);
const $$ = s => [...document.querySelectorAll(s)];

const icons = {
  code: 'm16 18 6-6-6-6M8 6l-6 6 6 6m6-16-4 20',
  sliders: 'M4 21v-7m0-4V3m8 18v-9m0-4V3m8 18v-5m0-4V3M1 14h6m2-6h6m2 8h6',
  layers: 'm12 3 10 5-10 5L2 8l10-5m-10 9 10 5 10-5m-20 5 10 5 10-5',
  download: 'M12 3v12m-5-5 5 5 5-5M5 16v5h14v-5',
  upload: 'M12 16V4m-5 5 5-5 5 5M5 16v5h14v-5',
  book: 'M12 7v14m0-14C9 4 5 4 2 5v15c3-1 7-1 10 1 3-2 7-2 10-1V5c-3-1-7-1-10 2',
  laptop: 'M4 3h16v13H4V3m-3 16h22l-2 2H3l-2-2',
  save: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h12l4 4v12a2 2 0 0 1-2 2M7 3v6h10V3M7 21v-8h10v8',
  file: 'M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8l-6-6m0 0v6h6',
  chevron: 'm6 9 6 6 6-6',
  copy: 'M9 9h12v12H9V9m6-4V3H3v12h2',
  reset: 'M3 11a9 9 0 1 1 2 7M3 3v8h8',
  bolt: 'm13 2-9 12h7l-1 8 10-12h-7l1-8',
  play: 'm8 5 11 7-11 7V5',
  stop: 'M6 6h12v12H6V6',
  terminal: 'm4 5 6 6-6 6m9 0h7',
  trash: 'M3 6h18M9 6V3h6v3M5 6l1 15h12l1-15M10 10v7m4-7v7',
  input: 'M3 3h18v18H3V3m3 9h12m-4-4 4 4-4 4',
  edit: 'm16 3 5 5-12 12-6 1 1-6L16 3m-3 3 5 5',
  bulb: 'M9 18h6m-5 3h4M8 14a6 6 0 1 1 8 0c-1 1-1 2-1 4H9c0-2 0-3-1-4',
  check: 'm4 12 5 5L20 6',
  sparkles: 'm12 3-1.9 5.8a2 2 0 0 1-1.3 1.3L3 12l5.8 1.9a2 2 0 0 1 1.3 1.3L12 21l1.9-5.8a2 2 0 0 1 1.3-1.3L21 12l-5.8-1.9a2 2 0 0 1-1.3-1.3L12 3z',
  volume: 'M11 5 6 9H2v6h4l5 4V5zm4.5 3a5 5 0 0 1 0 8m2.5-11a9 9 0 0 1 0 14',
  volume_off: 'm1 1 22 22M11 5 7.5 7.8M6 9H2v6h4l5 4V13m4.5-5a5 5 0 0 1 1 5.5M18 4a9 9 0 0 1 2.5 9.5',
  smile: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20zM8 14s1.5 2 4 2 4-2 4-2M9 9h.01M15 9h.01',
  trophy: 'M6 9V3h12v6a6 6 0 0 1-6 6 6 6 0 0 1-6-6zm0-4H2v3a4 4 0 0 0 4 4zm12 0h4v3a4 4 0 0 1-4 4zM9 21h6m-3-6v6'
};

function drawIcons(root = document) {
  root.querySelectorAll('[data-icon]').forEach(el => {
    const path = icons[el.dataset.icon] ?? icons.code;
    el.innerHTML = `<svg viewBox="0 0 24 24" aria-hidden="true"><path d="${path}"/></svg>`;
  });
}

const escapeHTML = s => String(s).replace(/[&<>"']/g, c => ({
  '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
}[c]));

const descriptors = {
  let: ['Variable', 'Store a value in memory'],
  print: ['Output', 'Display or print a value'],
  if: ['Condition', 'Branch when a condition is true'],
  else: ['Otherwise', 'The alternative branch'],
  for: ['For loop', 'Iterate over items in a list or text'],
  in: ['In keyword', 'Used with for: for item in list'],
  repeat: ['Repeat', 'Run a fixed number of times'],
  while: ['While', 'Loop while a condition is true'],
  end: ['End block', 'Close a loop, condition or function'],
  function: ['Function', 'Create a reusable function'],
  return: ['Return', 'Send a value back from a function'],
  input: ['Input', 'Read one line of input from user'],
  true: ['True', 'A true boolean value'],
  false: ['False', 'A false boolean value'],
  and: ['And', 'Both conditions must be true'],
  or: ['Or', 'Either condition may be true'],
  not: ['Not', 'Reverse or invert a condition']
};

const exampleData = {
  welcome: {
    title: 'Hello, world',
    description: 'A few words. A new language. Start with variables and your very first output.',
    tag: 'THE FIRST STEP',
    category: 'basics',
    badge: 'STARTER',
    icon: 'sparkles',
    source: '# A little language. A big beginning.\n\nlet name = "Josiah"\nsay "Hello, " + name + "!"\nsay "Welcome to my own language."\n\n# Try changing the message above.\n',
    input: ''
  },
  for_loop: {
    title: 'For loop & range',
    description: 'Loop over lists or count smoothly through numbers using for and range().',
    tag: 'POWERFUL ITERATION',
    category: 'loops',
    badge: 'POPULAR',
    icon: 'bolt',
    source: '# Loop through items in a list\nlet fruits = ["Apple", "Mango", "Strawberry"]\nsay "--- My Fruit Basket ---"\nfor fruit in fruits\n  say "Delicious: " + fruit\nend\n\nsay ""\nsay "--- Counting with range() ---"\n# Count from 1 to 5\nfor i in range(1, 6)\n  say "Step " + text(i) + " squared is " + text(i * i)\nend\n',
    input: ''
  },
  fizzbuzz: {
    title: 'FizzBuzz challenge',
    description: 'The famous programming challenge solved elegantly with a for loop.',
    tag: 'ALGORITHM CLASSIC',
    category: 'loops',
    badge: 'ALGORITHM',
    icon: 'layers',
    source: '# Classic FizzBuzz from 1 to 15\nsay "Starting FizzBuzz:"\n\nfor n in range(1, 16)\n  when n % 15 == 0\n    say "FizzBuzz! (divisible by 3 and 5)"\n  otherwise\n    when n % 3 == 0\n      say "Fizz (divisible by 3)"\n    otherwise\n      when n % 5 == 0\n        say "Buzz (divisible by 5)"\n      otherwise\n        say text(n)\n      end\n    end\n  end\nend\n',
    input: ''
  },
  loop: {
    title: 'Loops & variables',
    description: 'Count a little further. Repeat an action and update a value along the way.',
    tag: 'KEEP IT GOING',
    category: 'loops',
    badge: 'LOOPS',
    icon: 'reset',
    source: 'let count = 1\n\nrepeat 5\n  say "Step " + text(count)\n  count = count + 1\nend\n\nsay "You made it!"\n',
    input: ''
  },
  condition: {
    title: 'Making decisions',
    description: 'Give your program two paths. Let a condition choose what happens next.',
    tag: 'CHOOSE A PATH',
    category: 'basics',
    badge: 'LOGIC',
    icon: 'sliders',
    source: 'let score = 85\n\nwhen score >= 75\n  say "You did it! High score."\notherwise\n  say "Keep going. You have got this."\nend\n',
    input: ''
  },
  input: {
    title: 'Say hello to you',
    description: 'Ask a question and use the answer. Add your name in Program input.',
    tag: 'MAKE IT PERSONAL',
    category: 'interactive',
    badge: 'INPUT',
    icon: 'input',
    source: 'let name = ask("What is your name?")\nlet age = number(ask("How old are you?"))\n\nsay "Nice to meet you, " + name + "!"\nsay "Next year you will be " + text(age + 1) + "."\n',
    input: 'Josiah\n19'
  },
  function: {
    title: 'Your first function',
    description: 'Write it once, use it again. Give a reusable idea its own name.',
    tag: 'BUILD SOMETHING REUSABLE',
    category: 'basics',
    badge: 'FUNCTION',
    icon: 'code',
    source: 'fn square(n)\n  return n * n\nend\n\nsay "4 squared = " + text(square(4))\nsay "9 squared = " + text(square(9))\n',
    input: ''
  },
  list: {
    title: 'Working with lists',
    description: 'Keep a collection together. Use indexes to explore each item.',
    tag: 'A PLACE FOR EVERYTHING',
    category: 'math',
    badge: 'LISTS',
    icon: 'file',
    source: 'let ideas = ["Imagine", "Create", "Run"]\nlet i = 0\n\nwhile i < len(ideas)\n  say ideas[i]\n  i = i + 1\nend\n',
    input: ''
  },
  text_tools: {
    title: 'Text magic & helpers',
    description: 'Transform strings with split, join, upper, lower, and reverse helpers.',
    tag: 'TEXT PROCESSING',
    category: 'interactive',
    badge: 'STRINGS',
    icon: 'sparkles',
    source: 'let message = "code create inspire"\nsay "Original:  " + message\nsay "Uppercase: " + upper(message)\n\n# Split into words\nlet words = split(message, " ")\nsay "Words:     " + text(len(words))\nsay "Reversed:  " + reverse(message)\nsay "Connected: " + join(words, " ➔ ")\n',
    input: ''
  },
  game: {
    title: 'Number guessing game',
    description: 'An interactive guessing game using random numbers, player input, and logic.',
    tag: 'INTERACTIVE MINI-GAME',
    category: 'interactive',
    badge: 'GAME',
    icon: 'smile',
    source: 'say "Welcome to the Secret Number Game!"\nlet secret = 7  # or random(1, 10)\nlet guess = number(ask("Guess a number between 1 and 10:"))\n\nsay "You guessed: " + text(guess)\nwhen guess == secret\n  say "🎉 BINGO! You found the secret number!"\notherwise\n  when guess < secret\n    say "Too low! Try again next time."\n  otherwise\n    say "Too high! Try again next time."\n  end\nend\n',
    input: '7'
  }
};

let definition = {
  name: 'Nova',
  extension: 'nova',
  keywords: { ...LangLab.defaults },
  version: '1.0.0'
};
let activeExample = 'welcome';
let activeFilter = 'all';

let worker = null, workerURL = null, runTimer = null, toastTimer = null, saveTimer = null, pendingResolve = null;
let engineSourcePromise = null, runGeneration = 0;
let soundEnabled = true;
try {
  const savedSound = localStorage.getItem('langlab-sound');
  if (savedSound !== null) soundEnabled = savedSound === 'true';
} catch {}

const pageInfo = {
  playground: ['Your language. Your rules.', 'Give your ideas a syntax. Then bring them to life.', 'Playground'],
  rules: ['Make it speak your language.', 'The same possibilities. Words that feel like you.', 'Language rules'],
  examples: ['Small programs. Big possibilities.', 'Pick a starting point and see what your language can do.', 'Examples'],
  downloads: ['Your language, to go.', 'Keep creating on your computer, even without the internet.', 'Download & run'],
  reference: ['A guide to your language.', 'Everything you need to turn an idea into a program.', 'Language guide']
};

/* --- MASCOT COMPANION SYSTEM --- */
const mascotPoses = {
  idle: 'assets/robot.png',
  coding: 'assets/coding.png',
  wave: 'assets/wave.png',
  thinking: 'assets/thinking.png',
  celebrate: 'assets/celebrate.png',
  trophy: 'assets/trophy.png',
  pointing: 'assets/pointing.png',
  welcome: 'assets/welcome.png',
  flag: 'assets/flag.png'
};

const codingTips = [
  'Loop through items or numbers easily with "for item in list" and "range(start, stop)"!',
  'You can rename any keyword in Language rules! Want Tamil, Spanish, or French syntax? Go for it!',
  'Need to join words? Use join(["Hello", "World"], " ") to make clean sentences.',
  'Convert user input to numbers with number(ask()) so you can do math operations.',
  'Export your language anytime with "Download language kit" to run offline on any computer!',
  'Built-in helpers like sqrt(), round(), upper(), and reverse() work out of the box!',
  'Every run runs in a safe, sandboxed worker with execution and recursion protection.',
  'Try the FizzBuzz example to see how conditionals and for-loops work together!'
];
let tipIndex = 0;

function setMascotMood(poseKey, speechText, badgeText = 'READY', animClass = 'mascot-floating') {
  const img = $('#mascot-img');
  const speech = $('#mascot-speech');
  const badge = $('#mascot-badge');
  const pillText = $('#mascot-mood-text');
  const pill = $('#mascot-mood-pill');

  if (img) {
    img.src = mascotPoses[poseKey] ?? mascotPoses.idle;
    img.className = 'mascot-img ' + animClass;
  }
  if (speech && speechText) {
    speech.textContent = speechText;
    speech.classList.remove('speech-pop');
    void speech.offsetWidth; // trigger reflow
    speech.classList.add('speech-pop');
  }
  if (badge && badgeText) {
    badge.textContent = badgeText;
    badge.className = 'mascot-mood-badge ' + (badgeText === 'RUNNING' ? 'badge-running' : badgeText === 'SUCCESS' ? 'badge-success' : badgeText === 'CHECK CODE' ? 'badge-error' : '');
  }
  if (pillText && badgeText) {
    pillText.textContent = badgeText === 'RUNNING' ? 'Byte is running code...' : badgeText === 'SUCCESS' ? 'Byte: Success! 🎉' : badgeText === 'CHECK CODE' ? 'Byte: Check error ⚠️' : 'Byte is ready!';
  }
  if (pill) {
    const dot = pill.querySelector('.mood-indicator');
    if (dot) {
      dot.className = 'mood-indicator ' + (badgeText === 'RUNNING' ? 'pulse-amber' : badgeText === 'SUCCESS' ? 'pulse-green' : badgeText === 'CHECK CODE' ? 'pulse-red' : 'pulse-green');
    }
  }
}

/* --- WEB AUDIO SYNTHESIZER --- */
let audioCtx = null;
function playSound(type) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') {
      audioCtx.resume();
    }
    const now = audioCtx.currentTime;
    if (type === 'run') {
      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(520, now);
      osc.frequency.exponentialRampToValueAtTime(780, now + 0.08);
      gain.gain.setValueAtTime(0.08, now);
      gain.gain.linearRampToValueAtTime(0.001, now + 0.08);
      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start(now);
      osc.stop(now + 0.09);
    } else if (type === 'success') {
      const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, now + idx * 0.06);
        gain.gain.setValueAtTime(0.06, now + idx * 0.06);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.06 + 0.25);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.06);
        osc.stop(now + idx * 0.06 + 0.26);
      });
    } else if (type === 'error') {
      [280, 210].forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(freq, now + idx * 0.1);
        gain.gain.setValueAtTime(0.05, now + idx * 0.1);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.1 + 0.12);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.1);
        osc.stop(now + idx * 0.1 + 0.13);
      });
    } else if (type === 'cheer') {
      const notes = [440, 554.37, 659.25, 880];
      notes.forEach((freq, idx) => {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.07);
        gain.gain.setValueAtTime(0.08, now + idx * 0.07);
        gain.gain.exponentialRampToValueAtTime(0.001, now + idx * 0.07 + 0.3);
        osc.connect(gain);
        gain.connect(audioCtx.destination);
        osc.start(now + idx * 0.07);
        osc.stop(now + idx * 0.07 + 0.32);
      });
    }
  } catch {}
}

/* --- CELEBRATION CONFETTI --- */
function launchConfetti() {
  const canvas = $('#confetti-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.display = 'block';

  const colors = ['#6547ff', '#8b74fa', '#ffb703', '#fb8500', '#06d6a0', '#ef476f', '#38bdf8'];
  const particles = [];
  const originX = canvas.width * 0.75;
  const originY = canvas.height * 0.35;

  for (let i = 0; i < 75; i++) {
    particles.push({
      x: originX,
      y: originY,
      vx: (Math.random() - 0.5) * 16,
      vy: -Math.random() * 12 - 4,
      size: Math.random() * 8 + 4,
      color: colors[Math.floor(Math.random() * colors.length)],
      rotation: Math.random() * 360,
      rotationSpeed: (Math.random() - 0.5) * 14,
      opacity: 1
    });
  }

  let animFrame = null;
  function update() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    let active = false;

    for (const p of particles) {
      p.x += p.vx;
      p.y += p.vy;
      p.vy += 0.35; // gravity
      p.vx *= 0.98; // drag
      p.rotation += p.rotationSpeed;
      p.opacity -= 0.009;

      if (p.opacity > 0 && p.y < canvas.height + 50) {
        active = true;
        ctx.save();
        ctx.translate(p.x, p.y);
        ctx.rotate((p.rotation * Math.PI) / 180);
        ctx.globalAlpha = Math.max(0, p.opacity);
        ctx.fillStyle = p.color;
        ctx.fillRect(-p.size / 2, -p.size / 2, p.size, p.size * 0.6);
        ctx.restore();
      }
    }

    if (active) {
      animFrame = requestAnimationFrame(update);
    } else {
      cancelAnimationFrame(animFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  update();
}

/* --- CODE FORMATTER / BEAUTIFIER --- */
function formatCode() {
  const codeEl = $('#code');
  const lines = codeEl.value.split('\n');
  const blockOpeners = new Set(['when', 'if', 'repeat', 'while', 'for', 'fn', 'function', definition.keywords.if, definition.keywords.repeat, definition.keywords.while, definition.keywords.for, definition.keywords.function]);
  const blockClosers = new Set(['end', definition.keywords.end]);
  const blockMid = new Set(['otherwise', 'else', definition.keywords.else]);

  let indent = 0;
  const formatted = lines.map(line => {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith('#')) {
      return trimmed ? '  '.repeat(indent) + trimmed : '';
    }
    const firstWord = trimmed.split(/[\s(]/)[0];
    if (blockClosers.has(firstWord) || blockMid.has(firstWord)) {
      indent = Math.max(0, indent - 1);
    }
    const result = '  '.repeat(indent) + trimmed;
    if (blockOpeners.has(firstWord) || blockMid.has(firstWord)) {
      indent++;
    }
    return result;
  }).join('\n');

  codeEl.value = formatted;
  highlight();
  saveDraft();
  toast('Code formatted with clean 2-space indentation ✨');
  playSound('run');
}

function remap(source, oldWords, newWords) {
  const mapping = new Map(Object.keys(oldWords).map(k => [oldWords[k], newWords[k]]));
  return source.replace(/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\p{L}_][\p{L}\p{M}\p{N}_]*/gu, word => mapping.get(word) ?? word);
}

function exampleCode(id) {
  return remap(exampleData[id].source, LangLab.defaults, definition.keywords);
}

function toast(message) {
  clearTimeout(toastTimer);
  const t = $('#toast');
  t.textContent = message;
  t.hidden = false;
  toastTimer = setTimeout(() => { t.hidden = true; }, 4000);
}

function navigate(page) {
  if (!pageInfo[page]) page = 'playground';
  const [title, description, breadcrumb] = pageInfo[page];
  $$('.page').forEach(el => {
    el.hidden = el.id !== 'page-' + page;
    el.classList.toggle('active-page', !el.hidden);
  });
  $$('.nav-item').forEach(el => {
    const isActive = el.dataset.page === page;
    el.classList.toggle('active', isActive);
    if (isActive) el.setAttribute('aria-current', 'page');
    else el.removeAttribute('aria-current');
  });
  $('#page-title').textContent = title;
  $('#page-description').textContent = description;
  $('#breadcrumb').textContent = breadcrumb;
  history.replaceState(null, '', '#' + page);

  // Character reaction to page navigation
  if (page === 'playground') {
    setMascotMood('idle', "Welcome to the studio! Write, edit, or pick an example.", 'READY');
  } else if (page === 'rules') {
    fillRules();
    setMascotMood('pointing', "Here you can invent new syntax. Change any keyword you want!", 'CUSTOMIZE');
  } else if (page === 'examples') {
    renderExamples();
    setMascotMood('welcome', "Check out 10 examples! Click 'Try this example' to load one.", 'EXPLORE');
  } else if (page === 'downloads') {
    setMascotMood('trophy', "Take your language with you! Download the standalone offline kit.", 'EXPORT');
  } else if (page === 'reference') {
    renderReference();
    setMascotMood('pointing', "Need syntax help? Here's the complete language guide.", 'GUIDE');
  }
  window.scrollTo({ top: 0, behavior: 'instant' });
}

function saveDraft() {
  clearTimeout(saveTimer);
  saveTimer = setTimeout(() => {
    try {
      localStorage.setItem('langlab-draft-v1', JSON.stringify({
        definition,
        code: $('#code').value,
        input: $('#stdin').value,
        example: activeExample
      }));
      $('#draft-status').innerHTML = '<i data-icon="save"></i>Draft saved';
      drawIcons($('#draft-status'));
    } catch {
      $('#footer-save').textContent = 'Draft storage is unavailable. Download a copy before leaving.';
    }
  }, 350);
}

function restoreDraft() {
  try {
    const text = localStorage.getItem('langlab-draft-v1');
    if (!text) return false;
    const draft = JSON.parse(text);
    if (text.length > 250000 || typeof draft.code !== 'string') return false;
    // Merge keywords with defaults to ensure any newly added keyword (for, in) is present
    const kw = { ...LangLab.defaults, ...(draft.definition?.keywords || {}) };
    draft.definition = { ...draft.definition, keywords: kw };
    if (LangLab.validate(draft.definition).length) return false;
    definition = draft.definition;
    $('#code').value = draft.code.slice(0, 100000);
    $('#stdin').value = String(draft.input ?? '').slice(0, 100000);
    activeExample = exampleData[draft.example] ? draft.example : 'welcome';
    return true;
  } catch {
    return false;
  }
}

function updateIdentity() {
  const { name, extension, keywords } = definition;
  $$('.language-name').forEach(e => { e.textContent = name; });
  $$('.file-extension').forEach(e => { e.textContent = '.' + extension + ' files'; });
  $('.language-logo').textContent = [...name.trim()][0]?.toUpperCase() ?? 'L';
  $('#filename').textContent = 'hello.' + extension;
  $('#editor-language').textContent = name;
  $('#extension-label').textContent = '.' + extension;
  $('#cli-command').textContent = 'node cli.cjs hello.' + extension;
  $('#example-picker').value = activeExample;
  updateDropdownUI(activeExample);

  const previewKeys = ['print', 'let', 'if', 'for', 'in', 'end'];
  $('#keyword-preview').innerHTML = previewKeys.map(k => `
    <div class="keyword-row">
      <span>${descriptors[k][0]}</span>
      <code>${escapeHTML(keywords[k] ?? LangLab.defaults[k])}</code>
    </div>
  `).join('');

  renderExamples();
  renderReference();
  highlight();
}

function highlight() {
  const code = $('#code').value;
  const words = new Set(Object.values(definition.keywords));
  const builtins = new Set([
    'len', 'number', 'text', 'round', 'sqrt', 'abs', 'min', 'max',
    'range', 'push', 'pop', 'join', 'split', 'upper', 'lower', 'floor', 'ceil', 'random', 'reverse', 'contains'
  ]);
  let html = '', last = 0;
  const re = /#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|\b\d+(?:\.\d+)?\b|[\p{L}_][\p{L}\p{M}\p{N}_]*/gu;

  for (const match of code.matchAll(re)) {
    const token = match[0];
    html += escapeHTML(code.slice(last, match.index));
    const cls = token[0] === '#' ? 'comment' :
      (token[0] === '"' || token[0] === "'") ? 'string' :
      /^\d/.test(token) ? 'number' :
      words.has(token) ? 'keyword' :
      builtins.has(token) ? 'builtin' : '';
    html += cls ? `<span class="token-${cls}">${escapeHTML(token)}</span>` : escapeHTML(token);
    last = match.index + token.length;
  }
  html += escapeHTML(code.slice(last));
  $('#highlight').innerHTML = html + '\n';
  $('#line-numbers').textContent = Array.from({ length: code.split('\n').length }, (_, i) => i + 1).join('\n');
  syncScroll();
  updateCursor();
}

function syncScroll() {
  const el = $('#code');
  $('#highlight').scrollTop = el.scrollTop;
  $('#highlight').scrollLeft = el.scrollLeft;
  $('#line-numbers').scrollTop = el.scrollTop;
}

function updateCursor() {
  const code = $('#code');
  const before = code.value.slice(0, code.selectionStart);
  const lines = before.split('\n');
  $('#cursor-location').textContent = `Ln ${lines.length}, Col ${lines.at(-1).length + 1}`;
}

function updateDropdownUI(id) {
  const item = exampleData[id];
  if (!item) return;
  const titleEl = $('#dropdown-active-title');
  const badgeEl = $('#dropdown-active-badge');
  if (titleEl) titleEl.textContent = item.title;
  if (badgeEl) {
    badgeEl.textContent = item.badge || item.tag.split(' ')[0];
    badgeEl.className = 'dropdown-trigger-badge ' + (item.category || 'basics');
  }
  $$('.custom-dropdown-item').forEach(el => {
    const isSelected = el.dataset.value === id;
    el.classList.toggle('is-selected', isSelected);
    el.setAttribute('aria-selected', isSelected ? 'true' : 'false');
    const check = el.querySelector('.item-check');
    if (check) check.hidden = !isSelected;
  });
}

function openDropdown() {
  const popup = $('#example-dropdown-popup');
  const btn = $('#example-dropdown-btn');
  const container = $('#example-dropdown-container');
  if (!popup || !btn) return;
  popup.hidden = false;
  btn.setAttribute('aria-expanded', 'true');
  container?.classList.add('is-open');
}

function closeDropdown() {
  const popup = $('#example-dropdown-popup');
  const btn = $('#example-dropdown-btn');
  const container = $('#example-dropdown-container');
  if (!popup || !btn) return;
  popup.hidden = true;
  btn.setAttribute('aria-expanded', 'false');
  container?.classList.remove('is-open');
}

function toggleDropdown() {
  const popup = $('#example-dropdown-popup');
  if (!popup) return;
  if (popup.hidden) openDropdown();
  else closeDropdown();
}

function loadExample(id, force = false) {
  if (!exampleData[id]) return false;
  if (!force && $('#code').value.trim() && $('#code').value !== exampleCode(activeExample) &&
      !confirm('Replace your current program with this example? Download your program first if you want to keep it.')) {
    $('#example-picker').value = activeExample;
    updateDropdownUI(activeExample);
    return false;
  }
  stopRun(false);
  activeExample = id;
  $('#code').value = exampleCode(id);
  $('#stdin').value = exampleData[id].input;
  $('#example-picker').value = id;
  updateDropdownUI(id);
  if (id === 'input' || id === 'game') $('.input-panel').open = true;
  highlight();
  saveDraft();
  clearOutput();

  setMascotMood('idle', `Loaded example: "${exampleData[id].title}"! Press Run to test it. 🚀`, 'READY');
  playSound('run');
  return true;
}

function renderExamples() {
  const grid = $('#examples-grid');
  if (!grid) return;
  const entries = Object.entries(exampleData);
  const filtered = activeFilter === 'all'
    ? entries
    : entries.filter(([_, item]) => item.category === activeFilter);

  grid.innerHTML = filtered.map(([id, item], i) => `
    <article class="example-card ${activeExample === id ? 'active-card' : ''}">
      <div class="example-card-top">
        <span class="example-number">0${i + 1} <span class="separator">/</span> ${item.tag}</span>
        <span class="category-tag">${item.category.toUpperCase()}</span>
      </div>
      <h2>${item.title}</h2>
      <p>${item.description}</p>
      <pre>${escapeHTML(exampleCode(id))}</pre>
      <div class="example-actions">
        <button class="button primary small" data-example="${id}"><i data-icon="play"></i>Try in editor</button>
        <button class="icon-button copy-example-btn" data-copy-example="${id}" aria-label="Copy example code" title="Copy code"><i data-icon="copy"></i></button>
      </div>
    </article>
  `).join('');
  drawIcons(grid);
}

function renderReference() {
  const k = definition.keywords;
  const cards = [
    [
      'Values & variables',
      'Numbers, quoted text, booleans, and lists. Join text with +.',
      `${k.let} name = "Josiah"\n${k.let} ready = ${k.true}\n${k.print} "Hello, " + name`
    ],
    [
      'For loops & ranges',
      `Iterate through lists or whole number ranges with ${k.for} and ${k.in}.`,
      `${k.for} fruit ${k.in} ["Apple", "Berry"]\n  ${k.print} fruit\n${k.end}\n\n${k.for} i ${k.in} range(1, 4)\n  ${k.print} "Step " + text(i)\n${k.end}`
    ],
    [
      'Repeat & while loops',
      `Repeat a fixed number of times or loop while a condition holds true.`,
      `${k.repeat} 3\n  ${k.print} "Keep creating"\n${k.end}\n\n${k.let} i = 0\n${k.while} i < 3\n  ${k.print} i\n  i = i + 1\n${k.end}`
    ],
    [
      'Conditions (when / otherwise)',
      `Choose a path with ${k.if} and ${k.else}. Close blocks with ${k.end}.`,
      `${k.if} 5 > 3 ${k.and} ${k.not} ${k.false}\n  ${k.print} "Yes!"\n${k.else}\n  ${k.print} "Try again"\n${k.end}`
    ],
    [
      'Functions & return',
      `Define reusable logic with parameters and return values.`,
      `${k.function} double(n)\n  ${k.return} n * 2\n${k.end}\n${k.print} double(21)`
    ],
    [
      'Input & questions',
      `Read one answer per line from the Program input box. Convert to numbers with number().`,
      `${k.let} age = number(${k.input}("Your age?"))\n${k.print} "Next year: " + text(age + 1)`
    ],
    [
      'Lists & collections',
      `Store ordered collections. Add items with push(), remove last with pop().`,
      `${k.let} items = [10, 20]\npush(items, 30)\n${k.print} items[0]\n${k.print} len(items)\n${k.print} pop(items)`
    ],
    [
      'Built-in helpers',
      `18 powerful built-ins: range, push, pop, join, split, upper, lower, floor, ceil, random, reverse, contains, len, number, text, round, sqrt, abs, min, max.`,
      `${k.let} words = split("hello world", " ")\n${k.print} upper(words[0])\n${k.print} reverse("robot")\n${k.print} random(1, 10)\n${k.print} contains(words, "world")`
    ]
  ];

  $('#reference-grid').innerHTML = cards.map(([title, description, code]) => `
    <article class="reference-card">
      <h2>${title}</h2>
      <p>${escapeHTML(description)}</p>
      <pre>${escapeHTML(code)}</pre>
    </article>
  `).join('');
}

function fillRules() {
  $('#language-name').value = definition.name;
  $('#language-extension').value = definition.extension;
  $('#keyword-fields').innerHTML = Object.entries(descriptors).map(([key, [label, hint]]) => `
    <div class="keyword-field">
      <label for="kw-${key}">${label}</label>
      <input id="kw-${key}" name="${key}" value="${escapeHTML(definition.keywords[key] ?? LangLab.defaults[key])}" maxlength="30" required spellcheck="false" autocomplete="off">
      <small>${hint}</small>
    </div>
  `).join('');
  $('#rules-error').hidden = true;
}

function applyDefinition(next) {
  const issues = LangLab.validate(next);
  if (issues.length) throw Error(issues.join('\n'));
  stopRun(false);
  $('#code').value = remap($('#code').value, definition.keywords, next.keywords);
  definition = {
    name: next.name.trim(),
    extension: next.extension,
    keywords: Object.fromEntries(Object.keys(LangLab.defaults).map(k => [k, next.keywords[k]])),
    version: '1.0.0'
  };
  updateIdentity();
  saveDraft();
  clearOutput();
}

function clearOutput() {
  $('#output').innerHTML = '<p class="empty-output">Your next idea starts with a run.<br><span>Press Run program to see the result here.</span></p>';
  $('#execution-status').textContent = 'Ready when you are';
  $('#execution-status').className = 'execution-status';
}

function displayResult(result) {
  const out = $('#output');
  out.textContent = '';
  for (const line of result.output ?? []) {
    const el = document.createElement('div');
    el.className = 'output-line';
    el.textContent = line || ' ';
    out.append(el);
  }

  if (!result.ok) {
    const el = document.createElement('div');
    el.className = 'output-error';
    el.textContent = `Line ${result.line ?? 1}: ${result.message}`;
    out.append(el);

    $('#execution-status').className = 'execution-status error';
    $('#execution-status').textContent = `Error on line ${result.line ?? 1}`;
    setMascotMood('thinking', `Oops on line ${result.line ?? 1}: "${result.message}". Let's check it!`, 'CHECK CODE');
    playSound('error');
  } else {
    if (!result.output?.length) {
      const el = document.createElement('p');
      el.className = 'muted';
      el.textContent = 'Completed successfully with no output.';
      out.append(el);
    }
    const ms = result.duration ?? 0;
    $('#execution-status').className = 'execution-status success';
    $('#execution-status').textContent = `Completed · ${ms} ms · ${result.steps} steps`;

    setMascotMood('celebrate', `Boom! Code ran cleanly in ${ms} ms (${result.steps} steps)! 🎉⭐`, 'SUCCESS');
    playSound('success');
    launchConfetti();
  }
}

function engineSource() {
  if (!engineSourcePromise) {
    engineSourcePromise = fetch('engine.js').then(r => {
      if (!r.ok) throw Error('The runner could not load. Please refresh and try again.');
      return r.text();
    }).catch(e => {
      engineSourcePromise = null;
      throw e;
    });
  }
  return engineSourcePromise;
}

function finishRun() {
  clearTimeout(runTimer);
  if (worker) worker.terminate();
  if (workerURL) URL.revokeObjectURL(workerURL);
  worker = null;
  workerURL = null;
  $('#run').hidden = false;
  $('#run').disabled = false;
  $('#stop').hidden = true;
}

function stopRun(notify = true) {
  runGeneration++;
  const active = !!worker || !!pendingResolve;
  finishRun();
  if (notify && active) {
    $('#execution-status').textContent = 'Stopped';
    $('#execution-status').className = 'execution-status';
    setMascotMood('idle', 'Execution stopped.', 'READY');
  }
  pendingResolve?.({ ok: false, message: 'Stopped by user', output: [] });
  pendingResolve = null;
}

async function runProgram() {
  stopRun(false);
  const generation = runGeneration;
  $('#output').textContent = '';
  $('#execution-status').textContent = 'Running…';
  $('#execution-status').className = 'execution-status running';
  $('#run').disabled = true;

  setMascotMood('thinking', 'Running your program... Thinking through the steps ⚙️', 'RUNNING');
  playSound('run');

  try {
    const source = await engineSource();
    if (generation !== runGeneration) return { ok: false, message: 'Cancelled', output: [] };

    return await new Promise(resolve => {
      pendingResolve = resolve;
      const script = source + '\nonmessage=e=>{try{postMessage({ok:true,...LangLab.execute(e.data.code,e.data.definition,e.data.input)})}catch(error){postMessage({ok:false,message:error.message,line:error.line||1,output:error.output||[]})}};';
      workerURL = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
      worker = new Worker(workerURL);
      $('#run').hidden = true;
      $('#stop').hidden = false;

      const complete = result => {
        displayResult(result);
        finishRun();
        pendingResolve = null;
        resolve(result);
      };

      worker.onmessage = e => complete(e.data);
      worker.onerror = () => complete({ ok: false, message: 'The runner could not start. Refresh the page or try Chrome or Edge.', output: [] });
      worker.postMessage({ code: $('#code').value, definition, input: $('#stdin').value });
      runTimer = setTimeout(() => complete({ ok: false, message: 'Execution timed out. Check for an endless loop.', output: [] }), 5000);
    });
  } catch (error) {
    const result = { ok: false, message: error.message, output: [] };
    displayResult(result);
    finishRun();
    pendingResolve = null;
    return result;
  }
}

function downloadFile(name, content, type = 'text/plain;charset=utf-8') {
  const blob = content instanceof Blob ? content : new Blob([content], { type });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.append(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1500);
}

async function downloadKit() {
  const buttons = [$('#download-top'), $('#download-kit')];
  buttons.forEach(b => { if (b) b.disabled = true; });
  try {
    const source = await engineSource();
    const files = LangLabExport.kitFiles(definition, $('#code').value, source, $('#stdin').value);
    downloadFile(definition.extension + '-language-kit.zip', LangLabExport.zip(files));
    toast('Language kit ready! Extract it and open RUN.html.');
    setMascotMood('trophy', 'Your language kit is downloaded! Have fun exploring offline! 📦', 'DOWNLOADED');
    playSound('cheer');
    launchConfetti();
  } catch (e) {
    toast(e.message);
  } finally {
    buttons.forEach(b => { if (b) b.disabled = false; });
  }
}

/* --- EVENT LISTENERS & SETUP --- */
$('#code').addEventListener('input', () => {
  if ($('#code').value.length > 100000) {
    $('#code').value = $('#code').value.slice(0, 100000);
    toast('Programs are limited to 100,000 characters.');
  }
  highlight();
  saveDraft();
});
$('#code').addEventListener('scroll', syncScroll);
$('#code').addEventListener('click', updateCursor);
$('#code').addEventListener('keyup', updateCursor);
$('#code').addEventListener('keydown', e => {
  if (e.key === 'Tab') {
    e.preventDefault();
    const el = e.target;
    el.setRangeText('  ', el.selectionStart, el.selectionEnd, 'end');
    highlight();
    saveDraft();
  }
});
$('#stdin').addEventListener('input', saveDraft);

document.addEventListener('keydown', e => {
  if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && !$('#page-playground').hidden) {
    e.preventDefault();
    runProgram();
  }
});

document.addEventListener('click', e => {
  const page = e.target.closest('[data-page]');
  if (page) navigate(page.dataset.page);

  const example = e.target.closest('[data-example]');
  if (example && loadExample(example.dataset.example)) navigate('playground');

  const copyEx = e.target.closest('[data-copy-example]');
  if (copyEx) {
    const exId = copyEx.dataset.copyExample;
    if (exampleData[exId]) {
      navigator.clipboard.writeText(exampleCode(exId)).then(() => {
        toast(`Copied "${exampleData[exId].title}" to clipboard!`);
        playSound('run');
      });
    }
  }

  const filterBtn = e.target.closest('.filter-pill');
  if (filterBtn) {
    $$('.filter-pill').forEach(b => b.classList.remove('active'));
    filterBtn.classList.add('active');
    activeFilter = filterBtn.dataset.filter;
    renderExamples();
    playSound('run');
  }
});

$('.brand').addEventListener('click', e => {
  e.preventDefault();
  navigate('playground');
});
/* --- CUSTOM DROPDOWN INTERACTION --- */
$('#example-dropdown-btn')?.addEventListener('click', e => {
  e.stopPropagation();
  toggleDropdown();
});

$$('.custom-dropdown-item').forEach(btn => {
  btn.addEventListener('click', () => {
    const val = btn.dataset.value;
    if (val && loadExample(val)) {
      closeDropdown();
      $('#example-dropdown-btn')?.focus();
    }
  });
});

document.addEventListener('click', e => {
  if (!e.target.closest('#example-dropdown-container')) {
    closeDropdown();
  }
});

document.addEventListener('keydown', e => {
  if (e.key === 'Escape') {
    closeDropdown();
  }
});

$('#example-picker').addEventListener('change', e => loadExample(e.target.value));
$('#run').addEventListener('click', runProgram);
$('#stop').addEventListener('click', () => stopRun());
$('#clear-output').addEventListener('click', () => {
  stopRun(false);
  clearOutput();
});
$('#copy-output')?.addEventListener('click', async () => {
  const out = $('#output').textContent;
  if (!out.trim()) {
    toast('Nothing to copy yet. Run your program first!');
    return;
  }
  try {
    await navigator.clipboard.writeText(out);
    toast('Output copied to clipboard!');
    playSound('run');
  } catch {
    toast('Could not copy output.');
  }
});
$('#format-code')?.addEventListener('click', formatCode);
$('#reset-code').addEventListener('click', () => loadExample(activeExample));
$('#copy-code').addEventListener('click', async () => {
  try {
    await navigator.clipboard.writeText($('#code').value);
    toast('Program copied to clipboard.');
    playSound('run');
  } catch {
    $('#code').focus();
    $('#code').select();
    toast('Press Ctrl+C to copy the selected program.');
  }
});

/* --- MASCOT INTERACTION LISTENERS --- */
$('#mascot-sayhi')?.addEventListener('click', () => {
  setMascotMood('wave', "Beep boop! Hello world! Byte here, your language pair programmer 🤖👋", 'HELLO!');
  playSound('run');
});
$('#mascot-tip')?.addEventListener('click', () => {
  tipIndex = (tipIndex + 1) % codingTips.length;
  setMascotMood('pointing', `💡 Tip: ${codingTips[tipIndex]}`, 'PRO TIP');
  playSound('run');
});
$('#mascot-cheer')?.addEventListener('click', () => {
  setMascotMood('celebrate', "Yaaay! Keep building awesome things! You've got superpowers! 🌟🎉", 'CHEER!');
  playSound('cheer');
  launchConfetti();
});
$('#mascot-img')?.addEventListener('click', () => {
  tipIndex = (tipIndex + 1) % codingTips.length;
  setMascotMood('celebrate', `💡 ${codingTips[tipIndex]}`, 'BYTE');
  playSound('cheer');
  launchConfetti();
});
$('#mascot-fab')?.addEventListener('click', () => {
  tipIndex = (tipIndex + 1) % codingTips.length;
  setMascotMood('wave', `🤖 Byte says: ${codingTips[tipIndex]}`, 'HELLO!');
  playSound('run');
  if ($('#page-playground').hidden) {
    toast(`Byte: ${codingTips[tipIndex]}`);
  }
});

/* --- SOUND TOGGLE --- */
const soundBtn = $('#sound-toggle');
if (soundBtn) {
  soundBtn.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    try { localStorage.setItem('langlab-sound', String(soundEnabled)); } catch {}
    soundBtn.innerHTML = `<i data-icon="${soundEnabled ? 'volume' : 'volume_off'}"></i><span class="sr-only">Toggle sound</span>`;
    soundBtn.title = soundEnabled ? 'Audio feedback: ON' : 'Audio feedback: MUTED';
    drawIcons(soundBtn);
    toast(soundEnabled ? 'Audio feedback turned ON 🔊' : 'Audio feedback MUTED 🔇');
    if (soundEnabled) playSound('run');
  });
  if (!soundEnabled) {
    soundBtn.innerHTML = `<i data-icon="volume_off"></i><span class="sr-only">Toggle sound</span>`;
    soundBtn.title = 'Audio feedback: MUTED';
  }
}

/* --- INTERACTIVE TIP CARD --- */
$('#tip-card-interactive')?.addEventListener('click', () => {
  tipIndex = (tipIndex + 1) % codingTips.length;
  $('#tip-body').textContent = codingTips[tipIndex];
  playSound('run');
});

$('#rules-form').addEventListener('submit', e => {
  e.preventDefault();
  const next = {
    name: $('#language-name').value.trim(),
    extension: $('#language-extension').value.trim(),
    keywords: Object.fromEntries(Object.keys(LangLab.defaults).map(k => [k, $('#kw-' + k).value.trim()]))
  };
  try {
    applyDefinition(next);
    navigate('playground');
    toast('Your language is ready! Program keywords have been remapped.');
    setMascotMood('celebrate', 'Rules updated successfully! Your program now speaks your custom language!', 'SUCCESS');
    playSound('success');
    launchConfetti();
  } catch (error) {
    $('#rules-error').textContent = error.message;
    $('#rules-error').hidden = false;
    playSound('error');
  }
});

$('#download-top').onclick = downloadKit;
$('#download-kit').onclick = downloadKit;
$('#download-definition').onclick = () => downloadFile('language.json', JSON.stringify(definition, null, 2), 'application/json');
$('#download-program').onclick = () => downloadFile('hello.' + definition.extension, $('#code').value);

$('#import-button').onclick = () => $('#import-file').click();
$('#import-file').onchange = async e => {
  const file = e.target.files[0];
  if (!file) return;
  try {
    if (file.size > 50000) throw Error('Choose a language JSON file smaller than 50 KB.');
    const data = JSON.parse(await file.text());
    if (LangLab.validate(data).length) throw Error(LangLab.validate(data)[0]);
    applyDefinition(data);
    navigate('playground');
    toast('Language imported. Your current program uses its keywords.');
    setMascotMood('welcome', `Language "${data.name}" imported successfully! Ready to code.`, 'IMPORTED');
    playSound('success');
  } catch (error) {
    toast('Could not import: ' + error.message);
    playSound('error');
  } finally {
    e.target.value = '';
  }
};

drawIcons();
$$('.nav-item').forEach(el => el.setAttribute('aria-label', el.textContent.replace(/0[12]/, '').trim()));

if (!restoreDraft()) loadExample('welcome', true);
updateIdentity();
navigate(location.hash.slice(1) || 'playground');

if (document.modelContext?.registerTool) {
  const lifetime = new AbortController();
  const tools = [
    {
      name: 'read_language_workspace',
      title: 'Read language workspace',
      description: 'Read the current language rules, source code, and input.',
      inputSchema: { type: 'object', properties: {}, additionalProperties: false },
      annotations: { readOnlyHint: true, untrustedContentHint: true },
      execute: () => ({ definition, code: $('#code').value, input: $('#stdin').value })
    },
    {
      name: 'run_language_program',
      title: 'Run a program',
      description: 'Replace the visible program and optional input, then execute it using the current custom language.',
      inputSchema: {
        type: 'object',
        properties: {
          code: { type: 'string', maxLength: 100000 },
          input: { type: 'string', maxLength: 100000 }
        },
        required: ['code'],
        additionalProperties: false
      },
      annotations: { readOnlyHint: false, untrustedContentHint: true },
      execute: async input => {
        if (!input || typeof input.code !== 'string' || input.code.length > 100000 ||
            (input.input !== undefined && (typeof input.input !== 'string' || input.input.length > 100000))) {
          throw Error('Provide code and optional input, each under 100,000 characters.');
        }
        $('#code').value = input.code;
        $('#stdin').value = input.input ?? '';
        highlight();
        saveDraft();
        navigate('playground');
        return await runProgram();
      }
    }
  ];
  for (const tool of tools) {
    try {
      Promise.resolve(document.modelContext.registerTool(tool, { signal: lifetime.signal })).catch(() => {});
    } catch {}
  }
  window.addEventListener('pagehide', () => lifetime.abort(), { once: true });
}
