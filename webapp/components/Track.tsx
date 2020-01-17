import { Track as TrackType } from "utils/gqlTypes";
import { StoreContext } from "utils/context";
import { useContext } from "react";

type Props = {
  track: TrackType;
};

const Track = ({ track }: Props) => {
  const {
    dispatchers: { playTrack }
  } = useContext(StoreContext);
  return (
    <div>
      {track.title}
      <span onClick={() => playTrack(track.id)}>play</span>
    </div>
  );
};

export default Track;
