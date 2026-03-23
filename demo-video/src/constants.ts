export const COLORS = {
  bg: '#ffffff',
  surface: '#f8fafc',
  border: '#e2e8f0',
  green: '#059669',
  textPrimary: '#0f172a',
  textSecondary: '#475569',
  textMuted: '#94a3b8',
  terminalBg: '#0d1117',
  terminalHeader: '#161b22',
  terminalBorder: '#30363d',
  terminalComment: '#8b949e',
  monoFont: "'Courier New', monospace",
} as const;

export const SCENE_DURATIONS = {
  problem: 210,    // 7s — extended hold after subtext
  identity: 150,   // 5s
  dashboard: 210,  // 7s — NEW
  wizard: 210,     // 7s — NEW
  config: 150,     // 5s (shortened)
  engine: 150,     // 5s (shortened)
  terminal: 180,   // 6s — NEW
  metrics: 150,    // 5s (shortened)
  verdict: 240,    // 8s (extended)
  cta: 150,        // 5s
} as const;

export const TRANSITION_FRAMES = 15;

// 1710 - 9 * 15 = 1575 frames = 52.5 seconds
export const TOTAL_DURATION =
  Object.values(SCENE_DURATIONS).reduce((a, b) => a + b, 0) -
  (Object.keys(SCENE_DURATIONS).length - 1) * TRANSITION_FRAMES;
