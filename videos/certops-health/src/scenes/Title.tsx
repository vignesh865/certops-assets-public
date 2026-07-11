import {
  AbsoluteFill,
  interpolate,
  spring,
  useCurrentFrame,
  useVideoConfig,
} from "remotion";
import { COLORS } from "../config";
import { fontFamily } from "../fonts";

export const Title: React.FC<{ title: string; subtitle: string }> = ({
  title,
  subtitle,
}) => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  const enter = spring({ frame, fps, config: { damping: 200 } });
  const subtitleOpacity = interpolate(frame, [12, 30], [0, 1], {
    extrapolateLeft: "clamp",
    extrapolateRight: "clamp",
  });

  return (
    <AbsoluteFill
      className="items-center justify-center"
      style={{ backgroundColor: COLORS.bg, fontFamily }}
    >
      <div
        style={{
          transform: `translateY(${interpolate(enter, [0, 1], [24, 0])}px)`,
          opacity: enter,
        }}
      >
        <h1
          className="text-8xl font-bold tracking-tight"
          style={{ color: COLORS.text }}
        >
          {title}
        </h1>
      </div>
      <p
        className="mt-6 text-3xl"
        style={{ color: COLORS.muted, opacity: subtitleOpacity }}
      >
        {subtitle}
      </p>
    </AbsoluteFill>
  );
};
