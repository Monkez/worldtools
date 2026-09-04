# WorldTools documentation

WorldTools is an Electron desktop toolbox. The renderer is built with Vite from
`src/`, while Electron starts from `main.cjs` and loads `dist/index.html`.

## Common commands

- `setup.bat`: install Node.js dependencies.
- `build.bat`: create the Vite production build in `dist/`.
- `run.bat`: build and launch the Electron application in one terminal.
- `npm run generate:icon`: create the Windows `.ico` from the app logo.
- `npm run dev`: run only the Vite development server.

Feature-specific notes are stored alongside this file. See
`image-studio-project-files.md` for the Image Studio Pro project format.
