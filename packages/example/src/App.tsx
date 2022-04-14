import '@livekit/react-core/dist/index.css'
import { HashRouter as Router, Route, Switch } from 'react-router-dom'
import { PreJoinPage } from './PreJoinPage'
import { RoomPage } from './RoomPage'

const App = () => {
  return (
    <div className="container">
      <Router>
        <Switch>
          <Route path="/room">
            <RoomPage/>
          </Route>
          <Route path="/">
            <PreJoinPage/>
          </Route>
        </Switch>
      </Router>
    </div>
  )
}

export default App
