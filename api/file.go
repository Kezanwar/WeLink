package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"time"

	"mime/multipart"
)

const ONE_KB int64 = 1024
const TEN_KB int64 = ONE_KB * 10

const ONE_MB int64 = TEN_KB * 100
const FIVE_MB int64 = ONE_MB * 5

const FIVE_HUNDRED_MB = FIVE_MB * 100

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

	var buffer bytes.Buffer

	chunk := make([]byte, ONE_KB)

	for {
		n, err := file.Read(chunk)
		if err != nil && err != io.EOF {
			return nil, fmt.Errorf(err.Error())
		}
		if n == 0 {
			break
		}
		buffer.Write(chunk[:n])
	}

	return buffer.Bytes(), nil
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

func (f *FileService) make_one_day_expiry_unix() int64 {
	return time.Now().Add(ONE_DAY).Unix()
}
