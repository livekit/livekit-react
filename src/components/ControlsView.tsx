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

  const [audioButtonDisabled, setAudioButtonDisabled] = React.useState(false);
  let muteButton: ReactElement | undefined;
  if (enableAudio) {
    const enabled = room.localParticipant.isMicrophoneEnabled;
    muteButton = (
      <AudioSelectButton
        isMuted={!enabled}
        isButtonDisabled={audioButtonDisabled}
        onClick={async () => {
          setAudioButtonDisabled(true);
          room.localParticipant.setMicrophoneEnabled(!enabled);
          setAudioButtonDisabled(false);
        }}
        onSourceSelected={async (device) => {
          setAudioButtonDisabled(true);
          await room.switchActiveDevice("audioinput", device.deviceId);
          setAudioButtonDisabled(false);
        }}
      />
    );
  }

  const [videoButtonDisabled, setVideoButtonDisabled] = React.useState(false);

  let videoButton: ReactElement | undefined;
  if (enableVideo) {
    const enabled = !(camPub?.isMuted ?? true);
    videoButton = (
      <VideoSelectButton
        isEnabled={enabled}
        isButtonDisabled={videoButtonDisabled}
        onClick={async () => {
          setVideoButtonDisabled(true);
          await room.localParticipant.setCameraEnabled(!enabled);
          setVideoButtonDisabled(false);
        }}
        onSourceSelected={async (device) => {
          setVideoButtonDisabled(true);
          await room.switchActiveDevice("videoinput", device.deviceId);
          setVideoButtonDisabled(false);
        }}
      />
    );
  }

  const [screenButtonDisabled, setScreenButtonDisabled] = React.useState(false);
  let screenButton: ReactElement | undefined;
  if (enableScreenShare) {
    const enabled = room.localParticipant.isScreenShareEnabled;
    screenButton = (
      <ControlButton
        label={enabled ? "Stop sharing" : "Share screen"}
        icon={enabled ? faStop : faDesktop}
        disabled={screenButtonDisabled}
        onClick={async () => {
          setScreenButtonDisabled(true);
          await room.localParticipant.setScreenShareEnabled(!enabled);
          setScreenButtonDisabled(false);
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
