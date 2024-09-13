package main

import (
	"log"
)

func main() {

	err := Redis.connect()

	if err != nil {
		log.Fatal(err)
	}

	Api.serve()
}
