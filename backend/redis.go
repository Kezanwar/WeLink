package main

import (
	"context"
	"fmt"
	"os"
	"unsafe"

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

func (r *RedisClient) set_file(key string, file []byte) error {
	var str_file = r.binary_to_binstring(file)

	err := r.rdb.Set(ctx, key, str_file, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) get_file(key string) ([]byte, error) {
	file, err := r.rdb.Get(ctx, key).Bytes()

	if err == redis.Nil {
		return nil, fmt.Errorf("file not found")
	}

	return file, nil
}

func (r *RedisClient) binary_to_binstring(bs []byte) string {
	return unsafe.String(unsafe.SliceData(bs), len(bs))
}
