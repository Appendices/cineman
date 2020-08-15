#!/bin/bash
# Stops docker and deletes container

docker stop cineman_db_1
docker rm -v cineman_db_1