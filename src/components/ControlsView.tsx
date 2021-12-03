import { faDesktop, faStop } from "@fortawesome/free-solid-svg-icons";
import { Room, Track } from "livekit-client";
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
  endLabel?: string;
  stopShareLabel?: string;
  shareScreenLabel?: string;
  videoBtnClassName?: string;
  videoBtnPopoverContainerClassName?: string;
  videoBtnPopoverTriggerBtnClassName?: string;
  videoBtnPopoverTriggerBtnSeparatorClassName?: string;
  audioBtnClassName?: string;
  audioBtnPopoverContainerClassName?: string;
  audioBtnPopoverTriggerBtnClassName?: string;
  audioBtnPopoverTriggerBtnSeparatorClassName?: string;
  screenBtnClassName?: string;
  screenBtnPopoverContainerClassName?: string;
  screenBtnPopoverTriggerBtnClassName?: string;
  screenBtnPopoverTriggerBtnSeparatorClassName?: string;
  endBtnClassName?: string;
  endBtnPopoverContainerClassName?: string;
  endBtnPopoverTriggerBtnClassName?: string;
  endBtnPopoverTriggerBtnSeparatorClassName?: string;
  disableText?: string;
  enableText?: string;
  muteText?: string;
  unmuteText?: string;
}

export const ControlsView = ({
  room,
  enableScreenShare,
  enableAudio,
  enableVideo,
  onLeave,
  endLabel = "End",
  stopShareLabel = "Stop sharing",
  shareScreenLabel = "Share screen",
  videoBtnClassName,
  videoBtnPopoverContainerClassName,
  videoBtnPopoverTriggerBtnClassName,
  videoBtnPopoverTriggerBtnSeparatorClassName,
  audioBtnClassName,
  audioBtnPopoverContainerClassName,
  audioBtnPopoverTriggerBtnClassName,
  audioBtnPopoverTriggerBtnSeparatorClassName,
  screenBtnClassName,
  screenBtnPopoverContainerClassName,
  screenBtnPopoverTriggerBtnClassName,
  screenBtnPopoverTriggerBtnSeparatorClassName,
  endBtnClassName,
  endBtnPopoverContainerClassName,
  endBtnPopoverTriggerBtnClassName,
  endBtnPopoverTriggerBtnSeparatorClassName,
  disableText,
  enableText,
  muteText,
  unmuteText,
}: ControlsProps) => {
  const { unpublishTrack } = useParticipant(room.localParticipant);

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
        muteText={muteText}
        unmuteText={unmuteText}
        className={audioBtnClassName}
        popoverContainerClassName={audioBtnPopoverContainerClassName}
        popoverTriggerBtnClassName={audioBtnPopoverTriggerBtnClassName}
        popoverTriggerBtnSeparatorClassName={
          audioBtnPopoverTriggerBtnSeparatorClassName
        }
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
    const enabled = room.localParticipant.isCameraEnabled;
    videoButton = (
      <VideoSelectButton
        disableText={disableText}
        enableText={enableText}
        className={videoBtnClassName}
        popoverContainerClassName={videoBtnPopoverContainerClassName}
        popoverTriggerBtnClassName={videoBtnPopoverTriggerBtnClassName}
        popoverTriggerBtnSeparatorClassName={
          videoBtnPopoverTriggerBtnSeparatorClassName
        }
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
        label={enabled ? stopShareLabel : shareScreenLabel}
        icon={enabled ? faStop : faDesktop}
        className={screenBtnClassName}
        popoverContainerClassName={screenBtnPopoverContainerClassName}
        popoverTriggerBtnClassName={screenBtnPopoverTriggerBtnClassName}
        popoverTriggerBtnSeparatorClassName={
          screenBtnPopoverTriggerBtnSeparatorClassName
        }
        onClick={() => {
          if (enabled) {
            const pub = room.localParticipant.getTrack(
              Track.Source.ScreenShare
            );
            if (pub?.track) {
              unpublishTrack(pub.track);
            }
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
          className={endBtnClassName || styles.dangerButton}
          popoverContainerClassName={endBtnPopoverContainerClassName}
          popoverTriggerBtnClassName={endBtnPopoverTriggerBtnClassName}
          popoverTriggerBtnSeparatorClassName={
            endBtnPopoverTriggerBtnSeparatorClassName
          }
          label={endLabel}
          onClick={() => {
            room.disconnect();
            onLeave(room);
          }}
        />
      )}
    </div>
  );
};
