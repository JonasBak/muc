import { Album } from "utils/gqlTypes";
import { NextPageContext } from "next";
import { getAlbum } from "utils/req";

type Props = {
  album: Album;
};

const AlbumPage = ({ album }: Props) => {
  console.log(album.tracks);
  return (
    <div>
      <h1>{album.title}</h1>
      <img src={album.url} />
      <div>
        {album.tracks.map(track => (
          <div key={track.id}>{track.title}</div>
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
