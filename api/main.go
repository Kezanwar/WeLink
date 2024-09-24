package main

import (
	"log"
)

func main() {

	err := Redis.connect()

	if err != nil {
		log.Fatal(err)
	}

	AWS.init()

	API.serve()
}
