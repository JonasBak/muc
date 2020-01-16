package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/postgres"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/minio/minio-go/v6"
	"regexp"
)

type Track struct {
	gorm.Model
	Album     string `gorm:"not null"`
	Artist    string `gorm:"not null"`
	Title     string `gorm:"not null"`
	ObjectKey string `gorm:"not null;unique"`
	Filetype  string `gorm:"not null"`
}

// TODO
// Create a StartImport that sets a "verified" flag to false
// Set flag to true as tracks are imported/found
// Shows what tracks are moved/deleted, withour deleting the entire db

func (c Client) IndexMusicFile(object minio.ObjectInfo) error {
	// TODO only compile once
	r := regexp.MustCompile(`(.+)/(.+)/(.+)\.(\w+)`)
	subs := r.FindStringSubmatch(object.Key)
	if len(subs) != 5 {
		return fmt.Errorf("Could not parse object with key: %s", object.Key)
	}

	if !is_music_file(subs[4]) {
		return nil
	}

	var count int

	c.db.Model(&Track{}).Where("object_key = ?", object.Key).Count(&count)

	if count == 0 {
		track := Track{Album: subs[2], Artist: subs[1], Title: subs[3], ObjectKey: object.Key, Filetype: subs[4]}
		c.db.Create(&track)
		fmt.Printf("Added %s\n", object.Key)
	} else {
		// fmt.Printf("Already exists %s\n", object.Key)
	}

	return nil
}

func GetGormClient() *gorm.DB {
	db, err := gorm.Open("sqlite3", config.Config.SqliteLocation)
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Track{})
	return db
}
