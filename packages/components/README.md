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
