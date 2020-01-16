package music

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"net/url"
	"time"
)

func isMusicFile(filetype string) bool {
	for _, t := range []string{"flac"} {
		if filetype == t {
			return true
		}
	}
	return false
}

func (c Client) getSafeFileUrl(key string, fileUrl *string, expiry *time.Time) (bool, string, *time.Time, error) {
	if fileUrl != nil && expiry != nil && expiry.Sub(time.Now()) > time.Duration(config.Config.MucLinkMargin)*time.Minute {
		return false, *fileUrl, nil, nil
	}
	ttl := time.Duration(config.Config.MucLinkTtl) * time.Minute
	newExpiry := time.Now().Add(ttl)

	reqParams := make(url.Values)
	newUrl, err := c.mc.PresignedGetObject(config.Config.MinioBucket, key, ttl, reqParams)
	if err != nil {
		fmt.Println(err)
		return false, "", nil, err
	}

	fmt.Printf("Generated new url for %s\n", key)

	return true, newUrl.String(), &newExpiry, nil
}

func (c Client) GetPlaybackUrl(t Track) (string, error) {
	updated, playbackUrl, expiry, err := c.getSafeFileUrl(t.ObjectKey, t.Url, t.UrlExpires)
	if err != nil {
		return "", err
	}
	if !updated {
		return playbackUrl, nil
	}

	t.Url = &playbackUrl
	t.UrlExpires = expiry
	c.db.Save(&t)

	return playbackUrl, nil
}

func (c Client) GetCoverUrl(a Album) (string, error) {
	coverKey := fmt.Sprintf("%scover.jpg", a.ObjectPrefix)
	updated, coverUrl, expiry, err := c.getSafeFileUrl(coverKey, a.Url, a.UrlExpires)
	if err != nil {
		return "", err
	}
	if !updated {
		return coverUrl, nil
	}

	a.Url = &coverUrl
	a.UrlExpires = expiry
	c.db.Save(&a)

	return coverUrl, nil
}
