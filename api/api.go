package main

import (
	"encoding/json"
	"fmt"

	"log"
	"net/http"
	"os"

	"github.com/fatih/color"
	"github.com/gorilla/mux"
	_ "github.com/joho/godotenv/autoload"
)

type APIServer struct {
	ListenAddr string
	NilError   int
}

type ApiHandler func(http.ResponseWriter, *http.Request) (int, error)

type ApiErrorResponse struct {
	Message string `json:"message"`
}

var PORT = string(":") + os.Getenv("PORT")

var Api = &APIServer{
	ListenAddr: PORT,
	NilError:   0,
}

/*
if an endpoint will only return json wrap the handler with this,
then on success you must return NilError, s.write_json(success..) yourself but any errors can just
return code, err and will be handled by this.
*/
func (s *APIServer) make_json_handler(f ApiHandler) http.HandlerFunc {
	return func(w http.ResponseWriter, r *http.Request) {
		code, err := f(w, r)

		if err != nil {
			var c = http.StatusInternalServerError
			if code != s.NilError {
				c = code
			}
			s.write_json(w, r, c, ApiErrorResponse{Message: err.Error()})
		}

	}
}

func (s *APIServer) write_json(w http.ResponseWriter, r *http.Request, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	s.log_resp(status, r)
	return json.NewEncoder(w).Encode(v)
}

func (s *APIServer) get_uuid(r *http.Request) (string, error) {
	uuidStr := mux.Vars(r)["uuid"]

	if len(uuidStr) == 0 {
		return "", fmt.Errorf("no ID given")
	}

	match := UUID.validate_uuid(uuidStr)

	if !match {
		return "", fmt.Errorf("not a valid uuid")
	}

	return uuidStr, nil
}

func (s *APIServer) get_uuids(r *http.Request) ([]string, error) {
	var uuids = r.URL.Query()["uuid"]

	if len(uuids) == 0 {
		return nil, fmt.Errorf("no uuid params passed")
	}

	are_valid := UUID.validate_uuids(uuids)

	if !are_valid {
		return nil, fmt.Errorf("invalid uuid passed")
	}

	return uuids, nil
}

func (s *APIServer) log_resp(code int, r *http.Request) {
	if code >= 400 {
		color.Red("%d --- %s", code, r.RequestURI)
		return
	}
	color.Green("%d --- %s", code, r.RequestURI)
}

func (s *APIServer) serve() {
	router := mux.NewRouter()

	router.Use(corsMiddleware)
	router.Use(loggingMiddleware)

	router.HandleFunc("/api/upload", s.make_json_handler(s.handle_upload_file))
	router.HandleFunc("/api/file/meta/{uuid}", s.make_json_handler(s.handle_get_file_meta))
	router.HandleFunc("/api/files/meta" /*?query*/, s.make_json_handler(s.handle_get_files_meta))
	router.HandleFunc("/api/file/download/{uuid}", s.handle_download_file)

	log.Println("WeLink api running on port", s.ListenAddr)

	http.ListenAndServe(s.ListenAddr, router)

}

type SuccessfulUploadResponse struct {
	*FileMeta
	Expires int64 `json:"expires"`
}

func (s *APIServer) handle_upload_file(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "POST" {

		err := r.ParseMultipartForm(FIVE_HUNDRED_MB + ONE_MB)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse multipart form")
		}

		file, handler, err := r.FormFile("file")

		if handler.Size > FIVE_HUNDRED_MB {
			return http.StatusBadRequest, fmt.Errorf("file too large, limit is 500mb")
		}

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse file")
		}

		defer file.Close()

		bytes, err := File.make_buffer_from_file(file)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf(err.Error())
		}

		name := handler.Filename
		size := handler.Size
		file_type := handler.Header.Get("Content-Type")
		formatted_size := r.FormValue("formatted_size")
		uuid := UUID.create_uuid()

		meta := &FileMeta{
			Name:          name,
			Type:          file_type,
			FormattedSize: formatted_size,
			Size:          size,
			UUID:          uuid,
		}

		err = Redis.set_file_binary(uuid, bytes)

		if err != nil {
			return http.StatusBadRequest, err
		}

		err = Redis.set_file_meta(uuid, meta)

		if err != nil {
			Redis.delete_file_binary(uuid)
			return http.StatusBadRequest, fmt.Errorf("failed to save file meta")
		}

		response := &SuccessfulUploadResponse{
			FileMeta: meta,
			Expires:  File.make_one_day_expiry_unix(),
		}

		return s.NilError, s.write_json(w, r, http.StatusOK, response)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}

}

type SuccessfulFileMetaReponse = FileMeta

func (s *APIServer) handle_get_file_meta(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "GET" {
		uuid, err := s.get_uuid(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		meta, metaErr := Redis.get_file_meta(uuid)

		if metaErr != nil {
			return http.StatusNotFound, metaErr
		}

		return s.NilError, s.write_json(w, r, http.StatusOK, meta)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

type SuccessfulFilesMetaResponse struct {
	FileMetas []*FileMeta `json:"file_metas"`
}

func (s *APIServer) handle_get_files_meta(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "GET" {
		uuids, err := s.get_uuids(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		metas, err := Redis.get_mlti_files_meta(uuids)

		if err != nil {
			return http.StatusBadRequest, err
		}

		return s.NilError, s.write_json(w, r, http.StatusOK, &SuccessfulFilesMetaResponse{
			FileMetas: metas,
		})

	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

func (s *APIServer) handle_download_file(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	if r.Method == "GET" {

		uuid, err := s.get_uuid(r)

		if err != nil {
			s.write_json(w, r, http.StatusBadRequest, ApiErrorResponse{Message: err.Error()})
			return
		}

		fileBytes, fileErr := Redis.get_file_binary(uuid)

		if fileErr != nil {
			s.write_json(w, r, http.StatusBadRequest, ApiErrorResponse{Message: fileErr.Error()})
			return
		}

		fileMeta, metaErr := Redis.get_file_meta(uuid)

		if metaErr != nil {
			s.write_json(w, r, http.StatusBadRequest, ApiErrorResponse{Message: metaErr.Error()})
			return
		}

		w.Header().Set("Content-Type", fileMeta.Type)
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileMeta.Name))

		if _, err := w.Write(fileBytes); err != nil {
			s.write_json(w, r, http.StatusBadRequest, ApiErrorResponse{Message: "failed to write file to response"})
			return
		} else {
			s.log_resp(http.StatusAccepted, r)
		}

	}
}
