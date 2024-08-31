package main

import (
	"encoding/json"
	"log"
	"regexp"

	"github.com/google/uuid"
)

type Util struct {
	match_uuid *regexp.Regexp
}

var Utility = &Util{}

func (u *Util) init() error {
	test, err := regexp.Compile("/^[0-9A-F]{8}-[0-9A-F]{4}-4[0-9A-F]{3}-[89AB][0-9A-F]{3}-[0-9A-F]{12}$/i")

	if err != nil {
		return err
	}

	u.match_uuid = test

	return nil
}

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

func (u *Util) validate_uuid(uuid string) bool {
	return u.match_uuid.MatchString(uuid)
}
