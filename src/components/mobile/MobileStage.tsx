import { Track, VideoTrack } from "livekit-client";
import React, { ReactElement, useState } from "react";
import { ControlsView } from "../ControlsView";
import { ParticipantView } from "../ParticipantView";
import { ScreenShareView } from "../ScreenShareView";
import { StageProps } from "../StageProps";
import { defaultSortParticipants } from "../StageUtils";
import styles from "./styles.module.css";

export const MobileStage = ({
  roomState,
  participantRenderer,
  controlRenderer,
  onLeave,
  sortParticipants,
}: StageProps) => {
  const { isConnecting, error, participants, room } = roomState;
  const [showOverlay, setShowOverlay] = useState(false);

  if (error) {
    return <div>error {error.message}</div>;
  }

  if (isConnecting) {
    return <div>connecting</div>;
  }
  if (!room) {
    return <div>room closed</div>;
  }

  if (participants.length === 0) {
    return <div>no one is in the room</div>;
  }

  const ParticipantRenderer = participantRenderer ?? ParticipantView;
  const ControlRenderer = controlRenderer ?? ControlsView;

  const sortFn = sortParticipants ?? defaultSortParticipants;
  sortFn(participants);

  // find first participant with screen shared
  let screenTrack: VideoTrack | undefined;
  participants.forEach((p) => {
    if (screenTrack) {
      return;
    }
    const track = p.getTrack(Track.Source.ScreenShare);
    if (track?.isSubscribed && track.videoTrack) {
      screenTrack = track.videoTrack;
    }
  });

  const otherParticipants = participants;
  let mainView: ReactElement;
  if (screenTrack) {
    mainView = (
      <ScreenShareView track={screenTrack} height="100%" width="100%" />
    );
  } else {
    mainView = (
      <ParticipantRenderer
        key={participants[0].identity}
        participant={participants[0]}
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
        <ControlRenderer
          room={room}
          enableScreenShare={false}
          onLeave={onLeave}
        />
      </div>
    </div>
  );
};
