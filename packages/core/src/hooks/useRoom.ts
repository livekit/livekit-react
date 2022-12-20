import {
  AudioTrack,
  Participant,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  RoomOptions,
  RoomConnectOptions,
  ConnectionState,
} from 'livekit-client';
import { useCallback, useEffect, useState } from 'react';

export interface RoomState {
  connect: (url: string, token: string, options?: RoomConnectOptions) => Promise<Room | undefined>;
  isConnecting: boolean;
  room?: Room;
  /* all participants in the room, including the local participant. */
  participants: Participant[];
  /* all subscribed audio tracks in the room, not including local participant. */
  audioTracks: AudioTrack[];
  error?: Error;
  connectionState: ConnectionState;
}

export function useRoom(roomOptions?: RoomOptions): RoomState {
  const [room, setRoom] = useState<Room | undefined>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);
  const [connectionState, setConnectionState] = useState<ConnectionState>(
    ConnectionState.Disconnected,
  );

  useEffect(() => {
    setRoom(new Room(roomOptions));
  }, []);

  const connectFn = useCallback(
    async (url: string, token: string, options?: RoomConnectOptions) => {
      setIsConnecting(true);
      try {
        const onParticipantsChanged = () => {
          if (!room) return;
          const remotes = Array.from(room.participants.values());
          const participants: Participant[] = [room.localParticipant];
          participants.push(...remotes);
          setParticipants(participants);
        };
        const onSubscribedTrackChanged = (track?: RemoteTrack) => {
          // ordering may have changed, re-sort
          onParticipantsChanged();
          if ((track && track.kind !== Track.Kind.Audio) || !room) {
            return;
          }
          const tracks: AudioTrack[] = [];
          room.participants.forEach((p) => {
            p.audioTracks.forEach((pub) => {
              if (pub.audioTrack) {
                tracks.push(pub.audioTrack);
              }
            });
          });
          setAudioTracks(tracks);
        };

        const onConnectionStateChanged = (state: ConnectionState) => {
          setConnectionState(state);
        };

        if (!room) {
          setError(new Error('room is not ready yet'));
          return;
        }

        room.once(RoomEvent.Disconnected, () => {
          room
            .off(RoomEvent.ParticipantConnected, onParticipantsChanged)
            .off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
            .off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
            .off(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.LocalTrackPublished, onParticipantsChanged)
            .off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
            .off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
            .off(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);
        });
        room
          .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
          .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
          .on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
          .on(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.LocalTrackPublished, onParticipantsChanged)
          .on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
          // trigger a state change by re-sorting participants
          .on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged)
          .on(RoomEvent.ConnectionStateChanged, onConnectionStateChanged);

        await room.connect(url, token, options);
        setIsConnecting(false);
        onSubscribedTrackChanged();
        setError(undefined);
        return room;
      } catch (error) {
        setIsConnecting(false);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error('an error has occured'));
        }

        return undefined;
      }
    },
    [room],
  );

  return {
    connect: connectFn,
    isConnecting,
    room,
    error,
    participants,
    audioTracks,
    connectionState,
  };
}
