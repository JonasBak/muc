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
	router := mux.NewRouter()
	rootHandler := applyMiddleware(http.HandlerFunc(api.RootHandler))
	router.Handle("/", rootHandler)

	fmt.Println("Reading config...")

	config.ReadConfig()

	fmt.Println("Creating client...")

	_ = music.NewClient()

	fmt.Println("Starting muc server...")

	http.ListenAndServe(":3000", (router))
}
