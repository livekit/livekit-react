import { Participant, Track, VideoTrack } from 'livekit-client';
import React, { ReactElement, useEffect, useState } from 'react';
import { ControlsView } from '../ControlsView';
import { ParticipantView } from '../ParticipantView';
import { ScreenShareView } from '../ScreenShareView';
import { StageProps } from '../StageProps';
import { defaultSortParticipants } from '../StageUtils';
import styles from './styles.module.css';

export const MobileStage = ({
  roomState,
  participantRenderer,
  controlRenderer,
  onLeave,
  sortParticipants,
}: StageProps) => {
  const { isConnecting, error, participants, room } = roomState;
  const [showOverlay, setShowOverlay] = useState(false);
  const sortFn = sortParticipants ?? defaultSortParticipants;
  const [sortedParticipants, setSortedParticipants] = useState(sortFn(participants));

  useEffect(() => {
    setSortedParticipants(sortFn(participants));
  }, [participants, sortFn]);

  if (error) {
    return <div>error {error.message}</div>;
  }

  if (isConnecting) {
    return <div>connecting</div>;
  }
  if (!room) {
    return <div>room closed</div>;
  }

  if (sortedParticipants.length === 0) {
    return <div>no one is in the room</div>;
  }

  const ParticipantRenderer = participantRenderer ?? ParticipantView;
  const ControlRenderer = controlRenderer ?? ControlsView;

  // find first participant with screen shared
  let screenTrack: VideoTrack | undefined;
  sortedParticipants.forEach((p) => {
    if (screenTrack) {
      return;
    }
    const track = p.getTrack(Track.Source.ScreenShare);
    if (track?.isSubscribed && track.videoTrack) {
      screenTrack = track.videoTrack;
    }
  });

  let otherParticipants = sortedParticipants;
  let participantInFocus: Participant;
  let mainView: ReactElement;
  if (screenTrack) {
    mainView = <ScreenShareView track={screenTrack} height="100%" width="100%" />;
  } else if (otherParticipants.length === 0) {
    mainView = <div>no one is in the room</div>;
  } else {
    [participantInFocus, ...otherParticipants] = otherParticipants;
    mainView = (
      <ParticipantRenderer
        key={participantInFocus.identity}
        participant={participantInFocus}
        showOverlay={showOverlay}
        width="100%"
        height="100%"
        orientation="portrait"
        showConnectionQuality
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
      />
    );
  }

  return (
    // global container
    <div className={styles.container}>
      <div className={styles.stage}>{mainView}</div>
      <div className={styles.participantsArea}>
        {otherParticipants.map((participant) => {
          return (
            <ParticipantRenderer
              key={participant.identity}
              participant={participant}
              className={styles.participant}
              aspectWidth={4}
              aspectHeight={3}
              showOverlay={showOverlay}
              onMouseEnter={() => setShowOverlay(true)}
              onMouseLeave={() => setShowOverlay(false)}
            />
          );
        })}
      </div>
      <div className={styles.controlsArea}>
        <ControlRenderer room={room} enableScreenShare={false} onLeave={onLeave} />
      </div>
    </div>
  );
};
