import { Property } from 'csstype';
import { Track } from 'livekit-client';
import React, { CSSProperties, useCallback, useEffect, useRef } from 'react';

export interface VideoRendererProps {
  track: Track;
  isLocal: boolean;
  /**
   * Mirror the video on the y axis.
   * Is `true` by default for local, front-facing (and undetermined facing) media tracks,
   * unless overriden by this setting */
  isMirrored?: boolean;
  objectFit?: Property.ObjectFit;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
  onSizeChanged?: (width: number, height: number) => void;
}

export const VideoRenderer = ({
  track,
  isLocal,
  isMirrored,
  objectFit,
  className,
  onSizeChanged,
  width,
  height,
}: VideoRendererProps) => {
  const ref = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) {
      return;
    }
    el.muted = true;
    track.attach(el);
    return () => {
      track.detach(el);
    };
  }, [track, ref]);

  const handleResize = useCallback((ev: UIEvent) => {
    if (ev.target instanceof HTMLVideoElement) {
      if (onSizeChanged) {
        onSizeChanged(ev.target.videoWidth, ev.target.videoHeight);
      }
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    if (el) {
      el.addEventListener('resize', handleResize);
    }
    return () => {
      el?.removeEventListener('resize', handleResize);
    };
  }, [ref]);

  const style: CSSProperties = {
    width: width,
    height: height,
  };

  const isFrontFacingOrUnknown = track.mediaStreamTrack?.getSettings().facingMode !== 'environment';
  if (isMirrored || (isMirrored === undefined && isLocal && isFrontFacingOrUnknown)) {
    style.transform = 'rotateY(180deg)';
  }

  if (objectFit) {
    style.objectFit = objectFit;
  }

  return <video ref={ref} className={className} style={style} />;
};
