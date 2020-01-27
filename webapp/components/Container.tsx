import { reducer } from "utils/reducer";
import {
  playTrack,
  setPlayerState,
  togglePlaying,
  enqueue,
  nextTrack,
  playAlbum,
  playPlaylist
} from "utils/dispatchers";
import { getPlayback } from "utils/req";
import { useReducer } from "react";
import { StoreContext, initialState, PlayerState, State } from "utils/context";
import { Track } from "utils/gqlTypes";

const Container = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatchers: {
          playTrack: playTrack(state, dispatch),
          setPlayerState: setPlayerState(state, dispatch),
          togglePlaying: togglePlaying(state, dispatch),
          enqueue: enqueue(state, dispatch),
          nextTrack: nextTrack(state, dispatch),
          playAlbum: playAlbum(state, dispatch),
          playPlaylist: playPlaylist(state, dispatch)
        }
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default Container;
