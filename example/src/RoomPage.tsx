import { faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { createLocalTracks, CreateLocalTracksOptions, Room, RoomEvent, Track, TrackPublishOptions } from 'livekit-client'
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
        onLeave={onLeave}
        adaptiveVideo={true}
      />
    </div>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  createLocalTracks();
  const opts: CreateLocalTracksOptions = {};

  if (isSet(query, 'audioEnabled')) {
    opts.audio = {}
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId) {
      opts.audio.deviceId = audioDeviceId;
    }
  }

  if (isSet(query, 'videoEnabled')) {
    opts.video = {
      name: 'camera',
    }
    const videoDeviceId = query.get('videoDeviceId');
    if (videoDeviceId) {
      opts.video.deviceId = videoDeviceId;
    }
  }
  const tracks = await createLocalTracks(opts);
  tracks.forEach((track) => {
    const publishOptions: TrackPublishOptions = {};
    if (isSet(query, 'simulcast') && track.kind === Track.Kind.Video) {
      publishOptions.simulcast = true;
    }
    room.localParticipant.publishTrack(track, publishOptions);
  });
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true';
}
