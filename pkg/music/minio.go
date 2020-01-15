package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/minio/minio-go/v6"
)

func (c Client) SyncMusicFiles() error {
	doneCh := make(chan struct{})

	defer close(doneCh)

	objectCh := c.mc.ListObjectsV2(config.Config.MinioBucket, "", true, doneCh)
	for object := range objectCh {
		if object.Err != nil {
			fmt.Println(object.Err)
			return nil
		}
		err := c.IndexMusicFile(object)
		if err != nil {
			fmt.Println(err)
		}
	}
	return nil
}

func GetMinioClient() *minio.Client {
	minioClient, err := minio.New(config.Config.MinioHost, config.Config.MinioAccess, config.Config.MinioSecret, config.Config.MinioSSL)
	if err != nil {
		panic("failed to connect minio")
	}
	return minioClient
}
