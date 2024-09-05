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
	ListenAddr string
	NilError   int
}

type ApiHandler func(http.ResponseWriter, *http.Request) (int, error)

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
	File []byte `json:"file"`
}

var PORT = string(":") + os.Getenv("PORT")

var Api = &APIServer{
	ListenAddr: PORT,
	NilError:   0,
}

func (s *APIServer) makeHTTPHandler(f ApiHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code, err := f(w, r)

		if err != nil {
			s.writeJson(w, code, ApiError{Message: err.Error()})
		}

	}
}

func (s *APIServer) writeJson(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
}

func (s *APIServer) serve() error {
	router := mux.NewRouter()

	router.HandleFunc("/api/file/{uuid}", s.makeHTTPHandler(s.handle_get_file))
	router.HandleFunc("/api/files/meta", s.makeHTTPHandler(s.handle_get_file))
	router.HandleFunc("/api/upload", s.makeHTTPHandler(s.handle_post_file))

	router.Use(loggingMiddleware)
	router.Use(makeAuthMiddleware())

	log.Println("WeLink api running on port", s.ListenAddr)

	http.ListenAndServe(s.ListenAddr, router)

	return nil
}

func (s *APIServer) handle_get_file(w http.ResponseWriter, r *http.Request) (int, error) {

	fmt.Println("runs")
	if r.Method == "GET" {
		uuid, err := s.get_uuid(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		_, imgErr := Redis.get_file(uuid)

		if imgErr != nil {
			return http.StatusNotFound, imgErr
		}

		return s.NilError, s.writeJson(w, http.StatusOK, &ImageSuccessResponse{
			Image: "success",
		})
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

func (s *APIServer) handle_post_file(w http.ResponseWriter, r *http.Request) (int, error) {

	if r.Method == "POST" {

		err := r.ParseMultipartForm(TWO_GIG)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse multipart form")
		}

		file, handler, err := r.FormFile("file")

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse multipart form")
		}

		defer file.Close()

		bytes, err := File.make_buffer_from_file(file)

		if err != nil {
			return http.StatusBadRequest, err
		}

		name := handler.Filename
		size := handler.Size
		file_type := handler.Header.Get("Content-Type")
		formatted_size := r.FormValue("size")
		uuid := Utility.create_uuid()

		meta := File.make_file_meta(name, file_type, formatted_size, size, uuid)

		binstring := Redis.binary_to_binstring(bytes)

		fmt.Println(len(binstring))

		return s.NilError, s.writeJson(w, http.StatusOK, meta)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}

}

func (s *APIServer) get_uuid(r *http.Request) (string, error) {
	uuidStr := mux.Vars(r)["uuid"]

	if len(uuidStr) == 0 {
		return "", fmt.Errorf("no ID given")
	}

	match := Utility.validate_uuid(uuidStr)

	if !match {
		return "", fmt.Errorf("not a valid uuid")
	}

	return uuidStr, nil
}
