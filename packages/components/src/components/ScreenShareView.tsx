import { Property } from 'csstype';
import { Track } from 'livekit-client';
import { VideoRenderer } from '@livekit/react-core';

import React from 'react';
import styles from './styles.module.css';

interface ScreenShareProps {
  track: Track;
  width?: Property.Width;
  height?: Property.Height;
}

export const ScreenShareView = ({ track, width, height }: ScreenShareProps) => {
  return (
    <div className={styles.screenShare}>
      <VideoRenderer
        track={track}
        isLocal={false}
        width={width}
        height={height}
        className={styles.video}
      />
    </div>
  );
};
