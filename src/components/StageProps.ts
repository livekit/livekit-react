import { RoomState } from "../useRoom";
import { ParticipantProps } from "./ParticipantView";

export interface StageProps {
  roomState: RoomState;
  participantRenderer?: (
    renderProps: ParticipantProps
  ) => React.ReactElement | null;
}
