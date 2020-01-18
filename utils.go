package main

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	log "github.com/sirupsen/logrus"
)

func initLogs() {
	log.SetFormatter(&log.JSONFormatter{})

	if config.Config.LogLevel == "debug" {
		log.SetLevel(log.DebugLevel)
	} else if config.Config.LogLevel == "info" {
		log.SetLevel(log.InfoLevel)
	} else if config.Config.LogLevel == "warn" {
		log.SetLevel(log.WarnLevel)
	} else if config.Config.LogLevel == "error" {
		log.SetLevel(log.ErrorLevel)
	}
}
