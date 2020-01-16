package music

import (
	"fmt"
	graphql "github.com/graph-gophers/graphql-go"
)

const Schema string = `
    schema {
            query: Query
    }
    type Query {
            tracks: [Track!]!
            track(trackId: ID!): Track
            albums: [Album!]!
            artists: [Artist!]!
            playback(trackId: ID!): Playback
    }
    type Track {
            id: ID!
            album: Album!
            title: String!
            filetype: String!
    }
    type Album {
            id: ID!
            title: String!
            artist: Artist!
    }
    type Artist {
            id: ID!
            name: String!
    }
    type Playback {
            id: ID!
            url: String!
            coverUrl: String!
    }
  `

type Playback struct {
	ID       graphql.ID
	Url      string
	CoverUrl string
}

func (t Track) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(t.Model.ID))
}

func (a Album) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(a.Model.ID))
}

func (a Artist) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(a.Model.ID))
}

type Resolver struct {
	c *Client
}

func NewResolver(c *Client) Resolver {
	return Resolver{c}
}

func (r *Resolver) Tracks() []Track {
	var tracks []Track
	r.c.db.Preload("Album").Preload("Album.Artist").Find(&tracks)
	return tracks
}

func (r *Resolver) Track(args struct{ TrackId graphql.ID }) *Track {
	var track Track
	r.c.db.Where("id = ?", args.TrackId).Preload("Album").Preload("Album.Artist").First(&track)
	if track.Model.ID == 0 {
		return nil
	}
	return &track
}

func (r *Resolver) Albums() []Album {
	var albums []Album
	r.c.db.Preload("Artist").Find(&albums)
	return albums
}

func (r *Resolver) Artists() []Artist {
	var artists []Artist
	r.c.db.Find(&artists)
	return artists
}

func (r *Resolver) Playback(args struct{ TrackId graphql.ID }) *Playback {
	var track Track
	r.c.db.Where("id = ?", args.TrackId).Preload("Album").First(&track)
	if track.Model.ID == 0 {
		return nil
	}
	playbackUrl, err := r.c.GetPlaybackUrl(track)
	if err != nil {
		fmt.Println("Could not get playable url")
		return nil
	}
	coverUrl, err := r.c.GetCoverUrl(track.Album)
	if err != nil {
		fmt.Println("Could not get playable url")
		return nil
	}

	return &Playback{ID: args.TrackId, Url: playbackUrl, CoverUrl: coverUrl}
}
