import {
  connect,
  ConnectOptions,
  Participant,
  Room,
  RoomEvent
} from 'livekit-client'
import { useCallback, useState } from 'react'

export interface RoomState {
  connect: (
    url: string,
    token: string,
    options?: ConnectOptions
  ) => Promise<Room | undefined>
  isConnecting: boolean
  room?: Room
  participants: Participant[]
  error?: Error
}

export function useRoom(): RoomState {
  const [room, setRoom] = useState<Room>()
  const [isConnecting, setIsConnecting] = useState(false)
  const [error, setError] = useState<Error>()
  const [participants, setParticipants] = useState<Participant[]>([])

  const connectFn = useCallback(
    async (url: string, token: string, options?: ConnectOptions) => {
      setIsConnecting(true)
      try {
        const newRoom = await connect(url, token, options)
        setRoom(newRoom)
        const disconnect = () => newRoom.disconnect()
        const onParticipantsChanged = () => {
          const remotes = Array.from(newRoom.participants.values())
          const participants: Participant[] = [newRoom.localParticipant]
          participants.push(...remotes)
          setParticipants(participants)
        }

        newRoom.once(RoomEvent.Disconnected, () => {
          setTimeout(() => setRoom(undefined))
          window.removeEventListener('beforeunload', disconnect)

          newRoom.off(RoomEvent.ParticipantConnected, onParticipantsChanged)
          newRoom.off(RoomEvent.ParticipantDisconnected, onParticipantsChanged)
        })
        newRoom.on(RoomEvent.ParticipantConnected, onParticipantsChanged)
        newRoom.on(RoomEvent.ParticipantDisconnected, onParticipantsChanged)

        setIsConnecting(false)
        onParticipantsChanged()

        window.addEventListener('beforeunload', disconnect)

        return newRoom
      } catch (error) {
        setIsConnecting(false)
        setError(error)

        return undefined
      }
    },
    []
  )

  return {
    connect: connectFn,
    isConnecting,
    room,
    error,
    participants
  }
}
