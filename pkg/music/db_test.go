package music

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"testing"
)

func initClient() Client {
	config.Config = config.ConfigStruct{MinioHost: "localhost:9000", SqliteLocation: ":memory:"}

	c := NewClient()

	return c
}

func TestIndexMusicFile(t *testing.T) {
	c := initClient()

	err := c.IndexMusicFile("Father John Misty/God’s Favorite Customer/02 Mr. Tillman.flac")

	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}

	var track Track
	if c.db.Where("title = ?", "Mr. Tillman").First(&track).RecordNotFound() {
		t.Errorf("Could not find track in database after trying to index")
	}
	if track.Filetype != "flac" {
		t.Errorf("Filetype not parsed correctly")
	}
	if track.TrackIndex != 2 {
		t.Errorf("Track index not parsed correctly")
	}

	var album Album
	if c.db.Where("title = ?", "God’s Favorite Customer").First(&album).RecordNotFound() {
		t.Errorf("Could not find album in database after trying to index")
	}

	var artist Artist
	if c.db.Where("name = ?", "Father John Misty").First(&artist).RecordNotFound() {
		t.Errorf("Could not find artist in database after trying to index")
	}
}

func TestIndexMusicFileRelations(t *testing.T) {
	c := initClient()

	err := c.IndexMusicFile("Father John Misty/Pure Comedy/02 Total Entertainment Forever.flac")

	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}

	var track Track
	if c.db.Where("title = ?", "Total Entertainment Forever").Preload("Album").Preload("Album.Artist").First(&track).RecordNotFound() {
		t.Errorf("Could not find track in database after trying to index")
	}

	if track.Album.Title != "Pure Comedy" {
		t.Errorf("Track.Album relation isn't indexed properly")
	}

	if track.Album.Artist.Name != "Father John Misty" {
		t.Errorf("Album.Artist relation isn't indexed properly")
	}
}

func TestIndexMusicFileNonMusicFails(t *testing.T) {
	c := initClient()

	err := c.IndexMusicFile("Father John Misty/Pure Comedy/cover.jpg")

	if err == nil {
		t.Errorf("Cover file shouldn't be indexed as music file")
	}

	err = c.IndexMusicFile("Father John Misty/Pure Comedy/02 Total Entertainment Forever.json")

	if err == nil {
		t.Errorf("Random file with correct format but wrong file type shouldn't be indexed as music")
	}
}

func TestAlbumIsOnlyIndexedOnce(t *testing.T) {
	c := initClient()

	err := c.IndexMusicFile("Father John Misty/God’s Favorite Customer/08 God’s Favorite Customer.flac")
	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}
	err = c.IndexMusicFile("Father John Misty/God’s Favorite Customer/09 The Songwriter.flac")
	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}

	var count int
	c.db.Model(&Album{}).Where("title = ?", "God’s Favorite Customer").Count(&count)
	if count != 1 {
		t.Errorf("Album indexed %d times, should be 1", count)
	}
}

func TestArtistIsOnlyIndexedOnce(t *testing.T) {
	c := initClient()

	err := c.IndexMusicFile("Father John Misty/God’s Favorite Customer/08 God’s Favorite Customer.flac")
	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}
	err = c.IndexMusicFile("Father John Misty/God’s Favorite Customer/09 The Songwriter.flac")
	if err != nil {
		t.Errorf("Indexing failed with error %s", err.Error())
	}

	var count int
	c.db.Model(&Artist{}).Where("name = ?", "Father John Misty").Count(&count)
	if count != 1 {
		t.Errorf("Artist indexed %d times, should be 1", count)
	}
}
