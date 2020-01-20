import { Playback, Track } from "utils/gqlTypes";
import { State, PlayerState } from "utils/context";

export type Action =
  | {
      type: "SET_PLAYER_STATE";
      value: PlayerState;
    }
  | {
      type: "ENQUEUE";
      value: Track;
    };

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case "SET_PLAYER_STATE": {
      return {
        ...state,
        playerState: action.value
      };
    }
    case "ENQUEUE": {
      return {
        ...state,
        queue: [...state.queue, action.value]
      };
    }
    default: {
      return state;
    }
  }
};
