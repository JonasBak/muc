package main

import (
	"fmt"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/api"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	"github.com/gorilla/handlers"
	"github.com/gorilla/mux"
	log "github.com/sirupsen/logrus"
	"github.com/urfave/cli/v2"
	"net/http"
	"os"
)

func applyMiddleware(handler http.Handler) http.Handler {
	// CORS
	headersOk := handlers.AllowedHeaders([]string{"muc-auth", "content-type"})
	originsOk := handlers.AllowedOrigins([]string{"*"})
	methodsOk := handlers.AllowedMethods([]string{"GET", "HEAD", "POST", "PUT", "OPTIONS"})
	handler = handlers.CORS(originsOk, headersOk, methodsOk)(handler)

	// Logging
	handler = handlers.LoggingHandler(os.Stdout, handler)

	return handler
}

func serveMuc(c music.Client) {
	log.Info("Creating muc server")

	router := mux.NewRouter()

	rootHandler := applyMiddleware(api.GiQLHandler())
	router.Handle("/", rootHandler)

	queryHandler := applyMiddleware(api.AuthMiddleware(&c, !config.Config.AllowUnauthenticated, api.QueryHandler(&c)))
	router.Handle("/query", queryHandler)

	loginHandler := applyMiddleware(api.LoginHandler(&c))
	router.Handle("/login", loginHandler)

	log.WithFields(log.Fields{"port": config.Config.MucPort}).Info("Starting muc api")

	http.ListenAndServe(fmt.Sprintf(":%d", config.Config.MucPort), (router))
}

func main() {

	app := &cli.App{
		Name:  "muc",
		Usage: "Music player",
		Commands: []*cli.Command{
			{
				Name:  "serve",
				Usage: "serve muc api",
				Action: func(c *cli.Context) error {
					config.ReadConfig()
					initLogs()
					client := music.NewClient()
					serveMuc(client)
					return nil
				},
			},
			{
				Name:  "user",
				Usage: "manage users",
				Subcommands: []*cli.Command{
					{
						Name:  "new",
						Usage: "create new user",
						Flags: []cli.Flag{
							&cli.StringFlag{
								Name:     "username",
								Aliases:  []string{"u"},
								Usage:    "username for new user",
								Required: true,
							},
							&cli.StringFlag{
								Name:     "password",
								Aliases:  []string{"p"},
								Usage:    "password for new user",
								Required: true,
							},
							&cli.BoolFlag{
								Name:  "admin",
								Usage: "is the new user an admin?",
							},
						},
						Action: func(c *cli.Context) error {
							config.ReadConfig()
							initLogs()
							client := music.NewClient()
							_, err := client.NewUser(c.String("username"), c.String("password"), c.Bool("admin"))
							return err
						},
					},
				},
			},
			{
				Name:  "config",
				Usage: "show muc config",
				Action: func(c *cli.Context) error {
					config.ReadConfig()
					fmt.Printf("Using config:\n%+v\n", config.Config)
					return nil
				},
			},
		},
	}

	err := app.Run(os.Args)
	if err != nil {
		log.Fatal(err)
	}
}
