package api

import (
	"context"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	"net/http"
	"time"
)

func AuthMiddleware(c *music.Client, requreLogin bool, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var user *music.User = nil

		if cookie, err := r.Cookie(config.Config.MucCookieName); cookie != nil && err == nil {
			token := cookie.Value
			var session music.Session
			if !c.DB.Where("token = ?", token).Preload("User").First(&session).RecordNotFound() {
				user = &session.User
			}
		}
		if requreLogin && user == nil {
			expiration := time.Now().AddDate(0, 0, -1)
			cookie := http.Cookie{Name: config.Config.MucCookieName, Value: "", Expires: expiration}
			http.SetCookie(w, &cookie)
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		ctx = context.WithValue(ctx, "mucUser", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
