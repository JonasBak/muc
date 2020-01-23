package music

import (
	"fmt"
	"github.com/google/uuid"
	log "github.com/sirupsen/logrus"
	"golang.org/x/crypto/bcrypt"
	"io/ioutil"
	"os"
)

func (c Client) NewUser(username, password string, admin bool) (*User, error) {
	hash, err := bcrypt.GenerateFromPassword([]byte(password), bcrypt.DefaultCost)
	if err != nil {
		return nil, err
	}
	user := User{Username: username, Hash: string(hash), Admin: admin}

	if err := c.DB.Create(&user).Error; err != nil {
		return nil, err
	}
	return &user, nil
}

func (u User) CorrectPassword(password string) bool {
	err := bcrypt.CompareHashAndPassword([]byte(u.Hash), []byte(password))
	return err == nil
}

func (c Client) NewSession(user User) (*Session, error) {
	session := Session{User: user, Token: uuid.New().String()}

	if err := c.DB.Create(&session).Error; err != nil {
		return nil, err
	}
	return &session, nil
}

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
	c.DB.Save(&t)

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
	c.DB.Save(&a)

	return *coverUrl, nil
}
