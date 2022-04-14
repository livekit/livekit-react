import { Property } from "csstype";
import { Track } from "livekit-client";
import React, { CSSProperties, useCallback, useEffect, useRef } from "react";

export interface VideoRendererProps {
  track: Track;
  isLocal: boolean;
  objectFit?: Property.ObjectFit;
  className?: string;
  width?: Property.Width;
  height?: Property.Height;
  onSizeChanged?: (width: number, height: number) => void;
}

export const VideoRenderer = ({
  track,
  isLocal,
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
      el.addEventListener("resize", handleResize);
    }
    return () => {
      el?.removeEventListener("resize", handleResize);
    };
  }, [ref]);

  const isFrontFacing =
    track.mediaStreamTrack?.getSettings().facingMode !== "environment";
  const style: CSSProperties = {
    transform: isLocal && isFrontFacing ? "rotateY(180deg)" : "",
    width: width,
    height: height,
  };
  if (objectFit) {
    style.objectFit = objectFit;
  }

  return <video ref={ref} className={className} style={style} />;
};
