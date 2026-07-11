import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

const SLIDES = [
  { src: 'screenshots/datalab-datasets.png', label: 'Your test datasets' },
  { src: 'screenshots/datalab-new-job.png',  label: 'Generate adversarial variants' },
];

const STEP_FRAMES = 98;
const SLIDE_FRAMES = 12;

const LEFT_W = 360;
const GAP = 56;
const CAROUSEL_W = 720;
const CAROUSEL_H = 408;

export const DataLab: React.FC = () => {
  const frame = useCurrentFrame();

  const stepIndex = Math.min(SLIDES.length - 1, Math.floor(frame / STEP_FRAMES));
  const frameInStep = frame % STEP_FRAMES;
  const isSliding = stepIndex < SLIDES.length - 1 && frameInStep >= STEP_FRAMES - SLIDE_FRAMES;
  const slideProgress = isSliding ? (frameInStep - (STEP_FRAMES - SLIDE_FRAMES)) / SLIDE_FRAMES : 0;

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
      {/* Left caption */}
      <div
        style={{
          width: LEFT_W,
          display: 'flex',
          flexDirection: 'column',
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <SectionLabel label="DataLab" />
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
          }}
        >
          Generate adversarial test data.
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
          Bring your golden set. CertOps mutates it into thousands of hostile
          variants — typos, jailbreaks, paraphrases, edge cases — all
          domain-grounded.
        </div>

        {/* Hero number */}
        <div style={{ marginTop: 28, display: 'flex', alignItems: 'baseline', gap: 10 }}>
          <span
            style={{
              fontSize: 36,
              fontWeight: 800,
              color: COLORS.green,
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            200 → 2,400
          </span>
          <span style={{ fontSize: 13, color: COLORS.textMuted, fontWeight: 500 }}>
            rows
          </span>
        </div>
        <div style={{ marginTop: 6, fontSize: 13, color: COLORS.textMuted }}>
          12× coverage from one click.
        </div>

        {/* Slide ticker */}
        <div
          style={{
            marginTop: 24,
            display: 'flex',
            flexDirection: 'column',
            gap: 10,
          }}
        >
          {SLIDES.map((slide, i) => {
            const active = i === stepIndex;
            return (
              <div
                key={slide.src}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: 12,
                  opacity: active ? 1 : 0.45,
                }}
              >
                <div
                  style={{
                    width: i === stepIndex ? 22 : 8,
                    height: 8,
                    borderRadius: 4,
                    background: active ? COLORS.green : COLORS.border,
                  }}
                />
                <span
                  style={{
                    fontSize: 13,
                    fontWeight: active ? 600 : 500,
                    color: active ? COLORS.textPrimary : COLORS.textSecondary,
                  }}
                >
                  {slide.label}
                </span>
              </div>
            );
          })}
        </div>
      </div>

      {/* Right carousel */}
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
        {SLIDES.map((slide, i) => (
          <div
            key={slide.src}
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
              src={slide.src}
              glowColor={COLORS.green}
              glowOpacity={i === stepIndex ? glowOpacity : 0}
            />
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
