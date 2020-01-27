import { Track as TrackType, Playlist } from "utils/gqlTypes";
import { StoreContext } from "utils/context";
import { getAuthCookie } from "utils/auth";
import { useContext, useState, useEffect } from "react";
import Modal from "components/Modal";
import { getPlaylists, addToPlaylist } from "utils/req";

const TrackMenu = ({
  track,
  closeModal
}: {
  track: TrackType;
  closeModal: () => void;
}) => {
  const {
    dispatchers: { enqueue }
  } = useContext(StoreContext);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistsResult = await getPlaylists(getAuthCookie());
      if (playlistsResult.type === "SUCCESS")
        setPlaylists(playlistsResult.data);
    };
    fetchPlaylists();
  }, []);
  return (
    <div>
      <div>
        <span onClick={() => enqueue(track)}>Add to queue</span>
      </div>
      <div>
        <div>Add to playlist:</div>
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            onClick={() =>
              addToPlaylist(getAuthCookie(), playlist.id, track.id)
            }
          >
            {playlist.name}
          </div>
        ))}
      </div>
      <div onClick={closeModal}>Close</div>
    </div>
  );
};

type Props = {
  track: TrackType;
};

const Track = ({ track }: Props) => {
  const {
    dispatchers: { playTrack }
  } = useContext(StoreContext);
  return (
    <div className="wrapper">
      <span onClick={() => playTrack(track.id)}>▶ </span>
      <Modal Component={TrackMenu} props={{ track }} buttonText="[...]" />
      {track.title}
      <style jsx>{`
        .wrapper {
          padding: 5px;
        }
      `}</style>
    </div>
  );
};

export default Track;
