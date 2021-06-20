import { faBolt } from '@fortawesome/free-solid-svg-icons'
import { createLocalVideoTrack, CreateVideoTrackOptions, LocalVideoTrack } from 'livekit-client'
import { AudioSelectButton, ControlButton, VideoRenderer, VideoSelectButton } from 'livekit-react'
import React, { ReactElement, useEffect, useRef, useState } from "react"
import AspectRatio from 'react-aspect-ratio'
import { useHistory } from 'react-router-dom'

export const PreJoinPage = () => {
  // state to pass onto room
  const [url, setUrl] = useState('ws://localhost:7880')
  const [token, setToken] = useState<string>('')
  const [simulcast, setSimulcast] = useState(true)
  const [videoEnabled, setVideoEnabled] = useState(false)
  const [audioEnabled, setAudioEnabled] = useState(true)
  // disable connect button unless validated
  const [connectDisabled, setConnectDisabled] = useState(true)
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoTrack, setVideoTrack] = useState<LocalVideoTrack>();
  const [audioDevice, setAudioDevice] = useState<MediaDeviceInfo>();
  const [videoDevice, setVideoDevice] = useState<MediaDeviceInfo>();
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
      const options: CreateVideoTrackOptions = {}
      if (videoDevice) {
        options.deviceId = videoDevice.deviceId
      }
      createLocalVideoTrack(options).then((track) => {
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

  const selectVideoDevice = (device: MediaDeviceInfo) => {
    setVideoDevice(device);
    if (videoTrack) {
      if (videoTrack.mediaStreamTrack.getSettings().deviceId === device.deviceId) {
        return
      }
      // stop video
      toggleVideo();
    }

    // start video with correct device
    toggleVideo();
  }

  const connectToRoom = () => {
    const params: {[key: string]: string} = {
      url,
      token,
      videoEnabled: videoEnabled ? '1' : '0',
      audioEnabled: audioEnabled ? '1' : '0',
      simulcast: simulcast ? '1' : '0',
    }
    if (audioDevice) {
      params.audioDeviceId = audioDevice.deviceId;
    }
    if (videoDevice) {
      params.videoDeviceId = videoDevice.deviceId;
    }
    history.push({
      pathname: '/room',
      search: "?" + new URLSearchParams(params).toString()
    })
  }

  let videoElement: ReactElement;
  if (videoTrack) {
    videoElement = <VideoRenderer track={videoTrack} isLocal={true} />;
  } else {
    videoElement = <div className="placeholder"/>
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
          <AspectRatio ratio={16 / 9}>
            {videoElement}
          </AspectRatio>
        </div>

        <div className="controlSection">
          <div>
            <AudioSelectButton
              isMuted={!audioEnabled}
              onClick={toggleAudio}
              onSourceSelected={setAudioDevice}
              />
            <VideoSelectButton
              isEnabled={videoTrack !== undefined}
              onClick={toggleVideo}
              onSourceSelected={selectVideoDevice}
            />
          </div>
          <div className="right">
            <ControlButton
              label="Connect"
              disabled={connectDisabled}
              icon={faBolt}
              onClick={connectToRoom}/>
          </div>
        </div>
      </main>
    </div>
  )
}
