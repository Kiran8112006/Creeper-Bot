import type { Metadata } from 'next';
import Link from 'next/link';
import SiteNav from '@/components/layout/SiteNav';
import SiteFooter from '@/components/layout/SiteFooter';
import CreeperFace from '@/components/ui/CreeperFace';

export const metadata: Metadata = {
  title: 'CreeperBot — Minecraft-Inspired Desktop Pet & Autonomous Rover',
  description:
    'Meet CreeperBot — a physical robot companion that converses, sees and explores. Built for FARLANDS 2026.',
};

// ──────────────────────────────────────────────────────────────
// INLINE SVG ILLUSTRATIONS
// All artwork is original; no Minecraft game assets reproduced.
// ──────────────────────────────────────────────────────────────

function RobotIllustration() {
  return (
    <svg
      viewBox="0 0 120 160"
      xmlns="http://www.w3.org/2000/svg"
      aria-label="CreeperBot robot illustration"
      role="img"
      style={{ imageRendering: 'pixelated', width: '100%', maxWidth: '220px' }}
    >
      {/* Antenna */}
      <rect x="57" y="4" width="6" height="12" fill="#5C5C5C" />
      <rect x="54" y="2" width="12" height="4" fill="#7CB845" />

      {/* Head */}
      <rect x="30" y="16" width="60" height="56" fill="#3DAB3D" />
      {/* Head highlight */}
      <rect x="30" y="16" width="60" height="2" fill="rgba(255,255,255,0.15)" />
      <rect x="30" y="16" width="2" height="56" fill="rgba(255,255,255,0.12)" />
      {/* Head shadow */}
      <rect x="88" y="16" width="2" height="56" fill="rgba(0,0,0,0.2)" />
      <rect x="30" y="70" width="60" height="2" fill="rgba(0,0,0,0.2)" />

      {/* Eyes */}
      <rect x="40" y="28" width="16" height="16" fill="#1A1A1A" />
      <rect x="64" y="28" width="16" height="16" fill="#1A1A1A" />
      {/* Eye shine */}
      <rect x="43" y="31" width="4" height="4" fill="rgba(255,255,255,0.35)" />
      <rect x="67" y="31" width="4" height="4" fill="rgba(255,255,255,0.35)" />

      {/* Mouth — idle expression */}
      <rect x="44" y="52" width="8" height="8" fill="#1A1A1A" />
      <rect x="44" y="60" width="32" height="8" fill="#1A1A1A" />
      <rect x="68" y="52" width="8" height="8" fill="#1A1A1A" />

      {/* OLED panel on forehead area */}
      <rect x="46" y="18" width="28" height="8" fill="#0A0A0A" />
      <rect x="47" y="19" width="26" height="6" fill="#001100" />
      {/* OLED text dots */}
      <rect x="49" y="21" width="2" height="2" fill="#3DAB3D" />
      <rect x="53" y="21" width="2" height="2" fill="#3DAB3D" />
      <rect x="57" y="21" width="2" height="2" fill="#3DAB3D" />
      <rect x="61" y="21" width="2" height="2" fill="#2D7D2D" />
      <rect x="65" y="21" width="2" height="2" fill="#3DAB3D" />
      <rect x="69" y="21" width="2" height="2" fill="#3DAB3D" />

      {/* Neck */}
      <rect x="50" y="72" width="20" height="10" fill="#5C5C5C" />
      {/* Neck joint bolts */}
      <rect x="52" y="74" width="4" height="4" fill="#888888" />
      <rect x="64" y="74" width="4" height="4" fill="#888888" />

      {/* Body */}
      <rect x="24" y="82" width="72" height="54" fill="#2D7D2D" />
      {/* Body highlight */}
      <rect x="24" y="82" width="72" height="2" fill="rgba(255,255,255,0.1)" />
      <rect x="24" y="82" width="2" height="54" fill="rgba(255,255,255,0.08)" />

      {/* Chest ESP32 panel */}
      <rect x="38" y="92" width="44" height="28" fill="#1A1A1A" />
      <rect x="40" y="94" width="40" height="24" fill="#0D1117" />
      {/* PCB details */}
      <rect x="42" y="96" width="8" height="6" fill="#1A3A1A" />
      <rect x="52" y="96" width="8" height="6" fill="#1A2A3A" />
      <rect x="62" y="96" width="8" height="6" fill="#1A1A3A" />
      <rect x="72" y="96" width="6" height="6" fill="#2A1A1A" />
      {/* LED indicator */}
      <rect x="44" y="106" width="4" height="4" fill="#3DAB3D" />
      <rect x="50" y="106" width="4" height="4" fill="#888888" />
      <rect x="56" y="106" width="4" height="4" fill="#888888" />
      {/* Chip */}
      <rect x="62" y="104" width="14" height="10" fill="#333333" />
      <rect x="64" y="106" width="10" height="6" fill="#222222" />

      {/* Camera module on shoulder */}
      <rect x="84" y="86" width="14" height="14" fill="#1A1A1A" />
      <rect x="86" y="88" width="10" height="10" fill="#0A0A0A" />
      <circle cx="91" cy="93" r="4" fill="#1A3A5A" />
      <circle cx="91" cy="93" r="2" fill="#0D2040" />
      <rect x="90" y="91" width="2" height="2" fill="rgba(255,255,255,0.3)" />

      {/* Arms */}
      {/* Left arm */}
      <rect x="6" y="84" width="18" height="40" fill="#2D7D2D" />
      <rect x="6" y="84" width="18" height="2" fill="rgba(255,255,255,0.1)" />
      {/* Left hand */}
      <rect x="4" y="122" width="22" height="16" fill="#3DAB3D" />

      {/* Right arm */}
      <rect x="96" y="84" width="18" height="40" fill="#2D7D2D" />
      {/* Right hand */}
      <rect x="94" y="122" width="22" height="16" fill="#3DAB3D" />

      {/* Legs */}
      {/* Left leg */}
      <rect x="34" y="136" width="22" height="20" fill="#2D7D2D" />
      {/* Left wheel */}
      <rect x="30" y="154" width="30" height="8" fill="#5C5C5C" />
      <rect x="32" y="156" width="26" height="4" fill="#3A3A3A" />

      {/* Right leg */}
      <rect x="64" y="136" width="22" height="20" fill="#2D7D2D" />
      {/* Right wheel */}
      <rect x="60" y="154" width="30" height="8" fill="#5C5C5C" />
      <rect x="62" y="156" width="26" height="4" fill="#3A3A3A" />

      {/* Ground shadow */}
      <ellipse cx="60" cy="163" rx="36" ry="3" fill="rgba(0,0,0,0.3)" />
    </svg>
  );
}

