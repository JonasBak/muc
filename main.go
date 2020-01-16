package main

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/api"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	"net/http"
	"os"
)

func applyMiddleware(handler http.Handler) http.Handler {
	// CORS
	headersOk := handlers.AllowedHeaders([]string{"Authorization"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	handler = handlers.CORS(originsOk, headersOk, methodsOk)(handler)

	// Logging
	handler = handlers.LoggingHandler(os.Stdout, handler)

	return handler
}

func main() {
	fmt.Println("Reading config...")

	config.ReadConfig()

	fmt.Println("Creating client...")

	c := music.NewClient()

	// c.SyncMusicFiles()

	fmt.Println("Creating muc server...")

	router := mux.NewRouter()

	rootHandler := applyMiddleware(http.HandlerFunc(api.GQLHandler()))
	router.Handle("/", rootHandler)

	queryHandler := applyMiddleware(http.HandlerFunc(api.QueryHandler(&c)))
	router.Handle("/query", queryHandler)

	fmt.Printf("Starting muc server on port %d...\n", config.Config.MucPort)

	http.ListenAndServe(fmt.Sprintf(":%d", config.Config.MucPort), (router))
}
