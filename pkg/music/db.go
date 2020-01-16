package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/minio/minio-go/v6"
	"regexp"
	"time"
)

type Album struct {
	gorm.Model
	Tracks []Track
	Title  string `gorm:"not null"`

	ObjectPrefix string `gorm:"not null"`

	Url        *string
	UrlExpires *time.Time
}

type Track struct {
	gorm.Model
	Title     string `gorm:"not null"`
	ObjectKey string `gorm:"not null;unique"`
	Filetype  string `gorm:"not null"`

	AlbumID uint  `gorm:"not null"`
	Album   Album `gorm:"not null"`

	Artist string `gorm:"not null"`

	Url        *string
	UrlExpires *time.Time
}

// TODO
// Create a StartImport that sets a "verified" flag to false
// Set flag to true as tracks are imported/found
// Shows what tracks are moved/deleted, withour deleting the entire db

func (c Client) IndexAlbum(subs []string) (Album, error) {
	var album Album

	object_prefix := fmt.Sprintf("%s/%s/", subs[1], subs[2])

	c.db.Where("object_prefix = ?", object_prefix).First(&album)

	if album.Model.ID != 0 {
		return album, nil
	}

	album.Title = subs[2]
	album.ObjectPrefix = object_prefix
	c.db.Create(&album)

	return album, nil
}

func (c Client) IndexMusicFile(object minio.ObjectInfo) error {
	// TODO only compile once
	r := regexp.MustCompile(`(.+)/(.+)/(.+)\.(\w+)`)
	subs := r.FindStringSubmatch(object.Key)
	if len(subs) != 5 {
		return fmt.Errorf("Could not parse object with key: %s", object.Key)
	}

	if !isMusicFile(subs[4]) {
		return nil
	}

	var count int

	c.db.Model(&Track{}).Where("object_key = ?", object.Key).Count(&count)

	if count != 0 {
		// fmt.Printf("Already exists %s\n", object.Key)
		return nil
	}

	album, err := c.IndexAlbum(subs)
	if err != nil {
		return err
	}

	track := Track{Album: album, Artist: subs[1], Title: subs[3], ObjectKey: object.Key, Filetype: subs[4]}
	c.db.Create(&track)
	fmt.Printf("Added %s\n", object.Key)

	return nil
}

func GetGormClient() *gorm.DB {
	db, err := gorm.Open("sqlite3", config.Config.SqliteLocation)
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Track{}, &Album{})
	return db
}
