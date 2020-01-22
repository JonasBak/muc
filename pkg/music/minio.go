package music

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/minio/minio-go/v6"
	log "github.com/sirupsen/logrus"
	"net/url"
	"time"
)

func (c Client) getSafeFileUrl(key string, fileUrl *string, expiry *time.Time) (bool, *string, *time.Time, error) {
	if fileUrl != nil && expiry != nil && expiry.Sub(time.Now()) > time.Duration(config.Config.MucLinkMargin)*time.Minute {
		return false, fileUrl, nil, nil
	}
	ttl := time.Duration(config.Config.MucLinkTtl) * time.Minute
	newExpiry := time.Now().Add(ttl)

	reqParams := make(url.Values)
	newUrl, err := c.MC.PresignedGetObject(config.Config.MinioBucket, key, ttl, reqParams)
	if err != nil {
		log.WithFields(log.Fields{"error": err.Error()}).Warn("Could not get prisigned object url!")
		return false, nil, nil, err
	}

	log.WithFields(log.Fields{"key": key}).Debug("Generated new presigned url")

	newUrlString := newUrl.String()
	return true, &newUrlString, &newExpiry, nil
}

func (c Client) SyncMusicFiles() error {
	doneCh := make(chan struct{})

	defer close(doneCh)

	objectCh := c.MC.ListObjectsV2(config.Config.MinioBucket, "", true, doneCh)
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
