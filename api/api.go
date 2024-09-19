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

type EmptyResponse struct {
	Message string `json:"message"`
}

var PORT = string(":") + os.Getenv("PORT")

var API = &APIServer{
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
			s.write_json(w, r, c, EmptyResponse{Message: err.Error()})
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
		return "", fmt.Errorf("this file doesn't exist")
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
		return nil, fmt.Errorf("one of these files don't exist")
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
	router.HandleFunc("/api/file/delete/{uuid}", s.make_json_handler(s.handle_delete_file))
	router.HandleFunc("/api/file/download/{uuid}", s.handle_download_file)

	log.Println("WeLink api running on port", s.ListenAddr)

	http.ListenAndServe(s.ListenAddr, router)

}

func (s *APIServer) handle_upload_file(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "POST" {

		err := r.ParseMultipartForm(FIVE_HUNDRED_MB + ONE_MB)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse multipart form")
		}

		file, handler, err := r.FormFile("file")

		if handler.Size > TWO_GIG {
			return http.StatusBadRequest, fmt.Errorf("file too large, limit is 500mb")
		}

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse file")
		}

		defer file.Close()

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
			Expires:       File.make_one_day_expiry_unix(),
		}

		err = Redis.set_file_meta(uuid, meta)

		if err != nil {
			return http.StatusBadRequest, err
		}

		err = AWS.store_file(uuid, file)

		if err != nil {
			Redis.delete_file_meta(uuid)
			return http.StatusBadRequest, fmt.Errorf("failed to save file")
		}

		return s.NilError, s.write_json(w, r, http.StatusOK, meta)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}

}

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

		err = s.check_file_expiry(meta)

		if err != nil {
			return http.StatusGone, err
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
			s.write_json(w, r, http.StatusBadRequest, EmptyResponse{Message: err.Error()})
			return
		}

		fileMeta, metaErr := Redis.get_file_meta(uuid)

		if metaErr != nil {
			s.write_json(w, r, http.StatusBadRequest, EmptyResponse{Message: metaErr.Error()})
			return
		}

		err = s.check_file_expiry(fileMeta)

		if err != nil {
			s.write_json(w, r, http.StatusGone, EmptyResponse{Message: err.Error()})
			return
		}

		fileBytes, fileErr := AWS.get_file(uuid)

		if fileErr != nil {
			s.write_json(w, r, http.StatusBadRequest, EmptyResponse{Message: fileErr.Error()})
			return
		}

		w.Header().Set("Content-Type", fileMeta.Type)
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileMeta.Name))

		if _, err := w.Write(fileBytes); err != nil {
			s.write_json(w, r, http.StatusBadRequest, EmptyResponse{Message: "failed to write file to response"})
			return
		} else {
			s.log_resp(http.StatusAccepted, r)
		}

	}
}

func (s *APIServer) handle_delete_file(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "DELETE" {
		uuid, err := s.get_uuid(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		err = Redis.delete_file_meta(uuid)

		if err != nil {
			return http.StatusNotFound, err
		}

		err = AWS.delete_file(uuid)

		if err != nil {
			return http.StatusNotFound, err
		}

		return s.NilError, s.write_json(w, r, http.StatusOK, &EmptyResponse{Message: "file deleted successfully"})
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

func (s *APIServer) check_file_expiry(meta *FileMeta) error {
	if File.is_expired(meta) {
		err := Redis.delete_file_meta(meta.UUID)

		if err != nil {
			return fmt.Errorf("this file has expired, error deleting meta")
		}

		err = AWS.delete_file(meta.UUID)

		if err != nil {
			return fmt.Errorf("this file has expired, error deleting binary")
		}

		return fmt.Errorf("this file has expired")
	}

	return nil
}
