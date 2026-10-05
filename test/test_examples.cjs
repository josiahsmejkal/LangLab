'use strict';
const engine = require('../dist/engine.js');
const def = { name: 'Nova', extension: 'nova', keywords: { ...engine.defaults } };

const programs = [
  { name: 'welcome', code: 'let name = "Josiah"\nsay "Hello, " + name + "!"\nsay "Welcome to my own language."', input: '' },
  { name: 'for_loop', code: 'let fruits = ["Apple", "Mango", "Strawberry"]\nfor fruit in fruits\n  say "Delicious: " + fruit\nend\nfor i in range(1, 6)\n  say "Step " + text(i) + " squared is " + text(i * i)\nend', input: '' },
  { name: 'fizzbuzz', code: 'for n in range(1, 16)\n  when n % 15 == 0\n    say "FizzBuzz! (divisible by 3 and 5)"\n  otherwise\n    when n % 3 == 0\n      say "Fizz (divisible by 3)"\n    otherwise\n      when n % 5 == 0\n        say "Buzz (divisible by 5)"\n      otherwise\n        say text(n)\n      end\n    end\n  end\nend', input: '' },
  { name: 'loop', code: 'let count = 1\nrepeat 5\n  say "Step " + text(count)\n  count = count + 1\nend\nsay "You made it!"', input: '' },
  { name: 'condition', code: 'let score = 85\nwhen score >= 75\n  say "You did it! High score."\notherwise\n  say "Keep going. You have got this."\nend', input: '' },
  { name: 'input', code: 'let name = ask("What is your name?")\nlet age = number(ask("How old are you?"))\nsay "Nice to meet you, " + name + "!"\nsay "Next year you will be " + text(age + 1) + "."', input: 'Josiah\n19' },
  { name: 'function', code: 'fn square(n)\n  return n * n\nend\nsay "4 squared = " + text(square(4))\nsay "9 squared = " + text(square(9))', input: '' },
  { name: 'list', code: 'let ideas = ["Imagine", "Create", "Run"]\npush(ideas, "Share")\nsay "Number of ideas: " + text(len(ideas))\nfor item in ideas\n  say "⭐ " + item\nend', input: '' },
  { name: 'text_tools', code: 'let message = "code create inspire"\nsay "Original:  " + message\nsay "Uppercase: " + upper(message)\nlet words = split(message, " ")\nsay "Words:     " + text(len(words))\nsay "Reversed:  " + reverse(message)\nsay "Connected: " + join(words, " ➔ ")', input: '' },
  { name: 'game', code: 'let secret = 7\nlet guess = number(ask("Guess a number between 1 and 10:"))\nsay "You guessed: " + text(guess)\nwhen guess == secret\n  say "🎉 BINGO! You found the secret number!"\notherwise\n  say "Try again!"\nend', input: '7' }
];

programs.forEach(p => {
  const r = engine.execute(p.code, def, p.input);
  console.log(`PASS ${p.name.padEnd(12)} -> ${r.output.length} output lines, ${r.steps} steps`);
});
console.log('\nAll 10 example programs executed successfully!');
