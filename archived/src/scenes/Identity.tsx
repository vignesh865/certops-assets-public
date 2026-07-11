import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

// Solutions map 1:1 to the FAILURES struck on the Problem scene.
const SOLUTIONS = [
  { title: 'Metrics as code', body: 'Define correctness in YAML, gate on it.' },
  { title: 'Adversarial Data Engine', body: 'Generate hostile inputs by design.' },
  { title: 'Pairwise regression', body: 'Catch silent drift between versions.' },
  { title: 'Signed Certificate of Conformity', body: 'Cryptographic, verifiable.' },
];

// ── Beat plan (300 frames = 10s) ───────────────────────────────────────────
// 0–25     Background lifts dark → warm. The struck-evidence state from Problem
//          dissolves through the cross-fade; this scene starts in the lift.
// 5–35     Flash burst at center
// 20–55    Shield + wordmark + tagline spring in CENTER
// 55–115   Hold center, undivided — the thunder beat
// 115–170  Brand slides smoothly to the LEFT third
// 140–170  Vertical green divider draws between the halves
// 150–185  Right-side eyebrow "BUILT TO ANSWER:" fades in
// 160–270  Four solution rows spring in, ~25f apart
// 270–300  Final hold
// ───────────────────────────────────────────────────────────────────────────

const BG_LIFT_START = 0;
const BG_LIFT_END = 25;
const FLASH_START = 5;
const LOGO_START = 20;
// Center-hold trimmed by 30 frames (was 55→115); the reclaimed 30 frames
// land at the tail, holding on the continuous-certification payoff line.
const SLIDE_START = 85;
const SLIDE_END = 140;
const DIVIDER_START = 110;
const DIVIDER_END = 140;
const SOLUTION_FADE_START = 105;
const SOLUTION_FADE_END = 145;
const SOL_EYEBROW_START = 120;
const SOL_BASE = 130;
const SOL_PER = 25;

// Pixel offset that pulls the logo column from its natural side-by-side
// position into the visual center of the scene during the hold beat.
const CENTER_SHIFT = 296;

const BG_DARK: [number, number, number] = [14, 10, 10];
const BG_WARM: [number, number, number] = [247, 247, 245];

