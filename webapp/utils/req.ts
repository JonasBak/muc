import { Queries, QueryTypeName } from "./gql";
import { Query, Mutation } from "./gqlTypes";
import fetch from "isomorphic-unfetch";
import { API_URL } from "utils/config";

type Response<T> = {
  data?: { [key in QueryTypeName]: T };
  errors?: Array<{
    message: string;
  }>;
};

// TODO error type
export type Result<T> =
  | { type: "SUCCESS"; data: T }
  | { type: "ERROR"; data: string };

async function doQuery<T>(
  queryType: QueryTypeName,
  args: Array<string> = [],
  auth: string
): Promise<Response<T>> {
  const req = await fetch(`${API_URL}/query`, {
    method: "POST",
    headers: {
      "muc-auth": auth
    },
    body: JSON.stringify({
      operationName: Queries[queryType].operationName,
      query: Queries[queryType].query,
      variables: Queries[queryType].variables
        .map((name, i) => ({ [name]: args[i] }))
        .reduce((obj, a) => ({ ...obj, ...a }), {})
    })
  });
  if (req.status < 200 || req.status >= 300) {
    return {
      errors: [{ message: `Error [${req.status}]: ${await req.text()}` }]
    };
  }
  return req.json() as Promise<Response<T>>;
}

async function queryWrapper<T>(
  field: QueryTypeName,
  args: Array<string>,
  auth: string
): Promise<Result<T>> {
  const res = await doQuery<T>(field, args, auth);
  if (res.errors) {
    return { type: "ERROR", data: res.errors[0].message }; // Could comma seperate array
  }
  if (res.data) {
    return { type: "SUCCESS", data: res.data[field] };
  }
  return { type: "ERROR", data: "Response couldn't be parsed" };
}

export const getAlbums = async (auth: string) => {
  return queryWrapper<Query["albums"]>("albums", [], auth);
};

export const getAlbum = async (auth: string, albumId: string) => {
  return queryWrapper<Query["album"]>("album", [albumId], auth);
};

export const getTracks = async (auth: string) => {
  return queryWrapper<Query["tracks"]>("tracks", [], auth);
};

export const getPlayback = async (auth: string, trackId: string) => {
  return queryWrapper<Query["playback"]>("playback", [trackId], auth);
};

export const getStats = async (auth: string) => {
  return queryWrapper<Query["stats"]>("stats", [], auth);
};

export const rescan = async (auth: string) => {
  return queryWrapper<Mutation["rescan"]>("rescan", [], auth);
};
