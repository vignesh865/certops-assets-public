import { Img, staticFile } from 'remotion';
import { COLORS } from '../constants';

type BrowserFrameProps = {
  src: string;
  style?: React.CSSProperties;
  /** CSS transform applied to the image for zoom/pan/crop effects */
  imageTransform?: string;
  /** transform-origin for the image transform */
  imageTransformOrigin?: string;
  /** Glow color (e.g. COLORS.green). Drives border + shadow tint. */
  glowColor?: string;
  /** 0–1: controls how intense the glow is. Animate from the parent. */
  glowOpacity?: number;
};

export const BrowserFrame: React.FC<BrowserFrameProps> = ({
  src,
  style,
  imageTransform,
  imageTransformOrigin = 'center center',
  glowColor = COLORS.green,
  glowOpacity = 0,
}) => {
  // Interpolate border color: transparent → glowColor
  const borderAlpha = Math.round(glowOpacity * 0xff)
    .toString(16)
    .padStart(2, '0');
  const borderColor = `${glowColor}${borderAlpha}`;

  const shadowOpacity1 = (glowOpacity * 0.55).toFixed(2);
  const shadowOpacity2 = (glowOpacity * 0.25).toFixed(2);

  return (
    <div
      style={{
        borderRadius: 12,
        overflow: 'hidden',
        border: `1.5px solid ${borderColor}`,
        boxShadow: [
          `0 0 32px rgba(${hexToRgb(glowColor)},${shadowOpacity1})`,
          `0 0 80px rgba(${hexToRgb(glowColor)},${shadowOpacity2})`,
          '0 8px 32px rgba(0,0,0,0.08)',
        ].join(', '),
        ...style,
      }}
    >
      {/* Screenshot — overflow:hidden crops the zoom/pan transform */}
      <div style={{ overflow: 'hidden', lineHeight: 0 }}>
        <Img
          src={staticFile(src)}
          style={{
            width: '100%',
            display: 'block',
            ...(imageTransform
              ? { transform: imageTransform, transformOrigin: imageTransformOrigin }
              : {}),
          }}
        />
      </div>
    </div>
  );
};

/** Convert #rrggbb hex to "r,g,b" string for rgba() */
function hexToRgb(hex: string): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16);
  const g = parseInt(clean.substring(2, 4), 16);
  const b = parseInt(clean.substring(4, 6), 16);
  return `${r},${g},${b}`;
}
