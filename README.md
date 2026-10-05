# Windows quick start

1. Extract the entire ZIP.
2. Open the `LangLab` folder.
3. Double-click `START_WINDOWS.bat` (requires Python 3).
4. Open http://localhost:8080 in Chrome or Edge.

The website uses plain HTML, CSS and JavaScript: no npm install or build step is required. Open it through the local server, not by double-clicking `dist/index.html`, because the studio loads its interpreter using fetch.

To run a language without a local server, use **Download language** in the website, extract that separate kit, and open its `RUN.html`.

---

# LangLab

A custom programming language studio using CodeLearn's purple robot design.

## Use the studio

Serve `dist/` using any static HTTP server. With Python installed:

```sh
python -m http.server 8080 --directory dist
```

Open `http://localhost:8080`. No build step or production dependencies are required.

- Playground: edit a program, enter input, and run it in a Web Worker.
- Playground: edit a program, enter input, and run it in a Web Worker with animated feedback.
- Language rules: change the language name, file extension, and 17 keywords (including `for` and `in`). Applying rules rewrites existing keyword tokens without rewriting strings or comments.
- Examples: 10 real programs covering language features, for-loops, FizzBuzz, string processing, and mini-games.
- Download & run: export a complete ZIP, language definition, or source program.
- Language guide: examples update to match the current custom keywords.
- Mascot companion: Byte the animated purple robot reacts to editing, running, errors, and celebrations with confetti and audio feedback.

Browser storage only holds a temporary local draft. Download the definition and program to keep a permanent copy. There are no accounts, cloud project storage, analytics, or external execution services.

## Use a downloaded language

Extract the language kit and open `RUN.html` in Chrome or Edge. It embeds the interpreter and a simple editor, and needs no network, server, or installation. Save program changes with its Save program button.

The kit also contains `engine.cjs`, `cli.cjs`, `language.json`, a source file, `input.txt`, and a Windows terminal shortcut. For command-line use, install Node.js 18+ and run:

```sh
node cli.cjs hello.nova
node cli.cjs hello.nova --input input.txt
```

This is a real interpreted language with configurable keywords over a defined grammar. It does not generate native executables or accept arbitrary grammar definitions. It supports numbers, text, booleans, lists, indexed reads, variables, assignment, conditions, for/repeat/while loops, functions, return, input, arithmetic/comparison/logical operators, and built-in helpers (`range`, `push`, `pop`, `join`, `split`, `upper`, `lower`, `floor`, `ceil`, `random`, `reverse`, `contains`, `len`, `number`, `text`, `round`, `sqrt`, `abs`, `min`, `max`). Unicode identifiers including combining marks are supported. Blocks use explicit end keywords. Variables declared inside a block stay in that block; assignment can update an outer variable.

The handwritten tokenizer, parser, and evaluator never use `eval` or `Function`. Programs cannot call host, network, filesystem, or operating-system APIs. Execution is bounded by step, time, recursion, nesting, and output limits. Every program starts with a fresh scope.

## Verify

```sh
node --check dist/app.js
node --check dist/engine.js
node --check dist/export.js
node test/verify.cjs
```

The suite checks language semantics, custom Tamil keywords, diagnostics, execution limits, isolation, ZIP integrity, exported script syntax, and actual Node.js CLI execution. UI state and interaction verification is recorded in `test/VALIDATION.md`. Full browser screenshot QA was unavailable in the build environment.

WebMCP tools are feature-detected and use the same visible state/run action. Validation in a supported WebMCP browser was unavailable; unsupported browsers continue normally.

Original robot assets were supplied by the user and reused unchanged. Bundled Plus Jakarta Sans and JetBrains Mono fonts include their OFL licenses in `dist/assets/`.
