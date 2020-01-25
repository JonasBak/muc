package api

import (
	// "context"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/config"
	"github.com/JonasBak/infrastucture/containers/muc/pkg/music"
	"net/http"
	"net/http/httptest"
	"testing"
)

func TestAuthMiddeware(t *testing.T) {
	config.Config = config.ConfigStruct{MinioHost: "localhost:9000", SqliteLocation: ":memory:"}
	c := music.NewClient()

	user, err := c.NewUser("admin", "admin", true)
	if err != nil {
		t.Fatal(err)
	}

	session, err := c.NewSession(*user)
	if err != nil {
		t.Fatal(err)
	}

	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		ctx := r.Context()
		user := ctx.Value("mucUser").(*music.User)
		if user == nil {
			w.Write([]byte("no user"))
		} else {
			w.Write([]byte(user.Username))
		}
	})

	t.Run("Test use middleware not authorized dont require auth", func(t *testing.T) {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/", nil)
		if err != nil {
			t.Fatal(err)
		}
		AuthMiddleware(&c, false, handler).ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Handler returned wrong status code: got '%v' want '%v'",
				status, http.StatusOK)
		}
		expected := "no user"
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got '%v' want '%v'",
				rr.Body.String(), expected)
		}
	})
	t.Run("Test use middleware authorized dont require auth", func(t *testing.T) {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/", nil)
		req.Header.Set("muc-auth", session.Token)
		if err != nil {
			t.Fatal(err)
		}
		AuthMiddleware(&c, false, handler).ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Handler returned wrong status code: got '%v' want '%v'",
				status, http.StatusOK)
		}
		expected := "admin"
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got '%v' want '%v'",
				rr.Body.String(), expected)
		}
	})
	t.Run("Test use middleware not authorized require auth", func(t *testing.T) {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/", nil)
		if err != nil {
			t.Fatal(err)
		}
		AuthMiddleware(&c, true, handler).ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusUnauthorized {
			t.Errorf("Handler returned wrong status code: got '%v' want '%v'",
				status, http.StatusUnauthorized)
		}
		expected := ""
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got '%v' want '%v'",
				rr.Body.String(), expected)
		}
	})
	t.Run("Test use middleware authorized require auth", func(t *testing.T) {
		rr := httptest.NewRecorder()
		req, err := http.NewRequest("GET", "/", nil)
		req.Header.Set("muc-auth", session.Token)
		if err != nil {
			t.Fatal(err)
		}
		AuthMiddleware(&c, true, handler).ServeHTTP(rr, req)
		if status := rr.Code; status != http.StatusOK {
			t.Errorf("Handler returned wrong status code: got '%v' want '%v'",
				status, http.StatusOK)
		}
		expected := "admin"
		if rr.Body.String() != expected {
			t.Errorf("handler returned unexpected body: got '%v' want '%v'",
				rr.Body.String(), expected)
		}
	})
}
