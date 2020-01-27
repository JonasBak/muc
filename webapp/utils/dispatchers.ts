import {
  StoreContext,
  initialState,
  PlayerState,
  State,
  Dispatchers
} from "utils/context";
import { getAuthCookie } from "utils/auth";
import { Track, Playback, Album, Playlist } from "utils/gqlTypes";
import { Action } from "utils/reducer";
import { getPlayback } from "utils/req";

export const playTrack = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["playTrack"] => {
  return async (trackId: string) => {
    const auth = getAuthCookie();
    const playbackResult = await getPlayback(auth, trackId);
    if (playbackResult.type == "SUCCESS") {
      dispatch({
        type: "SET_PLAYER_STATE",
        value: {
          playing: false,
          duration: 0,
          currentTime: 0,
          playback: playbackResult.data
        }
      });
    } else {
      console.error(playbackResult.data);
    }
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
    const auth = getAuthCookie();
    if (state.queue.length > 0) {
      const playbackResult = await getPlayback(auth, state.queue[0].id);
      if (playbackResult.type == "SUCCESS") {
        dispatch({
          type: "DEQUEUE",
          value: playbackResult.data
        });
      } else {
        console.error(playbackResult.data);
      }
      return;
    }
    if (state.currentList === null) {
      return;
    }
    switch (state.currentList.type) {
      case "ALBUM": {
        const playbackResult = await getPlayback(
          auth,
          state.currentList.album.tracks[state.currentList.nextIndex].id
        );
        if (playbackResult.type == "SUCCESS") {
          dispatch({
            type: "NEXT_TRACK",
            value: playbackResult.data
          });
        } else {
          console.error(playbackResult.data);
        }
        break;
      }
      case "PLAYLIST": {
        const playbackResult = await getPlayback(
          auth,
          state.currentList.playlist.tracks[state.currentList.nextIndex].id
        );
        if (playbackResult.type == "SUCCESS") {
          dispatch({
            type: "NEXT_TRACK",
            value: playbackResult.data
          });
        } else {
          console.error(playbackResult.data);
        }
        break;
      }
    }
  };
};

export const playAlbum = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["playAlbum"] => {
  return async (album: Album, currentIndex: number) => {
    const auth = getAuthCookie();
    const playbackResult = await getPlayback(
      auth,
      album.tracks[currentIndex].id
    );
    if (playbackResult.type == "SUCCESS") {
      dispatch({
        type: "PLAY_ALBUM",
        playback: playbackResult.data,
        album,
        nextIndex: currentIndex + 1
      });
    } else {
      console.error(playbackResult.data);
    }
  };
};

export const playPlaylist = (
  state: State,
  dispatch: (action: Action) => void
): Dispatchers["playPlaylist"] => {
  return async (playlist: Playlist, currentIndex: number) => {
    const auth = getAuthCookie();
    const playbackResult = await getPlayback(
      auth,
      playlist.tracks[currentIndex].id
    );
    if (playbackResult.type == "SUCCESS") {
      dispatch({
        type: "PLAY_PLAYLIST",
        playback: playbackResult.data,
        playlist,
        nextIndex: currentIndex + 1
      });
    } else {
      console.error(playbackResult.data);
    }
  };
};
