// CreeperFace — original pixel-art SVG Creeper face
// All artwork is original; no Minecraft assets were reproduced.

interface CreeperFaceProps {
  size?: number;
  expression?: 'idle' | 'happy' | 'confused' | 'angry' | 'thinking' | 'listening';
  className?: string;
  animated?: boolean;
}

const EXPRESSIONS = {
  idle: {
    // Eyes: two square pupils
    leftEye:  { x: 4,  y: 4,  w: 4, h: 4 },
    rightEye: { x: 8,  y: 4,  w: 4, h: 4 },
    // Mouth: T-shape frown
    mouth: [
      { x: 5, y: 9, w: 2, h: 2 },
      { x: 5, y: 11, w: 6, h: 2 },
      { x: 9, y: 9, w: 2, h: 2 },
    ],
  },
  happy: {
    leftEye:  { x: 4,  y: 4,  w: 4, h: 4 },
    rightEye: { x: 8,  y: 4,  w: 4, h: 4 },
    mouth: [
      { x: 4, y: 10, w: 2, h: 2 },
      { x: 6, y: 12, w: 4, h: 2 },
      { x: 10, y: 10, w: 2, h: 2 },
    ],
  },
  confused: {
    leftEye:  { x: 4,  y: 4,  w: 4, h: 4 },
    rightEye: { x: 8,  y: 4,  w: 4, h: 4 },
    mouth: [
      { x: 5, y: 9, w: 2, h: 2 },
      { x: 7, y: 11, w: 4, h: 2 },
      { x: 5, y: 13, w: 2, h: 2 },
    ],
  },
  angry: {
    leftEye:  { x: 4,  y: 5,  w: 4, h: 3 },
    rightEye: { x: 8,  y: 5,  w: 4, h: 3 },
    mouth: [
      { x: 5, y: 10, w: 6, h: 2 },
      { x: 5, y: 12, w: 2, h: 2 },
      { x: 9, y: 12, w: 2, h: 2 },
    ],
  },
  thinking: {
    leftEye:  { x: 4,  y: 4,  w: 3, h: 4 },
    rightEye: { x: 9,  y: 4,  w: 4, h: 4 },
    mouth: [
      { x: 6, y: 10, w: 5, h: 2 },
    ],
  },
  listening: {
    leftEye:  { x: 4,  y: 4,  w: 4, h: 5 },
    rightEye: { x: 8,  y: 4,  w: 4, h: 5 },
    mouth: [
      { x: 5, y: 10, w: 6, h: 3 },
    ],
  },
};

export default function CreeperFace({
  size = 64,
  expression = 'idle',
  className = '',
  animated = false,
}: CreeperFaceProps) {
  const expr = EXPRESSIONS[expression];

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 16 16"
      xmlns="http://www.w3.org/2000/svg"
      className={`${animated ? 'animate-pulse-green' : ''} ${className}`}
      style={{ imageRendering: 'pixelated' }}
      aria-label={`CreeperBot face — ${expression}`}
      role="img"
    >
      {/* Head background — creeper green */}
      <rect x="0" y="0" width="16" height="16" fill="#3DAB3D" />

      {/* Subtle noise texture overlay rows */}
      <rect x="0" y="0" width="16" height="1" fill="rgba(255,255,255,0.07)" />
      <rect x="0" y="2" width="16" height="1" fill="rgba(0,0,0,0.05)" />
      <rect x="0" y="4" width="16" height="1" fill="rgba(255,255,255,0.04)" />
      <rect x="0" y="8" width="16" height="1" fill="rgba(0,0,0,0.06)" />
      <rect x="0" y="12" width="16" height="1" fill="rgba(255,255,255,0.03)" />

      {/* Highlight edges */}
      <rect x="0" y="0" width="1" height="16" fill="rgba(255,255,255,0.12)" />
      <rect x="15" y="0" width="1" height="16" fill="rgba(0,0,0,0.2)" />
      <rect x="0" y="15" width="16" height="1" fill="rgba(0,0,0,0.2)" />

      {/* Eyes */}
      <rect
        x={expr.leftEye.x}
        y={expr.leftEye.y}
        width={expr.leftEye.w}
        height={expr.leftEye.h}
        fill="#1A1A1A"
      />
      <rect
        x={expr.rightEye.x}
        y={expr.rightEye.y}
        width={expr.rightEye.w}
        height={expr.rightEye.h}
        fill="#1A1A1A"
      />

      {/* Eye shine */}
      <rect x={expr.leftEye.x + 1}  y={expr.leftEye.y + 1}  width="1" height="1" fill="rgba(255,255,255,0.4)" />
      <rect x={expr.rightEye.x + 1} y={expr.rightEye.y + 1} width="1" height="1" fill="rgba(255,255,255,0.4)" />

      {/* Mouth */}
      {expr.mouth.map((rect, i) => (
        <rect key={i} x={rect.x} y={rect.y} width={rect.w} height={rect.h} fill="#1A1A1A" />
      ))}

      {/* Darker snout area */}
      <rect x="4" y="8" width="8" height="8" fill="rgba(0,0,0,0.10)" />
    </svg>
  );
}
