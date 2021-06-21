import { Property } from "csstype";
import {
  Participant,
  RemoteTrackPublication,
  Track,
  TrackPublication,
} from "livekit-client";
import { VideoQuality } from "livekit-client/dist/proto/livekit_rtc";
import React, { CSSProperties, ReactElement, useEffect, useState } from "react";
import AspectRatio from "react-aspect-ratio";
import "react-aspect-ratio/aspect-ratio.css";
import { useInView } from "react-intersection-observer";
import { useParticipant } from "../useParticipant";
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
  quality?: VideoQuality;
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
  quality,
  disableHiddenVideo,
  onMouseOver,
  onMouseOut,
  onClick,
}: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant);
  const { ref, inView } = useInView();
  const [videoPub, setVideoPub] = useState<TrackPublication>();

  // when video is hidden, disable it to optimize for bandwidth
  useEffect(() => {
    if (disableHiddenVideo && videoPub instanceof RemoteTrackPublication) {
      if (inView !== videoPub.isEnabled) {
        (videoPub as RemoteTrackPublication).setEnabled(inView);
      }
    }
  }, [videoPub, inView, disableHiddenVideo]);

  // effect to control video quality
  useEffect(() => {
    if (videoPub instanceof RemoteTrackPublication) {
      videoPub.setVideoQuality(quality ?? VideoQuality.HIGH);
    }
  }, [videoPub, quality]);

  // effect to set videoPub
  useEffect(() => {
    subscribedTracks.forEach((pub) => {
      if (pub.kind === Track.Kind.Video && !videoPub) {
        setVideoPub(pub);
      }
    });
  }, [subscribedTracks]);

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
