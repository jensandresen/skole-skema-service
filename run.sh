#!/bin/sh
APP_NAME="skole-skema-service" 
docker build -t $APP_NAME .
docker run -d \
    -p 3001:3000 \
    -v /data:/data \
    -e DATAFILE="/data/skole-skema-service.json" \
    --restart unless-stopped \
    $APP_NAME