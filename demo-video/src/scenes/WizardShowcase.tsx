import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

const STEPS = [
  { src: 'screenshots/wizard-manifest.png', label: 'Paste your manifest' },
  { src: 'screenshots/wizard-hosts.png', label: 'Set target hosts' },
  { src: 'screenshots/wizard-launch.png', label: 'Review & launch' },
];

const STEP_FRAMES = 65;
const SLIDE_FRAMES = 12;
const CURSOR_LEAD = 18;
const T0 = STEP_FRAMES - SLIDE_FRAMES;       // 53 — step 0→1 slide starts
const T1 = STEP_FRAMES * 2 - SLIDE_FRAMES;   // 118 — step 1→2 slide starts

// ─── Layout math (split: left caption / right carousel) ──────────────────────
// Scene inner: 1152 × 640 (after 40/64 padding on a 1280×720 stage).
// Row: leftPane(360) + gap(56) + carousel(720) = 1136. Centered → 8px each side.
// Carousel image: 3024×1716 → aspect 1.762 → height 720/1.762 ≈ 408.
// Carousel top in scene: 40 + (640-408)/2 = 156.
// Carousel left in scene: 64 + 8 + 360 + 56 = 488.
// "Next >" button at ~95% x, ~97.4% y of image:
//   x = 488 + 720*0.95 = 1172
//   y = 156 + 408*0.974 = 553
// ─────────────────────────────────────────────────────────────────────────────
const LEFT_W = 360;
const GAP = 56;
const CAROUSEL_W = 720;
const CAROUSEL_H = 408;
const BTN_X = 1172;
const BTN_Y = 553;

const Cursor: React.FC<{ clicking: boolean }> = ({ clicking }) => (
  <div style={{ position: 'relative', width: 0, height: 0 }}>
    <div
      style={{
        position: 'absolute',
        width: clicking ? 14 : 22,
        height: clicking ? 14 : 22,
        borderRadius: '50%',
        border: `1.5px solid ${clicking ? COLORS.green : 'rgba(9,9,11,0.65)'}`,
        top: clicking ? -7 : -11,
        left: clicking ? -7 : -11,
        background: clicking ? 'rgba(5,150,105,0.1)' : 'rgba(255,255,255,0.25)',
        boxShadow: clicking
          ? `0 0 10px rgba(5,150,105,0.45)`
          : `0 1px 4px rgba(0,0,0,0.14)`,
      }}
    />
    <div
      style={{
        position: 'absolute',
        width: clicking ? 5 : 4,
        height: clicking ? 5 : 4,
        borderRadius: '50%',
        background: clicking ? COLORS.green : 'rgba(9,9,11,0.85)',
        top: clicking ? -2.5 : -2,
        left: clicking ? -2.5 : -2,
      }}
    />
  </div>
);

