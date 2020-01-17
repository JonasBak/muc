import { Album } from "utils/gqlTypes";
import { NextPageContext } from "next";
import { getAlbum } from "utils/req";
import Track from "components/Track";

type Props = {
  album: Album;
};

const AlbumPage = ({ album }: Props) => {
  return (
    <div>
      <h1>{album.title}</h1>
      <img src={album.url} />
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
  const album: Album = await getAlbum(context.query.id[0]);
  return {
    album
  };
};

export default AlbumPage;
