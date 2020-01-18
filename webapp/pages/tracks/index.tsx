import { Track as TrackType } from "utils/gqlTypes";
import Track from "components/Track";
import { getTracks } from "utils/req";

type Props = {
  tracks: Array<TrackType>;
};

const AlbumHome = ({ tracks }: Props) => {
  return (
    <div>
      <h1>Tracks</h1>
      <div className="container">
        {tracks.map(track => (
          <Track key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

AlbumHome.getInitialProps = async (): Promise<Props> => {
  const tracks: Array<TrackType> = await getTracks();

  return {
    tracks
  };
};

export default AlbumHome;
