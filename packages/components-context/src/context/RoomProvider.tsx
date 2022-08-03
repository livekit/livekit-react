import React, { ReactNode, useContext, useEffect, useState } from 'react';
import { useParticipant as useParticipantHook } from '@livekit/react-core';
import { Room, RoomEvent } from 'livekit-client';

type RoomProviderProps = {
  children: Array<ReactNode> | ReactNode;
};

const RoomContext = React.createContext<Room>(new Room());

export function useRoom() {
  return useContext(RoomContext);
}

export function useParticipants() {
  return useContext(RoomContext)?.participants;
}

export function useParticipant(identity: string) {
  const participant = useContext(RoomContext).getParticipantByIdentity(identity);
  return participant ? useParticipantHook(participant) : undefined;
}

export const RoomProvider = ({ children }: RoomProviderProps) => {
  const [room, setRoom] = useState(new Room());
  const handleRoomUpdate = () => {
    setRoom(room);
  };
  useEffect(() => {
    room.on(RoomEvent.ParticipantConnected, handleRoomUpdate);
    room.on(RoomEvent.ConnectionStateChanged, handleRoomUpdate);
  });
  console.log('rendering room provider');
  return <RoomContext.Provider value={room}>{children}</RoomContext.Provider>;
};
