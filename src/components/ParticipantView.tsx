import { Property } from "csstype";
import {
  Participant,
  RemoteTrackPublication,
  Track,
  TrackPublication,
} from "livekit-client";
import React, { CSSProperties, ReactElement, useEffect } from "react";
import AspectRatio from "react-aspect-ratio";
import "react-aspect-ratio/aspect-ratio.css";
import { useInView } from "react-intersection-observer";
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
  disableHiddenVideo?: Boolean;
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
  disableHiddenVideo,
}: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant);
  const { ref, inView } = useInView();

  // when video is hidden, disable it to optimize for bandwidth
  useEffect(() => {
    if (disableHiddenVideo && videoPub instanceof RemoteTrackPublication) {
      if (inView !== videoPub.isEnabled) {
        (videoPub as RemoteTrackPublication).setEnabled(inView);
      }
    }
  }, [inView, disableHiddenVideo]);

  let audioTrack: Track | undefined;
  let videoPub: TrackPublication | undefined;
  subscribedTracks.forEach((pub) => {
    if (pub.kind === Track.Kind.Audio && !audioTrack) {
      audioTrack = pub.track;
    }
    if (pub.kind === Track.Kind.Video && !videoPub) {
      videoPub = pub;
    }
  });

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  // when aspect matches, cover instead
  let objectFit: Property.ObjectFit = "contain";
  if (
    aspectWidth &&
    aspectHeight &&
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

  let mainElement: ReactElement;
  if (videoPub) {
    mainElement = (
      <VideoRenderer
        track={videoPub.track!}
        isLocal={isLocal}
        objectFit={objectFit}
        width="100%"
        height="100%"
      />
    );
  } else {
    mainElement = <div className={styles.placeholder} />;
  }

  return (
    <div
      ref={ref}
      className={styles.participant}
      style={containerStyles}
      onMouseOver={onMouseOver}
      onMouseOut={onMouseOut}
      onClick={onClick}
    >
      {audioTrack && <AudioRenderer track={audioTrack} isLocal={isLocal} />}

      {aspectWidth && aspectHeight && (
        <AspectRatio ratio={aspectWidth / aspectHeight}>
          {mainElement}
        </AspectRatio>
      )}
      {(!aspectWidth || !aspectHeight) && mainElement}

      {showOverlay && (
        <div className={styles.participantName}>{displayName}</div>
      )}
    </div>
  );
};
