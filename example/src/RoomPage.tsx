import { CreateAudioTrackOptions, createLocalAudioTrack, createLocalVideoTrack, CreateVideoTrackOptions, Room, TrackPublishOptions } from 'livekit-client'
import { LiveKitRoom } from 'livekit-react'
import React from "react"
import { useHistory, useLocation } from 'react-router-dom'

export const RoomPage = () => {
  const history = useHistory()
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

  const onLeave = () => {
    history.push({
      pathname: '/',
    })
  }

  return (
    <div className="roomContainer">
      <h2>LiveKit Video</h2>
      <LiveKitRoom url={url} token={token} onConnected={room => onConnected(room, query)} onLeave={onLeave}/>
    </div>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  if (isSet(query, 'audioEnabled')) {
    const options: CreateAudioTrackOptions = {}
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId) {
      options.deviceId = audioDeviceId;
    }
    const audioTrack = await createLocalAudioTrack(options)
    await room.localParticipant.publishTrack(audioTrack)
  }
  if (isSet(query, 'videoEnabled')) {
    const videoDeviceId = query.get('videoDeviceId');
    const captureOptions: CreateVideoTrackOptions = {}
    if (videoDeviceId) {
      captureOptions.deviceId = videoDeviceId;
    }
    const videoTrack = await createLocalVideoTrack(captureOptions);
    const publishOptions: TrackPublishOptions = {
      name: 'camera'
    }
    if (isSet(query, 'simulcast')) {
      publishOptions.simulcast = true
    }
    await room.localParticipant.publishTrack(videoTrack, publishOptions)
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true'
}