import React, { ReactElement } from "react";
import { useMediaQuery } from "react-responsive";
import { AudioRenderer } from "./AudioRenderer";
import { DesktopStage } from "./desktop/DesktopStage";
import { MobileStage } from "./mobile/MobileStage";
import { StageProps } from "./StageProps";

export const StageView = (stageProps: StageProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });

  let mainElement: ReactElement;
  if (isMobile) {
    mainElement = <MobileStage {...stageProps} />;
  } else {
    mainElement = <DesktopStage {...stageProps} />;
  }

  return (
    <React.Fragment>
      {mainElement}
      {stageProps.roomState.audioTracks.map((track) => (
        <AudioRenderer key={track.sid} track={track} isLocal={false} />
      ))}
    </React.Fragment>
  );
};
