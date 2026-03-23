import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Run header
  const headerOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // CERTIFIED stamp — bouncy spring
  const stampProgress = spring({
    frame: frame - 35,
    fps,
    config: { damping: 8 },
  });
  const stampOpacity = interpolate(frame, [35, 50], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Details
  const detailsOpacity = interpolate(frame, [90, 110], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const detailsY = interpolate(frame, [90, 110], [15, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Trust badge
  const badgeOpacity = interpolate(frame, [135, 155], [0, 1], {
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
      {/* Run header */}
      <div
        style={{
          opacity: headerOpacity,
          fontSize: 14,
          color: COLORS.textMuted,
          letterSpacing: '0.04em',
          marginBottom: 48,
          fontFamily: COLORS.monoFont,
        }}
      >
        {'Run '}
        <span style={{ color: COLORS.textSecondary }}>#42</span>
        {' · '}
        <span style={{ color: COLORS.textSecondary }}>rag-pipeline-audit</span>
      </div>

      {/* CERTIFIED stamp */}
      <div
        style={{
          opacity: stampOpacity,
          transform: `scale(${stampProgress}) rotate(-2deg)`,
          position: 'relative',
        }}
      >
        <div
          style={{
            fontSize: 96,
            fontWeight: 900,
            color: COLORS.green,
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '16px 48px',
            border: `6px solid ${COLORS.green}`,
            borderRadius: 8,
            lineHeight: 1,
            boxShadow: `0 0 60px ${COLORS.green}35, inset 0 0 60px ${COLORS.green}08`,
          }}
        >
          CERTIFIED
        </div>
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(ellipse at center, ${COLORS.green}18 0%, transparent 70%)`,
            borderRadius: 8,
            zIndex: -1,
          }}
        />
      </div>

      {/* Details */}
      <div
        style={{
          opacity: detailsOpacity,
          transform: `translateY(${detailsY}px)`,
          marginTop: 52,
          display: 'flex',
          gap: 32,
          fontSize: 15,
          color: COLORS.textSecondary,
          alignItems: 'center',
        }}
      >
        <span>
          <span style={{ color: COLORS.green, fontWeight: 600 }}>4 / 4</span>
          {' components passed'}
        </span>
        <span style={{ color: COLORS.border }}>|</span>
        <span style={{ fontFamily: COLORS.monoFont, fontSize: 13 }}>
          🔐 ECDSA-SHA256 Signed
        </span>
      </div>

      {/* Trust badge */}
      <div
        style={{
          opacity: badgeOpacity,
          marginTop: 40,
          padding: '12px 24px',
          borderRadius: 32,
          border: `1px solid ${COLORS.border}`,
          background: COLORS.surface,
          fontFamily: COLORS.monoFont,
          fontSize: 14,
          color: COLORS.textSecondary,
          display: 'flex',
          alignItems: 'center',
          gap: 10,
        }}
      >
        <div
          style={{
            width: 8,
            height: 8,
            borderRadius: '50%',
            background: COLORS.green,
            boxShadow: `0 0 8px ${COLORS.green}`,
          }}
        />
        {'certops.com/verify/'}
        <span style={{ color: COLORS.green }}>c7f3a9b142</span>
      </div>
    </AbsoluteFill>
  );
};
