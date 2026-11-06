# Cyber Chess

**English** · [עברית](README.he.md) · [Русский](README.ru.md)

Chess in the browser with a "glass and neon" look: play against a friend on one screen or against the Stockfish engine, with a match clock, captured pieces and a choice of piece when a pawn is promoted.

**Live demo:** https://dubnovalexey.github.io/Cosmo-Glass-Chess/

## Features

- Player vs player or player vs AI; the AI level sets the Stockfish search depth.
- Play as White or Black, flip the board.
- A clock for each side with a configurable time, pause and restart.
- A promotion dialog (queen, rook, bishop, knight) and "graveyards" of captured pieces.
- Move, capture, check and end-of-game sounds.

## How it works

- `chess-logic.js` keeps the game state and talks to the engine; `chess-render.js` draws the board; `chess-timer.js` runs the clocks.
- Stockfish runs in a **Web Worker**, so the page never freezes while the engine thinks. The worker gets the position as FEN and answers with the best move (UCI protocol).

## Tech stack

HTML5 · CSS3 (glassmorphism) · JavaScript · Web Workers · Stockfish (UCI) · `<dialog>` · GitHub Pages

## Third-party code

Stockfish is distributed under the GNU GPL v3 — see `assets/js/STOCKFISH-LICENSE.md` for the authors and links to the source code. Move rules come from [chess.js](https://github.com/jhlywa/chess.js) 0.10.3 (BSD-2-Clause), loaded from cdnjs.

## Run locally

The engine runs in a Web Worker, so open the page through a local web server (for example `npx serve .`), not as a file.

## Roadmap

- This board, its style and the engine move into the chess game of my Cosmo Game Hub.
- Move history with notation (PGN) and undo.

## Engine regression checks

`node --test tests/engine-races.test.cjs` checks delayed moves across restart, pause/resume, position changes and page disposal. BFCache restoration restarts the current AI turn once and rejects callbacks from the old worker. UCI searches are serialized; an obsolete engine answer cannot change a new match.
