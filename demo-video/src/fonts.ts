// Outfit: geometric precision, weight 100–900 — much more distinctive than Inter
import { loadFont } from '@remotion/google-fonts/Outfit';

export const { fontFamily: inter } = loadFont('normal', {
  weights: ['400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});
