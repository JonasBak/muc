import { reducer } from "utils/reducer";
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
            if (state.playerState !== null) {
              dispatch({
                type: "SET_PLAYER_STATE",
                value: {
                  ...state.playerState,
                  playing: !state.playerState!.playing
                }
              });
            }
          },
          enqueue: async (track: Track) => {
            dispatch({
              type: "ENQUEUE",
              value: track
            });
          },
          nextTrack: async () => {
            if (state.queue.length === 0) {
              return;
            }
            const playback = await getPlayback(state.queue[0].id);
            dispatch({
              type: "NEXT_TRACK",
              value: playback
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
