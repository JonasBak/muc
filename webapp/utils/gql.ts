interface QueryType {
  operationName: string;
  query: string;
  variables: string[];
}

interface QueriesType {
  artists: QueryType;
  albums: QueryType;
  album: QueryType;
  tracks: QueryType;
  playback: QueryType;
}

export type QueryTypeName = keyof QueriesType;

export const Queries: QueriesType = {
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
  tracks: {
    operationName: "Tracks",
    query: `
      query Tracks {
        tracks {
          id
          title
        }
      }
    `,
    variables: []
  },
  playback: {
    operationName: "Playback",
    query: `
      query Playback($trackId: ID!) {
        playback(trackId: $trackId) {
          track {
            id
            title
            album {
              id
              title
              artist {
                id
                name
              }
            }
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
