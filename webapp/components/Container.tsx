import { reducer } from "utils/reducer";
import { getPlayback } from "utils/req";
import { useReducer } from "react";
import { StoreContext, initialState } from "utils/context";
import { PlayerState } from "utils/reducer";

const Container = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatchers: {
          playTrack: async (trackId: string) => {
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
          },
          setPlayerState: async (newState: PlayerState) => {
            dispatch({
              type: "SET_PLAYER_STATE",
              value: newState
            });
          },
          togglePlaying: async () => {
            dispatch({
              type: "SET_PLAYER_STATE",
              value: {
                ...state.playerState,
                playing: !state.playerState!.playing
              }
            });
          }
        }
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default Container;
