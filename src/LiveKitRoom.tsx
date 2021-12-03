import { ConnectOptions, Participant, Room } from "livekit-client";
import React, { useEffect } from "react";
import { ControlsProps } from "./components/ControlsView";
import { ParticipantProps } from "./components/ParticipantView";
import { StageProps } from "./components/StageProps";
import { StageView } from "./components/StageView";
import { useRoom } from "./useRoom";

export interface RoomProps {
  url: string;
  token: string;
  connectOptions?: ConnectOptions;
  // override default participant sort
  sortParticipants?: (participants: Participant[]) => void;
  /**
   * when set to true, optimize bandwidth (and room capacity) by
   * * disabling receiving video when participant is hidden
   * * use lower quality video when participant is displayed as thumbnail
   */
  adaptiveVideo?: Boolean;
  // when first connected to room
  onConnected?: (room: Room) => void;
  // when user leaves the room
  onLeave?: (room: Room) => void;
  stageRenderer?: (props: StageProps) => React.ReactElement | null;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
  onClickParticipant?: (participant: Participant) => void;
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

export const LiveKitRoom = ({
  url,
  token,
  connectOptions,
  sortParticipants,
  stageRenderer,
  participantRenderer,
  controlRenderer,
  onConnected,
  onLeave,
  adaptiveVideo,
  onClickParticipant,
  endLabel,
  stopShareLabel,
  shareScreenLabel,
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
}: RoomProps) => {
  const roomState = useRoom({ sortParticipants });
  if (!connectOptions) {
    connectOptions = {};
  }
  if (adaptiveVideo) {
    connectOptions.autoManageVideo = true;
  }

  useEffect(() => {
    roomState.connect(url, token, connectOptions).then((room) => {
      if (!room) {
        return;
      }
      if (onConnected) {
        onConnected(room);
      }
      return () => {
        room.disconnect();
      };
    });
  }, []);

  const selectedStageRenderer = stageRenderer ?? StageView;

  return selectedStageRenderer({
    roomState,
    participantRenderer,
    controlRenderer,
    onLeave,
    onClickParticipant,
    endLabel,
    stopShareLabel,
    shareScreenLabel,
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
  });
};
