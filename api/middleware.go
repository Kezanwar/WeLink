package main

import (
	"log"
	"net/http"
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
		// Do stuff here
		log.Println(r.RequestURI)
		log.Println("---------------------------------------------------")
		// Call the next handler, which can be another middleware in the chain, or the final handler.
		next.ServeHTTP(w, r)
	})
}
