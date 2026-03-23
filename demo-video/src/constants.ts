export const COLORS = {
  bg: '#060d1a',
  surface: '#0e1726',
  border: '#1e2d42',
  green: '#10b981',
  textPrimary: '#f1f5f9',
  textSecondary: '#94a3b8',
  textMuted: '#475569',
  terminalBg: '#0d1117',
  terminalHeader: '#161b22',
  terminalBorder: '#30363d',
  terminalComment: '#8b949e',
  monoFont: "'Courier New', monospace",
} as const;

export const SCENE_DURATIONS = {
  problem: 120,
  identity: 150,
  config: 210,
  engine: 180,
  metrics: 210,
  verdict: 210,
  cta: 150,
} as const;

export const TRANSITION_FRAMES = 15;

// 1230 - 6 * 15 = 1140 frames = 38 seconds
export const TOTAL_DURATION =
  Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENE_DURATIONS).length - 1) * TRANSITION_FRAMES;
