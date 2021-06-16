import { Property } from "csstype";
import { Track } from "livekit-client";
import React, { useEffect, useRef } from "react";
import styles from "./styles.module.css";

export interface VideoRendererProps {
  track: Track;
  isLocal: boolean;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
}

export const VideoRenderer = ({
  track,
  isLocal,
  className,
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
  }, [track]);

  const isFrontFacing =
    track.mediaStreamTrack?.getSettings().facingMode !== "environment";
  const style = {
    transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
    width: width,
    height: height,
  };

  // TODO: could use react native RCTVideoView

  return (
    <video ref={ref} className={className ?? styles.video} style={style} />
  );
};