function BlockWorld() {
  /* A simplified pixel landscape: sky → clouds → terrain */
  return (
    <div
      style={{ position: 'relative', width: '100%', height: '200px', overflow: 'hidden' }}
      aria-hidden="true"
    >
      {/* Sky */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: 'linear-gradient(180deg, #1A3A5A 0%, #2A5A8A 60%, #3A7ABF 100%)',
        }}
      />

      {/* Stars */}
      {[
        [10, 20], [25, 35], [45, 15], [65, 28], [80, 10], [90, 40],
        [15, 50], [55, 8], [72, 45], [38, 22],
      ].map(([x, y], i) => (
        <div
          key={i}
          style={{
            position: 'absolute',
            left: `${x}%`,
            top: `${y}%`,
            width: '2px',
            height: '2px',
            backgroundColor: 'rgba(255,255,255,0.6)',
          }}
        />
      ))}

      {/* Moon */}
      <div
        style={{
          position: 'absolute',
          right: '12%',
          top: '14%',
          width: '24px',
          height: '24px',
          backgroundColor: '#E8E8D0',
          boxShadow: '2px 2px 0 rgba(0,0,0,0.3)',
        }}
      />

      {/* Far mountains — stone */}
      <div
        style={{
          position: 'absolute',
          bottom: '80px',
          left: 0,
          right: 0,
          height: '80px',
          background: 'linear-gradient(180deg, #4A4A4A 0%, #5C5C5C 100%)',
          clipPath: 'polygon(0% 100%, 0% 60%, 8% 30%, 15% 60%, 22% 20%, 30% 55%, 38% 35%, 45% 65%, 52% 25%, 60% 50%, 67% 15%, 75% 45%, 82% 28%, 90% 55%, 97% 40%, 100% 60%, 100% 100%)',
        }}
      />

      {/* Dirt layer */}
      <div
        style={{
          position: 'absolute',
          bottom: '32px',
          left: 0,
          right: 0,
          height: '56px',
          backgroundColor: 'var(--color-dirt)',
        }}
      />

      {/* Grass top */}
      <div
        style={{
          position: 'absolute',
          bottom: '64px',
          left: 0,
          right: 0,
          height: '16px',
          backgroundColor: 'var(--color-grass)',
          backgroundImage: 'repeating-linear-gradient(90deg, transparent 0px, transparent 15px, rgba(0,0,0,0.1) 15px, rgba(0,0,0,0.1) 16px)',
        }}
      />

      {/* Stone base */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: '32px',
          backgroundColor: 'var(--color-stone-dark)',
        }}
      />

      {/* Tree trunks */}
      {[[8, 80], [20, 96], [75, 88], [88, 72]].map(([x, h], i) => (
        <div key={i}>
          <div
            style={{
              position: 'absolute',
              left: `${x}%`,
              bottom: '80px',
              width: '8px',
              height: `${h}px`,
              backgroundColor: '#6B4C35',
              transform: 'translateX(-50%)',
            }}
          />
          <div
            style={{
              position: 'absolute',
              left: `${x}%`,
              bottom: `${80 + h - 8}px`,
              width: '32px',
              height: '32px',
              backgroundColor: '#3A6A20',
              transform: 'translateX(-50%)',
              boxShadow: 'inset 1px 1px 0 rgba(255,255,255,0.1)',
            }}
          />
        </div>
      ))}
    </div>
  );
}

