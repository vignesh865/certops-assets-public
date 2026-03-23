import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

const HEADLINE = 'Does your AI actually work in production?';
const SUBTEXT = 'Real production failures. No warnings. No test coverage.';
const CHAR_FRAMES = 2;
const CURSOR_BLINK = 8;

export const Problem: React.FC = () => {
  const frame = useCurrentFrame();

  const chars = Math.min(HEADLINE.length, Math.floor(frame / CHAR_FRAMES));
  const cursorVisible = Math.floor(frame / CURSOR_BLINK) % 2 === 0;
  const typingDone = chars >= HEADLINE.length;

  const subtextOpacity = interpolate(
    frame,
    [HEADLINE.length * CHAR_FRAMES + 15, HEADLINE.length * CHAR_FRAMES + 40],
    [0, 1],
    { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
  );

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '0 120px',
      }}
    >
      <div
        style={{
          fontSize: 56,
          fontWeight: 700,
          color: COLORS.textPrimary,
          textAlign: 'center',
          lineHeight: 1.15,
          letterSpacing: '-0.025em',
          maxWidth: 900,
        }}
      >
        {HEADLINE.slice(0, chars)}
        <span
          style={{
            opacity: typingDone ? 0 : cursorVisible ? 1 : 0,
            color: COLORS.green,
            marginLeft: 2,
          }}
        >
          ▊
        </span>
      </div>

      <div
        style={{
          marginTop: 32,
          fontSize: 22,
          color: COLORS.textSecondary,
          opacity: subtextOpacity,
          fontWeight: 400,
          textAlign: 'center',
          lineHeight: 1.5,
        }}
      >
        {SUBTEXT}
      </div>
    </AbsoluteFill>
  );
};
