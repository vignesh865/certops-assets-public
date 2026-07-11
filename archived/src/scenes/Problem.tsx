import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

const HEADLINE = 'Does your AI ship on evidence — or on hope?';
const CHAR_FRAMES = 2;
const CURSOR_BLINK = 8;

// The four evidence rows — the real gaps that let problems through. The
// strike-throughs and philosophy payoff happen on this same scene so the
// cross-fade into Identity is meaningful (problem-state → answer-state),
// not a duplicate.
export const FAILURES = [
  'No formal definition of correctness.',
  'No adversarial pressure on the model.',
  'No regression gate between releases.',
  'No certificate. No audit trail.',
];

// ── Beat plan (360 frames = 12s) ───────────────────────────────────────────
// 0–80     Question types out
// 70–95    "EVIDENCE" eyebrow fades in
// 95–160   Four failure rows fade in one by one
// 80–155   Background darkens warm-white → near-black
// 160–180  Hold — the indictment lands
// 180–280  Strike each failure deliberately, ~25 frames apart
// 280–310  Hold — all four checked
// 310–340  Philosophy line "Quality is a gate. Not a hope." fades in below
// 340–360  Final hold before fade to Identity
// ───────────────────────────────────────────────────────────────────────────

const EYEBROW_START = 70;
const ROW_START = 95;
const ROW_STAGGER = 16;
const ROW_FADE = 14;
const BG_DARKEN_START = 80;
const BG_DARKEN_END = 155;

const STRIKE_BASE = 180;
const STRIKE_PER_ROW = 25;
const STRIKE_DRAW = 14;
const PHILO_START = 310;

