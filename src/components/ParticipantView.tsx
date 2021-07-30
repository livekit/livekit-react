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
  quality?: VideoQuality;
  // when set, video will be disabled when not in view
  adaptiveVideo?: Boolean;
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
  quality,
  adaptiveVideo,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ParticipantProps) => {
  const { isLocal, isMuted, subscribedTracks } = useParticipant(participant);
  const { ref, inView } = useInView();
  const [videoPub, setVideoPub] = useState<TrackPublication>();
  const [videoEnabled, setVideoEnabled] = useState(true);
  const [callbackTimeout, setCallbackTimeout] =
    useState<ReturnType<typeof setTimeout>>();

  // when video is hidden, disable it to optimize for bandwidth
  useEffect(() => {
    let enabled = inView;
    if (!adaptiveVideo) {
      enabled = true;
    }
    if (videoEnabled !== enabled) {
      setVideoEnabled(enabled);
    }
  }, [participant, inView, adaptiveVideo]);

  // effect to set videoPub
  useEffect(() => {
    let newVideoPub: TrackPublication | undefined;
    subscribedTracks.forEach((pub) => {
      if (
        pub.isSubscribed &&
        pub.kind === Track.Kind.Video &&
        pub.trackName !== "screen" &&
        !newVideoPub
      ) {
        newVideoPub = pub;
      }
    });
    setVideoPub(newVideoPub);
  }, [subscribedTracks]);

  // debounce adaptive settings, to ensure less twitchy responses
  useEffect(() => {
    if (callbackTimeout) {
      clearTimeout(callbackTimeout);
      setCallbackTimeout(undefined);
    }
    if (!(videoPub instanceof RemoteTrackPublication)) {
      return;
    }

    // always enable right away, while disable quality changes are delayed
    if (videoEnabled) {
      videoPub.setEnabled(true);
    }

    setCallbackTimeout(
      setTimeout(() => {
        videoPub.setEnabled(videoEnabled);
        if (videoEnabled) {
          videoPub.setVideoQuality(quality ?? VideoQuality.HIGH);
        }
      }, 3000)
    );
    return () => {
      if (callbackTimeout) {
        clearTimeout(callbackTimeout);
        setCallbackTimeout(undefined);
      }
    };
  }, [quality, videoEnabled, videoPub]);

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
  if (videoPub?.dimensions) {
    videoOrientation =
      videoPub.dimensions.width > videoPub.dimensions.height
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
  if (videoPub?.track && videoEnabled) {
    mainElement = (
      <VideoRenderer
        track={videoPub.track}
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

  return (
    <div
      ref={ref}
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
