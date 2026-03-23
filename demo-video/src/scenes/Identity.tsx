import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

const PILLS = ['CI/CD Blocking Gate', 'Config as Code', 'Cryptographic Certificates'];

export const Identity: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(frame, [0, 10], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [25, 42], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const taglineY = interpolate(frame, [25, 45], [20, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const dividerWidth = interpolate(frame, [50, 75], [0, 320], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const pillProgress = (i: number) =>
    spring({
      frame: frame - 65 - i * 10,
      fps,
      config: { damping: 20, stiffness: 200 },
    });

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
      }}
    >
      {/* Logo mark + name */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: 20,
          opacity: logoOpacity,
          transform: `scale(${logoProgress})`,
        }}
      >
        <div
          style={{
            width: 72,
            height: 72,
            borderRadius: 18,
            background: `linear-gradient(135deg, ${COLORS.green}, #059669)`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            boxShadow: `0 0 40px ${COLORS.green}40`,
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
            />
          </svg>
        </div>

        <div
          style={{
            fontSize: 72,
            fontWeight: 700,
            letterSpacing: '-0.03em',
            lineHeight: 1,
          }}
        >
          <span style={{ color: COLORS.textPrimary }}>Cert</span>
          <span style={{ color: COLORS.green }}>Ops</span>
        </div>
      </div>

      {/* Tagline */}
      <div
        style={{
          marginTop: 20,
          fontSize: 28,
          color: COLORS.textSecondary,
          opacity: taglineOpacity,
          transform: `translateY(${taglineY}px)`,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        The Universal AI Verifier
      </div>

      {/* Divider */}
      <div
        style={{
          marginTop: 40,
          height: 1,
          background: COLORS.border,
          width: dividerWidth,
        }}
      />

      {/* Pills */}
      <div style={{ marginTop: 32, display: 'flex', gap: 12 }}>
        {PILLS.map((label, i) => (
          <div
            key={label}
            style={{
              padding: '10px 20px',
              borderRadius: 24,
              border: `1px solid ${COLORS.border}`,
              background: COLORS.surface,
              color: COLORS.textSecondary,
              fontSize: 15,
              fontWeight: 500,
              opacity: pillProgress(i),
              transform: `scale(${pillProgress(i)})`,
            }}
          >
            {label}
          </div>
        ))}
      </div>
    </AbsoluteFill>
  );
};
