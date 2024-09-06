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
			s.write_json(w, c, ApiErrorResponse{Message: err.Error()})
		}

	}
}

func (s *APIServer) write_json(w http.ResponseWriter, status int, v any) error {
	w.Header().Add("Content-Type", "application/json")
	w.WriteHeader(status)
	return json.NewEncoder(w).Encode(v)
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

func (s *APIServer) get_uuids(r *http.Request) ([]string, error) {
	var uuids = r.URL.Query()["uuid"]

	if len(uuids) == 0 {
		return nil, fmt.Errorf("no uuid params passed")
	}

	return uuids, nil
}

func (s *APIServer) download_file(w http.ResponseWriter, file []byte, fileMeta *FileMeta) error {
	// Set the appropriate content type - adjust as needed
	w.Header().Set("Content-Type", fileMeta.Type)

	// Set the content disposition header for downloading the file
	w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", fileMeta.Name))

	// Write the []byte to the response
	if _, err := w.Write(file); err != nil {
		return fmt.Errorf("failed to download file")
	}

	return nil
}

func (s *APIServer) serve() {
	router := mux.NewRouter()

	router.HandleFunc("/api/file/download/{uuid}", s.handle_download_file)
	router.HandleFunc("/api/files/meta" /*?query*/, s.make_json_handler(s.handle_get_files_meta))
	router.HandleFunc("/api/file/meta/{uuid}", s.make_json_handler(s.handle_get_file_meta))
	router.HandleFunc("/api/upload", s.make_json_handler(s.handle_upload_file))

	router.Use(loggingMiddleware)
	router.Use(makeAuthMiddleware())

	log.Println("WeLink api running on port", s.ListenAddr)

	http.ListenAndServe(s.ListenAddr, router)

}

func (s *APIServer) handle_download_file(w http.ResponseWriter, r *http.Request) {
	defer r.Body.Close()

	if r.Method == "GET" {

		uuid, err := s.get_uuid(r)

		if err != nil {
			s.write_json(w, http.StatusBadRequest, ApiErrorResponse{Message: err.Error()})
			return
		}

		fileBytes, fileErr := Redis.get_file_binary(uuid)

		if fileErr != nil {
			s.write_json(w, http.StatusBadRequest, ApiErrorResponse{Message: fileErr.Error()})
			return
		}

		// Assume this filename is dynamically determined by some logic
		dynamicFilename := "customfile.txt"

		// Set the Content-Type according to your file's content
		w.Header().Set("Content-Type", "text/plain")

		// Dynamically set the filename in the Content-Disposition header
		w.Header().Set("Content-Disposition", fmt.Sprintf("attachment; filename=\"%s\"", dynamicFilename))

		// Write the []byte to the response
		if _, err := w.Write(fileBytes); err != nil {
			http.Error(w, "Failed to write file", http.StatusInternalServerError)
			return
		}

		// 	if fileErr != nil {
		// 		return http.StatusNotFound, fileErr
		// 	}

		// 	return s.NilError, s.write_json(w, http.StatusOK, &ImageSuccessResponse{
		// 		Image: "success",
		// 	})
		// } else {
		// 	return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

type SuccessfulFilesMetaResponse struct {
	FileMetas []FileMeta `json:"file_metas"`
}

func (s *APIServer) handle_get_files_meta(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "GET" {
		uuids, err := s.get_uuids(r)

		if err != nil {
			return http.StatusBadRequest, err
		}

		are_valid := Utility.validate_uuids(uuids)

		if !are_valid {
			return http.StatusBadRequest, fmt.Errorf("invalid uuid passed")
		}

		fmt.Println(uuids)

		metas, err := Redis.get_mlti_files_meta(uuids)

		//remove nil metas

		if len(metas) != len(uuids) {
			//
		}

		if err != nil {
			return http.StatusBadRequest, err
		}

		return s.NilError, s.write_json(w, http.StatusOK, &ApiErrorResponse{
			Message: "success",
		})
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

		return s.NilError, s.write_json(w, http.StatusOK, meta)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}
}

type SuccessfulUploadResponse struct {
	UUID    string `json:"uuid"`
	Expires int64  `json:"expires"`
}

func (s *APIServer) handle_upload_file(w http.ResponseWriter, r *http.Request) (int, error) {
	defer r.Body.Close()

	if r.Method == "POST" {
		//get the multipart form data (max 2 gig file size)
		err := r.ParseMultipartForm(TWO_GIG)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to parse multipart form")
		}

		file, handler, err := r.FormFile("file")

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
		formatted_size := r.FormValue("size")
		uuid := Utility.create_uuid()

		meta := &FileMeta{
			Name:          name,
			Type:          file_type,
			FormattedSize: formatted_size,
			Size:          size,
			UUID:          uuid,
		}

		err = Redis.set_file_binary(uuid, bytes)

		if err != nil {
			return http.StatusBadRequest, fmt.Errorf("failed to save file")
		}

		err = Redis.set_file_meta(uuid, meta)

		if err != nil {
			Redis.delete_file_binary(uuid)
			return http.StatusBadRequest, fmt.Errorf("failed to save file meta")
		}

		response := &SuccessfulUploadResponse{
			UUID:    uuid,
			Expires: File.make_three_day_expiry_unix(),
		}

		return s.NilError, s.write_json(w, http.StatusOK, response)
	} else {
		return http.StatusBadRequest, fmt.Errorf("method not allow %s", r.Method)
	}

}
