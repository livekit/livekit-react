import { ConnectOptions, Room } from "livekit-client";
import React, { useEffect } from "react";
import { ControlsProps } from "./components/ControlsView";
import { ParticipantProps } from "./components/ParticipantView";
import { StageProps } from "./components/StageProps";
import { StageView } from "./components/StageView";
import { useRoom } from "./useRoom";

export interface RoomProps {
  url: string;
  token: string;
  connectOptions?: ConnectOptions;
  onConnected?: (room: Room) => void;
  stageRenderer?: (props: StageProps) => React.ReactElement | null;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
}

export const LiveKitRoom = (props: RoomProps) => {
  const roomState = useRoom();
  const { participantRenderer, controlRenderer } = props;

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

  return stageRenderer({ roomState, participantRenderer, controlRenderer });
};
