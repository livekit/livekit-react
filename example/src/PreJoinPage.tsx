import { createLocalVideoTrack, LocalVideoTrack } from 'livekit-client'
import { ControlButton, VideoRenderer } from 'livekit-react'
import React, { useEffect, useRef, useState } from "react"
import { useHistory } from 'react-router-dom'

export const PreJoinPage = () => {
  // state to pass onto room
  const [url, setUrl] = useState('ws://localhost:7880')
  const [token, setToken] = useState<string>('')
  const [simulcast, setSimulcast] = useState(false)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(false)
  // disable connect button unless validated
  const [connectDisabled, setConnectDisabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const history = useHistory()

  useEffect(() => {
    if (!videoRef.current || !videoTrack) {
      return
    }
    const videoEl = videoRef.current;
    videoTrack.attach(videoEl)
    return () => {
      videoTrack.detach(videoEl)
      videoTrack.stop()
    }
  }, [videoTrack, videoRef])

  useEffect(() => {
    if (token && url) {
      setConnectDisabled(false)
    } else {
      setConnectDisabled(true)
    }
  }, [token, url])

  const toggleVideo = () => {
    if (videoTrack) {
      videoTrack.stop()
      setVideoEnabled(false)
      setVideoTrack(undefined)
    } else {
      createLocalVideoTrack().then((track) => {
        setVideoEnabled(true)
        setVideoTrack(track)
      })
    }
  }

  useEffect(() => {
    // enable video by default
    createLocalVideoTrack().then((track) => {
      setVideoEnabled(true)
      setVideoTrack(track)
    })
  }, [])

  const toggleAudio = () => {
    if (audioEnabled) {
      setAudioEnabled(false)
    } else {
      setAudioEnabled(true)
    }
  }

  const connectToRoom = () => {
    const params: {[key: string]: string} = {
      url,
      token,
      videoEnabled: videoEnabled ? '1' : '0',
      audioEnabled: audioEnabled ? '1' : '0',
      simulcast: simulcast ? '1' : '0',
    }
    history.push({
      pathname: '/room',
      search: "?" + new URLSearchParams(params).toString()
    })
  }

  return (
    <div className="prejoin">
      <main>
        <h2>LiveKit Video</h2>
        <hr/>
        <div className="entrySection">
          <div>
            <div className="label">
              LiveKit URL
            </div>
            <div>
              <input type="text" name="url" value={url} onChange={e => setUrl(e.target.value)} />
            </div>
          </div>
          <div>
            <div className="label">
              Token
            </div>
            <div>
              <input type="text" name="token" value={token} onChange={e => setToken(e.target.value)} />
            </div>
          </div>
          <div>
            <input type="checkbox" name="simulcast" checked={simulcast} onChange={e => setSimulcast(e.target.checked)}/>
            <label>Simulcast</label>
          </div>
        </div>

        <div className="videoSection">
          {videoTrack && <VideoRenderer track={videoTrack} isLocal={true} />}
        </div>

        <div className="controlSection">
          <div>
            <ControlButton label={audioEnabled ? 'Mute' : 'Unmute'} onClick={toggleAudio}/>
            <ControlButton label={videoTrack ? 'Disable Video' : 'Enable Video'} onClick={toggleVideo}/>
          </div>
          <div className="right">
            <ControlButton label="Connect" disabled={connectDisabled} onClick={connectToRoom}/>
          </div>
        </div>
      </main>
    </div>
  )
}
