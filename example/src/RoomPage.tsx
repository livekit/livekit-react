import { faSquare, faThLarge, faUserFriends } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { DisplayContext, DisplayOptions } from '@livekit/react-components';
import { RoomProvider } from '@livekit/react-components-context';

import { useState } from 'react';
import 'react-aspect-ratio/aspect-ratio.css';
import { useLocation } from 'react-router-dom';
import { RoomWithContext } from './RoomWithContext';

export const RoomPage = () => {
  const [displayOptions, setDisplayOptions] = useState<DisplayOptions>({
    stageLayout: 'grid',
    showStats: false,
  });
  const query = new URLSearchParams(useLocation().search);
  const url = query.get('url');
  const token = query.get('token');
  console.log('rendering room page');
  if (!url || !token) {
    return <div>url and token are required</div>;
  }

  const updateOptions = (options: DisplayOptions) => {
    setDisplayOptions({
      ...displayOptions,
      ...options,
    });
  };

  return (
    <DisplayContext.Provider value={displayOptions}>
      <RoomProvider>
        <div className="roomContainer">
          <div className="topBar">
            <h2>LiveKit Video</h2>
            <div className="right">
              <div>
                <input
                  id="showStats"
                  type="checkbox"
                  onChange={(e) => updateOptions({ showStats: e.target.checked })}
                />
                <label htmlFor="showStats">Show Stats</label>
              </div>
              <div>
                <button
                  className="iconButton"
                  disabled={displayOptions.stageLayout === 'grid'}
                  onClick={() => {
                    updateOptions({ stageLayout: 'grid' });
                  }}
                >
                  <FontAwesomeIcon height={32} icon={faThLarge} />
                </button>
                <button
                  className="iconButton"
                  disabled={displayOptions.stageLayout === 'speaker'}
                  onClick={() => {
                    updateOptions({ stageLayout: 'speaker' });
                  }}
                >
                  <FontAwesomeIcon height={32} icon={faSquare} />
                </button>
              </div>
              <div className="participantCount">
                <FontAwesomeIcon icon={faUserFriends} />
              </div>
              <RoomWithContext url={url} token={token} />
            </div>
          </div>
        </div>
      </RoomProvider>
    </DisplayContext.Provider>
  );
};
