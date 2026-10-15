import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: {
    default: 'CreeperBot — Minecraft-Inspired Desktop Pet & Autonomous Rover',
    template: '%s | CreeperBot',
  },
  description:
    'CreeperBot is a physical Minecraft-inspired robot companion with conversational AI, visual perception and autonomous TNT retrieval missions. FARLANDS 2026.',
  keywords: ['CreeperBot', 'Minecraft robot', 'desktop pet', 'autonomous rover', 'ESP32', 'FARLANDS 2026'],
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body className="texture-cave">{children}</body>
    </html>
  );
}
