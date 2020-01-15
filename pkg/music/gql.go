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
                }
                type Track {
                        id: ID!
                        album: String!
                        artist: String!
                        title: String!
                        filetype: String!
                }
        `

type Resolver struct {
	c *Client
}

func (t Track) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(t.Model.ID))
}

func NewResolver(c *Client) Resolver {
	return Resolver{c}
}

func (r *Resolver) Tracks() []Track {
	var tracks []Track
	r.c.db.Find(&tracks)
	return tracks
}
