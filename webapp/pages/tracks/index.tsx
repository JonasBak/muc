import { Track as TrackType } from "utils/gqlTypes";
import { getAuthCookie } from "utils/auth";
import { NextPageContext } from "next";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
import Track from "components/Track";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";

type Props = {
  tracks: Array<TrackType>;
};

const TrackHome = ({ tracks }: Props) => {
  return (
    <div>
      <h1>Tracks</h1>
      <div className="container">
        {tracks.map(track => (
          <Track key={track.id} showArtist colors track={track} />
        ))}
      </div>
    </div>
  );
};

const ErrorComponent = () => <div>Couldn't load tracks</div>;

const TrackHomeWrapper = (wrappedProps: Result<TrackType[]>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={TrackHome}
    mapSuccessToProps={data => ({ tracks: data })}
    ErrorComponent={ErrorComponent}
  />
);

TrackHomeWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<TrackType[]>> => {
  return errorWrapper(async () => {
    const { tracks } = await getGraphqlClient(context).Tracks();
    return tracks as TrackType[];
  });
};

export default TrackHomeWrapper;
