import { Album } from "utils/gqlTypes";
import { NextPageContext } from "next";
import LoginForm from "components/LoginForm";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";
import { getAuthCookie } from "utils/auth";
import AlbumCover from "components/AlbumCover";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
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

const ErrorComponent = () => (
  <div>
    <LoginForm />
  </div>
);

const AlbumHomeWrapper = (wrappedProps: Result<Album[]>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={AlbumHome}
    mapSuccessToProps={data => ({ albums: data })}
    ErrorComponent={ErrorComponent}
  />
);

AlbumHomeWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<Album[]>> => {
  return errorWrapper(async () => {
    const { albums } = await getGraphqlClient(context).Albums();
    return albums as Album[];
  });
};

export default AlbumHomeWrapper;
