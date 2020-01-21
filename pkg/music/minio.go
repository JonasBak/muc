package music

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/minio/minio-go/v6"
	log "github.com/sirupsen/logrus"
)

func (c Client) SyncMusicFiles() error {
	doneCh := make(chan struct{})

	defer close(doneCh)

	objectCh := c.mc.ListObjectsV2(config.Config.MinioBucket, "", true, doneCh)
	for object := range objectCh {
		if object.Err != nil {
			log.WithFields(log.Fields{"error": object.Err.Error()}).Fatal("Failed to connect to minio")
			return object.Err
		}
		err := c.IndexMusicFile(object.Key)
		if err != nil {
			log.WithFields(log.Fields{"key": object.Key}).Warn("Could not parse object")
		}
	}
	return nil
}

func GetMinioClient() *minio.Client {
	minioClient, err := minio.New(config.Config.MinioHost, config.Config.MinioAccess, config.Config.MinioSecret, config.Config.MinioSSL)
	if err != nil {
		log.WithFields(log.Fields{"error": err.Error()}).Fatal("Failed to connect to minio")
	}
	return minioClient
}
