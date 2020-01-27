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
  playlists: QueryType;
  playlist: QueryType;
  stats: QueryType;

  rescan: QueryType;
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
              url
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
  },
  playlists: {
    operationName: "Playlists",
    query: `
      query Playlists {
        playlists {
          id
          name
          tracks {
            id
            title
          }
        }
      }
    `,
    variables: []
  },
  playlist: {
    operationName: "Playlist",
    query: `
      query Playlist($playlistId: ID!) {
        playlist(playlistId: $playlistId) {
          id
          name
          tracks {
            id
            title
          }
        }
      }
    `,
    variables: ["playlistId"]
  },
  stats: {
    operationName: "Stats",
    query: `
      query Stats {
        stats {
          artistCount
          albumCount
          trackCount
        }
      }
    `,
    variables: []
  },
  rescan: {
    operationName: "Rescan",
    query: `
      mutation Rescan {
        rescan {
          artistCount
          albumCount
          trackCount
        }
      }
    `,
    variables: []
  }
};
