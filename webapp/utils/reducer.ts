import { Playback } from "utils/gqlTypes";

export type PlayerState = {
  playing: boolean;
  duration: number;
  currentTime: number;
  playback: Playback;
};

export type State = {
  playerState: PlayerState | null;
};

export const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "SET_PLAYER_STATE": {
      return {
        ...state,
        playerState: action.value
      };
    }
    default: {
      return state;
    }
  }
};
