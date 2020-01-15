package music

import (
	// "fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/jinzhu/gorm"
	_ "github.com/jinzhu/gorm/dialects/sqlite"
	"github.com/minio/minio-go/v6"
)

type Track struct {
	gorm.Model
	Title string
}

func IndexMusicFile(object *minio.Object) {

}

func GetGormClient() *gorm.DB {
	db, err := gorm.Open("sqlite3", config.Config.SqliteLocation)
	if err != nil {
		panic("failed to connect database")
	}
	db.AutoMigrate(&Track{})
	return db
}
