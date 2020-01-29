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
import { useReducer, useEffect } from "react";
import { StoreContext, initialState, PlayerState, State } from "utils/context";
import { Track } from "utils/gqlTypes";
import { getGraphqlClient } from "utils/req";

const Container = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    dispatch({ type: "SET_GRAPHQL_CLIENT", value: getGraphqlClient() });
  }, []);

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
