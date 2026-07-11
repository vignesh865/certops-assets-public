import { AbsoluteFill, interpolate, spring, useCurrentFrame, useVideoConfig } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { BrowserFrame } from '../components/BrowserFrame';
import { SectionLabel } from '../components/SectionLabel';

const LEFT_W = 360;
const GAP = 56;
const SHOT_W = 720;

export const Dashboard: React.FC = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

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

  const entryFlash = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const breathe = (Math.sin((frame - 55) * 0.065) + 1) / 2;
  const glowOpacity = entryFlash * (0.45 + 0.3 * breathe);

  const captionOpacity = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [4, 28], [16, 0], {
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
        <SectionLabel label="Command Center" />
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
          }}
        >
          One dashboard for every certification.
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
          Every run, every verdict, every signature — in one place. No spreadsheets,
          no scattered logs, no guessing what shipped.
        </div>
      </div>

      {/* Right screenshot */}
      <div
        style={{
          width: SHOT_W,
          opacity: screenshotOpacity,
          transform: `translateY(${screenshotY}px) scale(${scale})`,
          transformOrigin: 'center center',
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
