import { Album } from "utils/gqlTypes";
import { getAlbums } from "utils/req";
import Link from "next/link";

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
            <Link href="/albums/[id]" as={`/albums/${album.id}`}>
              <a>{album.title}</a>
            </Link>
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
