import { GraphQLClient } from 'graphql-request';
import { print } from 'graphql';
import gql from 'graphql-tag';
export type Maybe<T> = T | null;
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string,
  String: string,
  Boolean: boolean,
  Int: number,
  Float: number,
};

export type Album = {
   __typename?: 'Album',
  id: Scalars['ID'],
  title: Scalars['String'],
  url: Scalars['String'],
  artist: Artist,
  tracks: Array<Track>,
};

export type Artist = {
   __typename?: 'Artist',
  id: Scalars['ID'],
  name: Scalars['String'],
  albums: Array<Album>,
};

export type Mutation = {
   __typename?: 'Mutation',
  newPlaylist: Playlist,
  addToPlaylist: Playlist,
  rescan: Stats,
};


export type MutationNewPlaylistArgs = {
  name: Scalars['String']
};


export type MutationAddToPlaylistArgs = {
  playlistId: Scalars['ID'],
  trackId: Scalars['ID']
};

export type Playback = {
   __typename?: 'Playback',
  track: Track,
  url: Scalars['String'],
  coverUrl: Scalars['String'],
  filetype: Scalars['String'],
};

export type Playlist = {
   __typename?: 'Playlist',
  id: Scalars['ID'],
  name: Scalars['String'],
  tracks: Array<Track>,
};

export type Query = {
   __typename?: 'Query',
  tracks: Array<Track>,
  track: Track,
  albums: Array<Album>,
  album: Album,
  artists: Array<Artist>,
  artist: Artist,
  playback: Playback,
  playlists: Array<Playlist>,
  playlist: Playlist,
  stats: Stats,
};


export type QueryTrackArgs = {
  trackId: Scalars['ID']
};


export type QueryAlbumArgs = {
  albumId: Scalars['ID']
};


export type QueryArtistArgs = {
  artistId: Scalars['ID']
};


export type QueryPlaybackArgs = {
  trackId: Scalars['ID']
};


export type QueryPlaylistArgs = {
  playlistId: Scalars['ID']
};

export type Stats = {
   __typename?: 'Stats',
  artistCount: Scalars['Int'],
  albumCount: Scalars['Int'],
  trackCount: Scalars['Int'],
  userCount: Scalars['Int'],
};

export type Track = {
   __typename?: 'Track',
  id: Scalars['ID'],
  album: Album,
  title: Scalars['String'],
  trackIndex: Scalars['Int'],
};

export type AddToPlaylistMutationVariables = {
  playlistId: Scalars['ID'],
  trackId: Scalars['ID']
};


export type AddToPlaylistMutation = (
  { __typename?: 'Mutation' }
  & { addToPlaylist: (
    { __typename?: 'Playlist' }
    & Pick<Playlist, 'id' | 'name'>
    & { tracks: Array<(
      { __typename?: 'Track' }
      & Pick<Track, 'id' | 'title'>
    )> }
  ) }
);

export type AlbumQueryVariables = {
  albumId: Scalars['ID']
};


export type AlbumQuery = (
  { __typename?: 'Query' }
  & { album: (
    { __typename?: 'Album' }
    & Pick<Album, 'id' | 'title' | 'url'>
    & { artist: (
      { __typename?: 'Artist' }
      & Pick<Artist, 'id' | 'name'>
    ), tracks: Array<(
      { __typename?: 'Track' }
      & Pick<Track, 'id' | 'title'>
    )> }
  ) }
);

export type AlbumsQueryVariables = {};


export type AlbumsQuery = (
  { __typename?: 'Query' }
  & { albums: Array<(
    { __typename?: 'Album' }
    & Pick<Album, 'id' | 'title' | 'url'>
  )> }
);

export type ArtistsQueryVariables = {};


export type ArtistsQuery = (
  { __typename?: 'Query' }
  & { artists: Array<(
    { __typename?: 'Artist' }
    & Pick<Artist, 'id' | 'name'>
  )> }
);

export type NewPlaylistMutationVariables = {
  name: Scalars['String']
};


export type NewPlaylistMutation = (
  { __typename?: 'Mutation' }
  & { newPlaylist: (
    { __typename?: 'Playlist' }
    & Pick<Playlist, 'id' | 'name'>
  ) }
);

export type PlaybackQueryVariables = {
  trackId: Scalars['ID']
};


export type PlaybackQuery = (
  { __typename?: 'Query' }
  & { playback: (
    { __typename?: 'Playback' }
    & Pick<Playback, 'url' | 'coverUrl' | 'filetype'>
    & { track: (
      { __typename?: 'Track' }
      & Pick<Track, 'id' | 'title'>
      & { album: (
        { __typename?: 'Album' }
        & Pick<Album, 'id' | 'title' | 'url'>
        & { artist: (
          { __typename?: 'Artist' }
          & Pick<Artist, 'id' | 'name'>
        ) }
      ) }
    ) }
  ) }
);

export type PlaylistQueryVariables = {
  playlistId: Scalars['ID']
};


export type PlaylistQuery = (
  { __typename?: 'Query' }
  & { playlist: (
    { __typename?: 'Playlist' }
    & Pick<Playlist, 'id' | 'name'>
    & { tracks: Array<(
      { __typename?: 'Track' }
      & Pick<Track, 'id' | 'title'>
      & { album: (
        { __typename?: 'Album' }
        & Pick<Album, 'id' | 'title'>
        & { artist: (
          { __typename?: 'Artist' }
          & Pick<Artist, 'id' | 'name'>
        ) }
      ) }
    )> }
  ) }
);

