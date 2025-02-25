import { Track as TrackType, Playlist } from "utils/gqlTypes";
import { StoreContext } from "utils/context";
import { getAuthCookie } from "utils/auth";
import { useContext, useState, useEffect } from "react";
import Modal from "components/Modal";
import { errorWrapper } from "utils/req";
import theme from "utils/theme";

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
  colors?: boolean;
};

const Track = ({ track, showArtist = false, colors = false }: Props) => {
  const {
    dispatchers: { playTrack }
  } = useContext(StoreContext);
  return (
    <div onDoubleClick={e => playTrack(track.id)} className="wrapper">
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
          border-bottom: 2px solid ${theme.colors.dark0};
          border-radius: 5px;
          background: ${colors &&
            `linear-gradient(45deg,${track.album.colors
              .replace(/;/g, "88,")
              .slice(0, -1)})`};
        }
        .wrapper:hover {
          background: ${theme.colors.dark1};
        }
        .title {
          padding: 0px 10px;
          flex: 1;
        }
        .album {
          color: ${theme.colors.fontalt};
        }
      `}</style>
    </div>
  );
};

export default Track;
