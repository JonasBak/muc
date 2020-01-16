package config

import (
	"fmt"
	"github.com/go-yaml/yaml"
	"github.com/kelseyhightower/envconfig"
	"os"
)

var Config ConfigStruct

type ConfigStruct struct {
	MucPort        uint   `yaml:"muc-port" envconfig:"MUC_PORT"`
	MinioHost      string `yaml:"minio-host" envconfig:"MINIO_HOST"`
	MinioAccess    string `yaml:"minio-access" envconfig:"MINIO_ACCESS"`
	MinioSecret    string `yaml:"minio-secret" envconfig:"MINIO_SECRET"`
	MinioBucket    string `yaml:"minio-bucket" envconfig:"MINIO_BUCKET"`
	MinioSSL       bool   `yaml:"minio-ssl" envconfig:"MINIO_SSL"`
	SqliteLocation string `yaml:"sqlite-location" envconfig:"SQLITE_LOCATION"`
}

func processError(err error) {
	fmt.Println(err)
	os.Exit(2)
}

func readFile(cfg *ConfigStruct) {
	f, err := os.Open("config.yml")
	if err != nil {
		processError(err)
	}
	defer f.Close()

	decoder := yaml.NewDecoder(f)
	err = decoder.Decode(cfg)
	if err != nil {
		processError(err)
	}
}

func readEnv(cfg *ConfigStruct) {
	err := envconfig.Process("", cfg)
	if err != nil {
		processError(err)
	}
}

func ReadConfig() {
	var config ConfigStruct

	readFile(&config)
	readEnv(&config)

	fmt.Printf("Using config:\n%+v\n", config) // TODO only print in dev

	Config = config
}
