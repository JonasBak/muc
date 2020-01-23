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
  nextIndex: number;
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
    playTrack: () => console.error("Not implemented"),
    setPlayerState: () => console.error("Not implemented"),
    togglePlaying: () => console.error("Not implemented"),
    enqueue: () => console.error("Not implemented"),
    nextTrack: () => console.error("Not implemented"),
    playAlbum: () => console.error("Not implemented")
  }
};

export const StoreContext = createContext(initialContextValue);
