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

func TestTrackNestedQuery(t *testing.T) {
	_, ctx, schema := initGQL(t)

	gqltesting.RunTests(t, []*gqltesting.Test{
		{
			Context: ctx,
			Schema:  schema,
			Query: `
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
			ExpectedResult: `
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
	})
}

func TestAlbumNestedQuery(t *testing.T) {
	_, ctx, schema := initGQL(t)

	gqltesting.RunTests(t, []*gqltesting.Test{
		{
			Context: ctx,
			Schema:  schema,
			Query: `
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
			ExpectedResult: `
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
	})
}

func TestArtistNestedQuery(t *testing.T) {
	_, ctx, schema := initGQL(t)

	gqltesting.RunTests(t, []*gqltesting.Test{
		{
			Context: ctx,
			Schema:  schema,
			Query: `
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
			ExpectedResult: `
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
	})
}
