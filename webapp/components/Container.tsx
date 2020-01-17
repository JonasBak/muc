import { reducer } from "utils/reducer";
import { useReducer } from "react";
import { StoreContext, initialState } from "utils/context";

const Container = ({ children }: { children: any }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StoreContext.Provider
      value={{
        state,
        dispatchers: {
          playTrack: trackId => dispatch({ type: "PLAYTRACK", value: trackId })
        }
      }}
    >
      {children}
    </StoreContext.Provider>
  );
};

export default Container;
