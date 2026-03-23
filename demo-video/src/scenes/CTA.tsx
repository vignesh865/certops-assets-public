import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

export const CTA: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const logoProgress = spring({ frame, fps, config: { damping: 200 } });
  const logoOpacity = interpolate(frame, [0, 15], [0, 1], { extrapolateRight: 'clamp' });

  const taglineOpacity = interpolate(frame, [25, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const ctaProgress = spring({
    frame: frame - 55,
    fps,
    config: { damping: 20, stiffness: 200 },
  });
  const ctaOpacity = interpolate(frame, [55, 75], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
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
      {/* Domain */}
      <div
        style={{
          opacity: logoOpacity,
          transform: `scale(${logoProgress})`,
          fontSize: 96,
          fontWeight: 700,
          color: COLORS.textPrimary,
          letterSpacing: '-0.04em',
          lineHeight: 1,
        }}
      >
        {'cert'}
        <span style={{ color: COLORS.green }}>{'ops'}</span>
        <span style={{ color: COLORS.textMuted }}>{'.com'}</span>
      </div>

      {/* Tagline */}
      <div
        style={{
          opacity: taglineOpacity,
          marginTop: 24,
          fontSize: 24,
          color: COLORS.textSecondary,
          fontWeight: 400,
          letterSpacing: '-0.01em',
        }}
      >
        The Universal AI Verifier
      </div>

      {/* CTA pill */}
      <div
        style={{
          opacity: ctaOpacity,
          transform: `scale(${ctaProgress})`,
          marginTop: 52,
          padding: '16px 40px',
          borderRadius: 48,
          background: COLORS.green,
          color: 'white',
          fontSize: 18,
          fontWeight: 600,
          letterSpacing: '-0.01em',
          boxShadow: `0 8px 32px ${COLORS.green}50`,
        }}
      >
        Start verifying your AI today →
      </div>

      {/* Sub-tagline */}
      <div
        style={{
          opacity: ctaOpacity * 0.6,
          marginTop: 20,
          fontSize: 14,
          color: COLORS.textMuted,
        }}
      >
        No agent rebuilds. No SDK lock-in. Just verify.
      </div>
    </AbsoluteFill>
  );
};
