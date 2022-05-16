import React, {
  CSSProperties,
  ReactElement,
  useCallback,
  useContext,
  useEffect,
  useState,
} from 'react';
import { faMicrophone, faMicrophoneSlash } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { Property } from 'csstype';
import { ConnectionQuality, LocalTrack, Participant, RemoteTrack } from 'livekit-client';
import { useParticipant, VideoRenderer } from '@livekit/react-core';

import { AspectRatio } from 'react-aspect-ratio';
import { ReactComponent as connectionQuality1 } from '../../static/connection-quality-1.svg';
import { ReactComponent as connectionQuality2 } from '../../static/connection-quality-2.svg';
import { ReactComponent as connectionQuality3 } from '../../static/connection-quality-3.svg';
import { DisplayContext } from './DisplayContext';
import styles from './styles.module.css';

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
  orientation?: 'landscape' | 'portrait';
  // true if overlay with participant info should be shown
  showOverlay?: boolean;
  // true if connection quality should be shown
  showConnectionQuality?: boolean;
  // additional classname when participant is currently speaking
  speakerClassName?: string;
  onMouseEnter?: () => void;
  onMouseLeave?: () => void;
  onClick?: () => void;
}

export const ParticipantView = ({
  participant,
  width,
  height,
  className,
  speakerClassName,
  aspectWidth,
  aspectHeight,
  orientation,
  displayName,
  showOverlay,
  showConnectionQuality,
  onMouseEnter,
  onMouseLeave,
  onClick,
}: ParticipantProps) => {
  const { cameraPublication, isLocal, connectionQuality, isSpeaking } = useParticipant(participant);
  const [videoSize, setVideoSize] = useState<string>();
  const [currentBitrate, setCurrentBitrate] = useState<number>();
  const context = useContext(DisplayContext);

  const handleResize = useCallback((width: number, height: number) => {
    setVideoSize(`${width}x${height}`);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      let total = 0;
      participant.tracks.forEach((pub) => {
        if (pub.track instanceof LocalTrack || pub.track instanceof RemoteTrack) {
          total += pub.track.currentBitrate;
        }
      });
      setCurrentBitrate(total);
    }, 1000);
    return () => {
      clearInterval(interval);
    };
  }, []);

  const containerStyles: CSSProperties = {
    width: width,
    height: height,
  };

  // when aspect matches, cover instead
  let objectFit: Property.ObjectFit = 'contain';
  let videoOrientation: 'landscape' | 'portrait' | undefined;
  if (!orientation && aspectWidth && aspectHeight) {
    orientation = aspectWidth > aspectHeight ? 'landscape' : 'portrait';
  }
  if (cameraPublication?.dimensions) {
    videoOrientation =
      cameraPublication.dimensions.width > cameraPublication.dimensions.height
        ? 'landscape'
        : 'portrait';
  }

  if (videoOrientation === orientation) {
    objectFit = 'cover';
  }

  if (!displayName) {
    displayName = participant.name || participant.identity;
    if (isLocal) {
      displayName += ' (You)';
    }
  }

  let mainElement: ReactElement;
  if (cameraPublication?.isSubscribed && cameraPublication?.track && !cameraPublication?.isMuted) {
    mainElement = (
      <VideoRenderer
        track={cameraPublication.track}
        isLocal={isLocal}
        objectFit={objectFit}
        width="100%"
        height="100%"
        className={styles.video}
        onSizeChanged={handleResize}
      />
    );
  } else {
    mainElement = <div className={styles.placeholder} />;
  }

  const classes = [styles.participant];
  if (className) {
    classes.push(className);
  }
  if (isSpeaking) {
    classes.push(speakerClassName ?? styles.speaker);
  }
  const isAudioMuted = !participant.isMicrophoneEnabled;

  // gather stats
  let statsContent: ReactElement | undefined;
  if (context.showStats) {
    statsContent = (
      <div className={styles.stats}>
        <span>{videoSize}</span>
        {currentBitrate !== undefined && currentBitrate > 0 && (
          <span>&nbsp;{Math.round(currentBitrate / 1024)} kbps</span>
        )}
      </div>
    );
  }

  let ConnectionQualityIndicator: typeof connectionQuality1 | undefined;
  if (showConnectionQuality) {
    switch (connectionQuality) {
      case ConnectionQuality.Excellent:
        ConnectionQualityIndicator = connectionQuality3;
        break;
      case ConnectionQuality.Good:
        ConnectionQualityIndicator = connectionQuality2;
        break;
      case ConnectionQuality.Poor:
        ConnectionQualityIndicator = connectionQuality1;
        break;
    }
  }

  return (
    <div
      className={classes.join(' ')}
      style={containerStyles}
      onMouseEnter={onMouseEnter}
      onMouseLeave={onMouseLeave}
      onClick={onClick}
    >
      {aspectWidth && aspectHeight && (
        <AspectRatio ratio={aspectWidth / aspectHeight}>{mainElement}</AspectRatio>
      )}
      {(!aspectWidth || !aspectHeight) && mainElement}

      {(showOverlay || context.showStats) && (
        <div className={styles.participantBar}>
          <div className={styles.name}>{displayName}</div>
          <div className={styles.center}>{statsContent}</div>
          <div>{ConnectionQualityIndicator && <ConnectionQualityIndicator />}</div>
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
