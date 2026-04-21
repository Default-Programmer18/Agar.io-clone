# Agar.io Clone 🟢

A real-time multiplayer browser game inspired by [Agar.io](https://agar.io), built with **Node.js**, **Express**, and **Socket.IO**. Players move around a 4000×4000 world, absorb colorful orbs to grow, and compete to absorb other players.

---

## 📁 Project Structure

```
Agar.io-clone-main/
├── index.js                        # Entry point — starts Express & Socket.IO
├── servers.js                      # Exports the io and app instances
├── package.json
├── expressStuff/
│   └── expressMain.js              # Serves static files on port 8000
├── socketStuff/
│   ├── socketMain.js               # Core game loop & Socket.IO event handling
│   ├── checkCollisions.js          # Orb & player collision detection (AABB + Pythagorean)
│   └── classes/
│       ├── Player.js               # Combines socketId + config + data
│       ├── PlayerConfig.js         # Private per-player state (speed, zoom, vectors)
│       ├── PlayerData.js           # Public per-player state (position, radius, score, color)
│       └── Orb.js                  # Food orbs with random position and color
└── public/
    ├── index.html                  # Game UI (Bootstrap modals, canvas, leaderboard)
    ├── styles.css                  # Styles
    ├── uiStuff.js                  # Modal logic, name input, game start
    ├── canvasStuff.js              # Canvas rendering loop (requestAnimationFrame)
    ├── socketStuff.js              # Client-side Socket.IO event handling
    └── images/
        ├── starfield.jpg           # Canvas background
        ├── GitHub-Mark-32px.png
        └── GitHub-Mark-Light-32px.png
```

---

## 🚀 Getting Started

### Prerequisites

- [Node.js](https://nodejs.org/) v14 or higher
- npm

### Installation

```bash
git clone https://github.com/your-username/Agar.io-clone.git
cd Agar.io-clone
npm install
```

### Running the Server

```bash
npm start
```

This starts the server with **nodemon** on port `8000`. Open your browser and navigate to:

```
http://localhost:8000
```

---

## 🎮 How to Play

1. Enter your name in the login modal and click **Play as Guest**.
2. Click **Play Solo!** to join the game.
3. **Move your mouse** on the canvas — your player follows the cursor direction.
4. **Absorb orbs** (small colored circles) to grow your radius and increase your score.
5. **Absorb other players** — if your radius is larger than another player's, you absorb them.
6. Growing larger makes you **slower** — manage your size strategically.
7. Track your position on the real-time **leaderboard** (sortable by Score, Orbs, or Players absorbed).

---

## ⚙️ Game Settings

Configured in `socketStuff/socketMain.js`:

| Setting | Value | Description |
|---|---|---|
| `defaultNumberOfOrbs` | 4000 | Target orb count in the world |
| `defaultSpeed` | 6 | Starting player speed |
| `defaultSize` | 6 | Starting player radius |
| `defaultZoom` | 1.5 | Starting camera zoom |
| `worldHeight` | 4000 | World height in pixels |
| `worldWidth` | 4000 | World width in pixels |
| `defaultGenericOrbSize` | 5 | Orb radius |

On server start, **500 orbs** are spawned. When a player absorbs an orb, the server replaces it immediately so the world stays populated.

---

## 🔌 Socket.IO Event Reference

### Client → Server

| Event | Payload | Description |
|---|---|---|
| `init` | `{ playerName }` | Join the game; receives orb data and player index |
| `tock` | `{ xVector, yVector }` | Send mouse direction every ~33ms (30fps) |

### Server → Client

| Event | Payload | Description |
|---|---|---|
| `tick` | `playersArray` | Broadcast all player positions every ~33ms |
| `orbSwitch` | `{ capturedOrbI, newOrb }` | Replace an absorbed orb |
| `playerAbsorbed` | `{ absorbed, absorbedBy }` | Notify all clients of a player elimination |
| `updateLeaderBoard` | `leaderBoardArray` | Push updated scores after any absorption |

---

## 🏗️ Architecture Notes

- **`servers.js`** — single source of truth for the Express app and Socket.IO instance, exported for use in both `expressMain.js` and `socketMain.js`.
- **`ticktoeInterval`** — a `setInterval` that fires every 33ms only while players are in the room. It starts when the first player joins and stops when the last player disconnects.
- **Collision detection** — uses a two-phase approach: a fast AABB (Axis-Aligned Bounding Box) test first, then a precise Pythagorean distance check. This runs server-side on every `tock`.
- **Camera** — the canvas translates based on the local player's position, keeping them centered at all times.
- **Player removal** — when a player is absorbed or disconnects, their slot in the `players` and `playerForUser` arrays is replaced with `{}` (not spliced) to preserve stable indices for all connected clients.

---

## 📦 Dependencies

| Package | Purpose |
|---|---|
| `express` | HTTP server & static file serving |
| `socket.io` | Real-time bidirectional communication |
| `nodemon` | Auto-restart server on file changes (dev) |

---

## 🗺️ What's Complete

- ✅ Multiplayer real-time movement (tick/tock loop)
- ✅ Orb absorption and respawning
- ✅ Player vs. player collision and elimination
- ✅ Live leaderboard with sort options
- ✅ Dynamic camera zoom tied to player size
- ✅ Randomized player & orb colors
- ✅ Login modal with name input
- ✅ In-game absorption notifications

## 🔧 Known Gaps / Potential Improvements

- [ ] The `defaultNumberOfOrbs` setting (4000) is defined but only 500 orbs are spawned on startup — orb count could be synced to the setting
- [ ] GitHub login button in the modal is not yet wired up
- [ ] "Join a Team" button exists in the UI but has no implementation
- [ ] Player stats ("See your stats" / "See all stats") buttons are not yet functional
- [ ] No persistence — scores reset on disconnect
- [ ] World boundary uses `worldWidth` for both X and Y axis checks (should use `worldHeight` for Y)

---
