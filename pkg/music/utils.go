package music

import (
	"fmt"
	log "github.com/sirupsen/logrus"
	"io/ioutil"
	"os"
)

func GetSchema() string {
	f, err := os.Open("schema.graphql")
	if err != nil {
		log.Fatal(err)
	}
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		log.Fatal(err)
	}
	return string(b)
}

type apiError struct {
	Code    string `json:"code"`
	Message string `json:"message"`
}

func (e apiError) Error() string {
	return fmt.Sprintf("error [%s]: %s", e.Code, e.Message)
}

func (e apiError) Extensions() map[string]interface{} {
	return map[string]interface{}{
		"code":    e.Code,
		"message": e.Message,
	}
}

func isMusicFile(filetype string) bool {
	for _, t := range []string{"flac"} {
		if filetype == t {
			return true
		}
	}
	return false
}

func (c Client) GetPlaybackUrl(t Track) (string, error) {
	updated, playbackUrl, expiry, err := c.getSafeFileUrl(t.ObjectKey, t.UrlCache, t.UrlCacheExpires)
	if err != nil {
		return "", err
	}
	if !updated {
		return *playbackUrl, nil
	}

	t.UrlCache = playbackUrl
	t.UrlCacheExpires = expiry
	c.db.Save(&t)

	return *playbackUrl, nil
}

func (c Client) GetCoverUrl(a Album) (string, error) {
	coverKey := fmt.Sprintf("%scover.jpg", a.ObjectPrefix)
	updated, coverUrl, expiry, err := c.getSafeFileUrl(coverKey, a.UrlCache, a.UrlCacheExpires)
	if err != nil {
		return "", err
	}
	if !updated {
		return *coverUrl, nil
	}

	a.UrlCache = coverUrl
	a.UrlCacheExpires = expiry
	c.db.Save(&a)

	return *coverUrl, nil
}
