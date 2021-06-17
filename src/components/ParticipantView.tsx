import { Property } from "csstype";
import { Participant, Track } from "livekit-client";
import React, { CSSProperties, useEffect, useState } from "react";
import { useParticipant } from "../useParticipant";
import { AudioRenderer } from "./AudioRenderer";
import styles from "./styles.module.css";
import { VideoRenderer } from "./VideoRenderer";

export interface ParticipantProps {
  participant: Participant;
  displayName?: string;
  width?: Property.Width;
  height?: Property.Height;
  aspect?: string;
  showOverlay?: boolean;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
}

export const ParticipantView = ({
  participant,
  width,
  height,
  aspect,
  displayName,
  showOverlay,
  onMouseOver,
  onMouseOut,
  onClick,
}: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant);
  const [videoTrack, setVideoTrack] = useState<Track>();
  const [audioTrack, setAudioTrack] = useState<Track>();

  useEffect(() => {
    let foundVideo = false;
    let foundAudio = false;
    subscribedTracks.forEach((pub) => {
      if (pub.kind === Track.Kind.Audio && !foundAudio) {
        foundAudio = true;
        setAudioTrack(pub.track);
      }
      if (pub.kind === Track.Kind.Video && !foundVideo) {
        foundVideo = true;
        setVideoTrack(pub.track);
      }
    });
  }, [subscribedTracks]);

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  if (!aspect) {
    aspect = "16 / 9";
  }
  if (width && height === undefined) {
    containerStyles.aspectRatio = aspect;
  }

  if (!displayName) {
    displayName = participant.identity;
    if (isLocal) {
      displayName += " (You)";
    }
  }

  return (
    <div
      className={styles.participant}
      style={containerStyles}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {audioTrack && <AudioRenderer track={audioTrack} isLocal={isLocal} />}

      {videoTrack && (
        <VideoRenderer
          track={videoTrack}
          isLocal={isLocal}
          width="100%"
          height="100%"
        />
      )}

      {showOverlay && (
        <div className={styles.participantName}>{displayName}</div>
      )}
    </div>
  );
};
