import { Property } from "csstype";
import { Participant, Track } from "livekit-client";
import React, { CSSProperties } from "react";
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
}: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant);

  let audioTrack: Track | undefined;
  let videoTrack: Track | undefined;

  subscribedTracks.forEach((pub) => {
    if (pub.kind === Track.Kind.Audio && !audioTrack) {
      audioTrack = pub.track;
    }
    if (pub.kind === Track.Kind.Video && !videoTrack) {
      videoTrack = pub.track;
    }
  });

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
