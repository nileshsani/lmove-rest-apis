#!/usr/bin/env bash

## CLEANUP
docker stack rm webservices-swarm
docker rmi -f webservices-image db-image
docker system prune --force

## RUN UNIT TESTS
docker build -f docker-images/dockerfile.ws.test -t test-webservices-image .
docker run --name test-ws test-webservices-image:latest
docker stop test-ws
docker rm -f test-ws
docker rmi test-webservices-image

## GENERATE BUILDS
docker build -f docker-images/dockerfile.ws.build -t webservices-image .
docker build -f docker-images/dockerfile.db.build -t db-image .

## RUN
docker stack deploy -c docker-compose.yml webservices-swarm