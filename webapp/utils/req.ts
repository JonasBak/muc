import { QUERIES, QueryTypeName } from "./gql";
import { Query } from "./gqlTypes";
import fetch from "isomorphic-unfetch";

const API_BASE_URL = "http://localhost:3030";

type Response<T> = {
  data: { [key: string]: T };
  errors: {
    message: string;
  } | null;
};

async function doQuery<T>(
  queryType: QueryTypeName,
  args = []
): Promise<Response<T>> {
  const req = await fetch(`${API_BASE_URL}/query`, {
    method: "POST",
    body: JSON.stringify({
      operationName: QUERIES[queryType].operationName,
      query: QUERIES[queryType].query,
      variables: QUERIES[queryType].variables
        .map((name, i) => ({ [name]: args[i] }))
        .reduce((obj, a) => ({ ...obj, ...a }), {})
    })
  });
  return req.json() as Promise<Response<T>>;
}

export const getAlbums = async () =>
  (await doQuery<Query["albums"]>("albums")).data["albums"];
