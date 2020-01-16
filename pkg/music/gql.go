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
            playback(trackId: ID!): Playback
    }
    type Track {
            id: ID!
            album: String!
            artist: String!
            title: String!
            filetype: String!
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

type Resolver struct {
	c *Client
}

func NewResolver(c *Client) Resolver {
	return Resolver{c}
}

func (r *Resolver) Tracks() []Track {
	var tracks []Track
	r.c.db.Find(&tracks)
	return tracks
}

func (r *Resolver) Track(args struct{ TrackId graphql.ID }) *Track {
	var track Track
	r.c.db.Where("id = ?", args.TrackId).First(&track)
	if track.Model.ID == 0 {
		return nil
	}
	return &track
}

func (r *Resolver) Playback(args struct{ TrackId graphql.ID }) *Playback {
	var track Track
	r.c.db.Where("id = ?", args.TrackId).First(&track)
	if track.Model.ID == 0 {
		return nil
	}
	// TODO handle outdated or non existing playback and cover urls
	return &Playback{ID: args.TrackId, Url: "TODO", CoverUrl: "TODO"}
}
