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
	listenAddr: PORT,
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

	router.HandleFunc("/api/file/{uuid}", s.makeHTTPHandler(s.handleGetFile))
	router.HandleFunc("/api/files/meta", s.makeHTTPHandler(s.handleGetFile))
	router.HandleFunc("/api/upload", s.makeHTTPHandler(s.handlePostFile))

	router.Use(loggingMiddleware)
	router.Use(makeAuthMiddleware())

	log.Println("WeLink api running on port", s.listenAddr)

	http.ListenAndServe(s.listenAddr, router)

	return nil
}

func (s *APIServer) handleGetFile(w http.ResponseWriter, r *http.Request) (int, error) {

	fmt.Println("runs")
	if r.Method == "GET" {
		uuid, err := s.getUUID(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		_, imgErr := Redis.get_file(uuid)

		if imgErr != nil {
			return http.StatusNotFound, imgErr
		}

		return 0, s.writeJson(w, http.StatusOK, &ImageSuccessResponse{
			Image: "success",
		})
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

func (s *APIServer) handlePostFile(w http.ResponseWriter, r *http.Request) (int, error) {

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

		return 0, s.writeJson(w, http.StatusOK, meta)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}

}

func (s *APIServer) getUUID(r *http.Request) (string, error) {
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

//    s, err := ioutil.ReadAll(r.Body)
//     if err != nil {
//         panic(err) // This would normally be a normal Error http response but I've put this here so it's easy for you to test.
//     }
