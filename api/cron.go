package main

import (
	"time"

	"github.com/fatih/color"
	"github.com/robfig/cron"
)

type CronService struct {
	HOURLY string
}

var CRON = &CronService{
	HOURLY: "@hourly",
}

func (c *CronService) start() {
	cron := cron.New()
	cron.AddFunc(c.HOURLY, c.expire_files)
	cron.Start()
}

func (c *CronService) expire_files() {
	keys, err := Redis.get_all_file_meta_keys()

	color.HiMagenta("CRON --- expire files cron job started")

	if err != nil {
		color.Red("expire files cron: an error occured whilst fetching meta keys")
		return
	}

	var expire_count int

	for _, key := range keys {
		meta, err := Redis.get_file_meta_from_key(key)

		if err != nil {
			color.Red("expire files cron: an error occured whilst fetching meta keys")
			return
		}

		if meta.Expires <= time.Now().Unix() {

			err := AWS.delete_file(meta.UUID)

			if err != nil {
				color.Red("expire files cron: an error occured whilst deleting a file from AWS")
				return
			}

			err = Redis.delete_file_meta(meta.UUID)

			if err != nil {
				color.Red("expire files cron: an error occured whilst deleting a file meta from Redis")
				return
			}

			expire_count++

		}

	}

	color.HiMagenta("CRON --- expire files cron job finished, %d files expired", expire_count)

}
