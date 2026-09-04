# Agent project notes

## Architecture

- Electron main process: `main.cjs`
- Preload bridge: `preload.cjs`
- Vite renderer entry: `src/main.js`
- Tool implementations: `src/tools/`
- Production renderer output: `dist/` (ignored by Git)

## Current status

- Image Studio Pro project persistence is implemented in
  `src/tools/imageStudio.js`.
- The canonical editable-project extension is `.wtoolsimage`.
- `.wtools-image` is legacy-only because Chromium rejects its hyphen when it is
  used in File System Access API picker options.
- Preserve legacy opening through the hidden HTML file input.
- Windows packaging uses `build/worldtools.ico`, generated from
  `public/worldtools.png` before `electron-builder` runs.

## Change workflow

1. Read `docs/` and `agents/` before editing.
2. Check `git status` and preserve unrelated user changes.
3. Update relevant documentation with each behavior change.
4. Run `npm run build` before handing off renderer changes.
5. Use Git commands directly; do not use the GitHub CLI.
