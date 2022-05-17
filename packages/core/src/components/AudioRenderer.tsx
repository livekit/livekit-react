import { Track } from 'livekit-client';
import { useEffect, useRef } from 'react';

export interface AudioTrackProps {
  track: Track;
  isLocal: boolean;
}

export const AudioRenderer = ({ track, isLocal }: AudioTrackProps) => {
  const audioEl = useRef<HTMLAudioElement>();

  useEffect(() => {
    if (isLocal) {
      // don't play own audio
      return;
    }
    audioEl.current = track.attach();
    if (track.sid) {
      audioEl.current.setAttribute('data-audio-track-id', track.sid);
    }
    return () => track.detach().forEach((el) => el.remove());
  }, [track, isLocal]);

  // TODO: allow set sink id
  return null;
};
