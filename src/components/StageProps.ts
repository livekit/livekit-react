import { RoomState } from "../useRoom";
import { ControlsProps } from "./ControlsView";
import { ParticipantProps } from "./ParticipantView";

export interface StageProps {
  roomState: RoomState;
  participantRenderer?: (props: ParticipantProps) => React.ReactElement | null;
  controlRenderer?: (props: ControlsProps) => React.ReactElement | null;
}
