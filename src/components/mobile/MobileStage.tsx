import { LocalParticipant, RemoteVideoTrack } from "livekit-client";
import React, { ReactElement, useState } from "react";
import { ControlsView } from "../ControlsView";
import { ParticipantView } from "../ParticipantView";
import { ScreenShareView } from "../ScreenShareView";
import { StageProps } from "../StageProps";
import styles from "./styles.module.css";

export const MobileStage = ({
  roomState,
  participantRenderer,
  controlRenderer,
  onLeave,
  adaptiveVideo,
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
        onMouseEnter={() => setShowOverlay(true)}
        onMouseLeave={() => setShowOverlay(false)}
        adaptiveVideo={adaptiveVideo}
      />
    );
  }

  // TODO: since only first is visible, disable other tracks

  return (
    // global container
    <div className={styles.container}>
      <div className={styles.stage}>{mainView}</div>
      <div className={styles.controlsArea}>
        <ControlRenderer room={room} onLeave={onLeave} />
      </div>
    </div>
  );
};
