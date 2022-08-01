import { RoomOptions } from 'livekit-client';
import React, { useEffect } from 'react';
import create from 'zustand';
import { useRoomStore } from './store';

export interface LiveRoomProps {
  url: string;
  token: string;
  options?: RoomOptions;
}

export const LiveRoom = ({ url, token, options }: LiveRoomProps) => {
  const useStore = create(useRoomStore);
  const roomState = useStore();

  useEffect(() => {
    roomState.connect(url, token, options);

    return () => {
      roomState.room.disconnect();
    };
  });

  return <div></div>;
};
