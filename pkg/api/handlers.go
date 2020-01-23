package api

import (
	"context"
	"encoding/json"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"net/http"
	"time"
)

func QueryHandler(client *music.Client) http.Handler {
	opts := []graphql.SchemaOpt{graphql.UseFieldResolvers(), graphql.MaxParallelism(20)}
	resolver := music.NewResolver(client)
	schema := graphql.MustParseSchema(music.GetSchema(), &resolver, opts...)
	handler := relay.Handler{Schema: schema}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		ctx = context.WithValue(ctx, "mucClient", client)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GiQLHandler() http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(graphiql)
	})
}

func LoginHandler(client *music.Client) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		var creds Credentials
		if err := json.NewDecoder(r.Body).Decode(&creds); err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		var user music.User
		if client.DB.Where("username = ?", creds.Username).First(&user).RecordNotFound() {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		if !user.CorrectPassword(creds.Password) {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		session, err := client.NewSession(user)
		if err != nil {
			w.WriteHeader(http.StatusBadRequest)
			return
		}

		http.SetCookie(w, &http.Cookie{
			Name:    config.Config.MucCookieName,
			Value:   session.Token,
			Expires: time.Now().Add(120 * time.Minute),
		})
	})
}
