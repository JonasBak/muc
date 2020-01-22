package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	log "github.com/sirupsen/logrus"
	"regexp"
	"strconv"
	"time"
)

type Artist struct {
	gorm.Model
	Name         string `gorm:"not null"`
	ObjectPrefix string `gorm:"not null"`

	Albums []Album
}

type Album struct {
	gorm.Model
	Title        string `gorm:"not null"`
	ObjectPrefix string `gorm:"not null"`

	ArtistID uint   `gorm:"not null"`
	Artist   Artist `gorm:"not null"`
	Tracks   []Track

	UrlCache        *string
	UrlCacheExpires *time.Time
}

type Track struct {
	gorm.Model
	Title      string `gorm:"not null"`
	ObjectKey  string `gorm:"not null;unique"`
	TrackIndex int    `gorm:"not null"`
	Filetype   string `gorm:"not null"`

	AlbumID uint  `gorm:"not null"`
	Album   Album `gorm:"not null"`

	UrlCache        *string
	UrlCacheExpires *time.Time
}

// TODO
// Create a StartImport that sets a "verified" flag to false
// Set flag to true as tracks are imported/found
// Shows what tracks are moved/deleted, withour deleting the entire db

func (c Client) IndexArtist(subs []string) (*Artist, error) {
	var artist Artist

	object_prefix := fmt.Sprintf("%s/", subs[1])

	if !c.DB.Where("object_prefix = ?", object_prefix).First(&artist).RecordNotFound() {
		return &artist, nil
	}

	artist.Name = subs[1]
	artist.ObjectPrefix = object_prefix
	c.DB.Create(&artist)

	return &artist, nil
}

func (c Client) IndexAlbum(subs []string) (*Album, error) {
	var album Album

	object_prefix := fmt.Sprintf("%s/%s/", subs[1], subs[2])

	if !c.DB.Where("object_prefix = ?", object_prefix).First(&album).RecordNotFound() {
		return &album, nil
	}

	artist, err := c.IndexArtist(subs)
	if err != nil {
		return nil, err
	}

	album.Title = subs[2]
	album.Artist = *artist
	album.ObjectPrefix = object_prefix
	c.DB.Create(&album)

	return &album, nil
}

func (c Client) IndexMusicFile(objectKey string) error {
	// TODO only compile once
	r := regexp.MustCompile(`(.+)/(.+)/(\d+)\s+(.+)\.(\w+)`)
	subs := r.FindStringSubmatch(objectKey)
	if len(subs) != 6 {
		return fmt.Errorf("Could not parse object with key: %s", objectKey)
	}

	if !isMusicFile(subs[5]) {
		return fmt.Errorf("Object with key %s doesn't have allowed filetype %s", objectKey, subs[5])
	}

	var count int

	c.DB.Model(&Track{}).Where("object_key = ?", objectKey).Count(&count)

	if count != 0 {
		log.WithFields(log.Fields{"key": objectKey}).Debug("Object already indexed")
		return nil
	}

	album, err := c.IndexAlbum(subs)
	if err != nil {
		return err
	}

	trackIndex, err := strconv.Atoi(subs[3])
	if err != nil {
		log.WithFields(log.Fields{"key": objectKey}).Warn("Could not get TrackIndex")
		trackIndex = -1
	}

	track := Track{Album: *album, Title: subs[4], ObjectKey: objectKey, Filetype: subs[5], TrackIndex: trackIndex}
	c.DB.Create(&track)
	log.WithFields(log.Fields{"key": objectKey}).Debug("Object indexed")

	return nil
}

func GetGormClient() *gorm.DB {
	db, err := gorm.Open("sqlite3", config.Config.SqliteLocation)
	if err != nil {
		log.WithFields(log.Fields{"error": err.Error()}).Fatal("Failed to connect to database")
	}
	db.AutoMigrate(&Track{}, &Album{}, &Artist{})
	return db
}
