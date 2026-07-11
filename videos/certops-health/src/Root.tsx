import "./index.css";
import { Composition } from "remotion";
import { CertOpsHealth } from "./CertOpsHealth";
import { FPS, HEIGHT, WIDTH, sec } from "./config";

export const RemotionRoot: React.FC = () => {
  return (
    <>
      <Composition
        id="CertOpsHealth"
        component={CertOpsHealth}
        durationInFrames={sec(5)}
        fps={FPS}
        width={WIDTH}
        height={HEIGHT}
      />
    </>
  );
};
