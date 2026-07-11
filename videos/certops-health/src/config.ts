export const FPS = 30;
export const WIDTH = 1920;
export const HEIGHT = 1080;

export const sec = (seconds: number) => Math.round(seconds * FPS);

/**
 * Placeholder brand tokens. Replace once the CertOps brand/product docs land.
 */
export const COLORS = {
  bg: "#0B1020",
  surface: "#141B2E",
  text: "#F5F7FA",
  muted: "#94A3B8",
  accent: "#3B82F6",
} as const;
