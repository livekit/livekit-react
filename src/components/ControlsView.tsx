import {
  createLocalVideoTrack,
  LocalParticipant,
  LocalTrackPublication,
  LocalVideoTrack,
  Track,
} from "livekit-client";
import React, { ReactElement } from "react";
import { useParticipant } from "../useParticipant";
import { ControlButton } from "./ControlButton";
import styles from "./styles.module.css";

export interface ControlsProps {
  localParticipant: LocalParticipant;
}

export const ControlsView = ({ localParticipant }: ControlsProps) => {
  const { publications, isMuted, unpublishTrack } =
    useParticipant(localParticipant);

  const audioPub = publications.find((val) => val.kind === Track.Kind.Audio);
  const videoPub = publications.find((val) => {
    return val.kind === Track.Kind.Video && val.trackName !== "screen";
  });

  let muteButton: ReactElement | null = null;
  if (audioPub) {
    if (isMuted) {
      muteButton = (
        <ControlButton
          label="Unmute"
          onClick={() => (audioPub as LocalTrackPublication).unmute()}
        />
      );
    } else {
      muteButton = (
        <ControlButton
          label="Mute"
          onClick={() => (audioPub as LocalTrackPublication).mute()}
        />
      );
    }
  }

  let videoButton: ReactElement;
  if (videoPub?.track) {
    videoButton = (
      <ControlButton
        label="Stop video"
        onClick={() => unpublishTrack(videoPub.track as LocalVideoTrack)}
      />
    );
  } else {
    videoButton = (
      <ControlButton
        label="Start video"
        onClick={async () => {
          const videoTrack = await createLocalVideoTrack();
          await localParticipant.publishTrack(videoTrack);
        }}
      />
    );
  }

  return (
    <div className={styles.controlsWrapper}>
      {muteButton}
      {videoButton}
    </div>
  );
};
