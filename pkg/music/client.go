package music

import (
	"github.com/jinzhu/gorm"
	"github.com/minio/minio-go/v6"
)

type Client struct {
	mc *minio.Client
	db *gorm.DB
}

// TODO close

func NewClient() Client {
	return Client{mc: GetMinioClient(), db: GetGormClient()}
}
