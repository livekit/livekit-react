# Livekit React Core

Note: Currently this library isn't compatible with `React.StrictMode`. We are working on improvements in this area.

## Install

```bash
npm install --save @livekit/react-core livekit-client
```

## Using hooks

The provided components make use of two hooks: `useRoom` and `useParticipant`, they will help you manage internal LiveKit callbacks and map them into state variables that are ready-to-use from React components.

Using the `connect` function returned by useRoom will ensure that callbacks are registered automatically and the other state variables are updated when changes take place in the room.

```tsx
import { useRoom, useParticipant } from '@livekit/react-core'

export const MyComponent = () => {
  const roomOptions: RoomOptions = {
    adaptiveStream: true,
    dynacast: true,
  }
  const { connect, isConnecting, room, error, participants, audioTracks } = useRoom(roomOptions);

  async function init() {
    // initiate connection to the livekit room
    await connect(livekitUrl, livekitToken);
    // request camera and microphone permissions and publish tracks
    await room.localParticipant.enableCameraAndMicrophone();
    ...
  }

  useEffect(() => {
    init().catch(console.error)
  }, [])

  return (...)
}

export const ParticipantRenderer = ({ participant }) => {
  const { isSpeaking, subscribedTracks } = useParticipant(participant)
  ...
}
```

### Rendering video and audio

When building your custom UI, it's helpful to use track renderers that are provided in this library. `AudioRenderer` and `VideoRenderer` would render an audio and video track, respectively.
