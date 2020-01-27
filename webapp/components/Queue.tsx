import { Track as TrackType } from "utils/gqlTypes";
import Track from "components/Track";

type Props = {
  queue: Array<TrackType>;
};

const Queue = ({ queue }: Props) => {
  return (
    <div>
      <h3>Queue</h3>
      <div>
        {queue.map(track => (
          <Track key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

export default Queue;
