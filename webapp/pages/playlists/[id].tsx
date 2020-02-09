import { Playlist } from "utils/gqlTypes";
import { NextPageContext } from "next";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";
import Track from "components/Track";
import LoginForm from "components/LoginForm";
import { useContext } from "react";
import { StoreContext } from "utils/context";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";

type Props = {
  playlist: Playlist;
};

const PlaylistPage = ({ playlist }: Props) => {
  const {
    dispatchers: { playPlaylist }
  } = useContext(StoreContext);

  return (
    <div>
      <h1>{playlist.name}</h1>
      <div onClick={() => playPlaylist(playlist, 0)}>Play</div>
      <div>
        {playlist.tracks.map(track => (
          <Track key={track.id} showArtist colors track={track} />
        ))}
      </div>
    </div>
  );
};

const ErrorComponent = () => (
  <div>
    <LoginForm />
  </div>
);

const PlaylistPageWrapper = (wrappedProps: Result<Playlist>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={PlaylistPage}
    mapSuccessToProps={data => ({ playlist: data })}
    ErrorComponent={ErrorComponent}
  />
);

PlaylistPageWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<Playlist>> => {
  const id = context.query.id;
  return errorWrapper(async () => {
    const { playlist } = await getGraphqlClient(context).Playlist({
      playlistId: typeof id === "string" ? id : id[0]
    });
    return playlist as Playlist;
  });
};

export default PlaylistPageWrapper;
