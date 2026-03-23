import './index.css';
import { Composition } from 'remotion';
import { CertOpsDemo } from './CertOpsDemo';
import { TOTAL_DURATION } from './constants';

export const RemotionRoot: React.FC = () => {
  return (
    <Composition
      id="CertOpsDemo"
      component={CertOpsDemo}
      durationInFrames={TOTAL_DURATION}
      fps={30}
      width={1280}
      height={720}
    />
  );
};
