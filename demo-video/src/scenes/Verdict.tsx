import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

const LEFT_W = 360;
const GAP = 56;
const SHOT_W = 720;

export const Verdict: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const captionOpacity = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [4, 28], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // CERTIFIED stamp — bouncy spring
  const stampProgress = spring({ frame: frame - 30, fps, config: { damping: 8 } });
  const stampOpacity = interpolate(frame, [30, 45], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Cert screenshot — fades in from right
  const certOpacity = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const certX = interpolate(frame, [60, 90], [40, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const certImgScale = interpolate(frame, [60, 240], [1.18, 1.0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const certImgY = interpolate(frame, [60, 240], [-8, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const certFlash = interpolate(frame, [60, 90], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = (Math.sin((frame - 90) * 0.06) + 1) / 2;
  const stampOvershoot = Math.max(0, stampProgress - 1);
  const certGlow = certOpacity * (certFlash * 0.5 + 0.2 + 0.2 * breathe + stampOvershoot * 0.4);

  const detailsOpacity = interpolate(frame, [110, 138], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const detailsY = interpolate(frame, [110, 138], [12, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const badgeOpacity = interpolate(frame, [150, 178], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

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
      {/* Left caption + stamp */}
      <div
        style={{
          width: LEFT_W,
          display: 'flex',
          flexDirection: 'column',
          opacity: captionOpacity,
          transform: `translateY(${captionY}px)`,
        }}
      >
        <SectionLabel label="Verdict" />
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
          }}
        >
          Cryptographic proof of conformity.
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
          Every passing run gets a signed certificate — verifiable, tamper-proof,
          link-shareable.
        </div>

        {/* CERTIFIED stamp */}
        <div
          style={{
            marginTop: 28,
            opacity: stampOpacity,
            transform: `scale(${stampProgress}) rotate(-2deg)`,
            transformOrigin: 'left center',
            alignSelf: 'flex-start',
          }}
        >
          <div
            style={{
              fontSize: 40,
              fontWeight: 900,
              color: COLORS.green,
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
              padding: '10px 22px',
              border: `4px solid ${COLORS.green}`,
              borderRadius: 6,
              lineHeight: 1,
              boxShadow: `0 0 36px ${COLORS.green}30, inset 0 0 28px ${COLORS.green}06`,
              display: 'inline-block',
            }}
          >
            CERTIFIED
          </div>
        </div>

        {/* Details row */}
        <div
          style={{
            opacity: detailsOpacity,
            transform: `translateY(${detailsY}px)`,
            marginTop: 22,
            display: 'flex',
            flexDirection: 'column',
            gap: 8,
            fontSize: 13,
            color: COLORS.textSecondary,
          }}
        >
          <span>
            <span style={{ color: COLORS.green, fontWeight: 600 }}>4 / 4</span>
            {' components passed'}
          </span>
          <span style={{ fontFamily: COLORS.monoFont, fontSize: 12 }}>
            🔐 ECDSA-SHA256 Signed
          </span>
        </div>

        {/* Trust badge */}
        <div
          style={{
            opacity: badgeOpacity,
            marginTop: 16,
            padding: '8px 16px',
            borderRadius: 28,
            border: `1px solid ${COLORS.border}`,
            background: COLORS.surface,
            fontFamily: COLORS.monoFont,
            fontSize: 12,
            color: COLORS.textSecondary,
            display: 'inline-flex',
            alignItems: 'center',
            gap: 8,
            alignSelf: 'flex-start',
          }}
        >
          <div
            style={{
              width: 6,
              height: 6,
              borderRadius: '50%',
              background: COLORS.green,
              boxShadow: `0 0 8px ${COLORS.green}`,
            }}
          />
          {'certops.com/verify/'}
          <span style={{ color: COLORS.green }}>c7f3a9b142</span>
        </div>
      </div>

      {/* Right: Certificate screenshot */}
      <div
        style={{
          width: SHOT_W,
          opacity: certOpacity,
          transform: `translateX(${certX}px)`,
        }}
      >
        <BrowserFrame
          src="screenshots/cert-pass.png"
          imageTransform={`scale(${certImgScale}) translateY(${certImgY}%)`}
          imageTransformOrigin="center top"
          glowColor={COLORS.green}
          glowOpacity={certGlow}
        />
      </div>
    </AbsoluteFill>
  );
};
