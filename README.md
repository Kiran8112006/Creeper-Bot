# CreeperBot

A Minecraft-inspired physical desktop pet and autonomous rover — built for FARLANDS 2026.

## Repository Structure

```
CreeperBot/
├── apps/
│   └── web/          ← Next.js website (Phase 1)
├── docs/
│   └── credentials-setup.md
└── README.md
```

## Quick Start (Website)

```powershell
cd apps\web
Copy-Item .env.example .env.local   # then fill in your Supabase credentials
npm run dev
```

Open http://localhost:3000.

## Documentation

- [Credential Setup Guide](./docs/credentials-setup.md)

## Project Status

| Component | Status |
|-----------|--------|
| Landing page | ✅ Phase 1 |
| Sign-up / Sign-in | ✅ Phase 1 |
| Supabase Auth | ✅ Phase 1 (credentials required) |
| Dashboard shell | ✅ Phase 1 |
| AI conversation | 🔲 Future phase |
| Camera / Vision | 🔲 Future phase |
| Robot pairing | 🔲 Future phase |
| ESP32 firmware | 🔲 Future phase |
| Autonomous missions | 🔲 Future phase |

This project is not affiliated with Mojang Studios or Microsoft.
