import { Queries, QueryTypeName } from "./gql";
import { Query } from "./gqlTypes";
import fetch from "isomorphic-unfetch";
import { API_URL } from "utils/config";

type Response<T> = {
  data: { [key: string]: T };
  errors?: {
    message: string;
  };
};

async function doQuery<T>(
  queryType: QueryTypeName,
  args: Array<string> = []
): Promise<Response<T>> {
  const req = await fetch(`${API_URL}/query`, {
    method: "POST",
    body: JSON.stringify({
      operationName: Queries[queryType].operationName,
      query: Queries[queryType].query,
      variables: Queries[queryType].variables
        .map((name, i) => ({ [name]: args[i] }))
        .reduce((obj, a) => ({ ...obj, ...a }), {})
    })
  });
  return req.json() as Promise<Response<T>>;
}

export const getAlbums = async () => {
  const res = await doQuery<Query["albums"]>("albums");
  console.log(res.errors);
  return res.data["albums"];
};

export const getAlbum = async (albumId: string) => {
  const res = await doQuery<Query["album"]>("album", [albumId]);
  console.log(res.errors);
  return res.data["album"];
};

export const getTracks = async () => {
  const res = await doQuery<Query["tracks"]>("tracks");
  console.log(res.errors);
  return res.data["tracks"];
};

export const getPlayback = async (trackId: string) => {
  const res = await doQuery<Query["playback"]>("playback", [trackId]);
  console.log(res.errors);
  return res.data["playback"];
};
