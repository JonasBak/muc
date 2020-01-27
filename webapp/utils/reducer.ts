import { Playback, Track, Album, Playlist } from "utils/gqlTypes";
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
      type: "DEQUEUE";
      value: Playback;
    }
  | {
      type: "NEXT_TRACK";
      value: Playback;
    }
  | {
      type: "PLAY_ALBUM";
      playback: Playback;
      album: Album;
      nextIndex: number;
    }
  | {
      type: "PLAY_PLAYLIST";
      playback: Playback;
      playlist: Playlist;
      nextIndex: number;
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
    case "DEQUEUE": {
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
    case "NEXT_TRACK": {
      let currentList = null;
      if (state.currentList === null) {
      } else if (state.currentList.type === "ALBUM") {
        currentList = {
          ...state.currentList,
          nextIndex:
            (state.currentList.nextIndex + 1) %
            state.currentList.album.tracks.length
        };
      }
      return {
        ...state,
        playerState: {
          playing: false,
          duration: 0,
          currentTime: 0,
          playback: action.value
        },
        currentList
      };
    }
    case "PLAY_ALBUM": {
      return {
        ...state,
        playerState: {
          playing: false,
          duration: 0,
          currentTime: 0,
          playback: action.playback
        },
        currentList: {
          type: "ALBUM",
          album: action.album,
          nextIndex: action.nextIndex
        }
      };
    }
    case "PLAY_PLAYLIST": {
      return {
        ...state,
        playerState: {
          playing: false,
          duration: 0,
          currentTime: 0,
          playback: action.playback
        },
        currentList: {
          type: "PLAYLIST",
          playlist: action.playlist,
          nextIndex: action.nextIndex
        }
      };
    }
    default: {
      return state;
    }
  }
};
