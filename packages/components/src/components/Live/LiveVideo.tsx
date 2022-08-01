import { Participant } from 'livekit-client';
import React, { CSSProperties } from 'react';
import { Property } from 'csstype';
import { ParticipantsState, useParticipantsStore } from './store';
import { VideoRenderer } from '@livekit/react-core';
import create from 'zustand';

export interface LiveVideoProps {
  participant: Participant;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
  style?: CSSProperties;
}

export const LiveVideo = ({ participant, className, width, height }: LiveVideoProps) => {
  // const ref = useRef<HTMLVideoElement>(null);
  const useStore = create(useParticipantsStore);
  const { cameraPublication, isLocal } = useStore(
    (state: ParticipantsState) => state[participant.identity],
  );
  return (
    <div>
      {cameraPublication?.isSubscribed &&
        cameraPublication?.track &&
        !cameraPublication?.isMuted && (
          <VideoRenderer
            track={cameraPublication.track}
            isLocal={isLocal}
            width={width}
            height={height}
            className={className}
          />
        )}
    </div>
  );
};
