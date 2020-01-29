import { Track as TrackType, Playlist } from "utils/gqlTypes";
import { StoreContext } from "utils/context";
import { getAuthCookie } from "utils/auth";
import { useContext, useState, useEffect } from "react";
import Modal from "components/Modal";
import { errorWrapper } from "utils/req";

const TrackMenu = ({
  track,
  closeModal
}: {
  track: TrackType;
  closeModal: () => void;
}) => {
  const {
    dispatchers: { enqueue },
    state: { graphqlClient }
  } = useContext(StoreContext);
  const [playlists, setPlaylists] = useState<Playlist[]>([]);

  useEffect(() => {
    const fetchPlaylists = async () => {
      const playlistsResult = await errorWrapper(async () => {
        const { playlists } = await graphqlClient.Playlists();
        return playlists as Playlist[];
      });
      if (playlistsResult.type === "SUCCESS")
        setPlaylists(playlistsResult.data);
    };
    fetchPlaylists();
  }, []);
  return (
    <div className="wrapper">
      <h2>{track.title}</h2>
      <div>
        <span onClick={() => enqueue(track)}>Add to queue</span>
      </div>
      <div>
        <div>Add to playlist:</div>
        {playlists.map(playlist => (
          <div
            key={playlist.id}
            onClick={() =>
              errorWrapper(async () =>
                graphqlClient.AddToPlaylist({
                  playlistId: playlist.id,
                  trackId: track.id
                })
              )
            }
          >
            {playlist.name}
          </div>
        ))}
      </div>
      <style jsx>{`
        .wrapper {
          padding: 20px;
        }
      `}</style>
    </div>
  );
};

type Props = {
  track: TrackType;
  showArtist?: boolean;
};

const Track = ({ track, showArtist = false }: Props) => {
  const {
    dispatchers: { playTrack }
  } = useContext(StoreContext);
  return (
    <div className="wrapper">
      <div onClick={() => playTrack(track.id)}>▶ </div>
      <div className="title">
        <span>{track.title}</span>
        {showArtist && (
          <span className="album">{` - ${track.album.artist.name}`}</span>
        )}
      </div>
      <Modal Component={TrackMenu} props={{ track }} buttonText="..." />
      <style jsx>{`
        .wrapper {
          display: flex;
          padding: 10px;
          border-bottom: 2px solid #0f0f0f;
          border-radius: 5px;
        }
        .title {
          padding: 0px 10px;
          flex: 1;
        }
        .album {
          color: #b0b0b0;
        }
      `}</style>
    </div>
  );
};

export default Track;
