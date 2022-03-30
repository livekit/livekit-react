import { LocalParticipant, Participant } from "livekit-client";

/**
 * Default sort for participants, it'll order participants by:
 * 1. dominant speaker (speaker with the loudest audio level)
 * 2. local participant
 * 3. other speakers that are recently active
 * 4. participants with video on
 * 5. by joinedAt
 */
export function defaultSortParticipants(participants: Participant[]) {
  participants.sort((a, b) => {
    // loudest speaker first
    if (a.isSpeaking && b.isSpeaking) {
      return b.audioLevel - a.audioLevel;
    }

    // speaker goes first
    if (a.isSpeaking !== b.isSpeaking) {
      if (a.isSpeaking) {
        return -1;
      } else {
        return 1;
      }
    }

    // last active speaker first
    if (a.lastSpokeAt !== b.lastSpokeAt) {
      const aLast = a.lastSpokeAt?.getTime() ?? 0;
      const bLast = b.lastSpokeAt?.getTime() ?? 0;
      return bLast - aLast;
    }

    // video on
    const aVideo = a.videoTracks.size > 0;
    const bVideo = b.videoTracks.size > 0;
    if (aVideo !== bVideo) {
      if (aVideo) {
        return -1;
      } else {
        return 1;
      }
    }

    // joinedAt
    return (a.joinedAt?.getTime() ?? 0) - (b.joinedAt?.getTime() ?? 0);
  });
  const localParticipant = participants.find(
    (p) => p instanceof LocalParticipant
  );
  if (localParticipant) {
    const localIdx = participants.indexOf(localParticipant);
    if (localIdx >= 0) {
      participants.splice(localIdx, 1);
      if (participants.length > 0) {
        participants.splice(1, 0, localParticipant);
      } else {
        participants.push(localParticipant);
      }
    }
  }
}
