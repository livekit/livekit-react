# React components for LiveKit

This package provides React components that makes working with LiveKit easier.

## Install

```bash
npm install --save livekit-react
```

## Usage

### Video room with built-in UI

`LiveKitRoom`

### Customize rendering

### Rendering video and audio

### Using hooks

The provided components make use of two hooks: `useRoom` and `useParticipant`, they will help you manage internal LiveKit callbacks and map them into state variables that are ready-to-use from React components

```tsx
import React, { Component } from 'react'

import MyComponent from 'livekit-react'
import 'livekit-react/dist/index.css'

class Example extends Component {
  render() {
    return <MyComponent />
  }
}
```
