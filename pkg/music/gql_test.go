package music

import (
	"context"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	graphql "github.com/graph-gophers/graphql-go"
	"github.com/graph-gophers/graphql-go/gqltesting"
	"io/ioutil"
	"os"
	"testing"
)

var testKeys []string = []string{
	"Tyler, the Creator/Flower Boy/01 Foreword.flac",
	"Tyler, the Creator/Flower Boy/02 Where This Flower Blooms.flac",
	"Tyler, the Creator/Flower Boy/03 Sometimes….flac",
	"Tyler, the Creator/Flower Boy/04 See You Again.flac",
	"Tyler, the Creator/Flower Boy/05 Who Dat Boy.flac",
	"Tyler, the Creator/Flower Boy/06 Pothole.flac",
	"Tyler, the Creator/Flower Boy/07 Garden Shed.flac",
	"Tyler, the Creator/Flower Boy/08 Boredom.flac",
	"Tyler, the Creator/Flower Boy/09 I Ain’t Got Time!.flac",
	"Tyler, the Creator/Flower Boy/10 911 _ Mr. Lonely.flac",
	"Tyler, the Creator/Flower Boy/11 Droppin’ Seeds.flac",
	"Tyler, the Creator/Flower Boy/12 November.flac",
	"Tyler, the Creator/Flower Boy/13 Glitter.flac",
	"Tyler, the Creator/Flower Boy/14 Enjoy Right Now, Today.flac",
}

type testQuery struct {
	name     string
	expected string
	query    string
}

var testQueries []testQuery = []testQuery{
	testQuery{
		name: "track nested query",
		query: `
      {
        track(trackId:1) {
          id
          title
          trackIndex
          album {
            title
            artist {
              name
            }
          }
        }
      }
    `,
		expected: `
      {
        "track": {
          "id": "1",
          "title": "Foreword",
          "trackIndex": 1,
          "album": {
            "title": "Flower Boy",
            "artist": {
              "name": "Tyler, the Creator"
            }
          }
        }
      }
    `,
	},
	testQuery{
		name: "album nested query",
		query: `
      {
        album(albumId:1) {
          id
          title
          artist {
            name
          }
          tracks {
            trackIndex
            title
          }
        }
      }
    `,
		expected: `
      {
        "album": {
          "id": "1",
          "title": "Flower Boy",
          "artist": {
            "name": "Tyler, the Creator"
          },
          "tracks": [
            {"trackIndex": 1, "title": "Foreword"},
            {"trackIndex": 2, "title": "Where This Flower Blooms"},
            {"trackIndex": 3, "title": "Sometimes…"},
            {"trackIndex": 4, "title": "See You Again"},
            {"trackIndex": 5, "title": "Who Dat Boy"},
            {"trackIndex": 6, "title": "Pothole"},
            {"trackIndex": 7, "title": "Garden Shed"},
            {"trackIndex": 8, "title": "Boredom"},
            {"trackIndex": 9, "title": "I Ain’t Got Time!"},
            {"trackIndex": 10, "title": "911 _ Mr. Lonely"},
            {"trackIndex": 11, "title": "Droppin’ Seeds"},
            {"trackIndex": 12, "title": "November"},
            {"trackIndex": 13, "title": "Glitter"},
            {"trackIndex": 14, "title": "Enjoy Right Now, Today"}
          ]
        }
      }
    `,
	},
	testQuery{
		name: "artist nested query",
		query: `
      {
        artist(artistId:1) {
          id
          name
          albums {
            title
            tracks {
              trackIndex
              title
            }
          }
        }
      }
    `,
		expected: `
      {
        "artist": {
          "id": "1",
          "name": "Tyler, the Creator",
          "albums": [
            {
              "title": "Flower Boy",
              "tracks": [
                {"trackIndex": 1, "title": "Foreword"},
                {"trackIndex": 2, "title": "Where This Flower Blooms"},
                {"trackIndex": 3, "title": "Sometimes…"},
                {"trackIndex": 4, "title": "See You Again"},
                {"trackIndex": 5, "title": "Who Dat Boy"},
                {"trackIndex": 6, "title": "Pothole"},
                {"trackIndex": 7, "title": "Garden Shed"},
                {"trackIndex": 8, "title": "Boredom"},
                {"trackIndex": 9, "title": "I Ain’t Got Time!"},
                {"trackIndex": 10, "title": "911 _ Mr. Lonely"},
                {"trackIndex": 11, "title": "Droppin’ Seeds"},
                {"trackIndex": 12, "title": "November"},
                {"trackIndex": 13, "title": "Glitter"},
                {"trackIndex": 14, "title": "Enjoy Right Now, Today"}
              ]
            }
          ]
        }
      }
    `,
	},
}

