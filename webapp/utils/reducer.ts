export type State = {
  currentTrack: string | null;
};

export const reducer = (state: State, action: any): State => {
  switch (action.type) {
    case "PLAYTRACK": {
      return {
        ...state,
        currentTrack: action.value
      };
    }
    default: {
      return state;
    }
  }
};
