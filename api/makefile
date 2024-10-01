build: 
	@go build -o bin/we-link-api

run:
	@./bin/we-link-api

dev: 	
	@go build -o bin/we-link-api
	@./bin/we-link-api

create-redis:
	@docker run -p 6379:6379 --name we-link-redis -d -it redis/redis-stack-server:latest

start-redis: 
	@docker start we-link-redis

stop-redis:
	@docker stop we-link-redis

redis-cli:
	@docker exec -it we-link-redis redis-cli

test: 
	@go test -v ./