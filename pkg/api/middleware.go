package api

import (
	"context"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	"net/http"
)

func AuthMiddleware(c *music.Client, requireLogin bool, next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		var user *music.User = nil

		token := ""
		if cookie, err := r.Cookie("muc-auth"); err == nil {
			token = cookie.Value
		} else {
			token = r.Header.Get("muc-auth")
		}
		var session music.Session
		if !c.DB.Where("token = ?", token).Preload("User").First(&session).RecordNotFound() {
			user = &session.User
		}
		if requireLogin && user == nil {
			w.WriteHeader(http.StatusUnauthorized)
			return
		}
		ctx = context.WithValue(ctx, "mucUser", user)
		next.ServeHTTP(w, r.WithContext(ctx))
	})
}
