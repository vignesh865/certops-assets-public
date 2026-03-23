import { AbsoluteFill } from 'remotion';
import { TransitionSeries, linearTiming } from '@remotion/transitions';
import { fade } from '@remotion/transitions/fade';
// import { Audio } from '@remotion/media';
// import { staticFile } from 'remotion';
import { inter } from './fonts';
import { SCENE_DURATIONS, TRANSITION_FRAMES } from './constants';
import { Problem } from './scenes/Problem';
import { Identity } from './scenes/Identity';
import { Config } from './scenes/Config';
import { Engine } from './scenes/Engine';
import { Metrics } from './scenes/Metrics';
import { Verdict } from './scenes/Verdict';
import { CTA } from './scenes/CTA';

const FADE = linearTiming({ durationInFrames: TRANSITION_FRAMES });

export const CertOpsDemo: React.FC = () => {
  // Uncomment when public/bg-music.mp3 is added:
  // const { durationInFrames, fps } = useVideoConfig();

  return (
    <AbsoluteFill style={{ fontFamily: inter, background: '#060d1a' }}>
      {/*
        Background music — uncomment after placing an audio file at:
        demo-video/public/bg-music.mp3

        <Audio
          src={staticFile('bg-music.mp3')}
          loop
          volume={(f) =>
            interpolate(
              f,
              [0, 1 * fps, durationInFrames - 1.5 * fps, durationInFrames],
              [0, 0.35, 0.35, 0],
              { extrapolateLeft: 'clamp', extrapolateRight: 'clamp' },
            )
          }
        />
      */}

      <TransitionSeries>
        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.problem}>
          <Problem />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.identity}>
          <Identity />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.config}>
          <Config />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.engine}>
          <Engine />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.metrics}>
          <Metrics />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.verdict}>
          <Verdict />
        </TransitionSeries.Sequence>
        <TransitionSeries.Transition presentation={fade()} timing={FADE} />

        <TransitionSeries.Sequence durationInFrames={SCENE_DURATIONS.cta}>
          <CTA />
        </TransitionSeries.Sequence>
      </TransitionSeries>
    </AbsoluteFill>
  );
};
