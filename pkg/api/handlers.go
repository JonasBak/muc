package api

import (
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/relay"
	"net/http"
)

func QueryHandler(client *music.Client) http.HandlerFunc {
	opts := []graphql.SchemaOpt{graphql.UseFieldResolvers(), graphql.MaxParallelism(20)}
	resolver := music.NewResolver(client)
	schema := graphql.MustParseSchema(music.Schema, &resolver, opts...)
	handler := relay.Handler{Schema: schema}
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		handler.ServeHTTP(w, r)
	})
}

func GQLHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(graphiql)
	})
}
