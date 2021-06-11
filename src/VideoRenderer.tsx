import { Track } from 'livekit-client'
import React, { useEffect, useRef } from 'react'

export interface VideoRendererProps {
  track: Track
  isLocal: boolean
  className?: string
}

export const VideoRenderer = ({
  track,
  isLocal,
  className
}: VideoRendererProps) => {
  const ref = useRef<HTMLVideoElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) {
      return
    }
    el.muted = true
    track.attach(el)
    return () => {
      track.detach(el)
    }
  }, [track])

  const isFrontFacing =
    track.mediaStreamTrack?.getSettings().facingMode !== 'environment'
  const style = {
    width: '100%',
    height: '100%',
    transform: isLocal && isFrontFacing ? 'rotateY(180deg)' : ''
  }
  // TODO: could use react native RCTVideoView

  return <video ref={ref} className={className} style={style} />
}
