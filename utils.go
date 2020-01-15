package main

import (
	"github.com/minio/minio-go/v6"
)

func ScanMusicFiles() error {
	return nil
}

func GetMinioClient() (*minio.Client, error) {
	// Use a secure connection.
	ssl := true

	// Initialize minio client object.
	minioClient, err := minio.New("play.min.io", "Q3AM3UQ867SPQQA43P2F", "zuf+tfteSlswRu7BJ86wekitnifILbZam1KYY3TG", ssl)
	if err != nil {
		return nil, err
	}
	return minioClient, nil
}
