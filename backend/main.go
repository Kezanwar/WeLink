package main

import (
	"log"
)

func main() {

	redisErr := Redis.connect()

	if redisErr != nil {
		log.Fatal(redisErr)
	}

	apiErr := Api.serve()

	if apiErr != nil {
		log.Fatal(apiErr)
	}

}
