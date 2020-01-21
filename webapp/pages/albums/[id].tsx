import { Album } from "utils/gqlTypes";
import { NextPageContext } from "next";
import AlbumCover from "components/AlbumCover";
import { getAlbum } from "utils/req";
import Track from "components/Track";
import { useContext } from "react";
import { StoreContext } from "utils/context";

type Props = {
  album: Album;
};

const AlbumPage = ({ album }: Props) => {
  const {
    dispatchers: { playAlbum }
  } = useContext(StoreContext);

  return (
    <div>
      <h1>{album.title}</h1>
      <AlbumCover url={album.url} size={600} />
      <div onClick={() => playAlbum(album, 0)}>Play</div>
      <div>
        {album.tracks.map(track => (
          <Track key={track.id} track={track} />
        ))}
      </div>
    </div>
  );
};

AlbumPage.getInitialProps = async (
  context: NextPageContext
): Promise<Props> => {
  const id = context.query.id;
  const album: Album = await getAlbum(typeof id === "string" ? id : id[0]);
  return {
    album
  };
};

export default AlbumPage;
