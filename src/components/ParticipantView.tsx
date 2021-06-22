import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
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
  adaptiveVideo?: Boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
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
  adaptiveVideo,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ParticipantProps) => {
  const { isLocal, isMuted, subscribedTracks } = useParticipant(participant);
  const { ref, inView } = useInView();
  const [videoPub, setVideoPub] = useState<TrackPublication>();

  // when video is hidden, disable it to optimize for bandwidth
  useEffect(() => {
    if (adaptiveVideo && videoPub instanceof RemoteTrackPublication) {
      if (inView !== videoPub.isEnabled) {
        (videoPub as RemoteTrackPublication).setEnabled(inView);
      }
    }
  }, [videoPub, inView, adaptiveVideo]);

  // effect to control video quality
  useEffect(() => {
    if (adaptiveVideo && videoPub instanceof RemoteTrackPublication) {
      videoPub.setVideoQuality(quality ?? VideoQuality.HIGH);
    }
  }, [videoPub, quality, adaptiveVideo]);

  // effect to set videoPub
  useEffect(() => {
    subscribedTracks.forEach((pub) => {
      if (
        pub.isSubscribed &&
        pub.kind === Track.Kind.Video &&
        !videoPub &&
        pub.trackName !== "screen"
      ) {
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
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {aspectWidth && aspectHeight && (
        <AspectRatio ratio={aspectWidth / aspectHeight}>
          {mainElement}
        </AspectRatio>
      )}
      {(!aspectWidth || !aspectHeight) && mainElement}

      {showOverlay && (
        <div className={styles.participantBar}>
          <div>{displayName}</div>
          <div>
            <FontAwesomeIcon
              icon={isMuted ? faMicrophoneSlash : faMicrophone}
              height={24}
              className={isMuted ? styles.iconRed : styles.iconNormal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
