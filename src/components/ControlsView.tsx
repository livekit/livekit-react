import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  Room,
  Track,
} from "livekit-client";
import React, { ReactElement } from "react";
import { useParticipant } from "../useParticipant";
import { ControlButton } from "./ControlButton";
import styles from "./styles.module.css";
export interface ControlsProps {
  room: Room;
}

export const ControlsView = ({ room }: ControlsProps) => {
  const { publications, isMuted, unpublishTrack } = useParticipant(
    room.localParticipant
  );

  const audioPub = publications.find((val) => val.kind === Track.Kind.Audio);
  const videoPub = publications.find((val) => {
    return val.kind === Track.Kind.Video && val.trackName !== "screen";
  });

  let muteButton: ReactElement;
  if (!audioPub || isMuted) {
    muteButton = (
      <ControlButton
        label="Unmute"
        onClick={async () => {
          if (audioPub) {
            (audioPub as LocalTrackPublication).unmute();
          } else {
            // track not published
            const audioTrack = await createLocalAudioTrack();
            room.localParticipant.publishTrack(audioTrack);
          }
        }}
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
          await room.localParticipant.publishTrack(videoTrack);
        }}
      />
    );
  }

  return (
    <div className={styles.controlsWrapper}>
      {muteButton}
      {videoButton}
      <ControlButton label="Leave" onClick={() => room.disconnect()} />
    </div>
  );
};
