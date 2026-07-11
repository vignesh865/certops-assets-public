import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';
import { SectionLabel } from '../components/SectionLabel';

const YAML_LINES = [
  { text: 'suite: rag-pipeline-audit', color: '#e6edf3' },
  { text: 'version: 2', color: '#a5d6ff' },
  { text: '', color: '' },
  { text: 'targets:', color: '#79c0ff' },
  { text: '  - id: retriever-service', color: '#e6edf3' },
  { text: '    endpoint: /v1/retrieve', color: '#a5d6ff' },
  { text: '    dataset: golden-qa-set-v2', color: '#a5d6ff' },
  { text: '', color: '' },
  { text: '    metrics:', color: '#79c0ff' },
  { text: '      - cosine-similarity', color: '#3fb950' },
  { text: '      - hallucination', color: '#3fb950' },
  { text: '      - rouge-l', color: '#3fb950' },
  { text: '', color: '' },
  { text: '    gates:', color: '#79c0ff' },
  { text: '      - metric: cosine-similarity', color: '#e6edf3' },
  { text: '        threshold: 0.75', color: '#f8c555' },
  { text: '        blocking: true', color: '#ff7b72' },
];

const FRAMES_PER_LINE = 8;
const LEFT_W = 360;
const GAP = 56;
const TERM_W = 720;

export const Config: React.FC = () => {
  const frame = useCurrentFrame();

  const visibleLines = Math.min(YAML_LINES.length, Math.floor(frame / FRAMES_PER_LINE));
  const cursorVisible = visibleLines < YAML_LINES.length && Math.floor(frame / 8) % 2 === 0;

  const captionOpacity = interpolate(frame, [4, 28], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const captionY = interpolate(frame, [4, 28], [16, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const termOpacity = interpolate(frame, [8, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });
  const termY = interpolate(frame, [8, 30], [24, 0], {
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
        <SectionLabel label="Configuration" />
        <div
          style={{
            fontSize: 44,
            fontWeight: 800,
            color: COLORS.textPrimary,
            lineHeight: 1.08,
            letterSpacing: '-0.022em',
          }}
        >
          Define your AI as code.
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
          One manifest declares your targets, metrics, and gates. Versionable,
          reviewable, audit-ready — no clicks, no drift.
        </div>
      </div>

      {/* Right terminal */}
      <div
        style={{
          width: TERM_W,
          opacity: termOpacity,
          transform: `translateY(${termY}px)`,
        }}
      >
        <div
          style={{
            background: COLORS.terminalBg,
            borderRadius: 14,
            overflow: 'hidden',
            width: '100%',
            border: `1px solid ${COLORS.terminalBorder}`,
            boxShadow: '0 24px 80px rgba(0,0,0,0.18), 0 8px 24px rgba(0,0,0,0.1)',
          }}
        >
          <div
            style={{
              background: COLORS.terminalHeader,
              padding: '12px 16px',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              borderBottom: `1px solid ${COLORS.terminalBorder}`,
            }}
          >
            {['#ff5f57', '#ffbd2e', '#28c840'].map((c) => (
              <div
                key={c}
                style={{ width: 12, height: 12, borderRadius: '50%', background: c }}
              />
            ))}
            <span
              style={{
                marginLeft: 12,
                color: COLORS.terminalComment,
                fontSize: 13,
                fontFamily: COLORS.monoFont,
              }}
            >
              certops.yaml
            </span>
          </div>

          <div
            style={{
              padding: '20px 24px',
              fontFamily: COLORS.monoFont,
              fontSize: 14,
              lineHeight: 1.75,
              minHeight: 360,
            }}
          >
            {YAML_LINES.slice(0, visibleLines).map((line, i) => (
              <div
                // eslint-disable-next-line react/no-array-index-key
                key={i}
                style={{
                  color: line.color || 'transparent',
                  whiteSpace: 'pre',
                  minHeight: '1em',
                }}
              >
                {line.text || ' '}
              </div>
            ))}
            {cursorVisible && (
              <div style={{ color: '#3fb950', height: '1em' }}>▋</div>
            )}
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
};