export const WizardShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  const stepIndex = Math.min(STEPS.length - 1, Math.floor(frame / STEP_FRAMES));
  const frameInStep = frame % STEP_FRAMES;

  const isSliding = stepIndex < STEPS.length - 1 && frameInStep >= STEP_FRAMES - SLIDE_FRAMES;
  const slideProgress = isSliding
    ? (frameInStep - (STEP_FRAMES - SLIDE_FRAMES)) / SLIDE_FRAMES
    : 0;

  const getTranslateX = (i: number): number => {
    if (i < stepIndex) return -110;
    if (i === stepIndex) return isSliding ? -110 * slideProgress : 0;
    if (i === stepIndex + 1) return isSliding ? 110 - 110 * slideProgress : 110;
    return 110;
  };

  const containerY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const containerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const captionOpacity = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [4, 28], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const slideFlash = isSliding ? 1 - slideProgress : 0;
  const breathe = (Math.sin(frame * 0.07) + 1) / 2;
  const glowOpacity = containerOpacity * (slideFlash * 0.55 + 0.15 + 0.15 * breathe);

  let cursorLife = -1;
  if (frame >= T0 - CURSOR_LEAD && frame < T0 + SLIDE_FRAMES) {
    cursorLife = frame - (T0 - CURSOR_LEAD);
  } else if (frame >= T1 - CURSOR_LEAD && frame < T1 + SLIDE_FRAMES) {
    cursorLife = frame - (T1 - CURSOR_LEAD);
  }
  const showCursor = cursorLife >= 0 && stepIndex < STEPS.length - 1;

  const cursorDX = showCursor
    ? interpolate(cursorLife, [0, 10], [48, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const cursorOpacity = showCursor
    ? interpolate(cursorLife, [0, 5, CURSOR_LEAD + 3, CURSOR_LEAD + SLIDE_FRAMES], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  const clicking = showCursor && cursorLife >= CURSOR_LEAD - 1 && cursorLife <= CURSOR_LEAD + 5;

  const rippleLife = showCursor ? cursorLife - CURSOR_LEAD : -1;
  const rippleSize =
    rippleLife >= 0
      ? interpolate(rippleLife, [0, 15], [4, 48], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;
  const rippleOpacity =
    rippleLife >= 0
      ? interpolate(rippleLife, [0, 3, 15], [0, 0.65, 0], {
          extrapolateLeft: 'clamp',
          extrapolateRight: 'clamp',
        })
      : 0;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        gap: GAP,
        fontFamily: inter,
        padding: '40px 64px',
      }}
    >
      {/* ── Left caption pane ─────────────────────────────────────────────── */}
      <div
        style={{
          width: LEFT_W,
          display: 'flex',
          flexDirection: 'column',
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <SectionLabel label="Onboarding" />

        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
          }}
        >
          From zero to certified in 3 clicks.
        </div>

        <div
          style={{
            marginTop: 18,
            fontSize: 16,
            fontWeight: 500,
            color: COLORS.textSecondary,
            lineHeight: 1.5,
          }}
        >
          Paste a manifest. Pick targets. Hit launch. CertOps takes it from there —
          adversarial generation, grading, signed verdict.
        </div>

        {/* Vertical step ticker */}
        <div
          style={{
            marginTop: 28,
            display: 'flex',
            flexDirection: 'column',
            gap: 12,
          }}
        >
          {STEPS.map((step, i) => {
            const active = i === stepIndex;
            return (
              <div
                key={step.src}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: active ? 1 : 0.45,
                  transition: 'opacity 0.2s',
                }}
              >
                <div
                  style={{
                    width: 22,
                    height: 22,
                    borderRadius: '50%',
                    background: active ? COLORS.green : 'transparent',
                    border: `1.5px solid ${active ? COLORS.green : COLORS.border}`,
                    color: active ? '#ffffff' : COLORS.textMuted,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  {i + 1}
                </div>
                <span
                  style={{
                    fontSize: 14,
                    fontWeight: active ? 600 : 500,
                    color: active ? COLORS.textPrimary : COLORS.textSecondary,
                  }}
                >
                  {step.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* ── Right carousel pane ───────────────────────────────────────────── */}
      <div
        style={{
          width: CAROUSEL_W,
          height: CAROUSEL_H,
          position: 'relative',
          overflow: 'hidden',
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
          borderRadius: 12,
        }}
      >
        {STEPS.map((step, i) => (
          <div
            key={step.src}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              height: '100%',
              transform: `translateX(${getTranslateX(i)}%)`,
              overflow: 'hidden',
            }}
          >
            <BrowserFrame
              src={step.src}
              glowColor={COLORS.green}
              glowOpacity={i === stepIndex ? glowOpacity : 0}
            />
          </div>
        ))}
      </div>

      {/* ── Cursor overlay over the "Next >" button in the carousel ─────── */}
      {showCursor && (
        <div
          style={{
            position: 'absolute',
            left: BTN_X + cursorDX,
            top: BTN_Y,
            opacity: cursorOpacity,
            pointerEvents: 'none',
            zIndex: 10,
          }}
        >
          <div
            style={{
              position: 'absolute',
              left: -rippleSize / 2,
              top: -rippleSize / 2,
              width: rippleSize,
              height: rippleSize,
              borderRadius: '50%',
              border: `1.5px solid ${COLORS.green}`,
              opacity: rippleOpacity,
              pointerEvents: 'none',
            }}
          />
          <Cursor clicking={clicking} />
        </div>
      )}
    </AbsoluteFill>
  );
};
