import { Album } from "utils/gqlTypes";
import { getAlbums } from "utils/req";

type Props = {
  albums: Array<Album>;
};

const AlbumHome = ({ albums }: Props) => {
  return (
    <div>
      <h1>Albums</h1>
      <div>
        {albums.map(album => (
          <div key={album.id}>
            <img src={album.url} />
            <a href={`/albums/${album.id}`}>{album.title}</a>
          </div>
        ))}
      </div>
    </div>
  );
};

AlbumHome.getInitialProps = async (): Promise<Props> => {
  const albums: Array<Album> = await getAlbums();

  return {
    albums
  };
};

export default AlbumHome;
