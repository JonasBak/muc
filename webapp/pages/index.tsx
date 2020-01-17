import { Artist, Album } from "utils/gqlTypes";
import { getAlbums } from "utils/req";
import { createContext, useState, useEffect, useContext } from "react";

type Props = {
  albums: Array<Album>;
};

const Home = ({ albums }: Props) => {
  return (
    <div>
      <h1>Albums</h1>
      <div>
        {albums.map(album => (
          <div key={album.id}>
            <img src={album.url} />
            {album.title}
          </div>
        ))}
      </div>
    </div>
  );
};

Home.getInitialProps = async (): Promise<Props> => {
  const albums: Array<Album> = await getAlbums();

  return {
    albums
  };
};

export default Home;
