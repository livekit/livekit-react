import '@livekit/react-components/dist/index.css';
import { StrictMode } from 'react';
import { HashRouter as Router, Route, Routes } from 'react-router-dom';
import { PreJoinPage } from './PreJoinPage';
import { RoomPage } from './RoomPage';

const App = () => {
  return (
    <div className="container">
      <StrictMode>
        <Router>
          <Routes>
            <Route path="/room" element={<RoomPage />} />
            <Route path="/" element={<PreJoinPage />} />
          </Routes>
        </Router>
      </StrictMode>
    </div>
  );
};

export default App;
