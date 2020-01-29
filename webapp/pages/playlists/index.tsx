import { Playlist } from "utils/gqlTypes";
import { NextPageContext } from "next";
import LoginForm from "components/LoginForm";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";
import { getAuthCookie } from "utils/auth";
import AlbumCover from "components/AlbumCover";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
import Link from "next/link";

type Props = {
  playlists: Array<Playlist>;
};

const PlaylistItem = ({ playlist }: { playlist: Playlist }) => {
  return (
    <div>
      <Link href="/playlists/[id]" as={`/playlists/${playlist.id}`}>
        <a className="name">{playlist.name}</a>
      </Link>
      <style jsx>{`
        .name {
          text-align: center;
        }
      `}</style>
    </div>
  );
};

const PlaylistHome = ({ playlists }: Props) => {
  return (
    <div>
      <h1 className="title">Playlists</h1>
      <div className="container">
        {playlists.map(playlist => (
          <PlaylistItem key={playlist.id} playlist={playlist} />
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

const ErrorComponent = () => (
  <div>
    <LoginForm />
  </div>
);

const PlaylistHomeWrapper = (wrappedProps: Result<Playlist[]>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={PlaylistHome}
    mapSuccessToProps={data => ({ playlists: data })}
    ErrorComponent={ErrorComponent}
  />
);

PlaylistHomeWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<Playlist[]>> => {
  return errorWrapper(async () => {
    const { playlists } = await getGraphqlClient(context).Playlists();
    return playlists as Playlist[];
  });
};

export default PlaylistHomeWrapper;
