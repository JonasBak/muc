import { createContext } from "react";
import { Playback, Track, Album } from "utils/gqlTypes";

export type PlayerState = {
  playing: boolean;
  duration: number;
  currentTime: number;
  playback: Playback;
};

export type ListType = {
  type: "ALBUM";
  album: Album;
  currentIndex: number;
};

export type State = {
  playerState: PlayerState | null;
  queue: Array<Track>;
  currentList: ListType | null;
};

export type Dispatchers = {
  playTrack: (trackId: string) => void;
  setPlayerState: (newState: PlayerState) => void;
  togglePlaying: () => void;
  enqueue: (track: Track) => void;
  nextTrack: () => void;
  playAlbum: (album: Album, currentIndex: number) => void;
};

type Context = {
  state: State;
  dispatchers: Dispatchers;
};

export const initialState: State = {
  playerState: null,
  queue: [],
  currentList: null
};

export const initialContextValue: Context = {
  state: initialState,
  dispatchers: {
    playTrack: () => console.log("Not implemented"),
    setPlayerState: () => console.log("Not implemented"),
    togglePlaying: () => console.log("Not implemented"),
    enqueue: () => console.log("Not implemented"),
    nextTrack: () => console.log("Not implemented"),
    playAlbum: () => console.log("Not implemented")
  }
};

export const StoreContext = createContext(initialContextValue);
