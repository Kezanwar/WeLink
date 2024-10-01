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

const ONE_DAY = time.Hour * 24

type RedisClient struct {
	rdb         *redis.Client
	bin_prefix  string
	meta_prefix string
}

var Redis = &RedisClient{
	bin_prefix:  "__BINARY__",
	meta_prefix: "__META__",
}

var RedisAddress = os.Getenv("REDIS_URL")

func (r *RedisClient) connect() error {
	r.rdb = redis.NewClient(&redis.Options{
		Addr:     RedisAddress,
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
	var key = r.bin_prefix + uuid
	file, err := r.rdb.Get(ctx, key).Bytes()

	if err == redis.Nil {
		return nil, fmt.Errorf("file not found")
	}

	return file, nil
}

func (r *RedisClient) set_file_binary(uuid string, file []byte) error {
	var str_file = r.binary_to_binstring(file)
	var key = r.bin_prefix + uuid

	err := r.rdb.Set(ctx, key, str_file, ONE_DAY).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) delete_file_binary(uuid string) error {
	var key = r.bin_prefix + uuid

	err := r.rdb.Del(ctx, key).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) get_file_meta_from_uuid(uuid string) (*FileMeta, error) {
	var key = r.meta_prefix + uuid

	meta_str, err := r.rdb.Get(ctx, key).Result()

	if err == redis.Nil {
		return nil, fmt.Errorf("meta not found")
	} else if err != nil {
		return nil, fmt.Errorf("meta search failed")
	}

	meta := &FileMeta{}

	err = json.Unmarshal([]byte(meta_str), meta)

	if err == redis.Nil {
		return nil, fmt.Errorf("meta parsing failed")
	}

	return meta, nil
}

func (r *RedisClient) get_file_meta_from_key(key string) (*FileMeta, error) {

	meta_str, err := r.rdb.Get(ctx, key).Result()

	if err == redis.Nil {
		return nil, fmt.Errorf("meta not found")
	} else if err != nil {
		return nil, fmt.Errorf("meta search failed")
	}

	meta := &FileMeta{}

	err = json.Unmarshal([]byte(meta_str), meta)

	if err == redis.Nil {
		return nil, fmt.Errorf("meta parsing failed")
	}

	return meta, nil
}

func (r *RedisClient) get_mlti_files_meta(uuids []string) ([]*FileMeta, error) {
	var keys []string

	for _, id := range uuids {
		keys = append(keys, r.meta_prefix+id)
	}

	results, err := r.rdb.MGet(ctx, keys...).Result()

	if err != nil {
		return nil, fmt.Errorf("error ")
	}

	var out = make([]*FileMeta, 0)

	for _, v := range results {
		str, ok := v.(string)
		if ok {
			parsed := &FileMeta{}
			err = json.Unmarshal([]byte(str), parsed)
			if err != nil {
				return nil, fmt.Errorf("error parsing meta")
			}
			out = append(out, parsed)
		}
	}

	return out, nil
}

func (r *RedisClient) set_file_meta(uuid string, fileMeta *FileMeta) error {
	meta_json, err := json.Marshal(fileMeta)

	if err != nil {
		return fmt.Errorf("unable to marshal file meta")
	}

	meta_str := string(meta_json)

	var key = r.meta_prefix + uuid

	err = r.rdb.Set(ctx, key, meta_str, 0).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) delete_file_meta(uuid string) error {
	var key = r.meta_prefix + uuid

	err := r.rdb.Del(ctx, key).Err()

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) delete_file(uuid string) error {
	err := r.delete_file_meta(uuid)

	if err != nil {
		return err
	}

	err = r.delete_file_binary(uuid)

	if err != nil {
		return err
	}

	return nil
}

func (r *RedisClient) get_all_file_meta_keys() ([]string, error) {

	var cursor uint64

	keys, cursor, err := r.rdb.Scan(ctx, cursor, r.meta_prefix+"*", 0).Result()

	if err != nil {
		return nil, fmt.Errorf("error ")
	}

	return keys, nil
}