export const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Background lift ──
  const lift = interpolate(frame, [BG_LIFT_START, BG_LIFT_END], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const r = Math.round(BG_DARK[0] + (BG_WARM[0] - BG_DARK[0]) * lift);
  const g = Math.round(BG_DARK[1] + (BG_WARM[1] - BG_DARK[1]) * lift);
  const b = Math.round(BG_DARK[2] + (BG_WARM[2] - BG_DARK[2]) * lift);
  const bg = `rgb(${r},${g},${b})`;

  // ── Logo entrance ──
  const logoSpring = spring({
    frame: Math.max(0, frame - LOGO_START),
    fps,
    config: { damping: 200 },
  });
  const logoOpacity = interpolate(frame, [LOGO_START, LOGO_START + 18], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Flash burst as logo lands
  const flashOpacity = interpolate(
    frame,
    [FLASH_START, FLASH_START + 8, FLASH_START + 30],
    [0, 1, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // Checkmark stroke draw inside shield
  const checkLen = 12;
  const checkDashOffset = interpolate(
    frame,
    [LOGO_START + 10, LOGO_START + 30],
    [checkLen, 0],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  // ── Slide left ──
  const slideProgress = spring({
    frame: Math.max(0, frame - SLIDE_START),
    fps,
    durationInFrames: SLIDE_END - SLIDE_START,
    config: { damping: 200 },
  });
  const slideShift = (1 - slideProgress) * CENTER_SHIFT;

  // ── Solution column reveal ──
  const solutionOpacity = interpolate(
    frame,
    [SOLUTION_FADE_START, SOLUTION_FADE_END],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const dividerHeight = interpolate(frame, [DIVIDER_START, DIVIDER_END], [0, 220], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const solEyebrowOpacity = interpolate(
    frame,
    [SOL_EYEBROW_START, SOL_EYEBROW_START + 18],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );
  const solRowProgress = (i: number) =>
    spring({
      frame: Math.max(0, frame - SOL_BASE - i * SOL_PER),
      fps,
      config: { damping: 18, stiffness: 200 },
    });

  // Continuous-certification payoff — lands once all 4 rows have sprung in
  const ccStart = SOL_BASE + SOL_PER * SOLUTIONS.length + 8;
  const ccOpacity = interpolate(frame, [ccStart, ccStart + 22], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const ccY = interpolate(frame, [ccStart, ccStart + 22], [8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  return (
    <AbsoluteFill
      style={{
        background: bg,
        fontFamily: inter,
        overflow: 'hidden',
      }}
    >
      {/* Solution radial glow */}
      <div
        style={{
          position: 'absolute',
          width: 600,
          height: 600,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(5,150,105,0.14) 0%, transparent 70%)`,
          opacity: lift,
          pointerEvents: 'none',
        }}
      />

      {/* Flash burst */}
      <div
        style={{
          position: 'absolute',
          width: 900,
          height: 900,
          borderRadius: '50%',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: `radial-gradient(circle, rgba(5,150,105,0.35) 0%, rgba(5,150,105,0.0) 60%)`,
          opacity: flashOpacity,
          pointerEvents: 'none',
        }}
      />

      {/* Brand + solutions */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 56 }}>
          {/* Brand column */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 16,
              opacity: logoOpacity,
              transform: `translateX(${slideShift}px) scale(${logoSpring})`,
              transformOrigin: 'center',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 20 }}>
              <div
                style={{
                  width: 72,
                  height: 72,
                  borderRadius: 18,
                  background: `linear-gradient(135deg, ${COLORS.green}, #047857)`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: `0 0 40px ${COLORS.green}50, 0 8px 24px rgba(0,0,0,0.12)`,
                }}
              >
                <svg width="38" height="38" viewBox="0 0 24 24" fill="none">
                  <path
                    d="M12 2L3 7v5c0 4.97 3.86 9.63 9 10.93C17.14 21.63 21 16.97 21 12V7L12 2z"
                    stroke="white"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                  <path
                    d="M9 12l2 2 4-4"
                    stroke="white"
                    strokeWidth="2.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeDasharray={checkLen}
                    strokeDashoffset={checkDashOffset}
                  />
                </svg>
              </div>

              <div
                style={{
                  fontSize: 72,
                  fontWeight: 800,
                  letterSpacing: '-0.04em',
                  lineHeight: 1,
                }}
              >
                <span style={{ color: '#09090b' }}>Cert</span>
                <span style={{ color: COLORS.green }}>Ops</span>
              </div>
            </div>

            <div
              style={{
                fontSize: 18,
                color: COLORS.textSecondary,
                fontWeight: 500,
                letterSpacing: '-0.005em',
              }}
            >
              The Universal AI Verifier
            </div>
          </div>

          {/* Divider */}
          <div
            style={{
              width: 1,
              height: dividerHeight,
              background: `linear-gradient(to bottom, transparent 0%, ${COLORS.green} 30%, ${COLORS.green} 70%, transparent 100%)`,
              opacity: solutionOpacity,
            }}
          />

          {/* Solution column */}
          <div
            style={{
              width: 480,
              opacity: solutionOpacity,
              display: 'flex',
              flexDirection: 'column',
            }}
          >
            <div
              style={{
                fontSize: 12,
                fontWeight: 700,
                color: COLORS.green,
                letterSpacing: '0.22em',
                textTransform: 'uppercase',
                marginBottom: 22,
                opacity: solEyebrowOpacity,
              }}
            >
              Built to answer:
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 18 }}>
              {SOLUTIONS.map((sol, i) => {
                const p = solRowProgress(i);
                const rowOpacity = Math.min(1, p);
                const rowY = (1 - p) * 12;
                return (
                  <div
                    key={sol.title}
                    style={{
                      display: 'flex',
                      alignItems: 'flex-start',
                      gap: 14,
                      opacity: rowOpacity,
                      transform: `translateY(${rowY}px)`,
                    }}
                  >
                    <div
                      style={{
                        marginTop: 4,
                        width: 18,
                        height: 18,
                        borderRadius: '50%',
                        background: COLORS.green,
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: `0 0 10px ${COLORS.green}60`,
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
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
                      <div
                        style={{
                          fontSize: 18,
                          fontWeight: 700,
                          color: COLORS.textPrimary,
                          letterSpacing: '-0.012em',
                          lineHeight: 1.2,
                        }}
                      >
                        {sol.title}
                      </div>
                      <div
                        style={{
                          fontSize: 14,
                          fontWeight: 500,
                          color: COLORS.textSecondary,
                          lineHeight: 1.45,
                        }}
                      >
                        {sol.body}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Continuous certification payoff — ties the four solutions
                together as a recurring regime, not four discrete tools. */}
            <div
              style={{
                marginTop: 22,
                fontSize: 14,
                fontWeight: 600,
                fontStyle: 'italic',
                color: COLORS.green,
                letterSpacing: '-0.005em',
                opacity: ccOpacity,
                transform: `translateY(${ccY}px)`,
                textShadow: `0 0 16px rgba(5,150,105,0.35)`,
              }}
            >
              Run on every release. Continuous, by design.
            </div>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
