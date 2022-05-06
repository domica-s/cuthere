# This is the makefile to run all the docker script directly
# Programmer: Ethan Lee
# This code is called when the user runs the 'make' script 

start:
	docker-compose -f docker-compose.yml build && docker-compose -f docker-compose.yml up

dev:
	docker-compose -f docker-compose.dev.yml build && docker-compose -f docker-compose.dev.yml up -d

clean:
	docker-compose down --remove-orphans
