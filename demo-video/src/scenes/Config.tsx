import { AbsoluteFill, interpolate, useCurrentFrame } from 'remotion';
import { inter } from '../fonts';
import { COLORS } from '../constants';

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

const FRAMES_PER_LINE = 10;

export const Config: React.FC = () => {
  const frame = useCurrentFrame();

  const titleOpacity = interpolate(frame, [0, 20], [0, 1], { extrapolateRight: 'clamp' });
  const visibleLines = Math.min(YAML_LINES.length, Math.floor(frame / FRAMES_PER_LINE));
  const cursorVisible = visibleLines < YAML_LINES.length && Math.floor(frame / 8) % 2 === 0;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.bg,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: inter,
        padding: '0 80px',
      }}
    >
      {/* Section label */}
      <div
        style={{
          opacity: titleOpacity,
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
        Configuration as Code
      </div>

      {/* Terminal window */}
      <div
        style={{
          background: COLORS.terminalBg,
          borderRadius: 12,
          overflow: 'hidden',
          width: '100%',
          border: `1px solid ${COLORS.terminalBorder}`,
          boxShadow: '0 24px 80px rgba(0,0,0,0.6)',
        }}
      >
        {/* Window chrome */}
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

        {/* Code content */}
        <div
          style={{
            padding: '20px 24px',
            fontFamily: COLORS.monoFont,
            fontSize: 14,
            lineHeight: 1.75,
            minHeight: 340,
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
    </AbsoluteFill>
  );
};
