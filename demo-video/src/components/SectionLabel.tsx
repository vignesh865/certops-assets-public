import { interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

type SectionLabelProps = {
  label: string;
  /** Override the entry animation start frame (default: 0) */
  startFrame?: number;
};

export const SectionLabel: React.FC<SectionLabelProps> = ({ label, startFrame = 0 }) => {
  const frame = useCurrentFrame();
  const opacity = interpolate(frame, [startFrame, startFrame + 20], [0, 1], {
    extrapolateRight: 'clamp',
  });

  return (
    <div
      style={{
        opacity,
        marginBottom: 24,
        alignSelf: 'flex-start',
        display: 'inline-flex',
        alignItems: 'center',
        gap: 7,
        background: 'rgba(5,150,105,0.07)',
        border: '1px solid rgba(5,150,105,0.2)',
        borderRadius: 100,
        padding: '5px 14px 5px 10px',
        fontFamily: inter,
      }}
    >
      <div
        style={{
          width: 6,
          height: 6,
          borderRadius: '50%',
          background: COLORS.green,
          flexShrink: 0,
        }}
      />
      <span
        style={{
          fontSize: 11,
          fontWeight: 700,
          color: COLORS.green,
          letterSpacing: '0.09em',
          textTransform: 'uppercase',
        }}
      >
        {label}
      </span>
    </div>
  );
};
