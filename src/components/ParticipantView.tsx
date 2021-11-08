import {
  faMicrophone,
  faMicrophoneSlash,
} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Property } from "csstype";
import { Participant } from "livekit-client";
import React, { CSSProperties, ReactElement } from "react";
import { AspectRatio } from "react-aspect-ratio";
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
  className?: string;
  // aspect ratio width, if set, maintains aspect ratio
  aspectWidth?: number;
  // aspect ratio height
  aspectHeight?: number;
  // determine whether to contain or cover video.
  // cover mode is used when layout orientation matches video orientation
  orientation?: "landscape" | "portrait";
  // true if overlay with participant info should be shown
  showOverlay?: boolean;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export const ParticipantView = ({
  participant,
  width,
  height,
  className,
  aspectWidth,
  aspectHeight,
  orientation,
  displayName,
  showOverlay,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ParticipantProps) => {
  const { cameraPublication, isLocal } = useParticipant(participant);

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  // when aspect matches, cover instead
  let objectFit: Property.ObjectFit = "contain";
  let videoOrientation: "landscape" | "portrait" | undefined;
  if (!orientation && aspectWidth && aspectHeight) {
    orientation = aspectWidth > aspectHeight ? "landscape" : "portrait";
  }
  if (cameraPublication?.dimensions) {
    videoOrientation =
      cameraPublication.dimensions.width > cameraPublication.dimensions.height
        ? "landscape"
        : "portrait";
  }

  if (videoOrientation === orientation) {
    objectFit = "cover";
  }

  if (!displayName) {
    displayName = participant.identity;
    if (isLocal) {
      displayName += " (You)";
    }
  }

  let mainElement: ReactElement;
  if (
    cameraPublication?.isSubscribed &&
    cameraPublication?.track &&
    !cameraPublication?.isMuted
  ) {
    mainElement = (
      <VideoRenderer
        track={cameraPublication.track}
        isLocal={isLocal}
        objectFit={objectFit}
        width="100%"
        height="100%"
      />
    );
  } else {
    mainElement = <div className={styles.placeholder} />;
  }

  const classes = [styles.participant];
  if (className) {
    classes.push(className);
  }
  const isAudioMuted = !participant.isMicrophoneEnabled;

  return (
    <div
      className={classes.join(" ")}
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
              icon={isAudioMuted ? faMicrophoneSlash : faMicrophone}
              height={24}
              className={isAudioMuted ? styles.iconRed : styles.iconNormal}
            />
          </div>
        </div>
      )}
    </div>
  );
};
