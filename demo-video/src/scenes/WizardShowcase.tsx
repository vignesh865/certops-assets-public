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

// ─── Layout math ─────────────────────────────────────────────────────────────
// Images: 3024×1716 px (2× retina). Aspect = 3024/1716 = 1.762
// Carousel width set to 960px so image height = 960/1.762 = 545px
// Total content: SectionLabel(48) + Carousel(545) + Dots(40) = 633px
// Scene inner height: 720 - 80 = 640px → 7px breathing room, no overflow ✓
// ─────────────────────────────────────────────────────────────────────────────
const CAROUSEL_W = 960;
const CAROUSEL_H = 545; // 960 / 1.762

// Carousel is centered in the scene:
// scene left-pad (64) + centering ((1152-960)/2 = 96) = 160px from scene left
// Content start y: 40 + (640-633)/2 = 43.5px
// Carousel start y: 43.5 + 48 (label) = 91.5px
// "Next >" button position in image: ~95% x, ~97.4% y
//   x = 160 + 960*0.95 = 160 + 912 = 1072px (scene)
//   y = 91.5 + 545*0.974 = 91.5 + 531 = 622px (scene)
const BTN_X = 1068;
const BTN_Y = 618;

/** Modern ring + dot cursor — replaces old-school arrow */
const Cursor: React.FC<{ clicking: boolean }> = ({ clicking }) => (
  // Container is 0×0; children are absolutely centered on the cursor hot-point
  <div style={{ position: 'relative', width: 0, height: 0 }}>
    {/* Outer ring — contracts and turns green on click */}
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
    {/* Inner dot */}
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

  const slideFlash = isSliding ? 1 - slideProgress : 0;
  const breathe = (Math.sin(frame * 0.07) + 1) / 2;
  const glowOpacity = containerOpacity * (slideFlash * 0.55 + 0.15 + 0.15 * breathe);

  // ── Cursor click lifecycle ──────────────────────────────────────────────────
  let cursorLife = -1;
  if (frame >= T0 - CURSOR_LEAD && frame < T0 + SLIDE_FRAMES) {
    cursorLife = frame - (T0 - CURSOR_LEAD);
  } else if (frame >= T1 - CURSOR_LEAD && frame < T1 + SLIDE_FRAMES) {
    cursorLife = frame - (T1 - CURSOR_LEAD);
  }
  const showCursor = cursorLife >= 0 && stepIndex < STEPS.length - 1;

  // Slide in from the right
  const cursorDX = showCursor
    ? interpolate(cursorLife, [0, 10], [48, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Fade in → hold → fade out as slide completes
  const cursorOpacity = showCursor
    ? interpolate(cursorLife, [0, 5, CURSOR_LEAD + 3, CURSOR_LEAD + SLIDE_FRAMES], [0, 1, 1, 0], {
        extrapolateLeft: 'clamp',
        extrapolateRight: 'clamp',
      })
    : 0;

  // Click: scale-down at the slide moment, spring back
  const clicking = showCursor && cursorLife >= CURSOR_LEAD - 1 && cursorLife <= CURSOR_LEAD + 5;

  // Ripple
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
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '40px 64px',
      }}
    >
      <SectionLabel label="Launch a certification in 3 steps" />

      {/* Carousel — narrowed to 960px so full image (including Next button) fits in scene */}
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

      {/* Step dots + label */}
      <div
        style={{
          marginTop: 20,
          display: 'flex',
          alignItems: 'center',
          gap: 12,
          opacity: containerOpacity,
        }}
      >
        {STEPS.map((step, i) => (
          <div key={step.src} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <div
              style={{
                width: i === stepIndex ? 24 : 8,
                height: 8,
                borderRadius: 4,
                background: i === stepIndex ? COLORS.green : COLORS.border,
              }}
            />
            {i === stepIndex && (
              <span style={{ fontSize: 13, color: COLORS.textSecondary, fontWeight: 500 }}>
                {step.label}
              </span>
            )}
          </div>
        ))}
      </div>

      {/* ── Cursor overlay — absolutely positioned over the "Next >" button ── */}
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
          {/* Click ripple */}
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
