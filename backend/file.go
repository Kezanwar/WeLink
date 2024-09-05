package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"

	"mime/multipart"
)

const ONE_KB int64 = 1024
const TEN_KB int64 = ONE_KB * 10

const ONE_MB int64 = TEN_KB * 100
const FIVE_MB int64 = ONE_MB * 5

const ONE_GIG int64 = ONE_MB * 1000
const TWO_GIG int64 = ONE_GIG * 2

type FileService struct {
}

type FileMeta struct {
	Name          string `json:"name"`
	Type          string `json:"type"`
	FormattedSize string `json:"formatted_size"`
	Size          int64  `json:"size"`
	UUID          string `json:"uuid"`
}

var File = &FileService{}

func (f *FileService) make_buffer_from_file(file multipart.File) ([]byte, error) {
	// size := handler.Size
	// if size <= int64(FIVE_MB) {
	// 	return f.process_file(file)
	// }
	return f.process_file(file)
	// return f.process_file_concurrently(file, size)
}

func (f *FileService) process_file(file multipart.File) ([]byte, error) {
	// Create a buffer to accumulate the file data
	var buffer bytes.Buffer
	// Define a slice to read chunks into
	chunk := make([]byte, ONE_KB)

	for {
		n, err := file.Read(chunk)
		if err != nil && err != io.EOF {
			return nil, fmt.Errorf("failed to read file")
		}
		if n == 0 {
			break
		}
		buffer.Write(chunk[:n])
	}
	return buffer.Bytes(), nil
}

func (f *FileService) make_file_meta(name string, filetype string, formatted_size string, size int64, uuid string) *FileMeta {
	return &FileMeta{
		Name:          name,
		Type:          filetype,
		FormattedSize: formatted_size,
		Size:          size,
		UUID:          uuid,
	}
}

func (f *FileService) write_tmp_file(bytes []byte, fileName string) {

	folderPath := "tmp"
	fullPath := filepath.Join(folderPath, fileName)

	file, err := os.Create(fullPath)

	if err != nil {
		log.Fatal(err)
	}

	err = file.Chmod(0666)

	if err != nil {
		log.Fatal(err)
	}

	defer file.Close()

	_, err = file.Write(bytes)

	if err != nil {
		log.Fatalf("failed to write to file: %v", err)
	}
}
