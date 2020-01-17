export type QueryType = {
  operationName: string;
  query: string;
  variables: string[];
};

export type QueryTypeName = "artists" | "albums" | "album" | "playback";

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
  },
  album: {
    operationName: "Album",
    query: `
      query Album($albumId: ID!) {
        album(albumId: $albumId) {
          id
          title
          url
          tracks {
            id
            title
          }
        }
      }
    `,
    variables: ["albumId"]
  },
  playback: {
    operationName: "Playback",
    query: `
      query Playback($trackId: ID!) {
        playback(trackId: $trackId) {
          track {
            id
            title
          }
          url
          coverUrl
          filetype
        }
      }
    `,
    variables: ["trackId"]
  }
};
