package main

import (
	"log"
)

var f = []string{"AUDIO-2024-09-11-10-20-39.m4a", "Screenshot 2024-05-01 at 09.05.42.png"}

func main() {

	err := Redis.connect()

	if err != nil {
		log.Fatal(err)
	}

	AWS.init()

	for _, v := range f {
		AWS.delete_file(v)
	}

	API.serve()
}
