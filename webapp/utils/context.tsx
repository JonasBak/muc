import { createContext } from "react";
import { Playback, Track } from "utils/gqlTypes";

export type PlayerState = {
  playing: boolean;
  duration: number;
  currentTime: number;
  playback: Playback;
};

export type State = {
  playerState: PlayerState | null;
  queue: Array<Track>;
};

type Dispatchers = {
  playTrack: (trackId: string) => void;
  setPlayerState: (newState: PlayerState) => void;
  togglePlaying: () => void;
  enqueue: (track: Track) => void;
};

type Context = {
  state: State;
  dispatchers: Dispatchers;
};

export const initialState: State = {
  playerState: null,
  queue: []
};

export const initialContextValue: Context = {
  state: initialState,
  dispatchers: {
    playTrack: _ => console.log("Not implemented"),
    setPlayerState: _ => console.log("Not implemented"),
    togglePlaying: () => console.log("Not implemented"),
    enqueue: _ => console.log("Not implemented")
  }
};

export const StoreContext = createContext(initialContextValue);
