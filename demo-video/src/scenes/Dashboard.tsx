import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // Section label fade-in
  const labelOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });

  // Screenshot: spring settle on entry, completely still after
  const settleProgress = spring({ frame, fps, config: { damping: 200 } });
  const scale = interpolate(settleProgress, [0, 1], [0.96, 1.0]);
  const screenshotOpacity = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const screenshotY = interpolate(frame, [8, 35], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Glow: flash as screenshot settles, then breathing pulse
  const entryFlash = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = (Math.sin((frame - 55) * 0.065) + 1) / 2;
  const glowOpacity = entryFlash * (0.45 + 0.3 * breathe);

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
        Your Certification Command Center
      </div>

      {/* Browser frame — springs in, holds still */}
      <div
        style={{
          opacity: screenshotOpacity,
          transform: `translateY(${screenshotY}px) scale(${scale})`,
          width: '100%',
          transformOrigin: 'center top',
        }}
      >
        <BrowserFrame
          src="screenshots/dashboard.png"
          glowColor={COLORS.green}
          glowOpacity={glowOpacity}
        />
      </div>
    </AbsoluteFill>
  );
};
