import { Participant, Room } from "livekit-client";
import { RoomState } from "../useRoom";
import { ControlsProps } from "./ControlsView";
import { ParticipantProps } from "./ParticipantView";

export interface StageProps {
  roomState: RoomState;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
  onLeave?: (room: Room) => void;
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
