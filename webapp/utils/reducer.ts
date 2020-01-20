import { Playback, Track } from "utils/gqlTypes";
import { State, PlayerState, initialState } from "utils/context";

export type Action =
  | {
      type: "SET_PLAYER_STATE";
      value: PlayerState;
    }
  | {
      type: "ENQUEUE";
      value: Track;
    }
  | {
      type: "NEXT_TRACK";
      value: Playback;
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
    case "NEXT_TRACK": {
      return {
        ...state,
        playerState: {
          playing: false,
          duration: 0,
          currentTime: 0,
          playback: action.value
        },
        queue: state.queue.slice(1)
      };
    }
    default: {
      return state;
    }
  }
};
