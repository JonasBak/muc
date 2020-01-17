package music

import (
	"context"
	"fmt"
	graphql "github.com/graph-gophers/graphql-go"
)

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

func (a Album) URL(c context.Context) (string, error) {
	client := c.Value("mucClient").(*Client)
	return client.GetCoverUrl(a)
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

func (r *Resolver) Track(args struct{ TrackId graphql.ID }) (Track, error) {
	var track Track
	r.c.db.Where("id = ?", args.TrackId).Preload("Album").Preload("Album.Artist").First(&track)
	if track.Model.ID == 0 {
		return Track{}, apiError{Code: "NotFound", Message: fmt.Sprintf("Could not get track with id %s", args.TrackId)}
	}
	return track, nil
}

func (r *Resolver) Albums() []Album {
	var albums []Album
	r.c.db.Preload("Tracks").Preload("Artist").Find(&albums)
	return albums
}

func (r *Resolver) Album(args struct{ AlbumId graphql.ID }) (Album, error) {
	var album Album
	r.c.db.Where("id = ?", args.AlbumId).Preload("Tracks").Preload("Artist").First(&album)
	if album.Model.ID == 0 {
		return Album{}, apiError{Code: "NotFound", Message: fmt.Sprintf("Could not get album with id %s", args.AlbumId)}
	}
	return album, nil
}

func (r *Resolver) Artists() []Artist {
	var artists []Artist
	r.c.db.Preload("Albums").Preload("Albums.Tracks").Find(&artists)
	return artists
}

func (r *Resolver) Artist(args struct{ ArtistId graphql.ID }) (Artist, error) {
	var artist Artist
	r.c.db.Where("id = ?", args.ArtistId).Preload("Albums").Preload("Albums.Tracks").First(&artist)
	if artist.Model.ID == 0 {
		return Artist{}, apiError{Code: "NotFound", Message: fmt.Sprintf("Could not get artist with id %s", args.ArtistId)}
	}
	return artist, nil
}

func (r *Resolver) Playback(args struct{ TrackId graphql.ID }) (Playback, error) {
	track, err := r.Track(args)
	if err != nil {
		return Playback{}, err
	}
	playbackUrl, err := r.c.GetPlaybackUrl(track)
	if err != nil {
		return Playback{}, apiError{Code: "InternalError", Message: err.Error()}
	}
	coverUrl, err := r.c.GetCoverUrl(track.Album)
	if err != nil {
		return Playback{}, apiError{Code: "InternalError", Message: err.Error()}
	}

	return Playback{ID: args.TrackId, Url: playbackUrl, CoverUrl: coverUrl}, err
}
