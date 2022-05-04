# LiveKit React Component Library

This package provides React components that makes it easier to use LiveKit in a React app.

## Install

```bash
npm install --save livekit-react
```

## Demo

https://example.livekit.io.

Source available in [example](example/)

## Usage

Note: Currently this library isn't compatible with `React.StrictMode`. We are working on improvements in this area.

### Video room with built-in UI

Without customization, the component would use a default skin as seen in the demo above.

```tsx
import { LiveKitRoom } from 'livekit-react'
// CSS should be explicitly imported if using the default UI
import 'livekit-react/dist/index.css'
// used by the default ParticipantView to maintain video aspect ratio.
// this CSS must be imported globally
// if you are using a custom Participant renderer, this import isn't necessary.
import "react-aspect-ratio/aspect-ratio.css";

export const RoomPage = () => {
  const url = 'wss://your_host'
  const token = 'your_token'
  return (
    <div className="roomContainer">
      <LiveKitRoom url={url} token={token} onConnected={room => onConnected(room)}/>
    </div>
  )
}

async function onConnected(room) {
  await room.localParticipant.setCameraEnabled(true)
  await room.localParticipant.setMicrophoneEnabled(true)
}
```

### Customize rendering

To provide your own rendering, override one or more of `stageRenderer`, `participantRenderer`, and `controlRenderer`. It's possible customize a single renderer and use defaults for the others.

```tsx
export const RoomPage = () => {
  const url = 'wss://your_host'
  const token = 'your_token'
  return (
    <LiveKitRoom url={url} token={token}
      // stageRenderer renders the entire stage
      stageRenderer={(props: StageProps) => { return <div/> }}
      // participantRenderer renders a single participant
      participantRenderer={(props: ParticipantProps) => { return <div/> }}
      // controlRenderer renders the control bar
      controlRenderer={(props: ControlsProps) => { return <div/> }}
    />
  )
}
```

### Using custom hooks

The provided components make use of two hooks: `useRoom` and `useParticipant`, they will help you manage internal LiveKit callbacks and map them into state variables that are ready-to-use from React components.

Using the `connect` function returned by useRoom will ensure that callbacks are registered automatically and the other state variables are updated when changes take place in the room.

```tsx
import { useRoom, useParticipant } from 'livekit-react'

export const MyComponent = () => {
  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
  }
  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);
  // initiate connection to the livekit room
  await connect(livekitUrl, livekitToken);
  // request camera and microphone permissions and publish tracks
  room.localParticipant.enableCameraAndMicrophone();
  ...
}

export const ParticipantRenderer = ({ participant }) => {
  const { isSpeaking, subscribedTracks } = useParticipant(participant)
  ...
}
```

### Rendering video and audio

When building your custom UI, it's helpful to use track renderers that are provided in this library. `AudioRenderer` and `VideoRenderer` would render an audio and video track, respectively.
