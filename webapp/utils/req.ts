import { NextPageContext } from "next";
import { API_URL } from "utils/config";
import { GraphQLClient } from "graphql-request";
import { getSdk } from "utils/gqlTypes";
import { getAuthCookie } from "utils/auth";

export type Result<T> =
  | { type: "SUCCESS"; data: T }
  | { type: "ERROR"; data: string };

export const getGraphqlClient = (context?: NextPageContext) => {
  const client = new GraphQLClient(`${API_URL}/query`, {
    mode: "cors",
    headers: {
      "muc-auth": getAuthCookie(context)
    }
  });
  return getSdk(client);
};

export async function errorWrapper<T>(
  func: () => Promise<T>
): Promise<Result<T>> {
  try {
    const data = await func();
    return { type: "SUCCESS", data };
  } catch (error) {
    return { type: "ERROR", data: "TODO" };
  }
}
