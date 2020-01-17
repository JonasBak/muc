import { createContext } from "react";
import { State } from "utils/reducer";

type Dispatchers = {
  playTrack: (trackId: string) => void;
};

type Context = {
  state: State;
  dispatchers: Dispatchers;
};

export const initialState: State = {
  currentTrack: null
};

export const initialContextValue: Context = {
  state: initialState,
  dispatchers: {
    playTrack: _ => console.log("Not implemented")
  }
};

export const StoreContext = createContext(initialContextValue);
