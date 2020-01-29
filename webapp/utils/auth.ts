import { NextPageContext } from "next";
import { API_URL } from "utils/config";

export const getAuthCookie = (ctx?: NextPageContext): string => {
  let cookie = "";
  if (ctx && ctx!.req) {
    cookie = ctx!.req!.headers.cookie || "";
  } else if (process.browser) {
    cookie = document.cookie;
  }
  const match = (cookie + ";").match(/muc-auth=(.|-)+?;/g);
  return match === null ? "" : match[0].slice(9, -1);
};

export const login = async (
  username: string,
  password: string,
  callback: () => void,
  callbackFail?: () => void
) => {
  const req = await fetch(`${API_URL}/login`, {
    method: "POST",
    body: JSON.stringify({
      username,
      password
    })
  });
  if (req.status === 200) {
    const token = await req.text();
    document.cookie = `muc-auth=${token}`;
    callback();
  } else {
    if (callbackFail) callbackFail();
  }
};
