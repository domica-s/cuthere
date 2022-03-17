# CUthere
CUthere is a web-app built to help members of The Chinese University of Hong Kong coordinate and participate in meetups with other members, this project is built using the MERN stack.

### Clone and start by typing:
#### Back end:
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:8080
$ npm start
```

#### Front end:
``` bash
# install dependencies
$ npm install

# serve with hot reload at localhost:3000
$ npm run build
```

## Start the Service using Makefile
``` bash
# start
make start

# stop the service and clean the environment
make clean
```


## Dockerised Service

``` bash
# Re-build the image (if Dockerfile is changed, else no need)
docker-compose build

# Start the service
docker-compose up

# Stop the service
docker-compose down
```