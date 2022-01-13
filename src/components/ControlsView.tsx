import { faDesktop, faStop } from "@fortawesome/free-solid-svg-icons";
import { Room } from "livekit-client";
import React, { ReactElement } from "react";
import { useParticipant } from "../useParticipant";
import { AudioSelectButton } from "./AudioSelectButton";
import { ControlButton } from "./ControlButton";
import styles from "./styles.module.css";
import { VideoSelectButton } from "./VideoSelectButton";

export interface ControlsProps {
  room: Room;
  enableScreenShare?: boolean;
  enableAudio?: boolean;
  enableVideo?: boolean;
  onLeave?: (room: Room) => void;
}

export const ControlsView = ({
  room,
  enableScreenShare,
  enableAudio,
  enableVideo,
  onLeave,
}: ControlsProps) => {
  const { cameraPublication: camPub } = useParticipant(room.localParticipant);

  if (enableScreenShare === undefined) {
    enableScreenShare = true;
  }
  if (enableVideo === undefined) {
    enableVideo = true;
  }
  if (enableAudio === undefined) {
    enableAudio = true;
  }

  let muteButton: ReactElement | undefined;
  if (enableAudio) {
    const enabled = room.localParticipant.isMicrophoneEnabled;
    muteButton = (
      <AudioSelectButton
        isMuted={!enabled}
        onClick={() => room.localParticipant.setMicrophoneEnabled(!enabled)}
        onSourceSelected={(device) =>
          room.switchActiveDevice("audioinput", device.deviceId)
        }
      />
    );
  }

  let videoButton: ReactElement | undefined;
  if (enableVideo) {
    const enabled = !(camPub?.isMuted ?? true);
    videoButton = (
      <VideoSelectButton
        isEnabled={enabled}
        onClick={() => room.localParticipant.setCameraEnabled(!enabled)}
        onSourceSelected={(device) => {
          room.switchActiveDevice("videoinput", device.deviceId);
        }}
      />
    );
  }

  let screenButton: ReactElement | undefined;
  if (enableScreenShare) {
    const enabled = room.localParticipant.isScreenShareEnabled;
    screenButton = (
      <ControlButton
        label={enabled ? "Stop sharing" : "Share screen"}
        icon={enabled ? faStop : faDesktop}
        onClick={() => {
          if (enabled) {
            room.localParticipant.setScreenShareEnabled(false);
          } else {
            room.localParticipant.setScreenShareEnabled(true);
          }
        }}
      />
    );
  }

  return (
    <div className={styles.controlsWrapper}>
      {muteButton}
      {videoButton}
      {screenButton}
      {onLeave && (
        <ControlButton
          label="End"
          className={styles.dangerButton}
          onClick={() => {
            room.disconnect();
            onLeave(room);
          }}
        />
      )}
    </div>
  );
};
