package music

import (
	"github.com/jinzhu/gorm"
	"github.com/minio/minio-go/v6"
)

type Client struct {
	MC *minio.Client
	DB *gorm.DB
}

// TODO close

func NewClient() Client {
	return Client{MC: GetMinioClient(), DB: GetGormClient()}
}
