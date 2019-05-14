#!/usr/bin/env bash

## CLEANUP
docker stack rm webservices-swarm
docker rmi -f webservices-image db-image
docker system prune --force

## GENERATE BUILDS
docker build -f docker-images/dockerfile.ws.build -t webservices-image .
docker build -f docker-images/dockerfile.db.build -t db-image .

## RUN
docker stack deploy -c docker-compose.yml webservices-swarm