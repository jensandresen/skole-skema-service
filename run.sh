#!/bin/sh

APP_NAME="skole-skema-service"
HOST_DATA_DIR=${1-"/data"}
HOST_DATA_FILENAME=${2-"skole-skema-data.json"}

docker build -t $APP_NAME .

docker run -d \
    -p 3001:3000 \
    -v ${HOST_DATA_DIR}:/data \
    -e DATAFILE="/data/${HOST_DATA_FILENAME}" \
    --restart unless-stopped \
    $APP_NAME