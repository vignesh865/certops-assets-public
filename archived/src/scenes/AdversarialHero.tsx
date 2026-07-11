import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

// Dark hero spotlight — "Adversarial Data Engine" reveal
// Background: terminal dark. Contrast from surrounding light scenes.

const SUBTITLE = 'Standard datasets only test the easy case.';
const SUBTITLE_START = 90;
const CHARS_PER_FRAME = 2;

export const AdversarialHero: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // "Adversarial" springs in
  const word1 = spring({ frame: Math.max(0, frame - 20), fps, config: { damping: 200 } });
  const word1Y = interpolate(word1, [0, 1], [40, 0]);
  const word1Opacity = interpolate(word1, [0, 0.1], [0, 1]);

  // "Data Engine" springs in
  const word2 = spring({ frame: Math.max(0, frame - 48), fps, config: { damping: 200 } });
  const word2Y = interpolate(word2, [0, 1], [40, 0]);
  const word2Opacity = interpolate(word2, [0, 0.1], [0, 1]);

  // Green accent bar grows from left
  const barWidth = interpolate(frame, [70, 92], [0, 180], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Subtitle typewriter
  const subtitleChars = Math.min(
    SUBTITLE.length,
    Math.max(0, frame - SUBTITLE_START) * CHARS_PER_FRAME,
  );
  const subtitleText = SUBTITLE.slice(0, subtitleChars);

  // Blinking cursor — shows while typing, blinks after
  const isTyping = subtitleChars > 0 && subtitleChars < SUBTITLE.length;
  const isDone = subtitleChars >= SUBTITLE.length;
  const cursorVisible = isTyping || (isDone && Math.floor(frame / 15) % 2 === 0);

  // Radial glow behind text (green, subtle)
  const glowOpacity = interpolate(frame, [10, 40], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // "Why" copy on the right — fades in after subtitle starts
  const whyOpacity = interpolate(frame, [108, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const whyY = interpolate(frame, [108, 138], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.terminalBg,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '0 96px',
        gap: 80,
      }}
    >
      {/* Radial glow behind headline */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '32%',
          width: 700,
          height: 500,
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(ellipse at center, rgba(5,150,105,0.14) 0%, transparent 70%)`,
          opacity: glowOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Left: headline */}
      <div style={{ display: 'flex', flexDirection: 'column', flexShrink: 0 }}>
        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            opacity: word1Opacity,
            transform: `translateY(${word1Y}px)`,
          }}
        >
          Adversarial
        </div>

        <div
          style={{
            fontSize: 80,
            fontWeight: 900,
            color: '#ffffff',
            lineHeight: 1,
            letterSpacing: '-0.02em',
            opacity: word2Opacity,
            transform: `translateY(${word2Y}px)`,
            marginTop: 4,
          }}
        >
          Data Engine
        </div>

        <div
          style={{
            width: barWidth,
            height: 3,
            background: COLORS.green,
            borderRadius: 2,
            marginTop: 28,
            boxShadow: `0 0 12px ${COLORS.green}80`,
          }}
        />

        <div
          style={{
            marginTop: 20,
            fontSize: 15,
            fontWeight: 500,
            color: COLORS.green,
            fontFamily: COLORS.monoFont,
            letterSpacing: '0.02em',
            minHeight: 22,
          }}
        >
          {subtitleText}
          {cursorVisible && (
            <span
              style={{
                display: 'inline-block',
                width: 9,
                height: 16,
                background: COLORS.green,
                marginLeft: 2,
                verticalAlign: 'text-bottom',
                opacity: 0.9,
              }}
            />
          )}
        </div>
      </div>

      {/* Right: "why" copy */}
      <div
        style={{
          width: 380,
          opacity: whyOpacity,
          transform: `translateY(${whyY}px)`,
          borderLeft: `1px solid rgba(255,255,255,0.08)`,
          paddingLeft: 32,
        }}
      >
        <div
          style={{
            fontSize: 11,
            fontWeight: 700,
            color: COLORS.green,
            letterSpacing: '0.14em',
            textTransform: 'uppercase',
            marginBottom: 14,
          }}
        >
          Why it matters
        </div>
        <div
          style={{
            fontSize: 17,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.55,
            letterSpacing: '-0.005em',
          }}
        >
          Clean test sets miss the cases users actually find — typos,
          jailbreaks, hostile phrasing, ambiguous intent.
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 17,
            fontWeight: 500,
            color: 'rgba(255,255,255,0.88)',
            lineHeight: 1.55,
            letterSpacing: '-0.005em',
          }}
        >
          CertOps generates them by design — domain-grounded, reproducible,
          hostile.
        </div>
      </div>
    </AbsoluteFill>
  );
};
