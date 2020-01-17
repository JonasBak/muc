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

export type Playback = {
   __typename?: 'Playback',
  track: Track,
  url: Scalars['String'],
  coverUrl: Scalars['String'],
  filetype: Scalars['String'],
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

export type Track = {
   __typename?: 'Track',
  id: Scalars['ID'],
  album: Album,
  title: Scalars['String'],
};
