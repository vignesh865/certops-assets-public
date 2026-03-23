import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';

const STEPS = [
  { src: 'screenshots/wizard-manifest.png', label: 'Paste your manifest' },
  { src: 'screenshots/wizard-hosts.png', label: 'Set target hosts' },
  { src: 'screenshots/wizard-launch.png', label: 'Review & launch' },
];

const STEP_FRAMES = 65; // frames each step is "active"
const SLIDE_FRAMES = 12; // duration of the slide transition

export const WizardShowcase: React.FC = () => {
  const frame = useCurrentFrame();

  // Section label
  const labelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  const stepIndex = Math.min(STEPS.length - 1, Math.floor(frame / STEP_FRAMES));
  const frameInStep = frame % STEP_FRAMES;

  // Transition window: last SLIDE_FRAMES of each step (except the final step)
  const isSliding = stepIndex < STEPS.length - 1 && frameInStep >= STEP_FRAMES - SLIDE_FRAMES;
  const slideProgress = isSliding
    ? (frameInStep - (STEP_FRAMES - SLIDE_FRAMES)) / SLIDE_FRAMES // 0→1
    : 0;

  /** Compute translateX% for step i */
  const getTranslateX = (i: number): number => {
    if (i < stepIndex) {
      return -110; // already exited left
    }
    if (i === stepIndex) {
      return isSliding ? -110 * slideProgress : 0; // exiting left
    }
    if (i === stepIndex + 1) {
      return isSliding ? 110 - 110 * slideProgress : 110; // entering from right
    }
    return 110; // waiting on right
  };

  // Initial container entrance
  const containerY = interpolate(frame, [0, 25], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const containerOpacity = interpolate(frame, [0, 25], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow: flashes on each slide, then breathes
  const slideFlash = isSliding ? 1 - slideProgress : 0;
  const breathe = (Math.sin(frame * 0.07) + 1) / 2;
  const glowOpacity = containerOpacity * (slideFlash * 0.55 + 0.15 + 0.15 * breathe);

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
      {/* Section label */}
      <div
        style={{
          opacity: labelOpacity,
          fontSize: 13,
          color: COLORS.green,
          fontWeight: 600,
          letterSpacing: '0.12em',
          textTransform: 'uppercase',
          marginBottom: 24,
          alignSelf: 'flex-start',
          display: 'flex',
          alignItems: 'center',
          gap: 8,
        }}
      >
        <div style={{ width: 20, height: 1.5, background: COLORS.green }} />
        Launch a certification in 3 steps
      </div>

      {/* Carousel */}
      <div
        style={{
          width: '100%',
          position: 'relative',
          overflow: 'hidden',
          opacity: containerOpacity,
          transform: `translateY(${containerY}px)`,
        }}
      >
        {/* Height reference — invisible, gives the container its natural height */}
        <div style={{ opacity: 0, pointerEvents: 'none' }}>
          <BrowserFrame src={STEPS[0].src} />
        </div>

        {/* Slides */}
        {STEPS.map((step, i) => (
          <div
            key={step.src}
            style={{
              position: 'absolute',
              left: 0,
              top: 0,
              width: '100%',
              transform: `translateX(${getTranslateX(i)}%)`,
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
    </AbsoluteFill>
  );
};
