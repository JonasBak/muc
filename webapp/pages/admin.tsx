import { Stats } from "utils/gqlTypes";
import { getAuthCookie } from "utils/auth";
import { NextPageContext } from "next";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
import { getStats, Result, rescan } from "utils/req";

type Props = {
  stats: Stats;
};

const AdminHome = ({ stats }: Props) => {
  return (
    <div>
      <h1>Admin</h1>
      <h2>Library</h2>
      <div>{`Artists: ${stats.artistCount}`}</div>
      <div>{`Albums: ${stats.albumCount}`}</div>
      <div>{`Tracks: ${stats.trackCount}`}</div>
      <button onClick={() => rescan(getAuthCookie())}>Rescan</button>
    </div>
  );
};

const ErrorComponent = () => (
  <div>You don't have access to the admin panel</div>
);

const AdminHomeWrapper = (wrappedProps: Result<Stats>) => (
  <ErrorHandlerWrapper
    wrappedProps={wrappedProps}
    Component={AdminHome}
    mapSuccessToProps={data => ({ stats: data })}
    ErrorComponent={ErrorComponent}
  />
);

AdminHomeWrapper.getInitialProps = async (
  context: NextPageContext
): Promise<Result<Stats>> => {
  const tracksResult = await getStats(getAuthCookie(context));

  return tracksResult;
};

export default AdminHomeWrapper;
