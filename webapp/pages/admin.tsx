import { Stats } from "utils/gqlTypes";
import { getAuthCookie } from "utils/auth";
import { NextPageContext } from "next";
import { useContext } from "react";
import ErrorHandlerWrapper from "components/ErrorHandlerWrapper";
import { getGraphqlClient, Result, errorWrapper } from "utils/req";
import { StoreContext } from "utils/context";

type Props = {
  stats: Stats;
};

const AdminHome = ({ stats }: Props) => {
  const {
    state: { graphqlClient }
  } = useContext(StoreContext);
  return (
    <div>
      <h1>Admin</h1>
      <h2>Library</h2>
      <div>{`Artists: ${stats.artistCount}`}</div>
      <div>{`Albums: ${stats.albumCount}`}</div>
      <div>{`Tracks: ${stats.trackCount}`}</div>
      <div>{`Users: ${stats.userCount}`}</div>
      <button onClick={() => errorWrapper(() => graphqlClient.Rescan())}>
        Rescan
      </button>
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
  return errorWrapper(async () => {
    const { stats } = await getGraphqlClient(context).Stats();
    return stats as Stats;
  });
};

export default AdminHomeWrapper;
