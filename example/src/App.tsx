import { LiveKitRoom } from 'livekit-react'
import 'livekit-react/dist/index.css'
import React from 'react'

const url = 'ws://localhost:7880'
const token = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE2MjQzNDIwNDgsImlzcyI6IkFQSXU5SmpLdFpubXRLQmtjcXNFOUJuZkgiLCJqdGkiOiJkeiIsIm5iZiI6MTYyMTc1MDA0OCwidmlkZW8iOnsicm9vbSI6Im15cm9vbSIsInJvb21Kb2luIjp0cnVlfX0.7KDM_U-RvW3FwMylXL3n076duSe0O5GMIU1QMCObWCY'

const App = () => {
  return <LiveKitRoom
    url={url} token={token}/>
}

export default App
