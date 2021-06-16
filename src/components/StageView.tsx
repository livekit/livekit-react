import React from "react";
import { useMediaQuery } from "react-responsive";
import { DesktopStage } from "./desktop/DesktopStage";
import { StageProps } from "./StageProps";

export const StageView = (stageProps: StageProps) => {
  const isMobile = useMediaQuery({ query: "(max-width: 800px)" });
  if (isMobile) {
    return null;
  }

  return <DesktopStage {...stageProps} />;
};
