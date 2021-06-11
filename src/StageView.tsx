import React from 'react'
import { ParticipantProps, ParticipantView } from './ParticipantView'
import { RoomState } from './useRoom'

export interface StageProps {
  roomState: RoomState
  participantRenderer?: (
    renderProps: ParticipantProps
  ) => React.ReactElement | null
}

export const StageView = ({ roomState, participantRenderer }: StageProps) => {
  if (roomState.isConnecting) {
    return <div>connecting</div>
  }
  if (roomState.error) {
    return <div>error {roomState.error}</div>
  }

  const ParticipantRenderer = participantRenderer ?? ParticipantView
  return (
    // global container
    <div>
      {roomState.participants.map((participant) => {
        return (
          <ParticipantRenderer
            key={participant.identity}
            participant={participant}
          />
        )
      })}
    </div>
  )
}
