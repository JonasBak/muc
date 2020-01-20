import { Track as TrackType } from "utils/gqlTypes";
import { StoreContext } from "utils/context";
import { useContext } from "react";

type Props = {
  track: TrackType;
};

const Track = ({ track }: Props) => {
  const {
    dispatchers: { playTrack, enqueue }
  } = useContext(StoreContext);
  return (
    <div className="wrapper">
      <span onClick={() => playTrack(track.id)}>▶ </span>
      {track.title}
      <span onClick={() => enqueue(track)}> Q</span>
      <style jsx>{`
        .wrapper {
          padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default Track;
