import { Album } from "utils/gqlTypes";
import { getAlbums } from "utils/req";
import AlbumCover from "components/AlbumCover";
import Link from "next/link";

type Props = {
  albums: Array<Album>;
};

const AlbumItem = ({ album }: { album: Album }) => {
  return (
    <div>
      <div className="container">
        <Link href="/albums/[id]" as={`/albums/${album.id}`}>
          <a className="title">{album.title}</a>
        </Link>
        <AlbumCover url={album.url} />
      </div>
      <style jsx>{`
        .container {
          display: flex;
          flex-direction: column;
          margin: 10px;
        }
        .title {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

const AlbumHome = ({ albums }: Props) => {
  return (
    <div>
      <h1 className="title">Albums</h1>
      <div className="container">
        {albums.map(album => (
          <AlbumItem key={album.id} album={album} />
        ))}
      </div>
      <style jsx>{`
        .title {
          text-align: center;
        }
        .container {
          display: flex;
          flex-flow: wrap;
          justify-content: center;
        }
      `}</style>
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
