import { Album } from "utils/gqlTypes";
import { getAuthCookie } from "utils/auth";
import { NextPageContext } from "next";
import AlbumCover from "components/AlbumCover";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";
import Track from "components/Track";
import LoginForm from "components/LoginForm";
import { useContext } from "react";
import { StoreContext } from "utils/context";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
import theme from "utils/theme";

type Props = {
  album: Album;
};

const AlbumPage = ({ album }: Props) => {
  const {
    dispatchers: { playAlbum }
  } = useContext(StoreContext);

  return (
    <div>
      <h1>
        {album.title}
        <span className="artist">{` - ${album.artist.name}`}</span>
      </h1>
      <AlbumCover url={album.url} size={400} />
      <div onClick={() => playAlbum(album, 0)}>Play</div>
      <div>
        {album.tracks.map(track => (
          <Track key={track.id} track={track} />
        ))}
      </div>
      <style jsx>{`
        .artist {
          color: ${theme.colors.fontalt};
        }
      `}</style>
    </div>
  );
};

const ErrorComponent = () => (
  <div>
    <LoginForm />
  </div>
);

const AlbumPageWrapper = (wrappedProps: Result<Album>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={AlbumPage}
    mapSuccessToProps={data => ({ album: data })}
    ErrorComponent={ErrorComponent}
  />
);

AlbumPageWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<Album>> => {
  const id = context.query.id;
  return errorWrapper(async () => {
    const { album } = await getGraphqlClient(context).Album({
      albumId: typeof id === "string" ? id : id[0]
    });
    return album as Album;
  });
};

export default AlbumPageWrapper;
