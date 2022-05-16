import React from 'react';

export interface DisplayOptions {
  stageLayout?: string;
  /** display debugging stats */
  showStats?: boolean;
}

export const DisplayContext = React.createContext<DisplayOptions>({
  stageLayout: 'grid',
  showStats: false,
});