func initGQL(t *testing.T) (Client, context.Context, *graphql.Schema) {
	t.Helper()

	config.Config = config.ConfigStruct{MinioHost: "localhost:9000", SqliteLocation: ":memory:"}

	c := NewClient()

	for _, key := range testKeys {
		err := c.IndexMusicFile(key)
		if err != nil {
			t.Errorf("Indexing failed with error %s", err.Error())
		}
	}

	ctx := context.Background()
	ctx = context.WithValue(ctx, "mucClient", c)
	var user *User = nil
	ctx = context.WithValue(ctx, "mucUser", user)

	f, err := os.Open("../../schema.graphql")
	if err != nil {
		t.Error(err.Error())
	}
	defer f.Close()
	b, err := ioutil.ReadAll(f)
	if err != nil {
		t.Error(err.Error())
	}
	schemaString := string(b)

	opts := []graphql.SchemaOpt{graphql.UseFieldResolvers(), graphql.MaxParallelism(20)}
	resolver := NewResolver(&c)
	schema := graphql.MustParseSchema(schemaString, &resolver, opts...)

	return c, ctx, schema
}

func TestNestedQuery(t *testing.T) {
	_, ctx, schema := initGQL(t)

	for _, test := range testQueries {
		t.Run(test.name, func(t *testing.T) {
			gqltesting.RunTest(t, &gqltesting.Test{
				Context:        ctx,
				Schema:         schema,
				Query:          test.query,
				ExpectedResult: test.expected,
			})
		})
	}
}

func TestPlaylist(t *testing.T) {
	c, ctx, schema := initGQL(t)
	userA, err := c.NewUser("testuser", "test", false)
	if err != nil {
		t.Error(err)
	}
	userB, err := c.NewUser("testuserB", "test", false)
	if err != nil {
		t.Error(err)
	}

	t.Run("anonymous can't create playlist", func(t *testing.T) {
		test := gqltesting.Test{
			Context: ctx,
			Schema:  schema,
			Query: `
          mutation {
            newPlaylist(name: "test playlist") {
              id
              name
            }
          }
        `,
		}
		result := test.Schema.Exec(test.Context, test.Query, test.OperationName, test.Variables)

		if len(result.Errors) != 1 {
			t.Errorf("Expects 1 Unauthorized error, got %+v", result.Errors)
		}
		if result.Errors[0].Extensions["code"] != "Unauthorized" {
			t.Errorf("Shoud return 'Unauthorized', got %+v", result.Errors)
		}
	})
	t.Run("user can create playlist", func(t *testing.T) {
		gqltesting.RunTest(t, &gqltesting.Test{
			Context: context.WithValue(ctx, "mucUser", userA),
			Schema:  schema,
			Query: `
        mutation {
          newPlaylist(name: "test playlist") {
            name
          }
        }
      `,
			ExpectedResult: `
        {
          "newPlaylist": {
            "name": "test playlist"
          }
        }
      `,
		})
	})
	t.Run("user can add to playlist", func(t *testing.T) {
		gqltesting.RunTest(t, &gqltesting.Test{
			Context: context.WithValue(ctx, "mucUser", userA),
			Schema:  schema,
			Query: `
        mutation {
          addToPlaylist(playlistId: 1, trackId: 1) {
            id
            name
            tracks {
              id
            }
          }
        }
      `,
			ExpectedResult: `
        {
          "addToPlaylist": {
            "id": "1",
            "name": "test playlist",
            "tracks": [{ "id": "1" }]
          }
        }
      `,
		})
	})
	t.Run("can't add to other users playlist", func(t *testing.T) {
		test := gqltesting.Test{
			Context: context.WithValue(ctx, "mucUser", userB),
			Schema:  schema,
			Query: `
          mutation {
            addToPlaylist(playlistId: 1, trackId: 1) {
              name
            }
          }
        `,
		}
		result := test.Schema.Exec(test.Context, test.Query, test.OperationName, test.Variables)

		if len(result.Errors) != 1 {
			t.Errorf("Expects 1 Unauthorized error, got %+v", result.Errors)
		}
		if result.Errors[0].Extensions["code"] != "NotAllowed" {
			t.Errorf("Shoud return 'NotAllowed', got %+v", result.Errors)
		}
	})
}
