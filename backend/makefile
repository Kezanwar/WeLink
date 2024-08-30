build: 
	@go build -o bin/bank-api

run:
	@./bin/bank-api

dev: 	
	@go build -o bin/bank-api
	@./bin/bank-api

create-redis:
	@docker run -p 6379:6379 --name we-link-redis -d -it redis/redis-stack-server:latest

start-redis: 
	@docker start we-link-redis

stop-redis:
	@docker stop we-link-redis

test: 
	@go test -v ./