package api

import (
	"context"
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
		ctx := context.Background()
		ctx = context.WithValue(ctx, "mucClient", client)
		handler.ServeHTTP(w, r.WithContext(ctx))
	})
}

func GiQLHandler() http.HandlerFunc {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Write(graphiql)
	})
}
