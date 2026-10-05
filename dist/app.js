'use strict';

// React Setup and Core Primitives
const { useState, useEffect, useRef, useCallback, useMemo, createElement: h, Fragment } = window.React || {};

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

function Icon({ name, className = '' }) {
  const path = icons[name] || icons.code;
  return h('svg', {
    viewBox: '0 0 24 24',
    className: `icon icon-${name} ${className}`,
    'aria-hidden': true
  }, h('path', { d: path }));
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

function remap(source, oldWords, newWords) {
  const mapping = new Map(Object.keys(oldWords).map(k => [oldWords[k], newWords[k]]));
  return source.replace(/#[^\n]*|"(?:\\.|[^"\\])*"|'(?:\\.|[^'\\])*'|[\p{L}_][\p{L}\p{M}\p{N}_]*/gu, word => mapping.get(word) ?? word);
}

// Audio Synthesizer
let audioCtx = null;
function playSound(type, soundEnabled = true) {
  if (!soundEnabled) return;
  try {
    if (!audioCtx) {
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;
      audioCtx = new AudioContextClass();
    }
    if (audioCtx.state === 'suspended') audioCtx.resume();
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
      [523.25, 659.25, 783.99, 1046.50].forEach((freq, idx) => {
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
      [440, 554.37, 659.25, 880].forEach((freq, idx) => {
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

// Canvas Confetti Engine
function launchConfetti() {
  const canvas = document.getElementById('confetti-canvas');
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
      p.vy += 0.35;
      p.vx *= 0.98;
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
    if (active) animFrame = requestAnimationFrame(update);
    else {
      cancelAnimationFrame(animFrame);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      canvas.style.display = 'none';
    }
  }
  update();
}

// React Startup WebApp Component
function LangLabReactApp() {
  const [definition, setDefinition] = useState(() => ({
    name: 'Nova',
    extension: 'nova',
    keywords: { ...window.LangLab.defaults },
    version: '1.0.0'
  }));

  const [activePage, setActivePage] = useState(() => location.hash.slice(1) || 'playground');
  const [activeExample, setActiveExample] = useState('welcome');
  const [activeFilter, setActiveFilter] = useState('all');
  const [code, setCode] = useState(() => exampleData.welcome.source);
  const [stdin, setStdin] = useState('');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [toastMsg, setToastMsg] = useState('');
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [tipIdx, setTipIdx] = useState(0);

  const [execution, setExecution] = useState({
    status: 'idle',
    output: [],
    duration: 0,
    steps: 0,
    error: null
  });

  const [mascot, setMascot] = useState({
    pose: 'idle',
    speech: "Welcome to the studio! Write, edit, or pick an example.",
    badge: 'READY'
  });

  const textareaRef = useRef(null);
  const lineNumbersRef = useRef(null);
  const highlightRef = useRef(null);
  const toastTimerRef = useRef(null);
  const workerRef = useRef(null);
  const workerURLRef = useRef(null);
  const runTimerRef = useRef(null);
  const engineSourceRef = useRef(null);

  const triggerToast = useCallback((msg) => {
    clearTimeout(toastTimerRef.current);
    setToastMsg(msg);
    toastTimerRef.current = setTimeout(() => setToastMsg(''), 4000);
  }, []);

  // Sync Hash Navigation
  useEffect(() => {
    const handleHash = () => {
      const page = location.hash.slice(1) || 'playground';
      setActivePage(page);
    };
    window.addEventListener('hashchange', handleHash);
    return () => window.removeEventListener('hashchange', handleHash);
  }, []);

  const navigate = useCallback((page) => {
    setActivePage(page);
    location.hash = page;
    window.scrollTo({ top: 0, behavior: 'smooth' });

    if (page === 'playground') {
      setMascot({ pose: 'idle', speech: "Welcome to the studio! Write, edit, or pick an example.", badge: 'READY' });
    } else if (page === 'rules') {
      setMascot({ pose: 'pointing', speech: "Here you can invent new syntax. Change any keyword you want!", badge: 'CUSTOMIZE' });
    } else if (page === 'examples') {
      setMascot({ pose: 'welcome', speech: "Check out 10 examples! Click 'Try in editor' to load one.", badge: 'EXPLORE' });
    } else if (page === 'downloads') {
      setMascot({ pose: 'trophy', speech: "Take your language with you! Download the standalone offline kit.", badge: 'EXPORT' });
    } else if (page === 'reference') {
      setMascot({ pose: 'pointing', speech: "Need syntax help? Here's the complete language guide.", badge: 'GUIDE' });
    }
  }, []);

  // Format / Beautify Code
  const handleFormatCode = useCallback(() => {
    const lines = code.split('\n');
    const blockOpeners = new Set(['when', 'if', 'repeat', 'while', 'for', 'fn', 'function', definition.keywords.if, definition.keywords.repeat, definition.keywords.while, definition.keywords.for, definition.keywords.function]);
    const blockClosers = new Set(['end', definition.keywords.end]);
    const blockMid = new Set(['otherwise', 'else', definition.keywords.else]);

    let indent = 0;
    const formatted = lines.map(line => {
      const trimmed = line.trim();
      if (!trimmed || trimmed.startsWith('#')) return trimmed ? '  '.repeat(indent) + trimmed : '';
      const firstWord = trimmed.split(/[\s(]/)[0];
      if (blockClosers.has(firstWord) || blockMid.has(firstWord)) indent = Math.max(0, indent - 1);
      const result = '  '.repeat(indent) + trimmed;
      if (blockOpeners.has(firstWord) || blockMid.has(firstWord)) indent++;
      return result;
    }).join('\n');

    setCode(formatted);
    triggerToast('Code formatted with clean 2-space indentation ✨');
    playSound('run', soundEnabled);
  }, [code, definition.keywords, soundEnabled, triggerToast]);

  // Load Example
  const loadExample = useCallback((id, force = false) => {
    if (!exampleData[id]) return;
    if (!force && code.trim() && code !== remap(exampleData[activeExample].source, window.LangLab.defaults, definition.keywords) &&
        !confirm('Replace your current program with this example?')) {
      return;
    }
    const mappedSource = remap(exampleData[id].source, window.LangLab.defaults, definition.keywords);
    setActiveExample(id);
    setCode(mappedSource);
    setStdin(exampleData[id].input);
    setExecution({ status: 'idle', output: [], duration: 0, steps: 0, error: null });
    setMascot({ pose: 'idle', speech: `Loaded example: "${exampleData[id].title}"! Press Run to test it. 🚀`, badge: 'READY' });
    playSound('run', soundEnabled);
  }, [activeExample, code, definition.keywords, soundEnabled]);

  // Code Runner Engine
  const fetchEngineSource = useCallback(async () => {
    if (!engineSourceRef.current) {
      const res = await fetch('engine.js');
      if (!res.ok) throw Error('Could not load language engine.');
      engineSourceRef.current = await res.text();
    }
    return engineSourceRef.current;
  }, []);

  const stopRun = useCallback(() => {
    clearTimeout(runTimerRef.current);
    if (workerRef.current) workerRef.current.terminate();
    if (workerURLRef.current) URL.revokeObjectURL(workerURLRef.current);
    workerRef.current = null;
    workerURLRef.current = null;
    setExecution(prev => prev.status === 'running' ? { ...prev, status: 'stopped' } : prev);
  }, []);

  const runProgram = useCallback(async () => {
    stopRun();
    setExecution({ status: 'running', output: [], duration: 0, steps: 0, error: null });
    setMascot({ pose: 'coding', speech: 'Running your program... Thinking through the steps ⚙️', badge: 'RUNNING' });
    playSound('run', soundEnabled);

    try {
      const source = await fetchEngineSource();
      const script = source + '\nonmessage=e=>{try{postMessage({ok:true,...LangLab.execute(e.data.code,e.data.definition,e.data.input)})}catch(error){postMessage({ok:false,message:error.message,line:error.line||1,output:error.output||[]})}};';
      workerURLRef.current = URL.createObjectURL(new Blob([script], { type: 'text/javascript' }));
      workerRef.current = new Worker(workerURLRef.current);

      workerRef.current.onmessage = e => {
        const result = e.data;
        if (!result.ok) {
          setExecution({ status: 'error', output: result.output || [], duration: 0, steps: 0, error: result });
          setMascot({ pose: 'thinking', speech: `Oops on line ${result.line || 1}: "${result.message}". Let's check it!`, badge: 'CHECK CODE' });
          playSound('error', soundEnabled);
        } else {
          setExecution({ status: 'success', output: result.output || [], duration: result.duration || 0, steps: result.steps || 0, error: null });
          setMascot({ pose: 'celebrate', speech: `Boom! Code ran cleanly in ${result.duration || 0} ms (${result.steps || 0} steps)! 🎉⭐`, badge: 'SUCCESS' });
          playSound('success', soundEnabled);
          launchConfetti();
        }
        stopRun();
      };

      workerRef.current.onerror = () => {
        setExecution({ status: 'error', output: [], duration: 0, steps: 0, error: { message: 'Runner could not start.', line: 1 } });
        playSound('error', soundEnabled);
        stopRun();
      };

      workerRef.current.postMessage({ code, definition, input: stdin });
      runTimerRef.current = setTimeout(() => {
        setExecution({ status: 'error', output: [], duration: 0, steps: 0, error: { message: 'Execution timed out. Check for infinite loops.', line: 1 } });
        playSound('error', soundEnabled);
        stopRun();
      }, 5000);
    } catch (err) {
      setExecution({ status: 'error', output: [], duration: 0, steps: 0, error: { message: err.message, line: 1 } });
      playSound('error', soundEnabled);
      stopRun();
    }
  }, [code, definition, fetchEngineSource, playSound, soundEnabled, stdin, stopRun]);

  // Keyboard Shortcuts
  useEffect(() => {
    const handleKeyDown = e => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'Enter' && activePage === 'playground') {
        e.preventDefault();
        runProgram();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activePage, runProgram]);

  // Syntax Highlighting Tokens
  const syntaxHTML = useMemo(() => {
    const words = new Set(Object.values(definition.keywords));
    const builtins = new Set(['len', 'number', 'text', 'round', 'sqrt', 'abs', 'min', 'max', 'range', 'push', 'pop', 'join', 'split', 'upper', 'lower', 'floor', 'ceil', 'random', 'reverse', 'contains']);
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
    return html + '\n';
  }, [code, definition.keywords]);

  const lineNumbers = useMemo(() => {
    return Array.from({ length: code.split('\n').length }, (_, i) => i + 1).join('\n');
  }, [code]);

  // Download Kit Action
  const handleDownloadKit = useCallback(async () => {
    try {
      const source = await fetchEngineSource();
      const files = window.LangLabExport.kitFiles(definition, code, source, stdin);
      const zipBlob = window.LangLabExport.zip(files);
      const url = URL.createObjectURL(zipBlob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${definition.extension}-language-kit.zip`;
      document.body.append(a);
      a.click();
      a.remove();
      setTimeout(() => URL.revokeObjectURL(url), 1500);

      triggerToast('Language kit ready! Extract it and open RUN.html.');
      setMascot({ pose: 'trophy', speech: 'Your language kit is downloaded! Have fun exploring offline! 📦', badge: 'DOWNLOADED' });
      playSound('cheer', soundEnabled);
      launchConfetti();
    } catch (err) {
      triggerToast(err.message);
    }
  }, [code, definition, fetchEngineSource, playSound, soundEnabled, stdin, triggerToast]);

  return h(Fragment, null,
    // SIDEBAR
    h('aside', { className: 'sidebar' },
      h('a', { className: 'brand', href: '#playground', onClick: e => { e.preventDefault(); navigate('playground'); } },
        h('span', { className: 'brand-mark', 'aria-hidden': true }, '</>'),
        h('span', null, 'Lang', h('span', { className: 'purple' }, 'Lab'))
      ),
      h('div', { className: 'workspace-label' }, 'YOUR WORKSPACE'),
      h('nav', { 'aria-label': 'Workspace' },
        h('button', { className: `nav-item ${activePage === 'playground' ? 'active' : ''}`, onClick: () => navigate('playground') }, h(Icon, { name: 'code' }), 'Playground', h('span', { className: 'nav-key' }, '01')),
        h('button', { className: `nav-item ${activePage === 'rules' ? 'active' : ''}`, onClick: () => navigate('rules') }, h(Icon, { name: 'sliders' }), 'Language rules', h('span', { className: 'nav-key' }, '02')),
        h('button', { className: `nav-item ${activePage === 'examples' ? 'active' : ''}`, onClick: () => navigate('examples') }, h(Icon, { name: 'layers' }), 'Examples'),
        h('button', { className: `nav-item ${activePage === 'downloads' ? 'active' : ''}`, onClick: () => navigate('downloads') }, h(Icon, { name: 'download' }), 'Download & run')
      ),
      h('div', { className: 'sidebar-bottom' },
        h('div', { className: 'tiny-label' }, 'A LITTLE HELP?'),
        h('button', { className: `nav-item ${activePage === 'reference' ? 'active' : ''}`, onClick: () => navigate('reference') }, h(Icon, { name: 'book' }), 'Language guide'),
        h('div', { className: 'local-note' },
          h('span', { className: 'local-icon' }, h(Icon, { name: 'laptop' })),
          h('div', null, h('strong', null, 'Your space to create'), h('span', null, 'Drafts stay in this browser.'))
        )
      )
    ),

    // MAIN APP WRAPPER
    h('div', { className: 'app' },
      // TOPBAR
      h('header', { className: 'topbar' },
        h('div', { className: 'breadcrumb-group' },
          h('div', { className: 'breadcrumb' },
            'Workspace ', h('span', null, '/'), ' ', h('strong', null, activePage.charAt(0).toUpperCase() + activePage.slice(1))
          ),
          h('div', { className: 'mascot-mood-pill', title: 'Companion Status' },
            h('span', { className: `mood-indicator ${execution.status === 'running' ? 'pulse-amber' : execution.status === 'error' ? 'pulse-red' : 'pulse-green'}` }),
            h('span', null, mascot.badge === 'RUNNING' ? 'Byte is running code...' : mascot.badge === 'SUCCESS' ? 'Byte: Success! 🎉' : mascot.badge === 'CHECK CODE' ? 'Byte: Check error ⚠️' : 'Byte is ready!')
          )
        ),
        h('div', { className: 'top-actions' },
          h('button', {
            className: 'button ghost icon-only',
            onClick: () => {
              setSoundEnabled(!soundEnabled);
              triggerToast(soundEnabled ? 'Audio feedback MUTED 🔇' : 'Audio feedback turned ON 🔊');
            },
            title: soundEnabled ? 'Audio feedback: ON' : 'Audio feedback: MUTED'
          }, h(Icon, { name: soundEnabled ? 'volume' : 'volume_off' })),
          h('button', {
            className: 'button primary small',
            onClick: handleDownloadKit
          }, h(Icon, { name: 'download' }), h('span', null, 'Download language'))
        )
      ),

      // MAIN CONTENT
      h('main', { id: 'main' },
        h('section', { className: 'page-heading' },
          h('div', null,
            h('div', { className: 'eyebrow' }, 'CREATE SOMETHING THAT\'S YOURS'),
            h('h1', null, activePage === 'playground' ? 'Your language. Your rules.' : activePage === 'rules' ? 'Make it speak your language.' : activePage === 'examples' ? 'Small programs. Big possibilities.' : activePage === 'downloads' ? 'Your language, to go.' : 'A guide to your language.'),
            h('p', null, activePage === 'playground' ? 'Give your ideas a syntax. Then bring them to life.' : activePage === 'rules' ? 'The same possibilities. Words that feel like you.' : activePage === 'examples' ? 'Pick a starting point and see what your language can do.' : activePage === 'downloads' ? 'Keep creating on your computer, even without the internet.' : 'Everything you need to turn an idea into a program.')
          ),
          h('div', { className: 'draft-badge' }, h(Icon, { name: 'save' }), 'Local draft')
        ),

        // PLAYGROUND PAGE
        activePage === 'playground' && h('section', { className: 'studio-grid' },
          h('div', { className: 'work-column' },
            h('div', { className: 'workspace-toolbar' },
              h('div', { className: 'file-tabs' },
                h('span', { className: 'file-tab' }, h(Icon, { name: 'file' }), `hello.${definition.extension}`, h('span', { className: 'file-dot' }))
              ),
              h('div', { className: `custom-dropdown-container ${dropdownOpen ? 'is-open' : ''}` },
                h('button', {
                  type: 'button',
                  className: 'custom-dropdown-trigger',
                  onClick: () => setDropdownOpen(!dropdownOpen)
                },
                  h('span', { className: 'dropdown-trigger-icon' }, h(Icon, { name: 'layers' })),
                  h('span', { className: 'dropdown-trigger-text' },
                    h('span', { className: 'dropdown-trigger-sub' }, 'EXAMPLE'),
                    h('strong', null, exampleData[activeExample].title)
                  ),
                  h('span', { className: 'dropdown-trigger-badge' }, exampleData[activeExample].badge),
                  h(Icon, { name: 'chevron', className: 'dropdown-chevron' })
                ),
                dropdownOpen && h('div', { className: 'custom-dropdown-popup' },
                  Object.entries(exampleData).map(([id, item]) =>
                    h('button', {
                      key: id,
                      type: 'button',
                      className: `custom-dropdown-item ${activeExample === id ? 'is-selected' : ''}`,
                      onClick: () => {
                        loadExample(id);
                        setDropdownOpen(false);
                      }
                    },
                      h('span', { className: `item-icon-box ${item.category}` }, h(Icon, { name: item.icon })),
                      h('span', { className: 'item-text-wrap' },
                        h('strong', { className: 'item-title' }, item.title),
                        h('span', { className: 'item-desc' }, item.description)
                      ),
                      h('span', { className: 'item-meta-wrap' },
                        h('span', { className: 'item-pill' }, item.badge),
                        activeExample === id && h('span', { className: 'item-check' }, h(Icon, { name: 'check' }))
                      )
                    )
                  )
                )
              )
            ),

            // EDITOR CARD
            h('div', { className: 'editor-card' },
              h('div', { className: 'editor-meta' },
                h('span', null, h('span', { className: 'language-dot' }), definition.name),
                h('div', null,
                  h('button', { className: 'icon-button', onClick: handleFormatCode, title: 'Beautify code' }, h(Icon, { name: 'sparkles' })),
                  h('button', { className: 'icon-button', onClick: () => { navigator.clipboard.writeText(code); triggerToast('Program copied!'); }, title: 'Copy code' }, h(Icon, { name: 'copy' })),
                  h('button', { className: 'icon-button', onClick: () => loadExample(activeExample, true), title: 'Reset example' }, h(Icon, { name: 'reset' }))
                )
              ),
              h('div', { className: 'code-area' },
                h('pre', { ref: lineNumbersRef, 'aria-hidden': true }, lineNumbers),
                h('div', { className: 'code-stack' },
                  h('pre', { ref: highlightRef, 'aria-hidden': true, dangerouslySetInnerHTML: { __html: syntaxHTML } }),
                  h('textarea', {
                    ref: textareaRef,
                    value: code,
                    onChange: e => setCode(e.target.value.slice(0, 100000)),
                    spellCheck: false,
                    autoCapitalize: 'off',
                    autoComplete: 'off',
                    autoCorrect: 'off'
                  })
                )
              ),
              h('div', { className: 'editor-footer' },
                h('span', null, `Ln ${code.split('\n').length}, Col 1`),
                h('span', null, `UTF-8 · .${definition.extension}`)
              )
            ),

            // RUN TOOLBAR
            h('div', { className: 'run-toolbar' },
              h('div', { className: 'run-hint' }, h(Icon, { name: 'bolt' }), h('span', null, 'Runs instantly in your browser')),
              h('div', { className: 'run-buttons' },
                execution.status === 'running'
                  ? h('button', { className: 'button danger', onClick: stopRun }, h(Icon, { name: 'stop' }), 'Stop')
                  : h('button', { className: 'button primary', onClick: runProgram }, h(Icon, { name: 'play' }), h('span', null, 'Run program'), h('kbd', null, 'Ctrl ↵'))
              )
            ),

            // OUTPUT TERMINAL
            h('section', { className: `output-card ${execution.status === 'success' ? 'has-success' : execution.status === 'error' ? 'has-error' : ''}` },
              execution.status === 'running' && h('div', { className: 'run-progress-bar' }),
              h('div', { className: 'panel-header' },
                h('div', { className: 'terminal-title-group' },
                  h('div', { className: 'terminal-dots' },
                    h('span', { className: 'terminal-dot dot-red' }),
                    h('span', { className: 'terminal-dot dot-yellow' }),
                    h('span', { className: 'terminal-dot dot-green' })
                  ),
                  h('h2', null, h(Icon, { name: 'terminal' }), 'Output')
                ),
                h('div', { className: 'output-actions' },
                  h('span', { className: `execution-status ${execution.status}` },
                    execution.status === 'running' ? 'Running…' : execution.status === 'success' ? `Completed · ${execution.duration} ms · ${execution.steps} steps` : execution.status === 'error' ? `Error on line ${execution.error?.line || 1}` : 'Ready when you are'
                  ),
                  h('button', { className: 'icon-button', onClick: () => { navigator.clipboard.writeText(execution.output.join('\n')); triggerToast('Output copied!'); }, title: 'Copy output' }, h(Icon, { name: 'copy' })),
                  h('button', { className: 'icon-button', onClick: () => setExecution({ status: 'idle', output: [], duration: 0, steps: 0, error: null }), title: 'Clear output' }, h(Icon, { name: 'trash' }))
                )
              ),
              h('div', { className: 'output-content' },
                execution.output.length === 0 && !execution.error
                  ? h('p', { className: 'empty-output' }, 'Your next idea starts with a run.', h('br'), h('span', null, 'Press Run program to see the result here.'))
                  : execution.output.map((line, idx) => h('div', { key: idx, className: 'output-line' }, line || ' ')),
                execution.error && h('div', { className: 'output-error' }, `Line ${execution.error.line || 1}: ${execution.error.message}`)
              )
            ),

            // STDIN PANEL
            h('details', { className: 'input-panel' },
              h('summary', null,
                h('span', null, h(Icon, { name: 'input' }), 'Program input'),
                h('span', { className: 'muted' }, 'For programs that ask questions')
              ),
              h('label', null, 'Enter one answer per line, in the order your program asks.'),
              h('textarea', {
                rows: 3,
                value: stdin,
                onChange: e => setStdin(e.target.value),
                placeholder: 'Josiah',
                spellCheck: false
              })
            )
          ),

          // SIDE PANEL
          h('aside', { className: 'studio-aside' },
            // MASCOT CARD
            h('div', { className: 'mascot-card' },
              h('div', { className: 'mascot-ambient-halo' }),
              h('div', { className: 'mascot-copy' },
                h('span', { className: 'mini-label' }, 'YOUR CODING PAL'),
                h('h2', null, 'Meet Byte', h('br'), 'your companion.'),
                h('div', { className: 'mascot-speech speech-pop' }, mascot.speech),
                h('div', { className: 'mascot-controls' },
                  h('button', { className: 'mascot-btn', onClick: () => { setMascot({ pose: 'wave', speech: "Beep boop! Hello world! Byte here! 🤖👋", badge: 'HELLO!' }); playSound('run', soundEnabled); } }, h(Icon, { name: 'smile' }), 'Say Hi'),
                  h('button', { className: 'mascot-btn', onClick: () => { const nextIdx = (tipIdx + 1) % codingTips.length; setTipIdx(nextIdx); setMascot({ pose: 'pointing', speech: `💡 Tip: ${codingTips[nextIdx]}`, badge: 'PRO TIP' }); playSound('run', soundEnabled); } }, h(Icon, { name: 'bulb' }), 'Tip'),
                  h('button', { className: 'mascot-btn', onClick: () => { setMascot({ pose: 'celebrate', speech: "Yaaay! Keep building awesome things! 🌟🎉", badge: 'CHEER!' }); playSound('cheer', soundEnabled); launchConfetti(); } }, h(Icon, { name: 'sparkles' }), 'Cheer')
                )
              ),
              h('div', { className: 'mascot-avatar-wrap' },
                h('img', {
                  src: mascotPoses[mascot.pose] || mascotPoses.idle,
                  alt: 'Byte companion robot',
                  width: 145, height: 145,
                  className: 'mascot-img mascot-floating',
                  onClick: () => {
                    const nextIdx = (tipIdx + 1) % codingTips.length;
                    setTipIdx(nextIdx);
                    setMascot({ pose: 'celebrate', speech: `💡 ${codingTips[nextIdx]}`, badge: 'BYTE' });
                    playSound('cheer', soundEnabled);
                    launchConfetti();
                  }
                }),
                h('div', { className: `mascot-mood-badge ${mascot.badge === 'RUNNING' ? 'badge-running' : mascot.badge === 'SUCCESS' ? 'badge-success' : mascot.badge === 'CHECK CODE' ? 'badge-error' : ''}` }, mascot.badge)
              )
            ),

            // DEFINITION CARD
            h('section', { className: 'definition-card' },
              h('div', { className: 'panel-header' }, h('h2', null, 'Your language'), h('span', { className: 'version' }, 'v1.0')),
              h('div', { className: 'language-identity' },
                h('span', { className: 'language-logo' }, definition.name.charAt(0).toUpperCase()),
                h('div', null, h('h3', { className: 'language-name' }, definition.name), h('span', { className: 'file-extension' }, `.${definition.extension} files`)),
                h('button', { className: 'icon-button', onClick: () => navigate('rules'), title: 'Edit rules' }, h(Icon, { name: 'edit' }))
              ),
              h('div', { className: 'rule-caption' }, 'YOUR KEYWORDS'),
              h('div', { className: 'keyword-preview' },
                ['print', 'let', 'if', 'for', 'in', 'end'].map(k =>
                  h('div', { key: k, className: 'keyword-row' },
                    h('span', null, descriptors[k][0]),
                    h('code', null, definition.keywords[k] || window.LangLab.defaults[k])
                  )
                )
              ),
              h('button', { className: 'button outline full', onClick: () => navigate('rules') }, h(Icon, { name: 'sliders' }), 'Customize language')
            ),

            // TIP CARD
            h('div', {
              className: 'tip-card',
              onClick: () => {
                const nextIdx = (tipIdx + 1) % codingTips.length;
                setTipIdx(nextIdx);
                playSound('run', soundEnabled);
              }
            },
              h('span', { className: 'tip-icon' }, h(Icon, { name: 'bulb' })),
              h('div', null,
                h('h3', null, 'A little syntax, a lot of possibility'),
                h('p', null, codingTips[tipIdx])
              )
            )
          )
        ),

        // RULES PAGE
        activePage === 'rules' && h('section', { className: 'rules-layout surface' },
          h('form', {
            onSubmit: e => {
              e.preventDefault();
              const form = e.target;
              const nextDef = {
                name: form.elements['language-name'].value.trim(),
                extension: form.elements['language-extension'].value.trim(),
                keywords: Object.fromEntries(Object.keys(window.LangLab.defaults).map(k => [k, form.elements[`kw-${k}`].value.trim()]))
              };
              const issues = window.LangLab.validate(nextDef);
              if (issues.length) {
                triggerToast(issues[0]);
                playSound('error', soundEnabled);
                return;
              }
              const remappedCode = remap(code, definition.keywords, nextDef.keywords);
              setDefinition(nextDef);
              setCode(remappedCode);
              navigate('playground');
              triggerToast('Language rules applied! Current program remapped.');
              setMascot({ pose: 'celebrate', speech: 'Rules updated successfully! Your program now speaks your custom language!', badge: 'SUCCESS' });
              playSound('success', soundEnabled);
              launchConfetti();
            }
          },
            h('div', { className: 'section-intro' },
              h('span', { className: 'step-number' }, '01'),
              h('div', null, h('h2', null, 'Give it an identity'), h('p', null, 'The name and extension travel with your downloaded language.'))
            ),
            h('div', { className: 'identity-fields' },
              h('label', null, 'Language name', h('input', { name: 'language-name', defaultValue: definition.name, required: true })),
              h('label', null, 'File extension', h('div', { className: 'extension-input' }, h('span', null, '.'), h('input', { name: 'language-extension', defaultValue: definition.extension, required: true })))
            ),
            h('div', { className: 'section-intro border-top' },
              h('span', { className: 'step-number' }, '02'),
              h('div', null, h('h2', null, 'Make the words your own'), h('p', null, 'Choose a unique keyword for each action.'))
            ),
            h('div', { className: 'keyword-fields' },
              Object.entries(descriptors).map(([k, [label, hint]]) =>
                h('div', { key: k, className: 'keyword-field' },
                  h('label', { htmlFor: `kw-${k}` }, label),
                  h('input', { id: `kw-${k}`, name: `kw-${k}`, defaultValue: definition.keywords[k] || window.LangLab.defaults[k], required: true }),
                  h('small', null, hint)
                )
              )
            ),
            h('div', { className: 'form-actions' },
              h('span', null, 'Applying rules updates keywords in your current program.'),
              h('button', { type: 'submit', className: 'button primary' }, h(Icon, { name: 'check' }), 'Apply language rules')
            )
          )
        ),

        // EXAMPLES PAGE
        activePage === 'examples' && h('section', null,
          h('div', { className: 'examples-hero surface' },
            h('div', { className: 'examples-hero-copy' },
              h('span', { className: 'eyebrow' }, 'READY-TO-RUN CODE'),
              h('h2', null, 'Explore Language Features'),
              h('p', null, 'Click any example to load it into the playground.'),
              h('div', { className: 'example-filters' },
                ['all', 'loops', 'basics', 'math', 'interactive'].map(filter =>
                  h('button', {
                    key: filter,
                    className: `filter-pill ${activeFilter === filter ? 'active' : ''}`,
                    onClick: () => setActiveFilter(filter)
                  }, filter.charAt(0).toUpperCase() + filter.slice(1))
                )
              )
            ),
            h('img', { src: 'assets/welcome.png', alt: 'Byte welcome', width: 170, height: 170, className: 'mascot-floating' })
          ),
          h('div', { className: 'examples-grid' },
            Object.entries(exampleData)
              .filter(([_, item]) => activeFilter === 'all' || item.category === activeFilter)
              .map(([id, item], i) =>
                h('article', { key: id, className: `example-card ${activeExample === id ? 'active-card' : ''}` },
                  h('div', { className: 'example-card-top' },
                    h('span', { className: 'example-number' }, `0${i + 1} / ${item.tag}`),
                    h('span', { className: 'category-tag' }, item.category.toUpperCase())
                  ),
                  h('h2', null, item.title),
                  h('p', null, item.description),
                  h('pre', null, remap(item.source, window.LangLab.defaults, definition.keywords)),
                  h('div', { className: 'example-actions' },
                    h('button', { className: 'button primary small', onClick: () => { loadExample(id, true); navigate('playground'); } }, h(Icon, { name: 'play' }), 'Try in editor'),
                    h('button', { className: 'icon-button copy-example-btn', onClick: () => { navigator.clipboard.writeText(remap(item.source, window.LangLab.defaults, definition.keywords)); triggerToast('Copied example code!'); } }, h(Icon, { name: 'copy' }))
                  )
                )
              )
          )
        ),

        // DOWNLOADS PAGE
        activePage === 'downloads' && h('section', null,
          h('div', { className: 'download-hero surface' },
            h('div', null,
              h('span', { className: 'eyebrow' }, 'YOURS, ONLINE AND OFFLINE'),
              h('h2', null, 'From your browser', h('br'), 'to your computer.'),
              h('p', null, `Everything you need to write and run ${definition.name} programs.`),
              h('button', { className: 'button primary', onClick: handleDownloadKit }, h(Icon, { name: 'download' }), 'Download language kit')
            ),
            h('img', { src: 'assets/trophy.png', alt: 'Byte trophy', width: 220, height: 220, className: 'mascot-floating' })
          ),
          h('div', { className: 'download-options' },
            h('article', { className: 'surface' },
              h('div', { className: 'card-icon' }, h(Icon, { name: 'laptop' })),
              h('span', { className: 'mini-label purple' }, 'EASIEST WAY'),
              h('h2', null, 'Double-click and run'),
              h('ol', null,
                h('li', null, 'Download and extract the ZIP.'),
                h('li', null, 'Open RUN.html in Chrome or Edge.'),
                h('li', null, 'Edit your program and press Run.')
              ),
              h('div', { className: 'info-strip' }, 'Works offline. No installation required.')
            ),
            h('article', { className: 'surface' },
              h('div', { className: 'card-icon' }, h(Icon, { name: 'terminal' })),
              h('span', { className: 'mini-label purple' }, 'FOR YOUR TERMINAL'),
              h('h2', null, 'Run it from a command'),
              h('p', null, 'With Node.js 18 or newer installed, open a terminal in the extracted folder:'),
              h('pre', null, `node cli.cjs hello.${definition.extension}`),
              h('p', null, 'Your language definition and interpreter are included.')
            )
          )
        ),

        // REFERENCE PAGE
        activePage === 'reference' && h('section', null,
          h('div', { className: 'guide-intro surface' },
            h('img', { src: 'assets/pointing.png', alt: 'Byte pointing', width: 80, height: 80, className: 'guide-mascot' }),
            h('div', null,
              h('h2', null, 'A small language with room for big ideas.'),
              h('p', null, 'Numbers, text, booleans, lists, variables, conditions, loops, functions, and built-in helpers.')
            )
          ),
          h('div', { className: 'reference-grid' },
            [
              ['Values & variables', 'Numbers, quoted text, booleans, and lists. Join text with +.', `${definition.keywords.let} name = "Josiah"\n${definition.keywords.let} ready = ${definition.keywords.true}\n${definition.keywords.print} "Hello, " + name`],
              ['For loops & ranges', `Iterate through lists or whole number ranges with ${definition.keywords.for} and ${definition.keywords.in}.`, `${definition.keywords.for} fruit ${definition.keywords.in} ["Apple", "Berry"]\n  ${definition.keywords.print} fruit\n${definition.keywords.end}\n\n${definition.keywords.for} i ${definition.keywords.in} range(1, 4)\n  ${definition.keywords.print} "Step " + text(i)\n${definition.keywords.end}`],
              ['Repeat & while loops', `Repeat a fixed number of times or loop while a condition holds true.`, `${definition.keywords.repeat} 3\n  ${definition.keywords.print} "Keep creating"\n${definition.keywords.end}\n\n${definition.keywords.let} i = 0\n${definition.keywords.while} i < 3\n  ${definition.keywords.print} i\n  i = i + 1\n${definition.keywords.end}`],
              ['Conditions (when / otherwise)', `Choose a path with ${definition.keywords.if} and ${definition.keywords.else}. Close blocks with ${definition.keywords.end}.`, `${definition.keywords.if} 5 > 3 ${definition.keywords.and} ${definition.keywords.not} ${definition.keywords.false}\n  ${definition.keywords.print} "Yes!"\n${definition.keywords.else}\n  ${definition.keywords.print} "Try again"\n${definition.keywords.end}`],
              ['Functions & return', `Define reusable logic with parameters and return values.`, `${definition.keywords.function} double(n)\n  ${definition.keywords.return} n * 2\n${definition.keywords.end}\n${definition.keywords.print} double(21)`],
              ['Input & questions', `Read one answer per line from the Program input box. Convert to numbers with number().`, `${definition.keywords.let} age = number(${definition.keywords.input}("Your age?"))\n${definition.keywords.print} "Next year: " + text(age + 1)`],
              ['Lists & collections', `Store ordered collections. Add items with push(), remove last with pop().`, `${definition.keywords.let} items = [10, 20]\npush(items, 30)\n${definition.keywords.print} items[0]\n${definition.keywords.print} len(items)\n${definition.keywords.print} pop(items)`],
              ['Built-in helpers', `18 powerful built-ins: range, push, pop, join, split, upper, lower, floor, ceil, random, reverse, contains, len, number, text, round, sqrt, abs, min, max.`, `${definition.keywords.let} words = split("hello world", " ")\n${definition.keywords.print} upper(words[0])\n${definition.keywords.print} reverse("robot")\n${definition.keywords.print} random(1, 10)\n${definition.keywords.print} contains(words, "world")`]
            ].map(([title, desc, snippet], idx) =>
              h('article', { key: idx, className: 'reference-card' },
                h('h2', null, title),
                h('p', null, desc),
                h('pre', null, snippet)
              )
            )
          )
        )
      ),

      // TOAST NOTIFICATION
      toastMsg && h('div', { className: 'toast' }, toastMsg),

      // FLOATING MASCOT FAB
      h('button', {
        className: 'mascot-fab',
        onClick: () => {
          const nextIdx = (tipIdx + 1) % codingTips.length;
          setTipIdx(nextIdx);
          setMascot({ pose: 'wave', speech: `🤖 Byte says: ${codingTips[nextIdx]}`, badge: 'HELLO!' });
          playSound('run', soundEnabled);
        }
      },
        h('img', { src: 'assets/wave.png', alt: 'Byte wave', width: 46, height: 46, className: 'mascot-fab-img' }),
        h('span', { className: 'mascot-fab-indicator' })
      ),

      // CONFETTI CANVAS
      h('canvas', { id: 'confetti-canvas', className: 'confetti-canvas', 'aria-hidden': true })
    )
  );
}

// Mount React App
if (typeof ReactDOM !== 'undefined' && ReactDOM.createRoot) {
  const root = ReactDOM.createRoot(document.getElementById('root'));
  root.render(h(LangLabReactApp));
}
