package main

import (
	"regexp"

	"github.com/google/uuid"
)

type UUIDServce struct {
}

var UUID = &UUIDServce{}

func (u *UUIDServce) create_uuid() string {
	return uuid.New().String()
}

var testUUID = regexp.MustCompile(`^[0-9a-fA-F]{8}-[0-9a-fA-F]{4}-[1-5][0-9a-fA-F]{3}-[89abAB][0-9a-fA-F]{3}-[0-9a-fA-F]{12}$`)

func (u *UUIDServce) validate_uuid(uuid string) bool {
	return testUUID.MatchString(uuid)
}

func (u *UUIDServce) validate_uuids(uuids []string) bool {
	for i := 0; i < len(uuids); i++ {
		if !u.validate_uuid(uuids[i]) {
			return false
		}
	}
	return true
}