function FeatureCard({
  icon,
  title,
  description,
  comingSoon = false,
}: {
  icon: React.ReactNode;
  title: string;
  description: string;
  comingSoon?: boolean;
}) {
  return (
    <div
      className="block-panel"
      style={{ padding: '24px', position: 'relative' }}
    >
      {comingSoon && (
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '12px',
            fontFamily: 'var(--font-pixel)',
            fontSize: '6px',
            backgroundColor: 'rgba(212,172,13,0.15)',
            color: 'var(--color-gold-light)',
            border: '1px solid var(--color-gold)',
            padding: '3px 6px',
          }}
        >
          PLANNED
        </div>
      )}
      <div
        className="slot"
        style={{ width: '48px', height: '48px', marginBottom: '16px' }}
      >
        {icon}
      </div>
      <h3
        className="heading-pixel"
        style={{ fontSize: '9px', color: 'var(--color-grass-light)', marginBottom: '12px' }}
      >
        {title}
      </h3>
      <p style={{ fontFamily: 'var(--font-body)', fontSize: '14px', color: '#AAAAAA', lineHeight: 1.7 }}>
        {description}
      </p>
    </div>
  );
}

function MissionStep({
  step,
  code,
  title,
  description,
  color,
}: {
  step: number;
  code: string;
  title: string;
  description: string;
  color: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        gap: '16px',
        padding: '20px',
        borderLeft: `4px solid ${color}`,
        backgroundColor: 'rgba(0,0,0,0.2)',
        marginBottom: '4px',
      }}
    >
      <div style={{ flexShrink: 0, textAlign: 'center' }}>
        <div
          style={{
            width: '36px',
            height: '36px',
            backgroundColor: color,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            fontFamily: 'var(--font-pixel)',
            fontSize: '10px',
            color: '#1A1A1A',
            fontWeight: 'bold',
          }}
        >
          {step}
        </div>
      </div>
      <div>
        <div
          className="heading-pixel"
          style={{ fontSize: '8px', color, marginBottom: '6px' }}
        >
          {code}
        </div>
        <div
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: '14px',
            color: '#DDDDDD',
            fontWeight: 600,
            marginBottom: '4px',
          }}
        >
          {title}
        </div>
        <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#888888', lineHeight: 1.6 }}>
          {description}
        </p>
      </div>
    </div>
  );
}

