start:
	docker-compose -f docker-compose.yml build && docker-compose -f docker-compose.yml up

clean:
	docker-compose down --remove-orphans