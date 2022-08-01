import {
  ConnectionQuality,
  ConnectionState,
  LocalParticipant,
  RemoteParticipant,
  Room,
  RoomConnectOptions,
  RoomEvent,
  RoomOptions,
  setLogLevel,
  TrackPublication,
} from 'livekit-client';
import create from 'zustand/vanilla';

export type LiveRoomState = {
  connect: (
    url: string,
    token: string,
    options?: RoomOptions,
    connectOptions?: RoomConnectOptions,
  ) => Promise<void>;
  room: Room;
  participants: Array<RemoteParticipant>;
  localParticipant: LocalParticipant;
  connectionState: ConnectionState;
};

export interface LiveParticipantState {
  isSpeaking: boolean;
  connectionQuality: ConnectionQuality;
  isLocal: boolean;
  metadata?: string;
  publications: TrackPublication[];
  subscribedTracks: TrackPublication[];
  cameraPublication?: TrackPublication;
  microphonePublication?: TrackPublication;
  screenSharePublication?: TrackPublication;
}

export interface ParticipantsState {
  [identity: string]: LiveParticipantState;
}

export const useRoomStore = create<LiveRoomState>()((set) => {
  const room = new Room();

  const connect = async (
    url: string,
    token: string,
    options?: RoomOptions,
    connectOptions?: RoomConnectOptions,
  ) => {
    // room.disconnect();
    // room
    //   .off(RoomEvent.ParticipantConnected, onParticipantsChanged)
    //   .off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
    //   .off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
    //   .off(RoomEvent.TrackSubscribed, onParticipantsChanged)
    //   .off(RoomEvent.TrackUnsubscribed, onParticipantsChanged)
    //   .off(RoomEvent.LocalTrackPublished, onParticipantsChanged)
    //   .off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
    //   // trigger a state change by re-sorting participants
    //   .off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
    //   .off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);

    if (options) {
      room.options = options;
    }

    setLogLevel('debug');

    room
      .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
      .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
      .on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
      .on(RoomEvent.TrackSubscribed, onParticipantsChanged)
      .on(RoomEvent.TrackUnsubscribed, onParticipantsChanged)
      .on(RoomEvent.LocalTrackPublished, onParticipantsChanged)
      .on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
      // trigger a state change by re-sorting participants
      .on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
      .on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
    await room.connect(url, token, connectOptions);
    set(() => ({
      room,
      participants: Array.from(room.participants.values()),
      connectionState: room.state,
      localParticipant: room.localParticipant,
    }));
  };
  const onParticipantsChanged = () => {
    set((state: LiveRoomState) => ({
      participants: Array.from(state.room!.participants.values()),
    }));
  };
  const onConnectionStateChanged = () => {
    set((state: LiveRoomState) => ({ connectionState: state.room!.state }));
  };
  return {
    connect,
    room,
    participants: [],
    localParticipant: room.localParticipant,
    connectionState: room.state,
  };
});

export const useParticipantsStore = create<ParticipantsState>()(() => {
  const participants = useRoomStore.getState().participants;
  const entries = {};
  participants.forEach((participant: RemoteParticipant) => {
    entries[participant.identity] = participant;
  });
  return entries;
});
