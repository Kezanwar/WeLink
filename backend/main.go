package main

import (
	"log"
)

func main() {

	redisErr := Redis.connect()

	if redisErr != nil {
		log.Fatal(redisErr)
	}

	Api.serve()
}
