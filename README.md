# speechBubbles — Real-Time Captioning & Desktop Overlay

A desktop live-captioning interface and overlay application built with **Vue 3**, **Pinia**, **Vite**, and **Electron**.

`speechBubbles` streams microphone audio to a local Whisper speech-to-text API via WebSockets and renders animated floating caption bubbles on a frameless, transparent GPU-accelerated desktop overlay.

---

## Architecture Overview

- **Desktop Shell**: Electron with frameless, transparent windows and native blur effects (`electron-acrylic-window`).
- **Audio Capture & Streaming**: Web Audio API (`AudioContext`) downsampling 44.1/48 kHz mic inputs to 16 kHz 16-bit PCM streaming chunks sent over WebSocket (`ws://localhost:8000/listen`).
- **Real-Time Reactive UI**: Pinia store managing live caption queues, dynamic bounding-box DOM calculations (`getBoundingClientRect`), and CSS pop-in transitions.
- **Global Hotkeys**: System shortcut management (`qhotkeys`) for live control during presentations or streaming.

---

## Getting Started

### Prerequisites
- Node.js 18+ (tested on v24)
- pnpm or npm

### Installation
```bash
pnpm install
```

### Development
1. Start the local Whisper API server (see companion `whisper-api` repository).
2. Start the Vite dev server:
```bash
pnpm dev
```
3. In a separate terminal, launch the Electron application:
```bash
pnpm electron
```

### Production Build
```bash
pnpm build
```

---

## License
MIT
