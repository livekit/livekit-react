import {
  AudioTrack,
  Participant,
  RemoteTrack,
  Room,
  RoomEvent,
  Track,
  RoomOptions,
  RoomConnectOptions,
} from "livekit-client";
import { useCallback, useEffect, useRef, useState } from "react";

export interface RoomState {
  connect: (
    url: string,
    token: string,
    options?: RoomConnectOptions
  ) => Promise<Room | undefined>;
  isConnecting: boolean;
  room?: Room;
  /* all participants in the room, including the local participant. */
  participants: Participant[];
  /* all subscribed audio tracks in the room, not including local participant. */
  audioTracks: AudioTrack[];
  error?: Error;
}

export function useRoom(roomOptions?: RoomOptions): RoomState {
  const room = useRef<Room>();
  const [isConnecting, setIsConnecting] = useState(false);
  const [error, setError] = useState<Error>();
  const [participants, setParticipants] = useState<Participant[]>([]);
  const [audioTracks, setAudioTracks] = useState<AudioTrack[]>([]);

  useEffect(() => {
    const newRoom = new Room(roomOptions);
    room.current = newRoom;
    return () => {
      room.current?.disconnect();
      room.current = undefined;
    };
  }, []);

  const connectFn = useCallback(
    async (url: string, token: string, options?: RoomConnectOptions) => {
      setIsConnecting(true);
      if (!room.current) {
        console.warn("component not mounted, return");
        return;
      }
      try {
        await room.current?.connect(url, token, options);
        const onParticipantsChanged = () => {
          if (!room.current) return;
          const remotes = Array.from(room.current.participants.values());
          const participants: Participant[] = [room.current.localParticipant];
          participants.push(...remotes);
          setParticipants(participants);
        };
        const onSubscribedTrackChanged = (track?: RemoteTrack) => {
          // ordering may have changed, re-sort
          onParticipantsChanged();
          if ((track && track.kind !== Track.Kind.Audio) || !room.current) {
            return;
          }
          const tracks: AudioTrack[] = [];
          room.current.participants.forEach((p) => {
            p.audioTracks.forEach((pub) => {
              if (pub.audioTrack) {
                tracks.push(pub.audioTrack);
              }
            });
          });
          setAudioTracks(tracks);
        };

        room.current.once(RoomEvent.Disconnected, () => {
          setTimeout(() => (room.current = undefined));
          if (!room.current) return;
          room.current
            .off(RoomEvent.ParticipantConnected, onParticipantsChanged)
            .off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
            .off(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
            .off(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
            .off(RoomEvent.LocalTrackPublished, onParticipantsChanged)
            .off(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
            .off(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged);
        });
        room.current
          .on(RoomEvent.ParticipantConnected, onParticipantsChanged)
          .on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
          .on(RoomEvent.ActiveSpeakersChanged, onParticipantsChanged)
          .on(RoomEvent.TrackSubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.TrackUnsubscribed, onSubscribedTrackChanged)
          .on(RoomEvent.LocalTrackPublished, onParticipantsChanged)
          .on(RoomEvent.LocalTrackUnpublished, onParticipantsChanged)
          // trigger a state change by re-sorting participants
          .on(RoomEvent.AudioPlaybackStatusChanged, onParticipantsChanged);

        setIsConnecting(false);
        onSubscribedTrackChanged();
        setError(undefined);
        return room.current;
      } catch (error) {
        setIsConnecting(false);
        if (error instanceof Error) {
          setError(error);
        } else {
          setError(new Error("an error has occured"));
        }

        return undefined;
      }
    },
    []
  );

  return {
    connect: connectFn,
    isConnecting,
    room: room.current,
    error,
    participants,
    audioTracks,
  };
}
