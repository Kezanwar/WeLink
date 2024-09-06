package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"os"
	"time"
	"unsafe"

	"github.com/go-redis/redis/v8"
)

var ctx = context.Background()

const THREE_DAYS = time.Hour * 24 * 3

type RedisClient struct {
	rdb         *redis.Client
	bin_suffix  string
	meta_suffix string
}

var Redis = &RedisClient{
	bin_suffix:  "__BINARY__",
	meta_suffix: "__META__",
}

var Address = os.Getenv("REDIS_URL")

func (r *RedisClient) connect() error {
	r.rdb = redis.NewClient(&redis.Options{
		Addr:     Address,
		Password: "", // no password set
		DB:       0,  // use default DB
	})

	_, err := r.rdb.Ping(ctx).Result()

	if err != nil {
		log.Fatal("redis failed to connect")
	}

	fmt.Println("redis connected 🚀")

	return nil
}

func (r *RedisClient) binary_to_binstring(bs []byte) string {
	return unsafe.String(unsafe.SliceData(bs), len(bs))
}

func (r *RedisClient) get_file_binary(uuid string) ([]byte, error) {
	var key = uuid + r.bin_suffix
	file, err := r.rdb.Get(ctx, key).Bytes()

	if err == redis.Nil {
		return nil, fmt.Errorf("file not found")
	}

	return file, nil
}

func (r *RedisClient) set_file_binary(uuid string, file []byte) error {
	var str_file = r.binary_to_binstring(file)
	var key = uuid + r.bin_suffix

	err := r.rdb.Set(ctx, key, str_file, THREE_DAYS).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) delete_file_binary(uuid string) error {
	var key = uuid + r.bin_suffix

	err := r.rdb.Del(ctx, key).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) get_file_meta(uuid string) (*FileMeta, error) {
	var key = uuid + r.meta_suffix

	meta_str, err := r.rdb.Get(ctx, key).Result()

	if err == redis.Nil {
		return nil, fmt.Errorf("meta not found")
	}

	meta := &FileMeta{}

	err = json.Unmarshal([]byte(meta_str), meta)

	if err == redis.Nil {
		return nil, fmt.Errorf("meta parsing failed")
	}

	return meta, nil
}

func (r *RedisClient) get_mlti_files_meta(uuids []string) ([]FileMeta, error) {
	var keys []string

	for i := 0; i < len(uuids); i++ {
		keys = append(keys, uuids[i]+r.meta_suffix)
	}

	meta_array, err := r.rdb.MGet(ctx, keys...).Result()

	if err == redis.Nil {
		return nil, fmt.Errorf("metas not found")
	}

	fmt.Println(meta_array...)

	// meta := &FileMeta{}

	// err = json.Unmarshal([]byte(meta_str), meta)

	return nil, fmt.Errorf("errrrr")
}

func (r *RedisClient) set_file_meta(uuid string, fileMeta *FileMeta) error {
	meta_json, err := json.Marshal(fileMeta)

	if err != nil {
		return fmt.Errorf("unable to marshal file meta")
	}

	meta_str := string(meta_json)

	var key = uuid + r.meta_suffix

	err = r.rdb.Set(ctx, key, meta_str, THREE_DAYS).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) delete_file_meta(uuid string) error {
	var key = uuid + r.meta_suffix

	err := r.rdb.Del(ctx, key).Err()

	if err != nil {
		return err
	}

	return nil
}
