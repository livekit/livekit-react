import { ConnectOptions, Room } from "livekit-client";
import React, { useEffect } from "react";
import { ParticipantProps } from "./components/ParticipantView";
import { StageProps } from "./components/StageProps";
import { StageView } from "./components/StageView";
import { useRoom } from "./useRoom";

export interface RoomProps {
  url: string;
  token: string;
  connectOptions?: ConnectOptions;
  onConnected?: (room: Room) => void;
  stageRenderer?: (renderProps: StageProps) => React.ReactElement | null;
  participantRenderer?: (
    renderProps: ParticipantProps
  ) => React.ReactElement | null;
}

export const LiveKitRoom = (props: RoomProps) => {
  const roomState = useRoom();

  useEffect(() => {
    roomState
      .connect(props.url, props.token, props.connectOptions)
      .then((room) => {
        if (room && props.onConnected) {
          props.onConnected(room);
        }
      });
  }, []);

  const stageRenderer = props.stageRenderer ?? StageView;

  return stageRenderer({ roomState });
};
