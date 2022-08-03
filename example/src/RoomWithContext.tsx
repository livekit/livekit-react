import { LiveVideo, useRoom } from '@livekit/react-components-context';
import { Participant } from 'livekit-client';
// import { Participant } from 'livekit-client';
import { useEffect } from 'react';

type RoomProps = {
  token: string;
  url: string;
};

export const RoomWithContext = ({ token, url }: RoomProps) => {
  const room = useRoom();
  useEffect(() => {
    room?.connect(url, token);
    console.log('connect to room');
  }, [room, token, url]);

  return (
    <div>
      {room?.participants ? (
        Array.from(room?.participants.values()).map((p: Participant) => (
          <LiveVideo identity={p.identity} key={p.identity} />
        ))
      ) : (
        <p>no participants</p>
      )}
    </div>
  );
};
