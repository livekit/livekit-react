import {
  LocalParticipant,
  Participant,
  RemoteVideoTrack,
} from "livekit-client";
import React, { ReactElement, useState } from "react";
import { ControlsView } from "../ControlsView";
import { ParticipantView } from "../ParticipantView";
import { StageProps } from "../StageProps";
import { VideoRenderer } from "../VideoRenderer";
import styles from "./styles.module.css";

export const DesktopStage = ({
  roomState,
  participantRenderer,
  controlRenderer,
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

  // find first participant with screen shared
  let screenTrack: RemoteVideoTrack | undefined;
  participants.forEach((p) => {
    if (p instanceof LocalParticipant) {
      return;
    }
    p.videoTracks.forEach((track) => {
      if (track.trackName === "screen" && track.track) {
        screenTrack = track.track as RemoteVideoTrack;
      }
    });
  });

  let otherParticipants: Participant[];
  let mainView: ReactElement;
  if (screenTrack) {
    otherParticipants = participants;
    mainView = (
      <VideoRenderer track={screenTrack} isLocal={false} height="100%" />
    );
  } else {
    otherParticipants = participants.slice(1);
    mainView = (
      <ParticipantRenderer
        key={participants[0].identity}
        participant={participants[0]}
        height="100%"
        showOverlay={showOverlay}
        onMouseOver={() => setShowOverlay(true)}
        onMouseOut={() => setShowOverlay(false)}
      />
    );
  }

  return (
    // global container
    <div className={styles.container}>
      <div className={styles.stage}>
        <div className={styles.stageCenter}>{mainView}</div>
        <div className={styles.sidebar}>
          {otherParticipants.map((participant) => {
            return (
              <ParticipantRenderer
                key={participant.identity}
                participant={participant}
                width="100%"
                showOverlay={showOverlay}
                onMouseOver={() => setShowOverlay(true)}
                onMouseOut={() => setShowOverlay(false)}
              />
            );
          })}
        </div>
      </div>
      <div className={styles.controlsArea}>
        <ControlRenderer room={room} />
      </div>
    </div>
  );
};
