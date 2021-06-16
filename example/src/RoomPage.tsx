import { createLocalAudioTrack, createLocalVideoTrack, Room, TrackPublishOptions } from 'livekit-client'
import { LiveKitRoom } from 'livekit-react'
import React from "react"
import { useLocation } from 'react-router-dom'

export const RoomPage = () => {
  const query = new URLSearchParams(useLocation().search)
  const url = query.get('url')
  const token = query.get('token')

  if (!url || !token) {
    return (
      <div>
        url and token are required
      </div>
    )
  }

  return (
    <div className="roomContainer">
      <h2>LiveKit Video</h2>
      <LiveKitRoom url={url} token={token} onConnected={room => onConnected(room, query)}/>
    </div>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  if (query.get('audioEnabled') === '1') {
    const audioTrack = await createLocalAudioTrack()
    await room.localParticipant.publishTrack(audioTrack)
  }
  if (query.get('videoEnabled') === '1') {
    const options: TrackPublishOptions = {
      name: 'camera'
    }
    if (query.get('simulcast') === '1') {
      options.simulcast = true
    }
    const videoTrack = await createLocalVideoTrack();
    await room.localParticipant.publishTrack(videoTrack, options)
  }
}
