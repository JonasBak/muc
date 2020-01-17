export type QueryType = {
  operationName: string;
  query: string;
  variables: string[];
};

export type QueryTypeName = "artists" | "albums";

export const QUERIES: { [key: string]: QueryType } = {
  artists: {
    operationName: "Artists",
    query: `
      query Artists {
        artists {
          id
          name
        }
      }
    `,
    variables: []
  },
  albums: {
    operationName: "Albums",
    query: `
      query Albums {
        albums {
          id
          title
          url
        }
      }
    `,
    variables: []
  }
};
