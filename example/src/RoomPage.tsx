import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { Room, RoomEvent, VideoPresets } from 'livekit-client'
import { DisplayContext, DisplayOptions, LiveKitRoom } from 'livekit-react'
import React, { useState } from "react"
import "react-aspect-ratio/aspect-ratio.css"
import { useHistory, useLocation } from 'react-router-dom'

export const RoomPage = () => {
  const [numParticipants, setNumParticipants] = useState(0)
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  })
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

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  }

  return (
    <DisplayContext.Provider value={displayOptions}>
      <div className="roomContainer">
        <div className="topBar">
          <h2>LiveKit Video</h2>
          <div className="right">
            <div>
              <input id="showStats" type="checkbox" onChange={(e) => updateOptions({ showStats: e.target.checked })} />
              <label htmlFor="showStats">Show Stats</label>
            </div>
            <div>
              <button
                className="iconButton"
                disabled={displayOptions.stageLayout === 'grid'}
                onClick={() => {
                  updateOptions({ stageLayout: 'grid' })
                }}
              >
                <FontAwesomeIcon height={32} icon={faThLarge} />
              </button>
              <button
                className="iconButton"
                disabled={displayOptions.stageLayout === 'speaker'}
                onClick={() => {
                  updateOptions({ stageLayout: 'speaker' })
                }}
              >
                <FontAwesomeIcon height={32} icon={faSquare} />
              </button>
            </div>
            <div className="participantCount">
              <FontAwesomeIcon icon={faUserFriends} />
              <span>{numParticipants}</span>
            </div>
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
            adaptiveStream: isSet(query, 'adaptiveStream'),
            dynacast: isSet(query, 'dynacast'),
            videoCaptureDefaults: {
              resolution: VideoPresets.hd.resolution,
            },
            publishDefaults: {
              videoEncoding: VideoPresets.hd.encoding,
              simulcast: isSet(query, 'simulcast'),
            },
            logLevel: 'debug',
          }}
          onLeave={onLeave}
        />
      </div>
    </DisplayContext.Provider>
  )
}

async function onConnected(room: Room, query: URLSearchParams) {
  // make it easier to debug
  (window as any).currentRoom = room;

  if (isSet(query, 'audioEnabled')) {
    const audioDeviceId = query.get('audioDeviceId');
    if (audioDeviceId && room.options.audioCaptureDefaults) {
      room.options.audioCaptureDefaults.deviceId = audioDeviceId;
    }
    await room.localParticipant.setMicrophoneEnabled(true);
  }

  if (isSet(query, 'videoEnabled')) {
    const videoDeviceId = query.get('videoDeviceId');
    if (videoDeviceId && room.options.videoCaptureDefaults) {
      room.options.videoCaptureDefaults.deviceId = videoDeviceId;
    }
    await room.localParticipant.setCameraEnabled(true);
  }
}

function isSet(query: URLSearchParams, key: string): boolean {
  return query.get(key) === '1' || query.get(key) === 'true';
}
