package main

import (
	"bytes"
	"fmt"
	"io"
	"log"
	"os"
	"path/filepath"
	"sync"

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
	fmt.Println("process_file")
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

/* currently doesnt work... */
func (f *FileService) process_file_concurrently(file multipart.File, fileSize int64) ([]byte, error) {

	fmt.Println("process_file_concurrently")
	chunkSize := ONE_KB * 30

	fileSize_64 := int64(fileSize)
	chunkSize_64 := int64(chunkSize)

	numChunks := int(fileSize_64 / chunkSize_64)

	if fileSize_64%chunkSize != 0 {
		numChunks++ // add an extra chunk to meet file size requirements
	}

	var wg sync.WaitGroup
	resultChan := make(chan []byte, numChunks)
	errChan := make(chan error, 1) // Buffered channel to avoid blocking goroutines

	for i := 0; i < numChunks; i++ {
		wg.Add((1))
		go func(chunkIndex int) {
			defer wg.Done()
			offset := int64(chunkIndex) * chunkSize_64
			size := chunkSize_64

			if offset+size > fileSize_64 {
				size = fileSize_64 - offset
				//we're adjusting the size for the last chunk
			}

			buffer := make([]byte, size)

			_, err := file.ReadAt(buffer, offset)
			if err != nil && err != io.EOF {
				select {
				case errChan <- fmt.Errorf("error reading chunk %d", chunkIndex):
				default:
				}
				return
			}

			resultChan <- buffer

		}(i)
	}

	go func() {
		wg.Wait()
		close(resultChan)
	}()

	var resultBuffer bytes.Buffer

	for {
		select {
		case chunk, ok := <-resultChan:
			if !ok {
				resultChan = nil
			} else {
				resultBuffer.Write(chunk)
			}
		case err := <-errChan:
			return nil, err
		}
		if resultChan == nil {
			break
		}
	}

	return resultBuffer.Bytes(), nil
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
