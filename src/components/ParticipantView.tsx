import { Property } from "csstype";
import { Participant, Track, TrackPublication } from "livekit-client";
import React, { CSSProperties } from "react";
import AspectRatio from "react-aspect-ratio";
import "react-aspect-ratio/aspect-ratio.css";
import { useParticipant } from "../useParticipant";
import { AudioRenderer } from "./AudioRenderer";
import styles from "./styles.module.css";
import { VideoRenderer } from "./VideoRenderer";

export interface ParticipantProps {
  participant: Participant;
  displayName?: string;
  // width in CSS
  width?: Property.Width;
  // height in CSS
  height?: Property.Height;
  // aspect ratio width
  aspectWidth?: number;
  // aspect ratio height
  aspectHeight?: number;
  showOverlay?: boolean;
  onMouseOver?: () => void;
  onMouseOut?: () => void;
  onClick?: () => void;
}

export const ParticipantView = ({
  participant,
  width,
  height,
  aspectWidth,
  aspectHeight,
  displayName,
  showOverlay,
  onMouseOver,
  onMouseOut,
  onClick,
}: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant);

  let videoTrack: Track | undefined;
  let audioTrack: Track | undefined;
  let videoPub: TrackPublication | undefined;
  subscribedTracks.forEach((pub) => {
    if (pub.kind === Track.Kind.Audio && !audioTrack) {
      audioTrack = pub.track;
    }
    if (pub.kind === Track.Kind.Video && !videoTrack) {
      videoTrack = pub.track;
      videoPub = pub;
    }
  });

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  if (!aspectWidth || !aspectHeight) {
    aspectWidth = 16;
    aspectHeight = 9;
  }
  // // when height unspecified and width is, conform to aspect ratio
  // if (width && height === undefined) {
  //   containerStyles.aspectRatio = `${aspectWidth} / ${aspectHeight}`;
  // }
  // when aspect matches, cover instead
  let objectFit: Property.ObjectFit = "contain";
  if (
    videoPub?.dimensions &&
    (aspectWidth - aspectHeight) *
      (videoPub.dimensions.width - videoPub.dimensions.height) >
      0
  ) {
    objectFit = "cover";
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
        <AspectRatio ratio={aspectWidth / aspectHeight}>
          <VideoRenderer
            track={videoTrack}
            isLocal={isLocal}
            objectFit={objectFit}
            width="100%"
            height="100%"
          />
        </AspectRatio>
      )}
      {!videoTrack && (
        <AspectRatio ratio={aspectWidth / aspectHeight}>
          <div className={styles.placeholder} />
        </AspectRatio>
      )}

      {showOverlay && (
        <div className={styles.participantName}>{displayName}</div>
      )}
    </div>
  );
};
