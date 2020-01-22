package music

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"os"
	"testing"
)

func initMinio(t *testing.T) Client {
	t.Helper()
	if os.Getenv("TEST_AGAINST_MINIO") != "true" {
		t.Skip("skipping, run with 'TEST_AGAINST_MINIO=true' to include")
	}
	os.Setenv("CONFIG_FILE", "../../test/config.test.yml")
	config.ReadConfig()
	config.Config.MinioBucket = "testing-minio"

	return NewClient()
}

func subtestSyncMusicFiles(c Client) func(*testing.T) {
	return func(t *testing.T) {
		err := c.SyncMusicFiles()

		if err != nil {
			t.Error(err.Error())
		}

		var artist Artist
		if c.db.Where("name = ?", "Phlake").Preload("Albums").Preload("Albums.Tracks").First(&artist).RecordNotFound() {
			t.Error("Couldn't find artist 'Phlake' in database after syncing")
		}
		if len(artist.Albums) != 1 {
			t.Errorf("Artist 'Phlake' is supposed to have 1 album, but has %d", len(artist.Albums))
		}
		if len(artist.Albums[0].Tracks) != 12 {
			t.Errorf("'Phlake'->'Slush Hours' is supposed to have 12 tracks, but has %d", len(artist.Albums[0].Tracks))
		}

		artist = Artist{}
		if c.db.Where("name = ?", "Mikhael Paskalev").Preload("Albums").Preload("Albums.Tracks").First(&artist).RecordNotFound() {
			t.Error("Couldn't find artist 'Mikhael Paskalev' in database after syncing")
		}
		if len(artist.Albums) != 1 {
			t.Errorf("Artist 'Mikhael Paskalev' is supposed to have 1 album, but has %d", len(artist.Albums))
		}
		if len(artist.Albums[0].Tracks) != 11 {
			t.Errorf("'Mikhael Paskalev'->'Heavy' is supposed to have 11 tracks, but has %d", len(artist.Albums[0].Tracks))
		}
	}
}

func TestMinio(t *testing.T) {
	c := initMinio(t)

	var count int
	c.db.Model(&Track{}).Count(&count)
	if count != 0 {
		t.Errorf("There is supposed to be 0 tracks in the database when starting, but there is %d", count)
	}

	t.Run("Test syncMusicFiles", subtestSyncMusicFiles(c))
}