function SystemNode({
  icon,
  label,
  sub,
  color = 'var(--color-stone)',
}: {
  icon: React.ReactNode;
  label: string;
  sub: string;
  color?: string;
}) {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '8px',
        minWidth: '100px',
      }}
    >
      <div
        className="slot"
        style={{ width: '52px', height: '52px', borderColor: color }}
      >
        {icon}
      </div>
      <div style={{ textAlign: 'center' }}>
        <div
          style={{
            fontFamily: 'var(--font-pixel)',
            fontSize: '7px',
            color: '#E8E8E8',
            marginBottom: '4px',
          }}
        >
          {label}
        </div>
        <div style={{ fontFamily: 'var(--font-body)', fontSize: '11px', color: '#777777' }}>{sub}</div>
      </div>
    </div>
  );
}

function Arrow() {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        color: '#444444',
        fontSize: '20px',
        flexShrink: 0,
      }}
      aria-hidden="true"
    >
      →
    </div>
  );
}

// ─────────────────────────────────────────────────────────────
// PAGE
// ─────────────────────────────────────────────────────────────

export default function HomePage() {
  return (
    <>
      <SiteNav />

      {/* ── A. HERO ─────────────────────────────────────────── */}
      <section
        id="hero"
        style={{ position: 'relative', overflow: 'hidden', minHeight: '90vh' }}
      >
        {/* Night sky + terrain illustration */}
        <BlockWorld />

        {/* Content sits on top */}
        <div
          style={{
            position: 'relative',
            zIndex: 10,
            backgroundColor: 'rgba(18,16,31,0.85)',
          }}
        >
          <div className="container-mc">
            <div
              style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '48px',
                alignItems: 'center',
                padding: '80px 0 64px',
              }}
            >
              {/* Text */}
              <div className="animate-slide-up">
                <div
                  className="badge badge-warning"
                  style={{ marginBottom: '20px', display: 'inline-flex' }}
                >
                  <span>⚒</span>
                  <span>FARLANDS 2026 — IN DEVELOPMENT</span>
                </div>
                <h1
                  className="heading-pixel"
                  style={{
                    fontSize: 'clamp(14px, 2.5vw, 22px)',
                    color: 'var(--color-grass-light)',
                    marginBottom: '16px',
                    lineHeight: 2,
                  }}
                >
                  MEET CREEPERBOT
                </h1>
                <p
                  style={{
                    fontFamily: 'var(--font-vt)',
                    fontSize: 'clamp(18px, 3vw, 26px)',
                    color: '#DDDDDD',
                    marginBottom: '24px',
                    lineHeight: 1.5,
                  }}
                >
                  A Minecraft-inspired physical robot that talks, sees and explores — right on your desk.
                </p>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '15px',
                    color: '#999999',
                    marginBottom: '36px',
                    lineHeight: 1.8,
                    maxWidth: '480px',
                  }}
                >
                  CreeperBot is a real desktop rover with an ESP32 brain, an ESP32-CAM for visual input and
                  an OLED Creeper face that expresses emotions. Ask it questions, show it objects and send it
                  on autonomous missions — all from your browser.
                </p>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap' }}>
                  <Link href="/sign-up" id="hero-cta-primary" className="btn btn-primary btn-lg">
                    ⚡ ENTER YOUR WORLD
                  </Link>
                  <Link href="/sign-in" id="hero-cta-signin" className="btn btn-ghost">
                    SIGN IN →
                  </Link>
                </div>
                <p
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: '12px',
                    color: '#555555',
                    marginTop: '16px',
                  }}
                >
                  Free account · No robot required to explore the dashboard
                </p>
              </div>

              {/* Robot illustration */}
              <div
                className="animate-float"
                style={{
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                }}
              >
                <div
                  style={{
                    position: 'relative',
                    padding: '32px',
                    background: 'radial-gradient(ellipse at center, rgba(61,171,61,0.08) 0%, transparent 70%)',
                  }}
                >
                  <RobotIllustration />
                  {/* Floating status badge */}
                  <div
                    className="badge badge-offline"
                    style={{
                      position: 'absolute',
                      top: '12px',
                      right: '8px',
                      fontSize: '6px',
                    }}
                  >
                    <span>●</span>
                    <span>NO ROBOT PAIRED</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Block dividers */}
      <div className="block-divider" />
      <div className="block-divider-dirt" />
      <div className="block-divider-stone" />

      {/* ── B. FEATURES ─────────────────────────────────────── */}
      <section
        id="features"
        style={{ padding: '80px 0', backgroundColor: 'var(--color-cave)' }}
      >
        <div className="container-mc">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              className="heading-pixel"
              style={{
                fontSize: 'clamp(12px, 2vw, 18px)',
                color: 'var(--color-grass-light)',
                marginBottom: '16px',
              }}
            >
              WHAT CREEPERBOT CAN DO
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: '#888888',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              CreeperBot combines hardware and AI into a single desk companion. Here&apos;s what the system is
              designed to do — features marked{' '}
              <span style={{ color: 'var(--color-gold-light)', fontWeight: 600 }}>PLANNED</span> are not yet
              fully implemented.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
              gap: '16px',
            }}
          >
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-grass-light)" strokeWidth="2">
                  <path d="M12 18.5a6.5 6.5 0 1 0 0-13 6.5 6.5 0 0 0 0 13Z" />
                  <path d="M19.14 19.14 21 21M3 21l1.86-1.86" />
                  <path d="M12 12v.01" />
                </svg>
              }
              title="TALK"
              description="Ask CreeperBot questions through your desktop or phone microphone. The robot responds with spoken answers and displays short replies on its OLED face. Conversational AI is processed in the cloud and returned in real time."
            />
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-sky-light)" strokeWidth="2">
                  <rect x="2" y="4" width="20" height="14" rx="1" />
                  <circle cx="12" cy="11" r="3" />
                  <path d="M18 20H6" />
                </svg>
              }
              title="SEE"
              description='The ESP32-CAM provides live visual input. Ask "What am I holding?" or "What colour is this?" and CreeperBot will analyse the camera feed and give you an answer. Visual results can also appear in your browser dashboard.'
              comingSoon
            />
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-gold-light)" strokeWidth="2">
                  <rect x="3" y="3" width="8" height="8" />
                  <rect x="13" y="3" width="8" height="8" />
                  <rect x="3" y="13" width="8" height="8" />
                  <rect x="13" y="13" width="8" height="8" />
                </svg>
              }
              title="REACT"
              description="The physical OLED screen is CreeperBot&apos;s face. It animates expressions — idle, listening, thinking, speaking, happy, confused, mission-complete and error — giving the robot a genuine Minecraft-inspired personality."
              comingSoon
            />
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-emerald-light)" strokeWidth="2">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M6 20v-2a6 6 0 0 1 12 0v2" />
                  <path d="M19 11l2 2-2 2" />
                </svg>
              }
              title="RECOGNIZE"
              description="CreeperBot is designed to learn your face and follow you around the room in supervised mode. Once enrolled, the robot can identify you as its owner and respond to your presence. This capability is under active development."
              comingSoon
            />
            <FeatureCard
              icon={
                <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-redstone-light)" strokeWidth="2">
                  <path d="M3 12h18" />
                  <path d="m15 6 6 6-6 6" />
                  <path d="M9 6 3 12l6 6" />
                </svg>
              }
              title="EXPLORE"
              description="CreeperBot&apos;s flagship mission: locate a designated TNT prop, navigate around obstacles, pick it up using the collection arm and return it to base. All four mission phases are designed and the hardware plan is in place."
              comingSoon
            />
          </div>
        </div>
      </section>

      <div className="block-divider-stone" />
      <div className="block-divider-dirt" />
      <div className="block-divider" />

      {/* ── C. MISSION SHOWCASE ─────────────────────────────── */}
      <section
        id="mission"
        style={{
          padding: '80px 0',
          backgroundColor: 'var(--color-cave-mid)',
        }}
      >
        <div className="container-mc">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <div
              className="badge badge-error"
              style={{ marginBottom: '16px', display: 'inline-flex' }}
            >
              <span>▣</span>
              <span>TNT RETRIEVAL MISSION</span>
            </div>
            <h2
              className="heading-pixel"
              style={{
                fontSize: 'clamp(12px, 2vw, 18px)',
                color: '#E8E8E8',
                marginBottom: '16px',
              }}
            >
              FIND → NAVIGATE → COLLECT → RETURN
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: '#888888',
                maxWidth: '580px',
                margin: '0 auto',
              }}
            >
              The centrepiece of CreeperBot&apos;s autonomous capability. This mission is planned and
              partially designed — hardware validation is ongoing.
            </p>
          </div>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))',
              gap: '32px',
              alignItems: 'start',
            }}
          >
            {/* Quest board panel */}
            <div className="quest-panel">
              <div
                className="heading-pixel"
                style={{
                  fontSize: '8px',
                  color: 'var(--color-gold-light)',
                  borderBottom: '1px solid #4A360A',
                  paddingBottom: '12px',
                  marginBottom: '20px',
                  letterSpacing: '0.12em',
                }}
              >
                📋 ACTIVE QUEST
              </div>
              <div
                style={{
                  fontFamily: 'var(--font-vt)',
                  fontSize: '22px',
                  color: '#E8D4A0',
                  marginBottom: '8px',
                }}
              >
                Retrieve the TNT Block
              </div>
              <p
                style={{
                  fontFamily: 'var(--font-body)',
                  fontSize: '13px',
                  color: '#998866',
                  lineHeight: 1.7,
                  marginBottom: '24px',
                }}
              >
                Locate the designated TNT prop within the arena, navigate past obstacles, engage the
                collection mechanism and return to the home base.
              </p>
              <div
                className="badge badge-warning"
                style={{ display: 'inline-flex' }}
              >
                <span>⚠</span>
                <span>MISSION IN DEVELOPMENT</span>
              </div>
            </div>

            {/* Mission steps */}
            <div>
              <MissionStep
                step={1}
                code="FIND"
                title="Detect the Target"
                description="The ESP32-CAM scans the environment for the TNT prop using colour detection and shape recognition algorithms currently under development."
                color="var(--color-sky)"
              />
              <MissionStep
                step={2}
                code="NAVIGATE"
                title="Approach the Target"
                description="The WROOM drives CreeperBot toward the detected target while the obstacle-avoidance sensors prevent collisions. Path planning is handled onboard."
                color="var(--color-gold-light)"
              />
              <MissionStep
                step={3}
                code="COLLECT"
                title="Engage Pickup Mechanism"
                description="When the required hardware is fitted and verified, CreeperBot activates its collection arm to retrieve the TNT prop. Hardware integration is ongoing."
                color="var(--color-redstone-light)"
              />
              <MissionStep
                step={4}
                code="RETURN"
                title="Return to Base"
                description="CreeperBot navigates back to the designated home position, deposits the object and signals mission complete on the OLED display."
                color="var(--color-emerald-light)"
              />
            </div>
          </div>
        </div>
      </section>

      <div className="block-divider" />
      <div className="block-divider-dirt" />
      <div className="block-divider-stone" />

      {/* ── D. HOW IT WORKS ─────────────────────────────────── */}
      <section
        id="how-it-works"
        style={{ padding: '80px 0', backgroundColor: 'var(--color-cave)' }}
      >
        <div className="container-mc">
          <div style={{ textAlign: 'center', marginBottom: '56px' }}>
            <h2
              className="heading-pixel"
              style={{
                fontSize: 'clamp(12px, 2vw, 18px)',
                color: 'var(--color-grass-light)',
                marginBottom: '16px',
              }}
            >
              HOW THE SYSTEM WORKS
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '15px',
                color: '#888888',
                maxWidth: '560px',
                margin: '0 auto',
              }}
            >
              CreeperBot connects your browser to a physical robot through a secure cloud pipeline.
            </p>
          </div>

          {/* Architecture diagram */}
          <div
            className="block-panel"
            style={{ padding: '40px 32px', marginBottom: '40px' }}
          >
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '12px',
              }}
            >
              <SystemNode
                icon={
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-sky-light)" strokeWidth="2">
                    <rect x="2" y="3" width="20" height="14" rx="1" />
                    <path d="M8 21h8M12 17v4" />
                  </svg>
                }
                label="BROWSER"
                sub="Your control centre"
                color="var(--color-sky)"
              />
              <Arrow />
              <SystemNode
                icon={
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-grass-light)" strokeWidth="2">
                    <rect x="3" y="3" width="18" height="18" rx="1" />
                    <path d="M3 9h18M3 15h18M9 3v18" />
                  </svg>
                }
                label="CLOUD"
                sub="Auth · AI · Relay"
                color="var(--color-grass)"
              />
              <Arrow />
              <SystemNode
                icon={
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-gold-light)" strokeWidth="2">
                    <rect x="5" y="2" width="14" height="20" rx="1" />
                    <circle cx="12" cy="18" r="1" />
                  </svg>
                }
                label="ESP32-CAM"
                sub="Visual input"
                color="var(--color-gold)"
              />
              <Arrow />
              <SystemNode
                icon={
                  <svg viewBox="0 0 24 24" width="28" height="28" fill="none" stroke="var(--color-redstone-light)" strokeWidth="2">
                    <rect x="4" y="6" width="16" height="12" rx="1" />
                    <path d="M8 6V4M16 6V4M8 18v2M16 18v2M2 10h2M20 10h2M2 14h2M20 14h2" />
                  </svg>
                }
                label="ESP32 WROOM"
                sub="Motors · OLED · Safety"
                color="var(--color-redstone)"
              />
            </div>
          </div>

          {/* Explanation cards */}
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))',
              gap: '16px',
            }}
          >
            {[
              {
                label: 'YOUR BROWSER',
                color: 'var(--color-sky)',
                text: 'The website is your control centre. You sign in, see robot status, provide microphone input and view camera results — from any modern browser on desktop or mobile.',
              },
              {
                label: 'CLOUD SERVICES',
                color: 'var(--color-grass-light)',
                text: 'Supabase handles authentication and stores account data securely. A Python service will route audio and camera data to Gemini AI and relay commands back to the robot.',
              },
              {
                label: 'ESP32-CAM',
                color: 'var(--color-gold-light)',
                text: 'The camera module captures images for visual questions and target detection. It communicates with the main ESP32 WROOM over a local serial or Wi-Fi bridge.',
              },
              {
                label: 'ESP32 WROOM',
                color: 'var(--color-redstone-light)',
                text: "The main controller drives the motors, manages obstacle sensors, animates the OLED face and enforces local safety rules — independent of cloud connectivity.",
              },
            ].map((item) => (
              <div
                key={item.label}
                style={{
                  padding: '20px',
                  backgroundColor: 'rgba(0,0,0,0.25)',
                  borderLeft: `3px solid ${item.color}`,
                }}
              >
                <div
                  className="heading-pixel"
                  style={{ fontSize: '7px', color: item.color, marginBottom: '10px' }}
                >
                  {item.label}
                </div>
                <p style={{ fontFamily: 'var(--font-body)', fontSize: '13px', color: '#999999', lineHeight: 1.7 }}>
                  {item.text}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <div className="block-divider-stone" />
      <div className="block-divider-dirt" />
      <div className="block-divider" />

      {/* ── E. CLOSING CTA ──────────────────────────────────── */}
      <section
        id="get-started"
        style={{
          padding: '96px 0',
          backgroundColor: 'var(--color-cave-mid)',
          textAlign: 'center',
        }}
      >
        <div className="container-mc">
          <div
            style={{
              maxWidth: '560px',
              margin: '0 auto',
            }}
          >
            <div style={{ marginBottom: '32px' }}>
              <CreeperFace size={80} expression="happy" animated />
            </div>
            <h2
              className="heading-pixel"
              style={{
                fontSize: 'clamp(12px, 2vw, 18px)',
                color: 'var(--color-grass-light)',
                marginBottom: '20px',
                lineHeight: 2,
              }}
            >
              READY TO MEET YOUR BOT?
            </h2>
            <p
              style={{
                fontFamily: 'var(--font-body)',
                fontSize: '16px',
                color: '#AAAAAA',
                marginBottom: '40px',
                lineHeight: 1.8,
              }}
            >
              Create a free account to claim your spot. When your CreeperBot is ready, you&apos;ll pair it
              directly from the dashboard.
            </p>
            <div
              style={{
                display: 'flex',
                gap: '16px',
                justifyContent: 'center',
                flexWrap: 'wrap',
                marginBottom: '24px',
              }}
            >
              <Link href="/sign-up" id="cta-register-btn" className="btn btn-primary btn-lg">
                ⚡ CREATE FREE ACCOUNT
              </Link>
              <Link href="/sign-in" id="cta-signin-btn" className="btn btn-secondary">
                SIGN IN →
              </Link>
            </div>
            <p
              style={{
                fontFamily: 'var(--font-pixel)',
                fontSize: '7px',
                color: '#555555',
                letterSpacing: '0.08em',
              }}
            >
              NO CREDIT CARD REQUIRED · FREE TIER APPLIES
            </p>
          </div>
        </div>
      </section>

      <SiteFooter />
    </>
  );
}
