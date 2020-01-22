package music

import (
	"context"
	"fmt"
	graphql "github.com/graph-gophers/graphql-go"
	log "github.com/sirupsen/logrus"
)

type Playback struct {
	Track    Track
	Url      string
	CoverUrl string
	Filetype string
}

type Stats struct {
	ArtistCount int32
	AlbumCount  int32
	TrackCount  int32
}

func (t Track) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(t.Model.ID))
}

func (t Track) TRACKINDEX() int32 {
	return int32(t.TrackIndex)
}

func (t Track) ALBUM(c context.Context) Album {
	if t.Album.Model.ID != 0 {
		return t.Album
	}
	log.Debug("Resolving track.album from db")
	client := c.Value("mucClient").(*Client)
	var album Album
	client.db.Model(&t).Related(&album)
	return album
}

func (a Album) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(a.Model.ID))
}

func (a Album) ARTIST(c context.Context) Artist {
	if a.Artist.Model.ID != 0 {
		return a.Artist
	}
	log.Debug("Resolving album.artist from db")
	client := c.Value("mucClient").(*Client)
	var artist Artist
	client.db.Model(&a).Related(&artist)
	return artist
}

func (a Album) TRACKS(c context.Context) []Track {
	if len(a.Tracks) > 0 {
		return a.Tracks
	}
	log.Debug("Resolving album.tracks from db")
	client := c.Value("mucClient").(*Client)
	var tracks []Track
	client.db.Model(&a).Related(&tracks)
	return tracks
}

func (a Album) URL(c context.Context) (string, error) {
	client := c.Value("mucClient").(*Client)
	return client.GetCoverUrl(a)
}

func (a Artist) ID() graphql.ID {
	return graphql.ID(fmt.Sprint(a.Model.ID))
}

func (a Artist) ALBUMS(c context.Context) []Album {
	if len(a.Albums) != 0 {
		return a.Albums
	}
	log.Debug("Resolving artist.albums from db")
	client := c.Value("mucClient").(*Client)
	var albums []Album
	client.db.Model(&a).Related(&albums)
	return albums
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
	if r.c.db.Where("id = ?", args.TrackId).Preload("Album").Preload("Album.Artist").First(&track).RecordNotFound() {
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
	if r.c.db.Where("id = ?", args.AlbumId).Preload("Tracks").Preload("Artist").First(&album).RecordNotFound() {
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
	if r.c.db.Where("id = ?", args.ArtistId).Preload("Albums").Preload("Albums.Tracks").First(&artist).RecordNotFound() {
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

	return Playback{Track: track, Url: playbackUrl, CoverUrl: coverUrl, Filetype: track.Filetype}, err
}

func (r *Resolver) Stats() Stats {
	var ArtistCount int32
	r.c.db.Model(&Artist{}).Count(&ArtistCount)
	var AlbumCount int32
	r.c.db.Model(&Album{}).Count(&AlbumCount)
	var TrackCount int32
	r.c.db.Model(&Track{}).Count(&TrackCount)

	return Stats{ArtistCount, AlbumCount, TrackCount}
}

func (r *Resolver) Rescan() Stats {
	initalStats := r.Stats()
	r.c.SyncMusicFiles()
	newStats := r.Stats()
	return Stats{ArtistCount: newStats.ArtistCount - initalStats.ArtistCount, AlbumCount: newStats.AlbumCount - initalStats.AlbumCount, TrackCount: newStats.TrackCount - initalStats.TrackCount}
}
