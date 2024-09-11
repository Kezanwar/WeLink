package main

import (
	"net/http"

	"github.com/fatih/color"
	"github.com/rs/cors"
)

func makeAuthMiddleware() func(http.Handler) http.Handler {
	return func(next http.Handler) http.Handler {
		return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {

			next.ServeHTTP(w, r)
			// if r.Method != "POST" {
			// 	next.ServeHTTP(w, r)
			// 	return
			// }

			// reqToken := r.Header.Get("x-auth-token")

			// if len(reqToken) == 0 {
			// 	WriteJSON(w, http.StatusForbidden, ApiError{Message: "invalid token"})
			// 	return
			// }

			// _, err := validateJWT(reqToken)

			// if err != nil {
			// 	WriteJSON(w, http.StatusForbidden, ApiError{Message: "invalid token"})
			// 	return
			// }

			// next.ServeHTTP(w, r)

		})
	}
}

func loggingMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		color.Cyan("%s --- %s", r.Method, r.RequestURI)
		next.ServeHTTP(w, r)
	})
}

var c = cors.New(cors.Options{
	AllowedOrigins:   []string{"*"},
	AllowedHeaders:   []string{"Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token", "Authorization"},
	AllowedMethods:   []string{"GET", "PATCH", "POST", "PUT", "OPTIONS", "DELETE"},
	Debug:            true,
	AllowCredentials: true,
})

func corsMiddleware(next http.Handler) http.Handler {
	return c.Handler(http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		if r.Method == "OPTIONS" {
			w.WriteHeader(http.StatusOK)
		} else {
			next.ServeHTTP(w, r)
		}
	}))
}
