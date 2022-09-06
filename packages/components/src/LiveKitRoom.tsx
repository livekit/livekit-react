import { Room, RoomOptions, RoomConnectOptions, ConnectionState } from 'livekit-client';
import React, { useEffect } from 'react';
import { ControlsProps } from './components/ControlsView';
import { ParticipantProps } from './components/ParticipantView';
import { StageProps } from './components/StageProps';
import { StageView } from './components/StageView';
import { useRoom } from '@livekit/react-core';

export interface RoomProps {
  url: string;
  token: string;
  roomOptions?: RoomOptions;
  connectOptions?: RoomConnectOptions;
  // when first connected to room
  onConnected?: (room: Room) => void;
  // when user leaves the room
  onLeave?: (room: Room) => void;
  stageRenderer?: (props: StageProps) => React.ReactElement | null;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
}

export const LiveKitRoom = ({
  url,
  token,
  roomOptions,
  connectOptions,
  stageRenderer,
  participantRenderer,
  controlRenderer,
  onConnected,
  onLeave,
}: RoomProps) => {
  const roomState = useRoom(roomOptions);

  useEffect(() => {
    roomState.connect(url, token, connectOptions).then((room) => {
      if (!room) {
        return;
      }
      if (onConnected && room.state === ConnectionState.Connected) {
        onConnected(room);
      }
    });

    return () => {
      if (roomState.connectionState !== ConnectionState.Disconnected) {
        roomState.room?.disconnect();
      }
    };
  }, []);

  const selectedStageRenderer = stageRenderer ?? StageView;

  return selectedStageRenderer({
    roomState,
    participantRenderer,
    controlRenderer,
    onLeave,
  });
};
