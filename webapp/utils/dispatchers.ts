import {
  StoreContext,
  initialState,
  PlayerState,
  State,
  Dispatchers
} from "utils/context";
import { Track, Playback, Album } from "utils/gqlTypes";
import { Action } from "utils/reducer";
import { getPlayback } from "utils/req";

export const playTrack = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["playTrack"] => {
  return async (trackId: string) => {
    const playback = await getPlayback(trackId);
    dispatch({
      type: "SET_PLAYER_STATE",
      value: {
        playing: false,
        duration: 0,
        currentTime: 0,
        playback
      }
    });
  };
};

export const setPlayerState = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["setPlayerState"] => {
  return async (newState: PlayerState) => {
    dispatch({
      type: "SET_PLAYER_STATE",
      value: newState
    });
  };
};

export const togglePlaying = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["togglePlaying"] => {
  return async () => {
    if (state.playerState !== null) {
      dispatch({
        type: "SET_PLAYER_STATE",
        value: {
          ...state.playerState,
          playing: !state.playerState!.playing
        }
      });
    }
  };
};

export const enqueue = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["enqueue"] => {
  return async (track: Track) => {
    dispatch({
      type: "ENQUEUE",
      value: track
    });
  };
};

export const nextTrack = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["nextTrack"] => {
  return async () => {
    if (state.queue.length > 0) {
      const playback = await getPlayback(state.queue[0].id);
      dispatch({
        type: "DEQUEUE",
        value: playback
      });
      return;
    }
    if (state.currentList === null) {
      return;
    }
    switch (state.currentList.type) {
      case "ALBUM": {
        const playback = await getPlayback(
          state.currentList.album.tracks[state.currentList.nextIndex].id
        );
        dispatch({
          type: "NEXT_TRACK",
          value: playback
        });
      }
    }
  };
};

export const playAlbum = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["playAlbum"] => {
  return async (album: Album, currentIndex: number) => {
    const playback = await getPlayback(album.tracks[currentIndex].id);
    dispatch({
      type: "PLAY_ALBUM",
      playback,
      album,
      nextIndex: currentIndex + 1
    });
  };
};
