# Repository Guidance

## Project Structure

- This is a browser-based Monogatari visual novel with Electron and Electrobun packaging.
- `index.html` is the runtime entry point. It loads scripts directly, so preserve dependency order when adding or moving scripts and custom elements.
- Put story, inventory, and shared game behavior in `js/`; persistent player defaults and options live in `js/storage.js` and `js/options.js`.
- Minigame implementations and their related media belong under `assets/games/<game>/`.
- Shared presentation lives in `style/main.css`; game assets are referenced from the repository root using their existing relative paths.
- `engine/core/` is the Monogatari runtime. Avoid changing vendored engine code to work around application-level behavior unless the fix genuinely belongs there.

## Working Conventions

- Keep the existing browser-compatible JavaScript style and the project's Spanish-language story/UI text.
- Check script loading and asset-copy configuration when adding files: `index.html`, `build-web.ts`, and `electrobun.config.ts` each define what the runtime or packaged builds include.
- Keep edits focused; do not reformat large legacy files as part of an unrelated change.
- There is no configured test or lint script. Do not describe a change as tested unless a relevant check has actually run.

## Useful Commands

- `bun run serve` starts the live-reload development server at `http://localhost:5100` (or the port set by `PORT`).
- `bun run build:web` creates the static web build in `build/web`.
- `bun run build:electrobun` builds the Electrobun app.
- `bun run start:electrobun` builds and launches Electrobun in development mode.

For story, UI, or minigame behavior changes, run `bun run serve` and smoke-test the affected flow in the browser. For web packaging changes, run `bun run build:web`.