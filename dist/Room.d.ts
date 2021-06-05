import * as React from 'react';
export interface RoomProps {
    url: string;
    token: string;
    roomRenderer?: (renderProps: RoomRendererProps) => React.ReactElement | null;
    participantRenderer?: (renderProps: ParticipantRendererProps) => React.ReactElement | null;
}
export interface RoomRendererProps {
    blah: string;
}
export interface ParticipantRendererProps {
    blah: string;
}
export declare const LiveKitRoom: (props: RoomProps) => JSX.Element;
