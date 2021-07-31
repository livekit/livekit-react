import {
  faDesktop,
  faMicrophone,
  faMicrophoneSlash,
  faStop,
  faVideo,
  faVideoSlash,
} from "@fortawesome/free-solid-svg-icons";
import {
  createLocalAudioTrack,
  createLocalVideoTrack,
  LocalTrackPublication,
  LocalVideoTrack,
  Room,
  Track,
  VideoPresets,
} from "livekit-client";
import React, { ReactElement } from "react";
import { useParticipant } from "../useParticipant";
import { ControlButton } from "./ControlButton";
import styles from "./styles.module.css";

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
  const { publications, isAudioMuted, isVideoMuted, unpublishTrack } =
    useParticipant(room.localParticipant);

  const audioPub = publications.find((val) => val.kind === Track.Kind.Audio);
  const videoPub = publications.find((val) => {
    return val.kind === Track.Kind.Video && val.trackName !== "screen";
  });
  const screenPub = publications.find((val) => {
    return val.kind === Track.Kind.Video && val.trackName === "screen";
  });
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
    if (!audioPub || isAudioMuted) {
      muteButton = (
        <ControlButton
          label="Unmute"
          icon={faMicrophoneSlash}
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
          icon={faMicrophone}
          onClick={() => (audioPub as LocalTrackPublication).mute()}
        />
      );
    }
  }

  let videoButton: ReactElement | undefined;
  if (enableVideo) {
    if (videoPub?.track && !isVideoMuted) {
      videoButton = (
        <ControlButton
          label="Stop video"
          icon={faVideo}
          onClick={() => (videoPub as LocalTrackPublication).mute()}
        />
      );
    } else {
      videoButton = (
        <ControlButton
          label="Start video"
          icon={faVideoSlash}
          onClick={async () => {
            if (videoPub) {
              (videoPub as LocalTrackPublication).unmute();
            } else {
              const videoTrack = await createLocalVideoTrack();
              room.localParticipant.publishTrack(videoTrack);
            }
          }}
        />
      );
    }
  }

  let screenButton: ReactElement | undefined;
  if (enableScreenShare) {
    if (screenPub?.track) {
      screenButton = (
        <ControlButton
          label="Stop sharing"
          icon={faStop}
          onClick={() => unpublishTrack(screenPub.track as LocalVideoTrack)}
        />
      );
    } else {
      screenButton = (
        <ControlButton
          label="Share screen"
          icon={faDesktop}
          onClick={async () => {
            try {
              const captureStream =
                // @ts-ignore
                (await navigator.mediaDevices.getDisplayMedia({
                  video: {
                    width: VideoPresets.fhd.resolution.width,
                    height: VideoPresets.fhd.resolution.height,
                  },
                })) as MediaStream;

              room.localParticipant.publishTrack(captureStream.getTracks()[0], {
                name: "screen",
                videoEncoding: {
                  maxBitrate: 3000000,
                  maxFramerate: 30,
                },
              });
            } catch (err) {
              // TODO: display error
            }
          }}
        />
      );
    }
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
