package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"net/url"
	"time"
)

func is_music_file(filetype string) bool {
	for _, t := range []string{"flac"} {
		if filetype == t {
			return true
		}
	}
	return false
}

func (c Client) GetPlaybackUrl(t Track) (string, error) {
	if t.Url != nil && t.UrlExpires != nil && t.UrlExpires.Sub(time.Now()) > time.Duration(config.Config.MucLinkMargin)*time.Minute {
		return *t.Url, nil
	}
	ttl := time.Duration(config.Config.MucLinkTtl) * time.Minute
	expiry := time.Now().Add(ttl)

	reqParams := make(url.Values)
	new_url, err := c.mc.PresignedGetObject(config.Config.MinioBucket, t.ObjectKey, ttl, reqParams)
	if err != nil {
		fmt.Println(err)
		return "", err
	}

	url := new_url.String()

	t.Url = &url
	t.UrlExpires = &expiry
	c.db.Save(&t)

	fmt.Printf("Generated new url for %s", t.ObjectKey)

	return new_url.String(), nil
}