const BG_WARM: [number, number, number] = [247, 247, 245];
const BG_DARK: [number, number, number] = [14, 10, 10];

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const chars = Math.min(HEADLINE.length, Math.floor(frame / CHAR_FRAMES));
  const cursorVisible = Math.floor(frame / CURSOR_BLINK) % 2 === 0;
  const typingDone = chars >= HEADLINE.length;

  // Background warm → dark
  const lift = interpolate(frame, [BG_DARKEN_START, BG_DARKEN_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const r = Math.round(BG_WARM[0] + (BG_DARK[0] - BG_WARM[0]) * lift);
  const g = Math.round(BG_WARM[1] + (BG_DARK[1] - BG_WARM[1]) * lift);
  const b = Math.round(BG_WARM[2] + (BG_DARK[2] - BG_WARM[2]) * lift);
  const bg = `rgb(${r},${g},${b})`;

  // Headline color tracks bg
  const textR = Math.round(9 + (245 - 9) * lift);
  const textG = Math.round(9 + (245 - 9) * lift);
  const textB = Math.round(11 + (243 - 11) * lift);
  const textColor = `rgb(${textR},${textG},${textB})`;

  // Red ambient pulses once dark
  const breathe = (Math.sin((frame - BG_DARKEN_END) * 0.06) + 1) / 2;
  const redOpacity = lift * (0.55 + 0.25 * breathe);

  const eyebrowOpacity = interpolate(frame, [EYEBROW_START, EYEBROW_START + 16], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Philosophy payoff
  const philoOpacity = interpolate(frame, [PHILO_START, PHILO_START + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const philoY = interpolate(frame, [PHILO_START, PHILO_START + 22], [10, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'flex-start',
        fontFamily: inter,
        padding: '120px 120px 60px 120px',
      }}
    >
      {/* Red ambient — only visible once bg darkens */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background:
            'radial-gradient(ellipse 70% 55% at 50% 55%, rgba(239,68,68,0.10) 0%, transparent 70%)',
          opacity: redOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Question */}
      <div
        style={{
          fontSize: 56,
          fontWeight: 800,
          color: textColor,
          textAlign: 'center',
          lineHeight: 1.12,
          letterSpacing: '-0.035em',
          maxWidth: 880,
          position: 'relative',
        }}
      >
        {HEADLINE.slice(0, chars)}
        <span
          style={{
            opacity: typingDone ? 0 : cursorVisible ? 1 : 0,
            color: COLORS.green,
            marginLeft: 3,
            fontWeight: 300,
          }}
        >
          |
        </span>
      </div>

      {/* "Evidence" eyebrow */}
      <div
        style={{
          marginTop: 44,
          fontSize: 12,
          fontWeight: 700,
          color: 'rgba(239,68,68,0.85)',
          letterSpacing: '0.24em',
          textTransform: 'uppercase',
          opacity: eyebrowOpacity,
          whiteSpace: 'nowrap',
          position: 'relative',
        }}
      >
        Evidence
      </div>

      {/* Failure rows with strike-throughs */}
      <div
        style={{
          marginTop: 22,
          display: 'flex',
          flexDirection: 'column',
          gap: 14,
          alignItems: 'center',
          position: 'relative',
        }}
      >
        {FAILURES.map((text, i) => {
          // Fade in
          const fadeStart = ROW_START + i * ROW_STAGGER;
          const opacity = interpolate(frame, [fadeStart, fadeStart + ROW_FADE], [0, 1], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const y = interpolate(frame, [fadeStart, fadeStart + ROW_FADE], [10, 0], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });

          // Strike beat
          const strikeStart = STRIKE_BASE + i * STRIKE_PER_ROW;
          const strikeEnd = strikeStart + STRIKE_DRAW;
          const strikeWidth = interpolate(frame, [strikeStart, strikeEnd], [0, 100], {
            extrapolateLeft: 'clamp',
            extrapolateRight: 'clamp',
          });
          const struck = frame >= strikeEnd;
          const desat = interpolate(
            frame,
            [strikeStart + STRIKE_DRAW * 0.4, strikeEnd + 4],
            [0, 1],
            { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
          );
          const cr = Math.round(239 + (130 - 239) * desat);
          const cg = Math.round(68 + (130 - 68) * desat);
          const cb = Math.round(68 + (130 - 68) * desat);
          const wordColor = `rgba(${cr},${cg},${cb},0.95)`;

          // Status icon: red dot fades out, green check pops in
          const dotOpacity = (1 - desat) * (0.7 + 0.3 * ((Math.sin((frame - fadeStart - 30) * 0.08) + 1) / 2));
          const checkScale = struck
            ? spring({
                frame: frame - strikeEnd,
                fps,
                config: { damping: 12, stiffness: 220 },
              })
            : 0;

          return (
            <div
              // eslint-disable-next-line react/no-array-index-key
              key={i}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                opacity,
                transform: `translateY(${y}px)`,
              }}
            >
              <div style={{ position: 'relative', width: 18, height: 18 }}>
                <div
                  style={{
                    position: 'absolute',
                    top: 5,
                    left: 5,
                    width: 8,
                    height: 8,
                    borderRadius: '50%',
                    background: '#ef4444',
                    opacity: dotOpacity,
                    boxShadow: `0 0 8px rgba(239,68,68,${dotOpacity * 0.7})`,
                  }}
                />
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    borderRadius: '50%',
                    background: COLORS.green,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    transform: `scale(${checkScale})`,
                    opacity: checkScale,
                    boxShadow: `0 0 12px ${COLORS.green}80`,
                  }}
                >
                  <svg width="10" height="10" viewBox="0 0 12 12" fill="none">
                    <path
                      d="M2.5 6.2L4.8 8.5L9.5 3.5"
                      stroke="white"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </div>
              </div>

              <div
                style={{
                  position: 'relative',
                  fontSize: 26,
                  fontWeight: 500,
                  color: wordColor,
                  fontFamily: COLORS.monoFont,
                  letterSpacing: '-0.005em',
                }}
              >
                {text}
                <div
                  style={{
                    position: 'absolute',
                    top: '50%',
                    left: 0,
                    height: 2.5,
                    width: `${strikeWidth}%`,
                    background: COLORS.green,
                    borderRadius: 2,
                    transform: 'translateY(-1px)',
                    boxShadow: `0 0 8px ${COLORS.green}90`,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      {/* Philosophy payoff — lands once all four are struck */}
      <div
        style={{
          marginTop: 40,
          fontSize: 24,
          fontWeight: 600,
          color: COLORS.green,
          letterSpacing: '-0.012em',
          opacity: philoOpacity,
          transform: `translateY(${philoY}px)`,
          textShadow: `0 0 24px rgba(5,150,105,0.45)`,
          position: 'relative',
        }}
      >
        Quality is a gate. Not a hope.
      </div>
    </AbsoluteFill>
  );
};