export type PlaylistsQueryVariables = {};


export type PlaylistsQuery = (
  { __typename?: 'Query' }
  & { playlists: Array<(
    { __typename?: 'Playlist' }
    & Pick<Playlist, 'id' | 'name'>
    & { tracks: Array<(
      { __typename?: 'Track' }
      & Pick<Track, 'id' | 'title'>
    )> }
  )> }
);

export type RescanMutationVariables = {};


export type RescanMutation = (
  { __typename?: 'Mutation' }
  & { rescan: (
    { __typename?: 'Stats' }
    & Pick<Stats, 'artistCount' | 'albumCount' | 'trackCount'>
  ) }
);

export type StatsQueryVariables = {};


export type StatsQuery = (
  { __typename?: 'Query' }
  & { stats: (
    { __typename?: 'Stats' }
    & Pick<Stats, 'artistCount' | 'albumCount' | 'trackCount' | 'userCount'>
  ) }
);

export type TracksQueryVariables = {};


export type TracksQuery = (
  { __typename?: 'Query' }
  & { tracks: Array<(
    { __typename?: 'Track' }
    & Pick<Track, 'id' | 'title' | 'trackIndex'>
    & { album: (
      { __typename?: 'Album' }
      & Pick<Album, 'id' | 'title'>
      & { artist: (
        { __typename?: 'Artist' }
        & Pick<Artist, 'id' | 'name'>
      ) }
    ) }
  )> }
);


export const AddToPlaylistDocument = gql`
    mutation AddToPlaylist($playlistId: ID!, $trackId: ID!) {
  addToPlaylist(playlistId: $playlistId, trackId: $trackId) {
    id
    name
    tracks {
      id
      title
    }
  }
}
    `;
export const AlbumDocument = gql`
    query Album($albumId: ID!) {
  album(albumId: $albumId) {
    id
    title
    url
    artist {
      id
      name
    }
    tracks {
      id
      title
    }
  }
}
    `;
export const AlbumsDocument = gql`
    query Albums {
  albums {
    id
    title
    url
  }
}
    `;
export const ArtistsDocument = gql`
    query Artists {
  artists {
    id
    name
  }
}
    `;
export const NewPlaylistDocument = gql`
    mutation NewPlaylist($name: String!) {
  newPlaylist(name: $name) {
    id
    name
  }
}
    `;
export const PlaybackDocument = gql`
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
    `;
export const PlaylistDocument = gql`
    query Playlist($playlistId: ID!) {
  playlist(playlistId: $playlistId) {
    id
    name
    tracks {
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
  }
}
    `;
export const PlaylistsDocument = gql`
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
    `;
export const RescanDocument = gql`
    mutation Rescan {
  rescan {
    artistCount
    albumCount
    trackCount
  }
}
    `;
export const StatsDocument = gql`
    query Stats {
  stats {
    artistCount
    albumCount
    trackCount
    userCount
  }
}
    `;
export const TracksDocument = gql`
    query Tracks {
  tracks {
    id
    title
    trackIndex
    album {
      id
      title
      artist {
        id
        name
      }
    }
  }
}
    `;
export function getSdk(client: GraphQLClient) {
  return {
    AddToPlaylist(variables: AddToPlaylistMutationVariables): Promise<AddToPlaylistMutation> {
      return client.request<AddToPlaylistMutation>(print(AddToPlaylistDocument), variables);
    },
    Album(variables: AlbumQueryVariables): Promise<AlbumQuery> {
      return client.request<AlbumQuery>(print(AlbumDocument), variables);
    },
    Albums(variables?: AlbumsQueryVariables): Promise<AlbumsQuery> {
      return client.request<AlbumsQuery>(print(AlbumsDocument), variables);
    },
    Artists(variables?: ArtistsQueryVariables): Promise<ArtistsQuery> {
      return client.request<ArtistsQuery>(print(ArtistsDocument), variables);
    },
    NewPlaylist(variables: NewPlaylistMutationVariables): Promise<NewPlaylistMutation> {
      return client.request<NewPlaylistMutation>(print(NewPlaylistDocument), variables);
    },
    Playback(variables: PlaybackQueryVariables): Promise<PlaybackQuery> {
      return client.request<PlaybackQuery>(print(PlaybackDocument), variables);
    },
    Playlist(variables: PlaylistQueryVariables): Promise<PlaylistQuery> {
      return client.request<PlaylistQuery>(print(PlaylistDocument), variables);
    },
    Playlists(variables?: PlaylistsQueryVariables): Promise<PlaylistsQuery> {
      return client.request<PlaylistsQuery>(print(PlaylistsDocument), variables);
    },
    Rescan(variables?: RescanMutationVariables): Promise<RescanMutation> {
      return client.request<RescanMutation>(print(RescanDocument), variables);
    },
    Stats(variables?: StatsQueryVariables): Promise<StatsQuery> {
      return client.request<StatsQuery>(print(StatsDocument), variables);
    },
    Tracks(variables?: TracksQueryVariables): Promise<TracksQuery> {
      return client.request<TracksQuery>(print(TracksDocument), variables);
    }
  };
}