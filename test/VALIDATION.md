# Validation

Completed 2026-10-02.

- 29 interpreter and export checks passed (`node test/verify.cjs`).
- 16 DOM interaction and offline-runner checks passed using jsdom 26 (`NODE_PATH=/tmp/langlab-dom/node_modules node test/ui.cjs`).
- JavaScript syntax checks passed for the engine, app, and export module.
- All six UI examples executed using the same generated worker code as the studio.
- Applied custom language rules changed real code tokens; quoted strings and comments were preserved.
- Duplicate keywords were rejected without changing the active language.
- Unicode keywords and identifiers, including Tamil combining marks, executed correctly.
- Runtime error messages include line numbers. Infinite loops and excessive recursion terminate with controlled errors.
- The exported CLI was run as an actual Node subprocess, including file-based input and a nonzero error exit.
- Python's standard ZIP reader verified archive contents and CRC integrity.
- The generated self-contained offline page executed its embedded worker in a DOM test context. Its program, input, and interpreter are embedded with no external resource references.
- Local draft saving, page navigation, custom definition export, and the language-kit download action passed DOM checks.

No full-browser visual or device QA was performed because the required browser-control skill was unavailable. DOM tests simulate browser APIs and do not prove pixel layout or every browser's Worker/CSP behavior. The responsive layout was reviewed in source at desktop/tablet/mobile breakpoints. WebMCP is feature-detected; validation in a supported WebMCP browser was unavailable.

This site has a local temporary draft and downloadable language files. It has no cloud account/project persistence. The generated languages are interpreted with customizable keywords over the documented grammar, not native machine-code compilers.
