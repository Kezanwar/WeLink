package main

import (
	"log"
)

func main() {

	redisErr := Redis.connect()

	if redisErr != nil {
		log.Fatal(redisErr)
	}

	utilErr := Utility.init()

	if utilErr != nil {
		log.Fatal(utilErr)
	}

	apiErr := Api.serve()

	if apiErr != nil {
		log.Fatal(apiErr)
	}

}
