import { createContext } from "react";
import { State } from "utils/reducer";
import { PlayerState } from "utils/reducer";

type Dispatchers = {
  playTrack: (trackId: string) => void;
  setPlayerState: (newState: PlayerState) => void;
  togglePlaying: () => void;
};

type Context = {
  state: State;
  dispatchers: Dispatchers;
};

export const initialState: State = {
  playerState: null
};

export const initialContextValue: Context = {
  state: initialState,
  dispatchers: {
    playTrack: _ => console.log("Not implemented"),
    setPlayerState: _ => console.log("Not implemented"),
    togglePlaying: () => console.log("Not implemented")
  }
};

export const StoreContext = createContext(initialContextValue);
