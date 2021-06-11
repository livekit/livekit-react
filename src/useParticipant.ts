import {
  LocalParticipant,
  Participant,
  ParticipantEvent,
  Track,
  TrackPublication
} from 'livekit-client'
import { useEffect, useState } from 'react'

export interface ParticipantState {
  isSpeaking: boolean
  isLocal: boolean
  isMuted: boolean
  metadata?: string
  publications: TrackPublication[]
  subscribedTracks: TrackPublication[]
}

export function useParticipant(participant: Participant): ParticipantState {
  const [isMuted, setMuted] = useState(false)
  const [isSpeaking, setSpeaking] = useState(false)
  const [metadata, setMetadata] = useState<string>()
  const [publications, setPublications] = useState<TrackPublication[]>([])
  const [subscribedTracks, setSubscribedTracks] = useState<TrackPublication[]>(
    []
  )

  useEffect(() => {
    const onMuted = (pub: TrackPublication) => {
      if (pub.kind === Track.Kind.Audio) {
        setMuted(true)
      }
    }
    const onUnmuted = (pub: TrackPublication) => {
      if (pub.kind === Track.Kind.Audio) {
        setMuted(false)
      }
    }
    const onMetadataChanged = () => {
      if (participant.metadata) {
        setMetadata(participant.metadata)
      }
    }
    const onIsSpeakingChanged = () => {
      setSpeaking(participant.isSpeaking)
    }
    const onPublicationsChanged = () => {
      setPublications(Array.from(participant.tracks.values()))
    }
    const onSubscriptionChanged = () => {
      setSubscribedTracks(
        Array.from(participant.tracks.values()).filter((pub) => {
          return pub.track !== undefined
        })
      )
    }

    // register listeners
    participant.on(ParticipantEvent.TrackMuted, onMuted)
    participant.on(ParticipantEvent.TrackUnmuted, onUnmuted)
    participant.on(ParticipantEvent.MetadataChanged, onMetadataChanged)
    participant.on(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
    participant.on(ParticipantEvent.TrackPublished, onPublicationsChanged)
    participant.on(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
    participant.on(ParticipantEvent.TrackSubscribed, onSubscriptionChanged)
    participant.on(ParticipantEvent.TrackUnsubscribed, onSubscriptionChanged)

    // set initial state
    onMetadataChanged()
    onIsSpeakingChanged()
    onPublicationsChanged()
    onSubscriptionChanged()
    participant.audioTracks.forEach((pub) => {
      setMuted(pub.isMuted)
    })

    return () => {
      // cleanup
      participant.off(ParticipantEvent.TrackMuted, onMuted)
      participant.off(ParticipantEvent.TrackUnmuted, onUnmuted)
      participant.off(ParticipantEvent.MetadataChanged, onMetadataChanged)
      participant.off(ParticipantEvent.IsSpeakingChanged, onIsSpeakingChanged)
      participant.off(ParticipantEvent.TrackPublished, onPublicationsChanged)
      participant.off(ParticipantEvent.TrackUnpublished, onPublicationsChanged)
      participant.off(ParticipantEvent.TrackSubscribed, onSubscriptionChanged)
      participant.off(ParticipantEvent.TrackUnsubscribed, onSubscriptionChanged)
    }
  }, [])

  return {
    isLocal: participant instanceof LocalParticipant,
    isSpeaking,
    isMuted,
    publications,
    subscribedTracks,
    metadata
  }
}
