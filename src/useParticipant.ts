import {
  LocalParticipant,
  LocalTrack,
  Participant,
  ParticipantEvent,
  Track,
  TrackPublication,
} from "livekit-client";
import { useEffect, useState } from "react";

export interface ParticipantState {
  isSpeaking: boolean;
  isLocal: boolean;
  metadata?: string;
  publications: TrackPublication[];
  subscribedTracks: TrackPublication[];
  cameraPublication?: TrackPublication;
  microphonePublication?: TrackPublication;
  screenSharePublication?: TrackPublication;
  unpublishTrack: (track: LocalTrack) => void;
}

export function useParticipant(participant: Participant): ParticipantState {
  const [isAudioMuted, setAudioMuted] = useState(false);
  const [, setVideoMuted] = useState(false);
  const [isSpeaking, setSpeaking] = useState(false);
  const [metadata, setMetadata] = useState<string>();
  const [publications, setPublications] = useState<TrackPublication[]>([]);
  const [subscribedTracks, setSubscribedTracks] = useState<TrackPublication[]>(
    []
  );

  const onPublicationsChanged = () => {
    setPublications(Array.from(participant.tracks.values()));
    setSubscribedTracks(
      Array.from(participant.tracks.values()).filter((pub) => {
        return pub.isSubscribed && pub.track !== undefined;
      })
    );
  };
  const unpublishTrack = async (track: LocalTrack) => {
    if (!(participant instanceof LocalParticipant)) {
      throw new Error("could not unpublish, not a local participant");
    }
    (participant as LocalParticipant).unpublishTrack(track);
    participant.emit("localtrackchanged");
  };

  useEffect(() => {
    const onMuted = (pub: TrackPublication) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(true);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(true);
      }
    };
    const onUnmuted = (pub: TrackPublication) => {
      if (pub.kind === Track.Kind.Audio) {
        setAudioMuted(false);
      } else if (pub.kind === Track.Kind.Video) {
        setVideoMuted(false);
      }
    };
    const onMetadataChanged = () => {
      if (participant.metadata) {
        setMetadata(participant.metadata);
      }
    };
    const onIsSpeakingChanged = () => {
      setSpeaking(participant.isSpeaking);
    };

    // register listeners
    participant.on(ParticipantEvent.TrackMuted, onMuted);
    participant.on(ParticipantEvent.TrackUnmuted, onUnmuted);
    participant.on(ParticipantEvent.MetadataChanged, onMetadataChanged);
    participant.on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged);
    participant.on(ParticipantEvent.TrackPublished, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackUnpublished, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackSubscribed, onPublicationsChanged);
    participant.on(ParticipantEvent.TrackUnsubscribed, onPublicationsChanged);
    participant.on(ParticipantEvent.LocalTrackPublished, onPublicationsChanged);
    participant.on("localtrackchanged", onPublicationsChanged);

    // set initial state
    onMetadataChanged();
    onIsSpeakingChanged();
    onPublicationsChanged();

    return () => {
      // cleanup
      participant.off(ParticipantEvent.TrackMuted, onMuted);
      participant.off(ParticipantEvent.TrackUnmuted, onUnmuted);
      participant.off(ParticipantEvent.MetadataChanged, onMetadataChanged);
      participant.off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged);
      participant.off(ParticipantEvent.TrackPublished, onPublicationsChanged);
      participant.off(ParticipantEvent.TrackUnpublished, onPublicationsChanged);
      participant.off(ParticipantEvent.TrackSubscribed, onPublicationsChanged);
      participant.off(
        ParticipantEvent.TrackUnsubscribed,
        onPublicationsChanged
      );
      participant.off(
        ParticipantEvent.LocalTrackPublished,
        onPublicationsChanged
      );
      participant.off("localtrackchanged", onPublicationsChanged);
    };
  }, [participant]);

  let muted: boolean | undefined;
  participant.audioTracks.forEach((pub) => {
    muted = pub.isMuted;
  });
  if (muted === undefined) {
    muted = true;
  }
  if (isAudioMuted !== muted) {
    setAudioMuted(muted);
  }

  return {
    isLocal: participant instanceof LocalParticipant,
    isSpeaking,
    publications,
    subscribedTracks,
    cameraPublication: participant.getTrack(Track.Source.Camera),
    microphonePublication: participant.getTrack(Track.Source.Microphone),
    screenSharePublication: participant.getTrack(Track.Source.ScreenShare),
    metadata,
    unpublishTrack,
  };
}
