import { Participant, Track } from 'livekit-client'
import React from 'react'
import { AudioRenderer } from './AudioRenderer'
import styles from './styles.module.css'
import { useParticipant } from './useParticipant'
import { VideoRenderer } from './VideoRenderer'

export interface ParticipantProps {
  participant: Participant
}

export const ParticipantView = ({ participant }: ParticipantProps) => {
  const { isLocal, subscribedTracks } = useParticipant(participant)

  let audioTrack: Track | undefined
  let videoTrack: Track | undefined

  subscribedTracks.forEach((pub) => {
    if (pub.kind === Track.Kind.Audio && !audioTrack) {
      audioTrack = pub.track
    }
    if (pub.kind === Track.Kind.Video && !videoTrack) {
      videoTrack = pub.track
    }
  })

  return (
    <div className={styles.participant}>
      <div className={styles.participantName}>{participant.identity}</div>
      {audioTrack && <AudioRenderer track={audioTrack} isLocal={isLocal} />}
      {videoTrack && (
        <div style={{ width: 300, height: 180 }}>
          <VideoRenderer track={videoTrack} isLocal={isLocal} />
        </div>
      )}
    </div>
  )
}
