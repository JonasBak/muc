package config

import (
	"fmt"
	"github.com/go-yaml/yaml"
	"github.com/kelseyhightower/envconfig"
	"os"
)

var Config ConfigStruct

type ConfigStruct struct {
	LogLevel string `yaml:"log-level" envconfig:"LOG_LEVEL"`

	MucPort       uint `yaml:"muc-port" envconfig:"MUC_PORT"`
	MucLinkTtl    uint `yaml:"muc-link-ttl" envconfig:"MUC_LINK_TTL"`
	MucLinkMargin uint `yaml:"muc-link-margin" envconfig:"MUC_LINK_MARGIN"`
	MucFindColors bool `yaml:"muc-find-colors" envconfig:"MUC_FIND_COLORS"`

	AllowUnauthenticated bool `yaml:"allow-unauthenticated" envconfig:"ALLOW_UNAUTHENTICATED"`

	MinioHost   string `yaml:"minio-host" envconfig:"MINIO_HOST"`
	MinioAccess string `yaml:"minio-access" envconfig:"MINIO_ACCESS"`
	MinioSecret string `yaml:"minio-secret" envconfig:"MINIO_SECRET"`
	MinioBucket string `yaml:"minio-bucket" envconfig:"MINIO_BUCKET"`
	MinioSSL    bool   `yaml:"minio-ssl" envconfig:"MINIO_SSL"`

	SqliteLocation string `yaml:"sqlite-location" envconfig:"SQLITE_LOCATION"`
}

func processError(err error) {
	fmt.Println(err)
	os.Exit(2)
}

func readFile(cfg *ConfigStruct) {
	configFile, ok := os.LookupEnv("CONFIG_FILE")
	if !ok {
		configFile = "config.yml"
	}
	f, err := os.Open(configFile)
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

	Config = config
}
