import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { ConnectOptions, LogLevel, Room, RoomEvent } from 'livekit-client'
import { LiveKitRoom } from 'livekit-react'
import React, { useState } from "react"
import "react-aspect-ratio/aspect-ratio.css"
import { useHistory, useLocation } from 'react-router-dom'

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0)
  const history = useHistory()
  const query = new URLSearchParams(useLocation().search)
  const url = query.get('url')
  const token = query.get('token')
  const recorder = query.get('recorder')

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

  const updateParticipantSize = (room: Room) => {
    setNumParticipants(room.participants.size + 1);
  }

  const onParticipantDisconnected = (room: Room) => {
    updateParticipantSize(room)

    /* Special rule for recorder */
    if (recorder && parseInt(recorder, 10) === 1 && room.participants.size === 0) {
      console.log("END_RECORDING")
    }
  }

  return (
    <div className="roomContainer">
      <div className="topBar">
        <h2>LiveKit Video</h2>
        <div className="participantCount">
          <FontAwesomeIcon icon={faUserFriends} />
          <span>{numParticipants}</span>
        </div>
      </div>
      <LiveKitRoom
        url={url}
        token={token}
        onConnected={room => {
          onConnected(room, query);
          room.on(RoomEvent.ParticipantConnected, () => updateParticipantSize(room))
          room.on(RoomEvent.ParticipantDisconnected, () => onParticipantDisconnected(room))
          updateParticipantSize(room);
        }}
        connectOptions={{
          autoManageVideo: true,
          logLevel: LogLevel.debug,
        }}
        onLeave={onLeave}
      />
    </div>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  const opts: ConnectOptions = {};

  if (isSet(query, 'simulcast')) {
    room.defaultPublishOptions.simulcast = true;
  }

  if (isSet(query, 'audioEnabled')) {
    opts.audio = true
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId) {
      room.defaultCaptureOptions.audioDeviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, 'videoEnabled')) {
    opts.video = true
    const videoDeviceId = query.get('videoDeviceId');
    if (videoDeviceId) {
      room.defaultCaptureOptions.videoDeviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true';
}
