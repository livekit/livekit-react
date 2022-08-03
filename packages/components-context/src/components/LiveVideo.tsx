import React, { CSSProperties } from 'react';
import { Property } from 'csstype';
import { VideoRenderer } from '@livekit/react-core';
import { useParticipant } from '../context/RoomProvider';

export interface LiveVideoProps {
  identity: string;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
  style?: CSSProperties;
}

export const LiveVideo = ({ identity, className, width, height }: LiveVideoProps) => {
  // const ref = useRef<HTMLVideoElement>(null);
  const participant = useParticipant(identity);

  return (
    <div>
      <p>Participant {identity}</p>
      {participant?.cameraPublication?.isSubscribed &&
        participant?.cameraPublication?.track &&
        !participant?.cameraPublication?.isMuted && (
          <VideoRenderer
            track={participant?.cameraPublication.track}
            isLocal={participant?.isLocal}
            width={width}
            height={height}
            className={className}
          />
        )}
    </div>
  );
};
