package main

import (
	"context"
	"fmt"
	"os"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

type RedisClient struct {
	rdb *redis.Client
}

var Redis = &RedisClient{}

var Address = os.Getenv("REDIS_URL")

func (r *RedisClient) connect() error {
	r.rdb = redis.NewClient(&redis.Options{
		Addr:     Address,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err := r.rdb.Ping(ctx).Result()

	if err != nil {
		return fmt.Errorf("redis failed to connect")
	}

	fmt.Println("redis connected 🚀")

	return nil
}

func (r *RedisClient) set_image(key string, image string) error {
	err := r.rdb.Set(ctx, key, image, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) get_image(key string) (string, error) {
	image, err := r.rdb.Get(ctx, key).Result()

	if err == redis.Nil {
		return "", fmt.Errorf("image not found")
	}

	return image, nil
}
