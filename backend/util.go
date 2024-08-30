package main

import (
	"encoding/json"
	"log"

	"github.com/google/uuid"
)

type Util struct {
}

var Utility = &Util{}

func (u *Util) print_map(m any) {
	b, err := u.json_stringify(m)
	if err != nil {
		log.Fatal(err)
	}
	println(b)

}

func (u *Util) json_stringify(m any) (string, error) {
	b, err := json.Marshal(m)
	if err != nil {
		return "", err
	}
	return string(b), nil
}

func (u *Util) create_uuid() string {
	return uuid.New().String()
}
