import React, { useState } from "react";
import { ControlsView } from "../ControlsView";
import { ParticipantView } from "../ParticipantView";
import { StageProps } from "../StageProps";
import styles from "./styles.module.css";

export const DesktopStage = ({
  roomState,
  participantRenderer,
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

  const mainParticipant = participants[0];
  const otherParticipants = participants.slice(1);

  // TEST CODE
  const numToAdd = 8 - otherParticipants.length;
  for (let i = 0; i < numToAdd; i++) {
    otherParticipants.push(mainParticipant);
  }

  const ParticipantRenderer = participantRenderer ?? ParticipantView;
  return (
    // global container
    <div className={styles.container}>
      <div className={styles.stage}>
        <div className={styles.stageCenter}>
          <ParticipantRenderer
            participant={mainParticipant}
            height="100%"
            showOverlay={showOverlay}
            onMouseOver={() => setShowOverlay(true)}
            onMouseOut={() => setShowOverlay(false)}
          />
        </div>
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
        <ControlsView room={room} />
      </div>
    </div>
  );
};
