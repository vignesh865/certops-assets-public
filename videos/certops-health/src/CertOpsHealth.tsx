import { AbsoluteFill, Sequence } from "remotion";
import { sec } from "./config";
import { Title } from "./scenes/Title";

export const CertOpsHealth: React.FC = () => {
  return (
    <AbsoluteFill>
      <Sequence durationInFrames={sec(5)}>
        <Title title="CertOps" subtitle="Placeholder — awaiting product docs" />
      </Sequence>
    </AbsoluteFill>
  );
};
