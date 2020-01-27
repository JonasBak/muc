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
};

export type Track = {
   __typename?: 'Track',
  id: Scalars['ID'],
  album: Album,
  title: Scalars['String'],
  trackIndex: Scalars['Int'],
};
