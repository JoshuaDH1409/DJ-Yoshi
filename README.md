# PulseBot

[![License](https://img.shields.io/github/license/JoshuaDH1409/DJ-Yoshi)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D22-brightgreen)](https://nodejs.org/)
[![Docker](https://img.shields.io/badge/docker-ready-blue)](https://github.com/JoshuaDH1409/DJ-Yoshi/pkgs/container/dj-yoshi)
[![Last Commit](https://img.shields.io/github/last-commit/JoshuaDH1409/DJ-Yoshi)](https://github.com/JoshuaDH1409/DJ-Yoshi/commits/main)
[![CI](https://img.shields.io/github/actions/workflow/status/JoshuaDH1409/DJ-Yoshi/ci.yml?label=CI)](https://github.com/JoshuaDH1409/DJ-Yoshi/actions/workflows/ci.yml)
[![Security](https://img.shields.io/github/actions/workflow/status/JoshuaDH1409/DJ-Yoshi/security.yml?label=security)](https://github.com/JoshuaDH1409/DJ-Yoshi/actions/workflows/security.yml)

**PulseBot** is a Discord music bot for self-hosted playback with slash commands, queue controls, multi-language UI, and Docker deployment.

> **Honest credit:** this repository is a **personal portfolio fork / customization** of [BeatDock](https://github.com/lazaroagomez/BeatDock) by Lazaro Gomez (Apache-2.0). It is **not** an original bot written from scratch. Branding, docs, and config here are adapted for portfolio presentation while preserving upstream attribution (`LICENSE`, `NOTICE`, Credits).

---

## ES · Qué es

Bot de música para Discord pensado para portafolio y uso personal:

- Reproduce audio desde YouTube, SoundCloud, Bandcamp, Twitch y Vimeo (vía Lavalink)
- Soporte opcional de Spotify (búsqueda/resolución)
- Cola, loop, shuffle, autoplay, filtros EQ y letras
- Comandos slash, varios idiomas (`en`, `es`, `tr`, `it`, `pt-BR`)
- Despliegue con Docker Compose (bot + Lavalink) o fallback a nodos públicos

### Stack

| Capa | Tecnología |
|------|------------|
| Runtime | **Node.js** 22+ |
| Discord API | **discord.js** |
| Audio | **Lavalink** 4 + **lavalink-client** |
| Deploy | **Docker** / Docker Compose |

---

## EN · What it does

Self-hostable Discord music bot with:

- Playback from major sources through Lavalink
- Queue management (skip, back, loop, shuffle, clear, play-next)
- Interactive search, lyrics, filters, invite/about commands
- Role-based access control and env-based configuration
- Works with a local Lavalink container **or** public Lavalink v4 fallback

---

## Quick start (Docker)

### Prerequisites

- Discord bot token from the [Developer Portal](https://discord.com/developers/applications)
- Enable **all 3 Privileged Gateway Intents** (Presence, Server Members, Message Content)
- [Docker](https://docs.docker.com/get-docker/) installed

### From this repository

```bash
git clone https://github.com/JoshuaDH1409/DJ-Yoshi.git
cd DJ-Yoshi
cp .env.example .env
# Edit .env and set TOKEN=your_discord_bot_token
docker compose up -d --build
```

Services:

| Container | Role |
|-----------|------|
| `pulsebot` | Discord bot (Node.js) |
| `pulsebot-lavalink` | Lavalink 4 audio server |

Useful commands:

```bash
docker compose logs -f
docker compose restart
docker compose down
```

### Minimal `.env`

```env
TOKEN=your_discord_bot_token_here
```

See [`.env.example`](.env.example) for optional Spotify, language, volume, roles, and Lavalink settings. **Never commit real tokens.**

### Without a self-hosted Lavalink

If `LAVALINK_HOST`, `LAVALINK_PORT`, and `LAVALINK_PASSWORD` are unset, the bot can fetch free public Lavalink v4 nodes and rotate on failure. For portfolio/demo reliability, the included `docker-compose.yml` still runs a local Lavalink service.

---

## Commands

| Command | Description |
|---------|-------------|
| `/play <query> [next]` | Play a song (optional front-of-queue) |
| `/search <query>` | Search and select tracks |
| `/pause` | Pause / resume |
| `/skip` | Skip track |
| `/back` | Previous track |
| `/stop` | Stop and disconnect |
| `/queue` | Show queue |
| `/shuffle` | Shuffle queue |
| `/autoplay` | Toggle autoplay |
| `/loop` | Toggle loop |
| `/clear` | Clear queue |
| `/volume <1-100>` | Set volume |
| `/lyrics` | Lyrics for current track |
| `/filter` | Audio effects / EQ presets |
| `/nowplaying` | Current track info |
| `/invite` | Bot invite link |
| `/about` | Bot info |

---

## Configuration

Only `TOKEN` is required.

| Variable | Default | Description |
|----------|---------|-------------|
| `TOKEN` | — | Discord bot token (**required**) |
| `SPOTIFY_ENABLED` | `false` | Enable Spotify search support |
| `SPOTIFY_CLIENT_ID` / `SPOTIFY_CLIENT_SECRET` | — | Spotify app credentials |
| `DEFAULT_LANGUAGE` | `en` | `en`, `es`, `tr`, `it`, `pt-BR` |
| `DEFAULT_VOLUME` | `80` | Default volume (0–100) |
| `AUTOPLAY_DEFAULT` | `false` | Autoplay on by default |
| `ALLOWED_ROLES` | — | Comma-separated role IDs |
| `DEFAULT_SEARCH_PLATFORM` | `ytmsearch` | Default search platform |
| `LAVALINK_PASSWORD` | `youshallnotpass` | Lavalink password |
| `QUEUE_EMPTY_DESTROY_MS` | `30000` | Leave VC after empty queue |
| `EMPTY_CHANNEL_DESTROY_MS` | `60000` | Leave empty voice channel |

Lavalink tuning lives in [`application.yml`](application.yml).

---

## Project layout

```
src/           Bot source (commands, events, Lavalink utils)
locales/       i18n strings
docs/          Static documentation site (PulseBot branding)
docker-compose.yml + Dockerfile + application.yml
NOTICE         Apache-2.0 attribution to BeatDock
```

---

## Credits & license

- **Upstream:** [BeatDock](https://github.com/lazaroagomez/BeatDock) by **Lazaro Gomez** — original architecture, features, and much of the codebase.
- **This fork:** branded as **PulseBot** for personal portfolio use by **JoshuaDH1409** (repo: [JoshuaDH1409/DJ-Yoshi](https://github.com/JoshuaDH1409/DJ-Yoshi)).
- **Upstream support (optional):** [Ko-fi — lazaroagomez](https://ko-fi.com/lazaroagomez)
- **License:** [Apache-2.0](LICENSE) — see also [`NOTICE`](NOTICE) and [`CHANGELOG.md`](CHANGELOG.md).

Built with [discord.js](https://discord.js.org/), [Lavalink](https://github.com/lavalink-devs/Lavalink), [lavalink-client](https://github.com/Tomato6966/lavalink-client), Docker, and Node.js 22+.
