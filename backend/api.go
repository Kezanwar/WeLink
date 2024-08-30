package main

import (
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/gorilla/mux"
	_ "github.com/joho/godotenv/autoload"
)

type APIServer struct {
	listenAddr string
}

type ApiHandler func(http.ResponseWriter, *http.Request) (error, int)

type ApiError struct {
	Message string `json:"message"`
}

type EmptySuccessResponse struct {
	Message string `json:"message"`
}

type ImageSuccessResponse struct {
	Image string `json:"image"`
}

type ImageUploadReq struct {
	Image string
}

var PORT = string(":") + os.Getenv("PORT")

var Api = &APIServer{
	listenAddr: PORT,
}

func makeHTTPHandler(f ApiHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		err, code := f(w, r)

		if err != nil {
			writeJson(w, code, ApiError{Message: err.Error()})
		}

		// if err := f(w, r); err != nil {
		// 	// handle the error
		// 	writeJson(w, http.StatusBadRequest, ApiError{Message: err.Error()})
		// }
	}
}

func writeJson(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func (s *APIServer) serve() error {
	router := mux.NewRouter()

	router.HandleFunc("/api/image/{uuid}", makeHTTPHandler(s.handleGetImage))
	router.HandleFunc("/api/upload", makeHTTPHandler(s.handlePostImage))

	router.Use(loggingMiddleware)
	router.Use(makeAuthMiddleware())

	log.Println("WeLink api running on port", s.listenAddr)

	http.ListenAndServe(s.listenAddr, router)

	return nil
}

func (s *APIServer) handleGetImage(w http.ResponseWriter, r *http.Request) (error, int) {

	fmt.Println("runs")
	if r.Method == "GET" {
		uuid, err := s.getUUID(r)

		if err != nil {
			return err, http.StatusBadRequest
		}

		image, imgErr := Redis.get_image(uuid)

		if imgErr != nil {
			return imgErr, http.StatusNotFound
		}

		return writeJson(w, http.StatusOK, &ImageSuccessResponse{
			Image: image,
		}), 0
	} else {
		return fmt.Errorf("method not allow %s", r.Method), http.StatusBadRequest
	}
}

func (s *APIServer) handlePostImage(w http.ResponseWriter, r *http.Request) (error, int) {

	if r.Method == "POST" {

		fmt.Println("runs")

		uuid := Utility.create_uuid()

		// var ImageReq = &ImageUploadReq{}

		// if err := json.NewDecoder(r.Body).Decode(ImageReq); err != nil {
		// 	return err, http.StatusBadRequest
		// }

		// defer r.Body.Close()

		// err := s.redis.SetImage(uuid, ImageReq.Image)

		// if err != nil {
		// 	return err, http.StatusBadRequest
		// }

		return writeJson(w, http.StatusOK, &EmptySuccessResponse{
			Message: uuid,
		}), 0
	} else {
		return fmt.Errorf("method not allow %s", r.Method), http.StatusBadRequest
	}

}

func (s *APIServer) getUUID(r *http.Request) (string, error) {
	uuidStr := mux.Vars(r)["uuid"]

	if len(uuidStr) == 0 {
		return "", fmt.Errorf("no ID given")
	}

	// uuid, err := strconv.Atoi(idStr)

	// // if ID cant cast to an int
	// if err != nil {
	// 	return 0, fmt.Errorf("invalid ID given: %s", idStr)
	// }

	return uuidStr, nil
}
